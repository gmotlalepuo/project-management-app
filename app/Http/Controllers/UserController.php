<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;

class UserController extends Controller {
    /**
     * Display a listing of the resource.
     */
    public function index() {
        $query = User::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        $users = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(10)
            ->onEachSide(1);

        return Inertia::render('User/Index', [
            'users' => UserCrudResource::collection($users),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create() {
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request) {
        $data = $request->validated();
        $data['email_verified_at'] = time();
        $data['password'] = bcrypt($data['password']);
        User::create($data);

        return to_route('user.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user) {
        return Inertia::render('User/Edit', [
            'user' => new UserCrudResource($user),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user) {
        $data = $request->validated();
        $password = $data['password'] ?? null;

        if ($password) {
            $data['password'] = bcrypt($password);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return to_route('user.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user) {
        $name = $user->name;

        if ($user->id === Auth::id()) {
            return to_route('user.index')->with('error', "You can't delete yourself.");
        }
        $user->delete();

        return to_route('user.index')->with('success', "User '$name' deleted successfully.");
    }

    public function search(Request $request, Project $project) {
        $query = $request->input('email');

        // Validate the email input
        $request->validate([
            'email' => 'required|string|email',
        ]);

        $currentUserId = Auth::id();

        // Get the IDs of users already participating or invited in the project
        $projectUserIds = $project->invitedUsers->pluck('id')->toArray();
        $projectUserIds[] = $project->created_by;

        // Check if the queried email belongs to a user who is already invited
        $alreadyInvitedUser = User::where('email', $query)
            ->whereIn('id', $projectUserIds)
            ->exists();

        if ($alreadyInvitedUser) {
            return response()->json(['error' => 'This user has already been invited or is part of the project.'], 409);
        }

        // Search for users excluding the current user and users already in the project
        $users = User::where('email', 'like', '%' . $query . '%')
            ->whereNotIn('id', array_merge([$currentUserId], $projectUserIds))
            ->get();

        // Determine if any users were found
        if ($users->isEmpty()) {
            return response()->json(['error' => 'No users found with this email.'], 404);
        }

        return response()->json(['users' => $users]);
    }
}
