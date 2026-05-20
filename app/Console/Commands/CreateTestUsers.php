<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Role;
use Illuminate\Console\Command;

class CreateTestUsers extends Command
{
    protected $signature = 'test:create-users';
    protected $description = 'Create test users with predefined roles and passwords';

    public function handle(): int
    {
        $testUsers = [
            [
                'login' => 'visitor_test',
                'email' => 'visitor@test.local',
                'password' => 'Visitor123!',
                'firstname' => 'Test',
                'lastname' => 'Visitor',
                'name' => 'Test Visitor',
                'roles' => [], // no roles
            ],
            [
                'login' => 'member_test',
                'email' => 'member@test.local',
                'password' => 'Member123!',
                'firstname' => 'Test',
                'lastname' => 'Member',
                'name' => 'Test Member',
                'roles' => ['member'],
            ],
            [
                'login' => 'producer_test',
                'email' => 'producer@test.local',
                'password' => 'Producer123!',
                'firstname' => 'Test',
                'lastname' => 'Producer',
                'name' => 'Test Producer',
                'roles' => ['member', 'producer'],
            ],
            [
                'login' => 'admin_test',
                'email' => 'admin@test.local',
                'password' => 'Admin123!',
                'firstname' => 'Test',
                'lastname' => 'Admin',
                'name' => 'Test Admin',
                'roles' => ['admin'],
            ],
        ];

        foreach ($testUsers as $userData) {
            $roles = $userData['roles'];
            unset($userData['roles']);

            $user = User::where('email', $userData['email'])->first();

            if ($user) {
                $this->line("✓ User {$userData['login']} already exists");
            } else {
                $user = User::create($userData);
                $this->line("✓ Created user: {$userData['login']} ({$userData['email']})");
            }

            // Sync roles
            $roleIds = [];
            foreach ($roles as $roleName) {
                $role = Role::where('role', $roleName)->first();
                if ($role) {
                    $roleIds[] = $role->id;
                }
            }
            $user->roles()->sync($roleIds);
        }

        $this->newLine();
        $this->info('Test users created/verified successfully!');

        return 0;
    }
}
