<x-guest-layout>
    {{-- Commit #20 : verify TOTP code on login when 2FA enabled --}}
    <div class="mb-4 text-sm text-gray-600">
        {{ __('Entrez le code généré par votre application d\'authentification pour continuer.') }}
    </div>

    <form method="POST" action="{{ route('2fa.verify') }}">
        @csrf

        <div class="mb-4">
            <x-input-label for="code" :value="__('Code d\'authentification')" />
            <x-text-input
                id="code"
                class="block mt-1 w-full text-center text-lg tracking-widest"
                type="text"
                name="code"
                inputmode="numeric"
                maxlength="6"
                placeholder="000000"
                autofocus
                required
            />
            <x-input-error :messages="$errors->get('code')" class="mt-2" />
        </div>

        <div class="flex justify-end mt-4">
            <x-primary-button>
                {{ __('Vérifier') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
