<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Member;
use App\Models\PatrolBase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function index()
    {
        $members = Member::all();
        $patrol_bases = PatrolBase::all();
        $loans = Loan::with('member', 'schedules', 'patrolBase')->latest()->get();
        $collectible_this_month = LoanSchedule::whereNull('paid_at')
            ->where(function ($query) {
                $query->whereMonth('due_date', now()->month)
                    ->whereYear('due_date', now()->year)
                    ->orWhere('due_date', '<', now()); // past due
            })
            ->sum('amount');
        return Inertia::render('borrowers/index', [
            'members' => $members,
            'loans' => $loans,
            'patrol_bases' => $patrol_bases,
            'collectibleThisMonth' => $collectible_this_month
        ]);
    }
}
