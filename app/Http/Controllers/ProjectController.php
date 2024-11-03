<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
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
use App\Http\Resources\ProjectInvitationResource;

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
            ->paginate(request('per_page', 10))
            ->withQueryString();

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

        if (isset($data['due_date'])) {
            $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
        } else {
            $data['due_date'] = null;
        }

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

        if (request()->has('status')) {
            $statuses = request()->input('status');
            if (is_array($statuses)) {
                $query->whereIn("status", $statuses);
            } else {
                $query->where("status", $statuses);
            }
        }

        if (request()->has('priority')) {
            $priorities = request()->input('priority');
            if (is_array($priorities)) {
                $query->whereIn("priority", $priorities);
            } else {
                $query->where("priority", $priorities);
            }
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
            'error' => session('error'),
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

        if (isset($data['due_date'])) {
            $data['due_date'] = Carbon::parse($data['due_date'])->setTimezone('UTC');
        } else {
            $data['due_date'] = null;
        }

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

        // Check if there's already an invitation for this user and project
        $existingInvitation = $project->invitedUsers()
            ->where('user_id', $user->id)
            ->first();

        // If the user has a rejected invitation, update it to pending instead of creating a new one
        if ($existingInvitation && $existingInvitation->pivot->status === 'rejected') {
            $project->invitedUsers()->updateExistingPivot($user->id, [
                'status' => 'pending',
                'updated_at' => now(),
            ]);
            return back()->with('success', 'User re-invited successfully.');
        }

        // If no invitation exists, create a new one
        if (!$existingInvitation) {
            $project->invitedUsers()->attach($user->id, [
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            return back()->with('success', 'User invited successfully.');
        }

        return back()->with('error', 'This user has already been invited.');
    }


    public function showInvitations(Request $request) {
        $user = Auth::user();

        // Initialize the query for pending invitations
        $query = $user->projectInvitations()->wherePivot('status', 'pending');

        // Apply filtering based on query parameters
        if ($request->has('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        if ($request->has('status')) {
            $statuses = $request->input('status');
            if (is_array($statuses)) {
                $query->wherePivotIn('status', $statuses);
            } else {
                $query->wherePivot('status', $statuses);
            }
        }

        // Apply sorting based on query parameters
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Paginate the results and include query string
        $invitations = $query->paginate($request->input('per_page', 10))->withQueryString();

        return Inertia::render('Project/Invite', [
            'invitations' => ProjectInvitationResource::collection($invitations),
            'success' => session('success'),
            'queryParams' => $request->query() ?: null,
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
