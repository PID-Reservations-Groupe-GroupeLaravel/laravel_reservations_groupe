<?php

namespace App\Livewire;

use App\Models\Role;
use App\Models\User;
use App\Mail\WelcomeMail;
use Livewire\Component;
use Livewire\WithFileUploads;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class RegisterForm extends Component
{
    use WithFileUploads;

    public string $login = '';
    public string $firstname = '';
    public string $lastname = '';
    public string $email = '';
    public string $password = '';
    public string $password_confirmation = '';
    public string $langue = 'fr';
    public $photo = null;

    protected array $rules = [
        'login'     => 'required|min:3|unique:users,login',
        'firstname' => 'required|min:2',
        'lastname'  => 'required|min:2',
        'email'     => 'required|email|unique:users,email',
        'password'  => ['required', 'min:6', 'confirmed', 'regex:/^(?=.*[A-Z])(?=.*[\W_]).+$/'],
        'langue'    => 'required|in:fr,en,nl',
        'photo'     => 'nullable|image|max:2048',
    ];

    protected array $messages = [
        'login.required'     => 'Le login est obligatoire.',
        'login.min'          => 'Le login doit contenir au moins 3 caractères.',
        'login.unique'       => 'Ce login est déjà pris.',
        'firstname.required' => 'Le prénom est obligatoire.',
        'firstname.min'      => 'Le prénom doit contenir au moins 2 caractères.',
        'lastname.required'  => 'Le nom est obligatoire.',
        'lastname.min'       => 'Le nom doit contenir au moins 2 caractères.',
        'email.required'     => 'L\'email est obligatoire.',
        'email.email'        => 'L\'email n\'est pas valide.',
        'email.unique'       => 'Cet email est déjà utilisé.',
        'password.required'  => 'Le mot de passe est obligatoire.',
        'password.min'       => 'Le mot de passe doit contenir au moins 6 caractères.',
        'password.confirmed' => 'Les mots de passe ne correspondent pas.',
        'password.regex'     => 'Le mot de passe doit contenir au moins 1 majuscule et 1 caractère spécial.',
        'photo.image'        => 'Le fichier doit être une image.',
        'photo.max'          => 'La photo ne doit pas dépasser 2 Mo.',
    ];

    public function updatedLogin(): void      { $this->validateOnly('login'); }
    public function updatedFirstname(): void  { $this->validateOnly('firstname'); }
    public function updatedLastname(): void   { $this->validateOnly('lastname'); }
    public function updatedEmail(): void      { $this->validateOnly('email'); }
    public function updatedPassword(): void   { $this->validateOnly('password'); }
    public function updatedPhoto(): void      { $this->validateOnly('photo'); }

    public function submit(): void
    {
        $this->validate();

        $photoPath = $this->photo
            ? $this->photo->store('photos', 'public')
            : null;

        $user = User::create([
            'login'     => $this->login,
            'firstname' => $this->firstname,
            'lastname'  => $this->lastname,
            'name'      => $this->firstname . ' ' . $this->lastname,
            'email'     => $this->email,
            'password'  => Hash::make($this->password),
            'langue'    => $this->langue,
            'photo'     => $photoPath,
        ]);

        $role = Role::where('role', 'member')->first();
        if ($role) $user->roles()->attach($role->id);

        try {
            Mail::to($user->email)->send(new WelcomeMail($user));
        } catch (\Exception $e) {
            // Mail non bloquant
        }

        session()->flash('success', 'Inscription réussie ! Vous pouvez vous connecter.');
        $this->redirect(route('login'));
    }

    public function render()
    {
        return view('livewire.register-form');
    }
}
