<nav class="-mx-3 flex flex-1 justify-end items-center gap-2">

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
        <a
            href="{{ url('/dashboard') }}"
            class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
        >
            {{ __('messages.nav.dashboard') }}
        </a>
    @else
        <a
            href="{{ route('login') }}"
            class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
        >
            {{ __('messages.nav.login') }}
        </a>

        @if (Route::has('register'))
            <a
                href="{{ route('register') }}"
                class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
            >
                {{ __('messages.nav.register') }}
            </a>
        @endif
    @endauth
</nav>
