<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Member;
use App\Models\PatrolBase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoanController extends Controller
{
    public function index()
    {
        $members = Member::all();
        $patrol_bases = PatrolBase::all();
        $loans = Loan::with('member', 'schedules', 'patrolBase')->latest()->get();

        return Inertia::render('loans/index', [
            'loans' => $loans,
            'members' => $members,
            'patrol_bases' => $patrol_bases
        ]);
    }

    public function create()
    {
        $members = Member::all();
        $patrolBases = PatrolBase::all();

        return Inertia::render('loans/create', [
            'members' => $members,
            'patrolBases' => $patrolBases
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'member_id' => 'required|exists:members,id',
            'patrol_base_id' => 'required|exists:patrol_bases,id',
            'principal_loan' => 'required|numeric|min:1000',
            'monthly_interest_rate' => 'required|numeric|min:0', // % per month
            'loan_term' => 'required|integer|min:1',
            'zampen_benefits' => 'nullable|numeric|min:0',
            'previous_payment' => 'nullable|numeric|min:0',
            'processing_fee' => 'nullable|numeric|min:0',
        ]);

        // Defaults for optional fields
        $zampenBenefits = $data['zampen_benefits'] ?? 0;
        $processingFee = $data['processing_fee'] ?? 0;

        // Loan inputs
        $principal = $data['principal_loan'];
        $term = $data['loan_term'];
        $interestRate = $data['monthly_interest_rate']; // percentage per month

        $principalDeduction = $principal * 0.2 * $term;
        $monthlyInterest = $principal * ($interestRate / 100) * $term;
        $unpaidShareCapital = $principal * 0.02 * $term;

        $totalDeductions = $principalDeduction + $monthlyInterest + $unpaidShareCapital + $zampenBenefits + $processingFee;

        $netAmount = $principal - $totalDeductions;

        $monthlyPayment = ($principal + $monthlyInterest) / $term;

        $data = array_merge($data, [
            'principal_deduction' => $principalDeduction,
            'monthly_interest' => $monthlyInterest,
            'unpaid_share_capital' => $unpaidShareCapital,
            'total_deduction' => $totalDeductions,
            'net_amount' => $netAmount,
            'monthly_payment' => $monthlyPayment,
        ]);

        Loan::create($data);

        return Inertia::location(route('loans.index'));
    }


    public function show(Loan $loan)
    {
        $loan->load('member', 'schedules', 'payments');

        return Inertia::render('loans/show', [
            'loan' => $loan
        ]);
    }

    public function approve(Loan $loan)
    {
        if ($loan->status !== 'Pending') {
            return redirect()->back()->with('error', 'Only pending loans can be approved.');
        }

        $loan->update(['status' => 'Open', 'date_approved' => now()]);

        // Generate loan schedules
        for ($month = 1; $month <= $loan->loan_term; $month++) {
            LoanSchedule::create([
                'loan_id' => $loan->id,
                'month_no' => $month,
                'due_date' => now()->addMonths($month),
            ]);
        }
    }
}
