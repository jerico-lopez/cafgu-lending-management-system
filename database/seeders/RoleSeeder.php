<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create(['name' => 'Admin', 'guard_name' => 'web']);
        Role::create(['name' => 'Treasurer', 'guard_name' => 'web']);
        Role::create(['name' => 'Encoder', 'guard_name' => 'web']);
    }
}
