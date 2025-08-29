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
            'principal' => 'required|numeric|min:1000',
        ]);

        $loan = Loan::create([
            'member_id' => $request->member_id,
            'patrol_base_id' => $request->patrol_base_id,
            'principal' => $request->principal,
        ]);

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
        // Generate loan schedules
        $principalDeduction = $loan->principal / $loan->term_months;
        $interest = $loan->principal * ($loan->interest_rate / 100);
        $shareCapital = $loan->principal * ($loan->share_capital_rate / 100);

        for ($month = 1; $month <= $loan->term_months; $month++) {
            LoanSchedule::create([
                'loan_id' => $loan->id,
                'month_no' => $month,
                'due_date' => now()->addMonths($month),
                'principal_deduction' => $principalDeduction,
                'interest' => $interest,
                'share_capital' => $shareCapital,
                'total_due' => $principalDeduction + $interest + $shareCapital,
            ]);
        }
    }
}
