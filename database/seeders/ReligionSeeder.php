<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReligionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $religions = [
            'Roman Catholic',
            'Islam',
            'Iglesia ni Cristo',
            'Protestant (Evangelical/Born Again)',
            'Seventh-day Adventist',
            'Jehovah’s Witnesses',
            'Buddhism',
            'Hinduism',
            'Judaism',
            'Other Christian',
            'None',
        ];

        foreach ($religions as $religion) {
            DB::table('religions')->insert(['name' => $religion]);
        }
    }
}
