<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('roles')->query();
        if ($request->filled('email')) {
            $query->where('email', 'like', "%{$request->email}%");
        }
        return UserResource::collection($query->paginate(20));
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'role' => 'required|string|exists:roles,role',
        ]);
        $role = Role::where('role', $data['role'])->firstOrFail();
        $user->roles()->sync([$role->id]);
        return new UserResource($user->load('roles'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
