<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Member;
use App\Models\PatrolBase;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::all();
        return view('loan.index', compact('loans'));
    }

    public function create()
    {
        $members = Member::all();
        $patrol_base = PatrolBase::all();
        return view('loan.create', [
            'members' => $members,
            'patrol_base' => $patrol_base
        ]);
    }

    public function show(Loan $loan)
    {
        return view('loan.show', compact('loan'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'patrol_base_id' => 'required|exists:patrol_bases,id',
            'principal_loan' => 'required|numeric|min:0',
            'previous_payment' => 'required|numeric|min:0',
            'principal_deduction' => 'required|numeric|min:0',
            'monthly_interest' => 'required|numeric|min:0',
            'unpaid_share_capital' => 'required|numeric|min:0',
            'balance' => 'required|numeric|min:0',
            'share' => 'required|numeric|min:0',
            'zampen_benefits' => 'required|numeric|min:0',
            'processing_fee' => 'required|numeric|min:0',
            'total_deductions' => 'required|numeric|min:0'
        ]);

        Loan::create($request->all());

        return redirect()->route('loans.index')->with('success', 'Loan created successfully.');
    }

    public function edit(Loan $loan)
    {
        $members = Member::all();
        $patrol_base = PatrolBase::all();
        return view('loans.edit', compact('loan', 'members', 'patrol_base'));
    }

    public function update(Request $request, Loan $loan)
    {
        $request->validate([
            'member_id' => 'required|exists:members,id',
            'patrol_base_id' => 'required|exists:patrol_bases,id',
            'principal_loan' => 'required|numeric|min:0',
            'previous_payment' => 'required|numeric|min:0',
            'principal_deduction' => 'required|numeric|min:0',
            'monthly_interest' => 'required|numeric|min:0',
            'unpaid_share_capital' => 'required|numeric|min:0',
            'balance' => 'required|numeric|min:0',
            'share' => 'required|numeric|min:0',
            'zampen_benefits' => 'required|numeric|min:0',
            'processing_fee' => 'required|numeric|min:0',
            'total_deductions' => 'required|numeric|min:0'
        ]);

        $loan->update($request->all());

        return redirect()->route('loans.index')->with('success', 'Loan updated successfully.');
    }

    public function destroy(Loan $loan)
    {
        $loan->delete();
        return redirect()->route('loans.index')->with('success', 'Loan deleted successfully.');
    }

    public function restore($id)
    {
        $loan = Loan::withTrashed()->findOrFail($id);
        $loan->restore();
        return redirect()->route('loans.index')->with('success', 'Loan restored successfully.');
    }

    public function forceDelete($id)
    {
        $loan = Loan::withTrashed()->findOrFail($id);
        $loan->forceDelete();
        return redirect()->route('loans.index')->with('success', 'Loan permanently deleted.');
    }
}
