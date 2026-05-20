<?php

namespace App\Console\Commands;

use App\Models\Review;
use App\Services\TranslationService;
use Illuminate\Console\Command;

class TranslateValidatedReviews extends Command
{
    protected $signature = 'translate:validated {--limit=0 : Limit number of reviews to translate (0 = all)}';
    protected $description = 'Translate validated reviews that don\'t have translations yet';

    public function handle(TranslationService $translationService): int
    {
        $limit = $this->option('limit');

        // Get validated reviews without translations
        $query = Review::where('validated', 1)
            ->where(function ($q) {
                $q->whereNull('comment_fr')
                  ->orWhereNull('comment_en')
                  ->orWhereNull('comment_nl');
            });

        if ($limit > 0) {
            $query->limit($limit);
        }

        $reviews = $query->get();
        $total = $reviews->count();

        if ($total === 0) {
            $this->info('✓ All validated reviews are already translated!');
            return 0;
        }

        $this->info("Found {$total} validated reviews to translate");
        $this->newLine();

        $bar = $this->output->createProgressBar($total);
        $bar->start();

        $successCount = 0;
        $errorCount = 0;

        foreach ($reviews as $review) {
            try {
                // Skip if no comment
                if (empty($review->comment)) {
                    $bar->advance();
                    continue;
                }

                // Translate to all languages
                $translations = $translationService->translateToAll($review->comment);

                // Update the review with translations
                $review->update([
                    'comment_fr'     => $translations['fr'] ?? $review->comment,
                    'comment_en'     => $translations['en'] ?? $review->comment,
                    'comment_nl'     => $translations['nl'] ?? $review->comment,
                    'translated_by'  => 'deepl',
                    'source_language'=> 'fr',
                ]);

                $successCount++;
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::warning("Translation error for review {$review->id}: {$e->getMessage()}");
                $errorCount++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("✓ Translation complete!");
        $this->line("  • Successful: {$successCount}");
        $this->line("  • Failed: {$errorCount}");

        if ($errorCount === 0) {
            $this->info('All validated reviews translated successfully!');
            return 0;
        }

        return 1;
    }
}
