<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Sécurité du compte') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-6">

            @if(session('status'))
                <div class="p-3 bg-green-100 text-green-800 rounded text-sm">
                    {{ session('status') }}
                </div>
            @endif

            {{-- Commit #24-#25 : security page with sessions + 2FA + history --}}

            {{-- Section 1 : Sessions --}}
            <div class="bg-white shadow rounded p-6">
                <h3 class="text-lg font-semibold mb-2">Sessions actives</h3>
                <p class="text-sm text-gray-600 mb-4">
                    Consultez l'historique de connexion ou déconnectez tous les autres appareils.
                </p>
                <a
                    href="{{ route('profile.sessions') }}"
                    class="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                >
                    Gérer les sessions
                </a>
            </div>

            {{-- Section 2 : Mot de passe --}}
            <div class="bg-white shadow rounded p-6">
                <h3 class="text-lg font-semibold mb-2">Mot de passe</h3>
                <p class="text-sm text-gray-600 mb-4">
                    Mettez à jour votre mot de passe régulièrement pour sécuriser votre compte.
                </p>
                <a
                    href="{{ route('profile.password.edit') }}"
                    class="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                >
                    Changer le mot de passe
                </a>
            </div>

            {{-- Section 3 : Authentification à deux facteurs (2FA) --}}
            <div class="bg-white shadow rounded p-6">
                <h3 class="text-lg font-semibold mb-2">
                    Authentification à deux facteurs (2FA)
                </h3>

                @if(auth()->user()->two_factor_confirmed_at)
                    <div class="flex items-center gap-2 mb-4">
                        <span class="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                            ✓ Activée
                        </span>
                        <span class="text-sm text-gray-600">
                            Votre compte est protégé par un code TOTP.
                        </span>
                    </div>
                    {{-- Désactiver --}}
                    <form method="POST" action="{{ route('profile.2fa.disable') }}">
                        @csrf
                        @method('DELETE')
                        <input
                            type="password"
                            name="password"
                            placeholder="Mot de passe actuel"
                            class="border rounded p-2 text-sm mr-2 @error('password') border-red-500 @enderror"
                        />
                        @error('password')
                            <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                        @enderror
                        <button
                            type="submit"
                            class="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
                        >
                            Désactiver la 2FA
                        </button>
                    </form>
                @else
                    <p class="text-sm text-gray-600 mb-4">
                        Ajoutez une couche de sécurité supplémentaire à votre compte.
                    </p>
                    <a
                        href="{{ route('profile.2fa.show') }}"
                        class="inline-block bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                        Activer la 2FA
                    </a>
                @endif
            </div>

            {{-- Section 4 : Historique rapide --}}
            <div class="bg-white shadow rounded p-6">
                <h3 class="text-lg font-semibold mb-4">Dernières connexions</h3>
                <table class="w-full text-sm">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2 text-left">Date</th>
                            <th class="p-2 text-left">IP</th>
                            <th class="p-2 text-left">Navigateur</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach(auth()->user()->loginHistory()->latest('logged_at')->limit(5)->get() as $entry)
                            <tr class="border-b">
                                <td class="p-2">{{ $entry->logged_at->format('d/m/Y H:i') }}</td>
                                <td class="p-2">{{ $entry->ip_address }}</td>
                                <td class="p-2 text-xs text-gray-500">
                                    {{ Str::limit($entry->user_agent, 40) }}
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
                <div class="mt-3 text-sm">
                    <a href="{{ route('profile.sessions') }}" class="text-indigo-600 hover:underline">
                        Voir tout l'historique →
                    </a>
                </div>
            </div>

        </div>
    </div>
</x-app-layout>
