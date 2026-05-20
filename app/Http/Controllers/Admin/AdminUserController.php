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

    public function exportCsv(Request $request)
    {
        $role = $request->query('role', 'members');

        $query = User::with('roles');

        if ($role === 'admins') {
            $query->whereHas('roles', fn($q) => $q->where('role', 'admin'));
        } elseif ($role === 'producers') {
            $query->whereHas('roles', fn($q) => $q->where('role', 'producer'));
        } else {
            $query->whereHas('roles', fn($q) => $q->where('role', 'member'))
                  ->whereDoesntHave('roles', fn($q) => $q->whereIn('role', ['admin', 'producer']));
        }

        $users = $query->get();

        $filename = "export_{$role}_" . now()->format('Y-m-d') . ".csv";

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function () use ($users, $role) {
            $handle = fopen('php://output', 'w');
            fputs($handle, "\xEF\xBB\xBF"); // BOM UTF-8 pour Excel

            $columns = ['ID', 'Nom', 'Prénom', 'Login', 'Email', 'Langue', 'Rôles', 'Inscrit le', 'Désactivé'];
            if ($role === 'producers') {
                $columns[] = 'Entreprise';
            }
            fputcsv($handle, $columns, ';');

            foreach ($users as $user) {
                $roles = $user->roles->pluck('role')->join(', ');
                $row = [
                    $user->id,
                    $user->lastname ?? '',
                    $user->firstname ?? '',
                    $user->login ?? '',
                    $user->email,
                    $user->langue ?? '',
                    $roles,
                    $user->created_at?->format('d/m/Y'),
                    $user->is_disabled ? 'Oui' : 'Non',
                ];
                if ($role === 'producers') {
                    $request_company = \DB::table('producer_requests')
                        ->where('user_id', $user->id)
                        ->where('status', 'approved')
                        ->value('company_name');
                    $row[] = $request_company ?? '';
                }
                fputcsv($handle, $row, ';');
            }
            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function disable(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json([
                'message' => "Un admin ne peut pas se désactiver lui-même."
            ], 403);
        }
        $user->update(['is_disabled' => true]);
        return response()->json(['message' => 'Utilisateur désactivé.']);
    }

    public function enable(User $user)
    {
        $user->update(['is_disabled' => false]);
        return response()->json(['message' => 'Utilisateur réactivé.']);
    }
}
