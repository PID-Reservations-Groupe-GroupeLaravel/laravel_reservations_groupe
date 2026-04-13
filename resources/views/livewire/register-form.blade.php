<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-900 py-12 px-4">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {{-- Header --}}
        <div class="text-center mb-6">
            <div class="text-5xl mb-3">🎭</div>
            <h2 class="text-2xl font-bold text-indigo-800">Créer un compte</h2>
            <p class="text-gray-400 text-sm mt-1">Rejoignez Ovatio</p>
        </div>

        @if (session()->has('success'))
            <div class="mb-4 bg-green-50 border border-green-300 text-green-700 rounded-xl px-4 py-3 text-sm">
                {{ session('success') }}
            </div>
        @endif

        <form wire:submit.prevent="submit" class="space-y-4" enctype="multipart/form-data">

            {{-- ===== PHOTO EN HAUT ===== --}}
            <div class="flex flex-col items-center gap-2">
                <div class="relative w-24 h-24">

                    <label for="photo-input"
                           class="block w-24 h-24 rounded-full overflow-hidden cursor-pointer
                                  border-4 transition shadow-md
                                  {{ $errors->has('photo') ? 'border-red-400' : 'border-indigo-300 hover:border-indigo-500' }}
                                  bg-gray-100">
                        @if ($photo)
                            <img src="{{ $photo->temporaryUrl() }}"
                                 alt="Aperçu"
                                 class="w-full h-full object-cover" />
                        @else
                            <div class="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-9 h-9 mb-0.5" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                          d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span class="text-xs font-medium">Photo</span>
                            </div>
                        @endif
                    </label>

                    {{-- Bouton + --}}
                    <label for="photo-input"
                           class="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 hover:bg-indigo-700
                                  text-white rounded-full flex items-center justify-center
                                  cursor-pointer shadow transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                    </label>
                </div>

                <input id="photo-input" type="file" wire:model="photo" accept="image/*" class="hidden" />

                <p class="text-xs text-gray-400">Photo de profil (optionnelle, max 2 Mo)</p>

                @error('photo')
                    <p class="text-xs text-red-500">{{ $message }}</p>
                @enderror

                <div wire:loading wire:target="photo" class="text-xs text-indigo-500">
                    Chargement...
                </div>
            </div>
            {{-- ========================= --}}

            {{-- Prénom / Nom --}}
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Prénom</label>
                    <input type="text" wire:model.live="firstname" placeholder="Jean"
                        class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
                               {{ $errors->has('firstname') ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white' }}" />
                    @error('firstname') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nom</label>
                    <input type="text" wire:model.live="lastname" placeholder="Dupont"
                        class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
                               {{ $errors->has('lastname') ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white' }}" />
                    @error('lastname') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
                </div>
            </div>

            {{-- Login --}}
            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Login</label>
                <input type="text" wire:model.live="login" placeholder="mon_login"
                    class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
                           {{ $errors->has('login') ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white' }}" />
                @error('login') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
            </div>

            {{-- Email --}}
            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                <input type="email" wire:model.live="email" placeholder="email@exemple.com"
                    class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
                           {{ $errors->has('email') ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white' }}" />
                @error('email') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
            </div>

            {{-- Langue --}}
            <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Langue</label>
                <select wire:model.live="langue"
                    class="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white">
                    <option value="fr">🇫🇷 Français</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="nl">🇧🇪 Nederlands</option>
                </select>
            </div>

            {{-- Mot de passe / Confirmation --}}
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Mot de passe</label>
                    <input type="password" wire:model.live="password" placeholder="••••••••"
                        class="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
                               {{ $errors->has('password') ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white' }}" />
                    @error('password') <p class="mt-1 text-xs text-red-500">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Confirmation</label>
                    <input type="password" wire:model.live="password_confirmation" placeholder="••••••••"
                        class="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white" />
                </div>
            </div>

            <p class="text-xs text-gray-400 -mt-1">Min. 6 caractères, 1 majuscule, 1 caractère spécial</p>

            {{-- Bouton --}}
            <button type="submit"
                class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95
                       text-white rounded-xl font-semibold text-sm transition-all shadow-md
                       disabled:opacity-50 disabled:cursor-not-allowed"
                wire:loading.attr="disabled">
                <span wire:loading.remove>S'inscrire</span>
                <span wire:loading class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Inscription...
                </span>
            </button>

            <p class="text-center text-sm text-gray-400 pt-1">
                Déjà un compte ?
                <a href="{{ route('login') }}" class="text-indigo-600 hover:underline font-medium">Se connecter</a>
            </p>

        </form>
    </div>
</div>
