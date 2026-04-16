<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-6">

        <h2 class="text-3xl font-extrabold text-center text-gray-900">
            Créer un compte Ovatio
        </h2>

        @if (session()->has('success'))
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {{ session('success') }}
            </div>
        @endif

        <form wire:submit.prevent="submit" class="space-y-5" enctype="multipart/form-data">

            {{-- ===== PHOTO EN HAUT ===== --}}
            <div class="flex flex-col items-center gap-3">
                <div class="relative w-28 h-28">
                    {{-- Cercle prévisualisation --}}
                    <label for="photo-input" class="cursor-pointer block w-28 h-28 rounded-full overflow-hidden border-4
                        {{ $errors->has('photo') ? 'border-red-400' : 'border-indigo-300' }}
                        hover:border-indigo-500 transition bg-gray-100 shadow">

                        @if ($photo)
                            <img src="{{ $photo->temporaryUrl() }}"
                                 alt="Aperçu"
                                 class="w-full h-full object-cover" />
                        @else
                            <div class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mb-1" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                          d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-xs">Photo</span>
                            </div>
                        @endif
                    </label>

                    {{-- Bouton + dans le coin --}}
                    <label for="photo-input"
                           class="absolute bottom-1 right-1 bg-indigo-600 text-white rounded-full w-7 h-7
                                  flex items-center justify-center cursor-pointer hover:bg-indigo-700 shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 4v16m8-8H4" />
                        </svg>
                    </label>
                </div>

                <input id="photo-input" type="file" wire:model="photo"
                       accept="image/*" class="hidden" />

                <p class="text-xs text-gray-500">Photo de profil (optionnelle, max 2 Mo)</p>

                @error('photo')
                    <p class="text-sm text-red-600">{{ $message }}</p>
                @enderror

                {{-- Indicateur de chargement Livewire --}}
                <div wire:loading wire:target="photo" class="text-xs text-indigo-500">
                    Chargement de la photo...
                </div>
            </div>
            {{-- ============================= --}}

            {{-- Prénom / Nom côte à côte --}}
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="firstname" class="block text-sm font-medium text-gray-700">Prénom</label>
                    <input id="firstname" type="text" wire:model.live="firstname"
                        class="mt-1 block w-full px-3 py-2 border {{ $errors->has('firstname') ? 'border-red-500' : 'border-gray-300' }} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Jean" />
                    @error('firstname') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="lastname" class="block text-sm font-medium text-gray-700">Nom</label>
                    <input id="lastname" type="text" wire:model.live="lastname"
                        class="mt-1 block w-full px-3 py-2 border {{ $errors->has('lastname') ? 'border-red-500' : 'border-gray-300' }} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Dupont" />
                    @error('lastname') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                </div>
            </div>

            {{-- Login --}}
            <div>
                <label for="login" class="block text-sm font-medium text-gray-700">Login</label>
                <input id="login" type="text" wire:model.live="login"
                    class="mt-1 block w-full px-3 py-2 border {{ $errors->has('login') ? 'border-red-500' : 'border-gray-300' }} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="mon_login" />
                @error('login') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
            </div>

            {{-- Email --}}
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                <input id="email" type="email" wire:model.live="email"
                    class="mt-1 block w-full px-3 py-2 border {{ $errors->has('email') ? 'border-red-500' : 'border-gray-300' }} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="email@exemple.com" />
                @error('email') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
            </div>

            {{-- Langue --}}
            <div>
                <label for="langue" class="block text-sm font-medium text-gray-700">Langue</label>
                <select id="langue" wire:model.live="langue"
                    class="mt-1 block w-full px-3 py-2 border {{ $errors->has('langue') ? 'border-red-500' : 'border-gray-300' }} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="nl">Nederlands</option>
                </select>
                @error('langue') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
            </div>

            {{-- Mot de passe / Confirmation côte à côte --}}
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Mot de passe</label>
                    <input id="password" type="password" wire:model.live="password"
                        class="mt-1 block w-full px-3 py-2 border {{ $errors->has('password') ? 'border-red-500' : 'border-gray-300' }} rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Min. 6 car." />
                    @error('password') <p class="mt-1 text-xs text-red-600">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="password_confirmation" class="block text-sm font-medium text-gray-700">Confirmation</label>
                    <input id="password_confirmation" type="password"
                        wire:model.live="password_confirmation"
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Répéter" />
                </div>
            </div>

            <button type="submit"
                class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition"
                wire:loading.attr="disabled">
                <span wire:loading.remove>S'inscrire</span>
                <span wire:loading>Inscription en cours...</span>
            </button>

            <p class="text-center text-sm text-gray-600">
                Déjà un compte ?
                <a href="{{ route('login') }}" class="text-indigo-600 hover:underline">Se connecter</a>
            </p>

        </form>
    </div>
</div>
