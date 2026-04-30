<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'demo@marketai.com'],
            [
                'name' => 'Demo Recruiter',
                'password' => \Illuminate\Support\Facades\Hash::make('demo123456'),
                'email_verified_at' => now(),
            ]
        );
    }
}
