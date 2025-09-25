<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Member;
use App\Models\PatrolBase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'previous_payment' => 'nullable|numeric|min:0',
            'balance' => 'nullable|numeric|min:0',
            'share' => 'nullable|numeric|min:0',
            'zampen_benefits' => 'nullable|numeric|min:0',
            'processing_fee' => 'nullable|numeric|min:0',
        ]);

        // Defaults for optional fields
        $zampenBenefits = $data['zampen_benefits'] ?? 0;
        $processingFee = $data['processing_fee'] ?? 0;

        // Loan inputs
        $principal = $data['principal_loan'];

        $principalDeduction = $principal * 0.2; //divide by 5 terms
        $monthlyInterest = $principal * 0.03; // 3% of loan
        $unpaidShareCapital = $principal * 0.02; // 2% of loan

        $totalDeductions = $principalDeduction + $monthlyInterest + $unpaidShareCapital + $zampenBenefits + $processingFee;

        $monthlyPayment = $principal / 5;

        $data = array_merge($data, [
            'principal_deduction' => $principalDeduction,
            'monthly_interest' => $monthlyInterest,
            'unpaid_share_capital' => $unpaidShareCapital,
            'total_deduction' => $totalDeductions,
            'monthly_payment' => $monthlyPayment,
        ]);

        // dd($data);

        Loan::create($data);

        return Inertia::location(route('loans.index'));
    }


    public function show(Loan $loan)
    {
        $loan->load('member', 'schedules', 'patrolBase');

        return Inertia::render('loans/show', [
            'loan' => $loan
        ]);
    }

    public function approve(Loan $loan)
    {
        if ($loan->status !== 'Pending') {
            return redirect()->back()->with('error', 'Only pending loans can be approved.');
        }

        DB::transaction(function () use ($loan) {
            // Update loan status and approval date
            $loan->update([
                'status' => 'Open',
                'date_approved' => now(),
            ]);

            // Generate loan schedules
            $schedules = [];
            for ($month = 1; $month <= 5; $month++) {
                $schedules[] = [
                    'loan_id' => $loan->id,
                    'month_no' => $month,
                    'amount' => $loan->monthly_payment,
                    'due_date' => now()->addMonths($month),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // dd($schedules);

            LoanSchedule::insert($schedules);
        });
    }

    public function pay(Loan $loan, LoanSchedule $schedule){
        if ($loan->status !== 'Open') {
            return redirect()->back()->with('error', 'Only open loans can be paid.');
        }

        if ($schedule->paid_at !== null) {
            return redirect()->back()->with('error', 'This schedule is already paid.');
        }

        DB::transaction(function () use ($loan, $schedule) {
            // Mark the schedule as paid
            $schedule->update([
                'paid_at' => now(),
            ]);

            // Check if all schedules are paid
            $allPaid = $loan->schedules()->whereNull('paid_at')->count() === 0;

            if ($allPaid) {
                // Update loan status to Paid if all schedules are paid
                $loan->update(['status' => 'Paid']);
            }
        });

        return redirect()->back()->with('success', 'Payment recorded successfully.');
    }
}
