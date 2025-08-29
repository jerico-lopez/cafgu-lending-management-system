<?php

namespace Tests\Traits;

use Illuminate\Support\Facades\DB;

trait WithRoles
{
    protected function seedRoles(): void
    {
        DB::table('roles')->insertOrIgnore([
            ['id' => 1, 'name' => 'Admin'],
            ['id' => 2, 'name' => 'User'],
            ['id' => 3, 'name' => 'Staff'],
        ]);
    }
}
