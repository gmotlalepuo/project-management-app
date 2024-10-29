<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use Carbon\Carbon;

class ProjectController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $query = Project::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request()->has('status')) {
            // Check if status is an array and apply filtering
            $statuses = request()->input('status');
            if (is_array($statuses)) {
                $query->whereIn("status", $statuses); // Use whereIn for multiple values
            } else {
                $query->where("status", $statuses);
            }
        }

        if (request("created_at")) {
            $createdAtRange = request("created_at");
            $startDate = Carbon::parse($createdAtRange[0])->startOfDay();
            $endDate = Carbon::parse($createdAtRange[1])->endOfDay();

            $query->whereBetween("created_at", [$startDate, $endDate]);
        }


        $projects = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Project/Index', [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        return Inertia::render('Project/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request) {
        $data = $request->validated();
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        if ($image) {
            $data['image_path'] = $image->store('project/' . Str::random(10), 'public');
        }

        Project::create($data);

        return to_route('project.index')->with('success', 'Project created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project) {
        // Check if the user is authorized to view the project
        $user = Auth::user();
        if ($user->id !== $project->created_by && !$project->invitedUsers->contains($user)) {
            abort(403, 'You are not authorized to view this project.');
        }

        $query = $project->tasks();
        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        $tasks = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('Project/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project) {
        return Inertia::render('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project) {
        $data = $request->validated();
        $name = $project->name;
        /** @var $image \Illuminate\Http\UploadedFile */
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();

        if ($image) {
            if ($project->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($project->image_path));
            }
            $data['image_path'] = $image->store('project/' . Str::random(10), 'public');
        }
        $project->update($data);

        return to_route('project.index')->with('success', "Project '$name' updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project) {
        $name = $project->name;

        if ($project->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($project->image_path));
        }
        $project->delete();

        return to_route('project.index')->with('success', "Project '$name' deleted successfully.");
    }

    public function inviteUser(Request $request, Project $project) {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->with('error', 'User does not exist.');
        }

        // Check if the user is already invited and the invitation is pending
        if ($project->invitedUsers()->where('user_id', $user->id)->wherePivot('status', 'pending')->exists()) {
            return back()->with('error', 'User has already been invited and is awaiting response.');
        }

        // Add user to invited users with a status of 'pending'
        $project->invitedUsers()->attach($user->id, [
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return back()->with('success', 'User invited successfully.');
    }

    public function showInvitations() {
        $user = Auth::user();
        // Get all pending invitations for the user
        $invitations = $user->projectInvitations()->wherePivot('status', 'pending')->get();

        return Inertia::render('Project/Invite', [
            'invitations' => $invitations,
        ]);
    }


    public function acceptInvitation(Project $project) {
        $user = Auth::user();

        // Update the invitation status to 'accepted'
        $project->invitedUsers()->updateExistingPivot($user->id, ['status' => 'accepted']);

        return redirect()->back()->with('success', 'Invitation accepted.');
    }

    public function rejectInvitation(Project $project) {
        $user = Auth::user();

        // Update the invitation status to 'rejected'
        $project->invitedUsers()->updateExistingPivot($user->id, ['status' => 'rejected']);

        return redirect()->back()->with('success', 'Invitation rejected.');
    }
}
