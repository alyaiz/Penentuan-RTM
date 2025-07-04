<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Kevin Iansyah',
                'email' => 'keviniansyah04@gmail.com',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'status' => 'aktif',
            ],
            [
                'name' => 'Sasa Amelia',
                'email' => 'sasa@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'aktif',
            ],
            [
                'name' => 'Dio Pratama',
                'email' => 'dio@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'nonaktif',
            ],
            [
                'name' => 'Rina Oktaviani',
                'email' => 'rina@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'aktif',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@example.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'nonaktif',
            ],
        ];

        foreach ($users as $user) {
            User::create($user);
        }
    }
}
