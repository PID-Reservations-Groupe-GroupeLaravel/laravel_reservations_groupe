<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class SendRssFeed extends Command
{
    protected $signature = 'rss:send
                            {--mode=latest : latest ou upcoming}
                            {--freq=daily  : daily ou weekly}';

    protected $description = 'Envoie le flux RSS par email aux utilisateurs';

    public function handle(): void
    {
        $mode = $this->option('mode');
        $freq = $this->option('freq');

        $rssUrl  = config('app.url') . '/api/rss?mode=' . $mode;
        $response = Http::get($rssUrl);

        if (!$response->successful()) {
            $this->error("Impossible de recuperer le flux RSS : {$rssUrl}");
            return;
        }

        $users = User::whereNotNull('email')->get();

        foreach ($users as $user) {
            Mail::send('emails.rss_digest', [
                'user' => $user,
                'mode' => $mode,
                'freq' => $freq,
                'rssUrl' => $rssUrl,
            ], function ($message) use ($user, $freq) {
                $label = $freq === 'weekly' ? 'hebdomadaire' : 'quotidien';
                $message->to($user->email)
                        ->subject("Standing-Ovation — Resume {$label} des spectacles");
            });
        }

        $this->info("RSS envoye a {$users->count()} utilisateurs. [mode={$mode}, freq={$freq}]");
    }
}
