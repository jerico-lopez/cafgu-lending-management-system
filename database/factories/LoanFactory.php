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
        $principalLoan = $this->faker->numberBetween(5000, 100000); // base loan
        $previousPayment = $this->faker->numberBetween(0, $principalLoan / 2);

        $principalDeduction = $principalLoan / 5; // principal loan divided by fixed 5 loan terms
        $monthlyInterest = $principalLoan * 0.03; //fixed 3% interest
        $unpaidShareCapital = $principalLoan * 0.02; //fixed 2%

        $processingFee = 100;
        $zampenBenefits = 100;

        $totalDeduction = $principalDeduction + $monthlyInterest + $unpaidShareCapital + $zampenBenefits + $processingFee;
        $balance = $this->faker->numberBetween(0, 2000);
        $share = $unpaidShareCapital;
        $monthly_payment =  $principalDeduction + $monthlyInterest + $unpaidShareCapital;

        return [
            'member_id' => Member::inRandomOrder()->first()->id ?? Member::factory(),
            'patrol_base_id' => PatrolBase::inRandomOrder()->first()->id ?? PatrolBase::factory(),
            'principal_loan' => $principalLoan,
            'previous_payment' => $previousPayment,
            'principal_deduction' => $principalDeduction,
            'monthly_interest' => $monthlyInterest,
            'unpaid_share_capital' => $unpaidShareCapital,
            'balance' => $balance,
            'share' => $share,
            'zampen_benefits' => $zampenBenefits,
            'processing_fee' => $processingFee,
            'total_deduction' => $totalDeduction,
            'status' => 'Pending',
            'monthly_payment' => $monthly_payment
        ];
    }
}
