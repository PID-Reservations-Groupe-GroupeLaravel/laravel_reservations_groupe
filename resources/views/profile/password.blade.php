<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Changer le mot de passe') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-xl mx-auto sm:px-6 lg:px-8">

            {{-- Commit #15 : password change form view --}}
            <div class="bg-white shadow rounded p-6">
                <h2 class="text-xl font-bold mb-4">Changement de mot de passe</h2>

                @if(session('status'))
                    <div class="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm">
                        {{ session('status') }}
                    </div>
                @endif

                <form method="POST" action="{{ route('profile.password.update') }}">
                    @csrf
                    @method('PUT')

                    {{-- Commit #16 : validate current password --}}
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Mot de passe actuel
                        </label>
                        <input
                            type="password"
                            name="current_password"
                            class="w-full border rounded p-2 @error('current_password') border-red-500 @enderror"
                            autocomplete="current-password"
                        />
                        @error('current_password')
                            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            class="w-full border rounded p-2 @error('password') border-red-500 @enderror"
                            autocomplete="new-password"
                        />
                        @error('password')
                            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-1">
                            Confirmer le nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            class="w-full border rounded p-2"
                            autocomplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        Mettre à jour le mot de passe
                    </button>
                </form>
            </div>

            <div class="text-sm text-center mt-4">
                <a href="{{ route('profile.security') }}" class="text-indigo-600 hover:underline">
                    ← Retour à la sécurité
                </a>
            </div>
        </div>
    </div>
</x-app-layout>
