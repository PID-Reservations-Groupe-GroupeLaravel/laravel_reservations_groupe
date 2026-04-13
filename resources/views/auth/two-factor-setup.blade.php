<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Configuration 2FA') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white shadow rounded p-6">

                {{-- Commit #19 : QR code display for 2FA setup --}}
                <h2 class="text-xl font-bold mb-4">Configurer l'authentification à deux facteurs</h2>

                <p class="text-sm text-gray-600 mb-6">
                    Scannez ce QR code avec votre application d'authentification
                    (Google Authenticator, Authy, etc.), puis entrez le code généré pour confirmer.
                </p>

                {{-- QR Code via BaconQrCode --}}
                <div class="flex justify-center mb-6">
                    {!! QrCode::size(200)->generate($qrCodeUrl) !!}
                </div>

                <p class="text-xs text-gray-500 text-center mb-2">
                    Ou entrez manuellement la clé secrète :
                </p>
                <p class="text-center font-mono text-sm bg-gray-100 rounded p-2 mb-6 tracking-widest">
                    {{ $secret }}
                </p>

                {{-- Commit #18 : activer la 2FA --}}
                <form method="POST" action="{{ route('profile.2fa.enable') }}">
                    @csrf
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Code de vérification (6 chiffres)
                        </label>
                        <input
                            type="text"
                            name="code"
                            inputmode="numeric"
                            maxlength="6"
                            class="w-full border rounded p-2 text-center text-lg tracking-widest @error('code') border-red-500 @enderror"
                            placeholder="000000"
                            autofocus
                        />
                        @error('code')
                            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>
                    <button
                        type="submit"
                        class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Activer la 2FA
                    </button>
                </form>

                <div class="text-sm text-center mt-4">
                    <a href="{{ route('profile.security') }}" class="text-gray-500 hover:underline">
                        Annuler
                    </a>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
