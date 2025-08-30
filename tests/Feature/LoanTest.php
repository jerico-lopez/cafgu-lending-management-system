<?php

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\User;

test('authenticated users can visit the loans', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get('/loans')->assertOk();
});

test('a loan can be created', function () {
    $this->actingAs($user = User::factory()->create());

    $response = $this->post('/loans', [
        'member_id' => 1,
        'patrol_base_id' => 1,
        'principal_loan' => 10000,
    ]);

    $response->assertRedirect('/loans');
    $this->assertDatabaseHas('loans', [
        'member_id' => 1,
        'patrol_base_id' => 1,
        'principal_loan' => 10000,
    ]);
});

test('a loan can be approved and generate 5 schedules', function () {
    $this->actingAs($user = User::factory()->create());

    Loan::create([
        'member_id' => 1,
        'patrol_base_id' => 1,
        'principal_loan' => 10000,
    ]);

    $this->put("/loans/1/approve");

    $this->assertDatabaseHas('loans', [
        'id' => 1,
        'status' => 'open',
    ]);

    $loan_sched_count = LoanSchedule::where('loan_id', '=', 1)->count();

    $this->assertEquals(5, $loan_sched_count);
});

test('a loan formula is accurate', function () {
    $this->actingAs($user = User::factory()->create());

    Loan::create([
        'member_id' => 1,
        'patrol_base_id' => 1,
        'principal_loan' => 10000,
    ]);

    $this->put("/loans/1/approve");

    $this->assertDatabaseHas('loans', [
        'id' => 1,
        'status' => 'open',
    ]);

    $loan_sched = LoanSchedule::where('loan_id', '=', 1)->first();

    $this->assertEquals(2000, $loan_sched->principal_deduction);
    $this->assertEquals(300, $loan_sched->monthly_interest);
    $this->assertEquals(200, $loan_sched->unpaid_share_capital);
    $this->assertEquals(2500, $loan_sched->total_deduction);
});

test('a payment can be made for a loan', function () {
    $this->actingAs($user = User::factory()->create());

    Loan::create([
        'member_id' => 1,
        'patrol_base_id' => 1,
        'principal_loan' => 10000,
    ]);

    $this->put("/loans/1/approve");

    $this->post("/loans/1/payments", [
        'amount' => 2500,
    ]);

    $this->assertDatabaseHas('payments', [
        'loan_id' => 1,
        'amount' => 2500,
    ]);
});