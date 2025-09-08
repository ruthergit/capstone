<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ScholarshipApproved extends Notification
{
    use Queueable;

    protected string $scholarshipName;

    /**
     * Create a new notification instance.
     */

    public function __construct(string $scholarshipName)
    {
        $this->scholarshipName = $scholarshipName;
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
            'title' => 'Scholarship Approved',
            'body' => "Congratulations! Your scholarship application for '{$this->scholarshipName}' has been approved.",
            'scholarship_name' => $this->scholarshipName,
            'action_url' => url('/scholarship'),
            'applicant_id' => $notifiable->id,
            'approved_at' => now(),
        ];
    }
}
