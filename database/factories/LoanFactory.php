<?php

namespace Database\Factories;

use App\Models\Member;
use App\Models\PatrolBase;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Loan>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $member_id = Member::inRandomOrder()->first()->id;
        $patrol_base_id = PatrolBase::inRandomOrder()->first()->id;
        $monthly_interest_rate = 0.03;
        $term = $this->faker->randomElement([1, 2, 3, 6, 12]);
        $zampenBenefits = $this->faker->numberBetween(1000, 5000);
        $processingFee = $this->faker->numberBetween(200, 800);

        $principal_loan = $this->faker->numberBetween(1000, 10000);
        $principal_deduction = $principal_loan * 0.2 * $term;
        $monthly_interest = $principal_loan * $monthly_interest_rate * $term;
        $unpaid_share_capital = $principal_loan * 0.02 * $term;

        $total_deductions = $principal_deduction + $monthly_interest + $unpaid_share_capital + $zampenBenefits + $processingFee;

        return [
            'member_id' => $member_id,
            'patrol_base_id' => $patrol_base_id,
            'principal_loan' => $principal_loan,
            'principal_deduction' => $principal_deduction,
            'monthly_interest_rate' => $monthly_interest_rate,
            'monthly_interest' => $monthly_interest,
            'loan_term' => $term,
            'unpaid_share_capital' => $unpaid_share_capital,
            'share' => $this->faker->numberBetween(1000, 5000),
            'zampen_benefits' => $zampenBenefits,
            'processing_fee' => $processingFee,
            'total_deduction' => $total_deductions,
            'net_amount' => $principal_loan - $total_deductions,
            'monthly_payment' => ($principal_loan + $monthly_interest) / $term,
            'date_approved' => $this->faker->date(),
        ];
    }
}
