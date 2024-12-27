<?php

namespace App\Notifications;

use App\Models\Project;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectInvitationNotification extends Notification {
  use Queueable;

  protected $project;

  public function __construct(Project $project) {
    $this->project = $project;
  }

  public function via($notifiable): array {
    return ['mail'];
  }

  public function toMail($notifiable): MailMessage {
    return (new MailMessage)
      ->subject("You've been invited to join {$this->project->name}")
      ->greeting("Hello {$notifiable->name}!")
      ->line("You have been invited to join the project: {$this->project->name}")
      ->action('View Invitation', route('project.invitations'))
      ->line('You can accept or reject this invitation from your invitations page.');
  }
}
