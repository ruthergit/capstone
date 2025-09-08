<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssistantshipApproved extends Notification
{
    use Queueable;

    protected string $assistantshipName;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $assistantshipName)
    {
        $this->assistantshipName = $assistantshipName;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'assistantship Approved',
            'body' => "Congratulations! Your assistantship application for '{$this->assistantshipName}' has been approved.",
            'assistantship_name' => $this->assistantshipName,
            'action_url' => url('/assistantship'),
            'applicant_id' => $notifiable->id,
            'approved_at' => now(),
        ];
    }
}
