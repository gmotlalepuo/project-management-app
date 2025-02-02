<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\TaskStatus;
use App\Services\TaskStatusService;
use Inertia\Inertia;
use App\Http\Requests\TaskStatus\StoreTaskStatusRequest;
use App\Http\Requests\TaskStatus\UpdateTaskStatusRequest;
use App\Http\Resources\TaskStatusResource;

class TaskStatusController extends Controller {
  protected $taskStatusService;

  public function __construct(TaskStatusService $taskStatusService) {
    $this->taskStatusService = $taskStatusService;
  }

  public function index(Project $project) {
    $filters = request()->all();

    $statuses = $this->taskStatusService->getProjectStatuses($project, $filters);

    return Inertia::render('TaskStatuses/Index', [
      'project' => $project->only(['id', 'name']),
      'statuses' => TaskStatusResource::collection($statuses),
      'queryParams' => request()->query() ?: null,
      'success' => session('success'),
      'error' => session('error'),
    ]);
  }

  public function create(Project $project) {
    return Inertia::render('TaskStatuses/Create', [
      'project' => $project->only(['id', 'name']),
    ]);
  }

  public function store(StoreTaskStatusRequest $request, Project $project) {
    $data = $request->validated();
    $data['project_id'] = $project->id;

    $status = $this->taskStatusService->storeStatus($data);

    return to_route('project.statuses.index', $project)->with('success', "Status '{$status->name}' created successfully.");
  }

  public function edit(Project $project, TaskStatus $status) {
    if ($status->is_default) {
      abort(403, 'Cannot edit default statuses.');
    }

    return Inertia::render('TaskStatuses/Edit', [
      'project' => $project->only(['id', 'name']),
      'status' => new TaskStatusResource($status),
    ]);
  }

  public function update(UpdateTaskStatusRequest $request, Project $project, TaskStatus $status) {
    if (is_null($status->project_id)) {
      abort(403, 'Cannot edit default statuses');
    }

    $status = $this->taskStatusService->updateStatus($status, $request->validated());
    return to_route('project.statuses.index', $project)
      ->with('success', "Status '{$status->name}' updated successfully.");
  }

  public function destroy(Project $project, TaskStatus $status) {
    if (is_null($status->project_id)) {
      return back()->with('error', 'Cannot delete default statuses');
    }

    try {
      $name = $status->name;
      $this->taskStatusService->deleteStatus($status);

      return redirect()->route('project.statuses.index', $project)
        ->with('success', "Status '{$name}' deleted successfully.");
    } catch (\Exception $e) {
      return redirect()->route('project.statuses.index', $project)
        ->with('error', $e->getMessage());
    }
  }
}
