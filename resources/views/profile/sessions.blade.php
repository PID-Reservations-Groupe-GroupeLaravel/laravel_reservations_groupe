<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Gestion des sessions') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="bg-white shadow rounded p-6">
                <h2 class="text-xl font-bold mb-4">Historique de connexion</h2>

                @if(session('status'))
                    <div class="mb-4 p-3 bg-green-100 text-green-800 rounded text-sm">
                        {{ session('status') }}
                    </div>
                @endif

                <table class="w-full text-sm mb-6">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="p-2 text-left">Date</th>
                            <th class="p-2 text-left">IP</th>
                            <th class="p-2 text-left">Navigateur</th>
                            <th class="p-2 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($history as $entry)
                            <tr class="border-b">
                                <td class="p-2">{{ $entry->logged_at->format('d/m/Y H:i') }}</td>
                                <td class="p-2">{{ $entry->ip_address }}</td>
                                <td class="p-2 text-xs text-gray-500">{{ Str::limit($entry->user_agent, 50) }}</td>
                                <td class="p-2">
                                    @if($entry->success)
                                        <span class="text-green-600 text-xs font-medium">OK</span>
                                    @else
                                        <span class="text-red-600 text-xs font-medium">Echouee</span>
                                    @endif
                                </td>
                            </tr>
                        @empty
                            <tr><td colspan="4" class="p-4 text-center text-gray-500">Aucun historique.</td></tr>
                        @endforelse
                    </tbody>
                </table>

                <form method="POST" action="{{ route('profile.sessions.destroy-others') }}">
                    @csrf
                    @method('DELETE')
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                        <input type="password" name="password" class="w-full border rounded p-2 mt-1" />
                        @error('password')<p class="text-red-500 text-sm mt-1">{{ $message }}</p>@enderror
                    </div>
                    <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded text-sm">
                        Deconnecter tous les autres appareils
                    </button>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
