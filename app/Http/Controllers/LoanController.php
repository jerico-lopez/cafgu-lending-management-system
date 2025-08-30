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
        $loans = Loan::with('member', 'schedules')->latest()->get();

        return Inertia::render('loans/index', [
            'loans' => $loans
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
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'patrol_base_id' => 'required|exists:patrol_bases,id',
            'principal_loan' => 'required|numeric|min:1000',
            'previous_payment' => 'nullable|numeric|min:0',
            'loan_term' => 'nullable|integer|min:1',
            'interest_rate' => 'nullable|numeric|min:0',
            'unpaid_share_capital_rate' => 'nullable|numeric|min:0',
            'status' => 'nullable|string',
            'share' => 'nullable|numeric|min:0',
            'zampen_benefits' => 'nullable|numeric|min:0',
            'processing_fee' => 'nullable|numeric|min:0',
        ]);

        Loan::create($request->all());

        return redirect()->route('loans.index')
            ->with('success', 'Loan created successfully with schedules.');
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
        if ($loan->status !== 'pending') {
            return redirect()->back()->with('error', 'Only pending loans can be approved.');
        }

        $loan->update(['status' => 'open']);

        // Computations
        $principalDeduction = $loan->principal_loan / $loan->loan_term;
        $interest = $loan->principal_loan * ($loan->interest_rate / 100);
        $shareCapital = $loan->principal_loan * ($loan->unpaid_share_capital_rate / 100);

        // Generate loan schedules
        for ($month = 1; $month <= $loan->loan_term; $month++) {
            LoanSchedule::create([
                'loan_id' => $loan->id,
                'month_no' => $month,
                'due_date' => now()->addMonths($month),
                'principal_deduction' => $principalDeduction,
                'monthly_interest' => $interest,
                'unpaid_share_capital' => $shareCapital,
                'total_deduction' => $principalDeduction + $interest + $shareCapital,
            ]);
        }
    }
}
