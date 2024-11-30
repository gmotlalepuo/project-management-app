<?php

namespace App\Enum;

enum RolesEnum: string {
    case Admin = 'admin';
    case ProjectManager = 'project_manager';
    case ProjectMember = 'project_member';

    public static function labels(): array {
        return [
            self::Admin->value => 'Admin',
            self::ProjectManager->value => 'Project Manager',
            self::ProjectMember->value => 'Project Member',
        ];
    }

    public function label() {
        return match ($this) {
            self::Admin => 'Admin',
            self::ProjectManager => 'Project Manager',
            self::ProjectMember => 'Project Member',
        };
    }
}
