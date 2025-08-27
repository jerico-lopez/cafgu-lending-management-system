<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CivilStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('civil_statuses')->insert([
            ['status' => 'Single'],
            ['status' => 'Married'],
            ['status' => 'Divorced'],
            ['status' => 'Separated'],
            ['status' => 'Widowed'],
        ]);
    }
}
