<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('payments/index');
    }

    public function create()
    {
        $loans = Loan::all();
        $loan_schedules = LoanSchedule::all();
        return Inertia::render('payments/create', [
            'loans' => $loans,
            'loan_schedules' => $loan_schedules
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'loan_schedule_id' => 'nullable|exists:loan_schedules,id',
            'amount' => 'required|numeric|min:1',
            'paid_at' => 'required|date',
            'or_number' => 'required|string',
        ]);

        $loan = Loan::find($request->loan_id);

        if($loan->status !== 'open') {
            return back()->withErrors(['loan_id' => 'Payments can only be made on open loans.'])->withInput();
        }

        Payment::create($request->all());

        return back()->with('success', 'Payment recorded.');
    }
}
