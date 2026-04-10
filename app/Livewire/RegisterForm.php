<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\User;
use App\Models\Role;
use App\Mail\WelcomeMail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class RegisterForm extends Component
{
    public string $login = '';
    public string $email = '';
    public string $password = '';
    public string $password_confirmation = '';

    protected function rules(): array
    {
        return [
            'login'    => 'required|min:3|unique:users,login',
            'email'    => 'required|email|unique:users,email',
            'password' => [
                'required',
                'min:6',
                'confirmed',
                'regex:/^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/',
            ],
        ];
    }

    public function updatedLogin(): void
    {
        $this->validateOnly('login');
    }

    public function updatedEmail(): void
    {
        $this->validateOnly('email');
    }

    public function updatedPassword(): void
    {
        $this->validateOnly('password');
    }

    public function submit(): void
    {
        $this->validate();

        $user = User::create([
            'login'    => $this->login,
            'name'     => $this->login,
            'email'    => $this->email,
            'password' => Hash::make($this->password),
            'langue'   => 'fr',
        ]);

        $role = Role::where('role', 'member')->first();
        if ($role) $user->roles()->attach($role->id);

        Mail::to($user->email)->send(new WelcomeMail($user));

        session()->flash('success', 'Compte créé avec succès !');
        $this->redirect('/login');
    }

    public function hasErrors(): bool
    {
        return $this->getErrorBag()->isNotEmpty();
    }

    public function render()
    {
        return view('livewire.register-form');
    }
}
