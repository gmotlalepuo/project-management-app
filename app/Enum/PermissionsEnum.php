<?php

namespace App\Enum;

enum PermissionsEnum: string {
    case ManageProjects = 'manage_projects';
    case ManageTasks = 'manage_tasks';
    case ManageUsers = 'manage_users';
    case ViewProjects = 'view_projects';
    case ViewTasks = 'view_tasks';
    case CommentOnTasks = 'comment_on_tasks';
    case DeleteComments = 'delete_comments';
    case ManageComments = 'manage_comments';
}
