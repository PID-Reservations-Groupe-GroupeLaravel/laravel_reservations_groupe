<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Artists') }}
        </h2>
    </x-slot>

    @php
        $artists = \App\Models\Artist::orderBy('id', 'asc')->get();
    @endphp

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">

            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">

                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-lg font-semibold">Liste des artistes</h3>

                        <a href="{{ route('artists.create') }}"
                           class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            + Ajouter un artiste
                        </a>
                    </div>

                    @if ($artists->count() === 0)
                        <div class="p-4 bg-yellow-50 text-yellow-800 rounded">
                            Aucun artiste trouvé.
                        </div>
                    @else
                        <div class="overflow-x-auto">
                            <table class="min-w-full border border-gray-200">
                                <thead class="bg-gray-100">
                                    <tr>
                                        <th class="text-left p-3 border-b">ID</th>
                                        <th class="text-left p-3 border-b">Firstname</th>
                                        <th class="text-left p-3 border-b">Lastname</th>
                                        <th class="text-left p-3 border-b">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($artists as $artist)
                                        <tr class="hover:bg-gray-50">
                                            <td class="p-3 border-b">{{ $artist->id }}</td>
                                            <td class="p-3 border-b">{{ $artist->firstname }}</td>
                                            <td class="p-3 border-b">{{ $artist->lastname }}</td>
                                            <td class="p-3 border-b">
                                                <div class="flex gap-2">
                                                    <a href="{{ route('artists.show', $artist->id) }}"
                                                       class="px-3 py-1 bg-gray-800 text-white rounded hover:bg-black">
                                                        Voir
                                                    </a>

                                                    <a href="{{ route('artists.edit', $artist->id) }}"
                                                       class="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                                                        Modifier
                                                    </a>

                                                    <form action="{{ route('artists.destroy', $artist->id) }}" method="POST"
                                                          onsubmit="return confirm('Supprimer cet artiste ?');">
                                                        @csrf
                                                        @method('DELETE')
                                                        <button type="submit"
                                                                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                                                            Supprimer
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @endif

                    <div class="mt-6">
                        <a href="{{ route('artists.index') }}" class="text-blue-700 hover:underline">
                            Aller sur la page complète /artists
                        </a>
                    </div>

                </div>
            </div>

        </div>
    </div>
</x-app-layout>
