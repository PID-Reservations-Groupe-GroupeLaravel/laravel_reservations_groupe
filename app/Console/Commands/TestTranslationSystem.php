<?php

namespace App\Console\Commands;

use App\Services\TranslationService;
use Illuminate\Console\Command;

class TestTranslationSystem extends Command
{
    protected $signature = 'test:translation {text=Ceci est un excellent spectacle}';
    protected $description = 'Test the translation system with DeepL and Google Cloud';

    public function handle(TranslationService $translationService): int
    {
        $text = $this->argument('text');

        $this->info('========================================');
        $this->info('Translation System Test');
        $this->info('========================================');
        $this->newLine();

        $this->info("Original Text: {$text}");
        $this->newLine();

        // Test providers status
        $this->info('Provider Status:');
        $status = $translationService->getProvidersStatus();
        foreach ($status as $provider) {
            $available = $provider['available'] ? '✓ Available' : '✗ Not Available';
            $this->line("  • {$provider['name']}: {$available}");
        }
        $this->newLine();

        // Test language detection
        $this->info('Testing Language Detection:');
        try {
            $detectedLang = $translationService->detectLanguage($text);
            $this->line("  • Detected Language: {$detectedLang}");
        } catch (\Exception $e) {
            $this->error("  • Detection Failed: {$e->getMessage()}");
        }
        $this->newLine();

        // Test translation to all languages
        $this->info('Testing Translation to All Languages:');
        try {
            $translations = $translationService->translateToAll($text);

            foreach ($translations as $lang => $translatedText) {
                $this->line("  [{$lang}] {$translatedText}");
            }

            $this->newLine();
            $this->info('✓ All translations completed successfully!');
        } catch (\Exception $e) {
            $this->error("✗ Translation Failed: {$e->getMessage()}");
            return 1;
        }

        return 0;
    }
}
