<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'last_name' => fake()->lastName(),
            'first_name' => fake()->firstName(),
            'middle_name' => fake()->optional()->lastName(),
            'address' => fake()->address(),
            'tin_number' => fake()->unique()->numerify('###-###-###'),
            'birth_date' => fake()->date(),
            'gender' => fake()->randomElement(['male', 'female']),
            'civil_status' => fake()->randomElement(['single', 'married', 'widowed', 'divorced']),
            'educational_attainment' => fake()->randomElement(['High School', 'College', 'Postgraduate']),
            'occupation' => fake()->jobTitle(),
            'number_of_dependents' => fake()->numberBetween(0, 5),
            'religion' => fake()->randomElement(['Roman Catholic', 'Islam', 'Iglesia ni Cristo']),
            'annual_income' => fake()->randomFloat(2, 0, 100000),
            'membership_number' => fake()->unique()->numerify('MEM-#####'),
            'bod_resolution_number' => fake()->unique()->numerify('BOD-#####'),
            'membership_type' => fake()->randomElement(['Regular', 'Associate']),
            'initial_capital_subscription' => fake()->randomFloat(2, 0, 100000),
            'initial_paid_up' => fake()->randomFloat(2, 0, 100000),
            'afp_issued_id' => fake()->unique()->numerify('AFP-#####'),
        ];
    }
}
