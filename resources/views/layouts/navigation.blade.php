<nav x-data="{ open: false }" class="bg-white border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">

            <!-- Logo + liens -->
            <div class="flex">
                <div class="shrink-0 flex items-center">
                    <a href="{{ route('home') }}">
                        <x-application-logo class="block h-9 w-auto fill-current text-gray-800" />
                    </a>
                </div>

                <div class="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                    <x-nav-link :href="route('home')" :active="request()->routeIs('home')">
                        {{ __('messages.nav.home') }}
                    </x-nav-link>

                    <x-nav-link :href="route('show.index')" :active="request()->routeIs('show.*')">
                        {{ __('messages.nav.shows') }}
                    </x-nav-link>

                    <x-nav-link :href="route('location.index')" :active="request()->routeIs('location.*')">
                        {{ __('messages.nav.locations') }}
                    </x-nav-link>

                    <x-nav-link :href="route('type.index')" :active="request()->routeIs('type.*')">
                        {{ __('messages.nav.types') }}
                    </x-nav-link>

                    <x-nav-link :href="route('price.index')" :active="request()->routeIs('price.*')">
                        {{ __('messages.nav.prices') }}
                    </x-nav-link>

                    <x-nav-link :href="route('locality.index')" :active="request()->routeIs('locality.*')">
                        {{ __('messages.nav.localities') }}
                    </x-nav-link>

                    <x-nav-link :href="route('role.index')" :active="request()->routeIs('role.*')">
                        {{ __('messages.nav.roles') }}
                    </x-nav-link>
                </div>
            </div>

            <!-- Droite: langue + Auth / Guest -->
            <div class="hidden sm:flex sm:items-center sm:ml-6 gap-4">

                <!-- Language switcher -->
                <div class="flex gap-1 text-xs">
                    <a href="{{ route('lang.switch', 'en') }}"
                       class="px-2 py-1 rounded border {{ app()->getLocale() === 'en' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-600 hover:border-gray-500' }}">
                        EN
                    </a>
                    <a href="{{ route('lang.switch', 'nl') }}"
                       class="px-2 py-1 rounded border {{ app()->getLocale() === 'nl' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-300 text-gray-600 hover:border-gray-500' }}">
                        NL
                    </a>
                </div>

                @auth
                    <x-dropdown align="right" width="48">
                        <x-slot name="trigger">
                            <button class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                                <div>{{ Auth::user()->name }}</div>

                                <div class="ml-1">
                                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </button>
                        </x-slot>

                        <x-slot name="content">
                            <x-dropdown-link :href="route('profile.edit')">
                                {{ __('messages.nav.profile') }}
                            </x-dropdown-link>

                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <x-dropdown-link :href="route('logout')"
                                    onclick="event.preventDefault(); this.closest('form').submit();">
                                    {{ __('Log Out') }}
                                </x-dropdown-link>
                            </form>
                        </x-slot>
                    </x-dropdown>
                @endauth

                @guest
                    <div class="space-x-4">
                        <a href="{{ route('login') }}" class="text-sm text-gray-600 hover:text-gray-900">
                            {{ __('messages.nav.login') }}
                        </a>
                        <a href="{{ route('register') }}" class="text-sm text-gray-600 hover:text-gray-900">
                            {{ __('messages.nav.register') }}
                        </a>
                    </div>
                @endguest

            </div>

            <!-- Hamburger -->
            <div class="-mr-2 flex items-center sm:hidden">
                <button @click="open = ! open" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition duration-150 ease-in-out">
                    <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path :class="{'hidden': open, 'inline-flex': ! open }" class="inline-flex"
                              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16" />
                        <path :class="{'hidden': ! open, 'inline-flex': open }" class="hidden"
                              stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

        </div>
    </div>
</nav>
