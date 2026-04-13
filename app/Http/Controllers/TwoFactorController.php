<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorController extends Controller
{
    public function show(Request $request): View
    {
        $user = $request->user();
        $google2fa = new Google2FA();

        if (! $user->two_factor_secret) {
            $user->update([
                'two_factor_secret' => encrypt($google2fa->generateSecretKey()),
            ]);
        }

        $secret = decrypt($user->two_factor_secret);

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return view('auth.two-factor-setup', [
            'secret'    => $secret,
            'qrCodeUrl' => $qrCodeUrl,
            'enabled'   => ! is_null($user->two_factor_confirmed_at),
        ]);
    }

    public function enable(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string']]);

        $user = $request->user();
        $google2fa = new Google2FA();
        $secret = decrypt($user->two_factor_secret);

        if (! $google2fa->verifyKey($secret, $request->code)) {
            return back()->withErrors(['code' => 'Code TOTP invalide.']);
        }

        $user->update(['two_factor_confirmed_at' => now()]);

        return redirect()->route('profile.security')->with('status', '2FA activee.');
    }

    public function disable(Request $request): RedirectResponse
    {
        $request->validate(['password' => ['required', 'current_password']]);

        $request->user()->update([
            'two_factor_secret'         => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at'   => null,
        ]);

        return redirect()->route('profile.security')->with('status', '2FA desactivee.');
    }

    public function challenge(): View
    {
        return view('auth.two-factor-challenge');
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate(['code' => ['required', 'string']]);

        $user = auth()->user();
        if (! $user) {
            return redirect()->route('login');
        }

        $google2fa = new Google2FA();
        $secret    = decrypt($user->two_factor_secret);

        if (! $google2fa->verifyKey($secret, $request->code)) {
            return back()->withErrors(['code' => 'Code invalide.']);
        }

        $request->session()->put('2fa_verified', true);

        return redirect()->intended(route('dashboard'));
    }
}
