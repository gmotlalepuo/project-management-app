<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserCrudResource;
use App\Services\UserService;

class UserController extends Controller {
    protected $userService;

    public function __construct(UserService $userService) {
        $this->userService = $userService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index() {
        $query = User::query();

        $sortField = request("sort_field", "created_at");
        $sortDirection = request("sort_direction", "desc");

        // Handle filters
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        if (request("email")) {
            $query->where("email", "like", "%" . request("email") . "%");
        }

        if (request("created_at")) {
            $query->whereDate("created_at", request("created_at"));
        }

        $users = $query
            ->orderBy($sortField, $sortDirection)
            ->paginate(request('per_page', 10))
            ->withQueryString();

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
        return Inertia::render('User/Create', [
            'success' => session('success'),
        ]);
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
            'success' => session('success'),
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

        $this->userService->deleteUser($user);

        return to_route('user.index')->with('success', "User '$name' deleted successfully.");
    }

    public function search(Request $request, Project $project) {
        $query = $request->input('email');

        if (empty($query)) {
            return response()->json(['users' => []]);
        }

        // First check if the email exists in our system
        $user = User::where('email', $query)->first();

        if ($user) {
            // Check project membership first
            $isMember = $user->id == $project->created_by ||
                $project->invitedUsers()
                ->where('user_id', $user->id)
                ->wherePivot('status', 'accepted')
                ->exists();

            if ($isMember) {
                return response()->json([
                    'error' => 'This user is already part of the project.',
                    'users' => []
                ], 409);
            }

            // Then check pending invitations
            $hasPendingInvite = $project->invitedUsers()
                ->where('user_id', $user->id)
                ->wherePivot('status', 'pending')
                ->exists();

            if ($hasPendingInvite) {
                return response()->json([
                    'error' => 'This user has already been invited and the invitation is pending.',
                    'users' => []
                ], 409);
            }

            // If user exists and isn't a member or pending, return them
            return response()->json(['users' => [$user]]);
        }

        // No user found with this email
        if (filter_var($query, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'error' => 'No users found with this email.',
                'users' => []
            ], 404);
        }

        // Invalid email format
        return response()->json([
            'error' => 'Please enter a valid email address.',
            'users' => []
        ], 422);
    }
}
