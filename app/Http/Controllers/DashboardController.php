<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Member;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ========================== Loan Data ===============================
        $total_loans = Loan::sum('principal_loan');

        $new_loans = Loan::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        if ($new_loans) {
            $loan_change = "+" . $new_loans;
            $loan_trend = "up";
        } else {
            $loan_change = "No updates";
            $loan_trend = "flat";
        }

        // ========================== Members Data ============================
        $total_members = Member::count(); // get the total members

        // get new members this month
        $new_members = Member::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        // get deleted members this month
        $deleted_members = Member::onlyTrashed()->whereMonth('deleted_at', now()->month)
            ->whereYear('deleted_at', now()->year)
            ->count();

        $members_total_change = $new_members - $deleted_members;

        if ($members_total_change > 0) {
            $members_total_change = "+" . $members_total_change;
            $members_trend = 'up';
        } else if ($members_total_change < 0) {
            $members_total_change = "-" . $members_total_change;
            $members_trend = 'down';
        } else {
            $members_total_change = "No updates";
            $members_trend = 'flat';
        }

        // ========================== Members Loan Data ============================

        $total_members_with_loan = Loan::where('status', 'Open')
            ->distinct('member_id')
            ->count('member_id');

        $new_loans_members_this_month = Loan::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->distinct('member_id')
            ->count('member_id');

        if ($new_loans_members_this_month) {
            $members_loan_change = "+" . $new_loans_members_this_month;
            $members_loan_trend = "up";
        } else {
            $members_loan_change = "No updates";
            $members_loan_trend = "flat";
        }

        // ========================== Past Due Data ============================
        $past_due_loans = LoanSchedule::where('paid_at', null)->whereDate('due_date', '<', now())->count();

        // ========================== Collectible Data ============================
        $current_month_collectibles = LoanSchedule::join('loans', 'loan_schedules.loan_id', '=', 'loans.id')
            ->whereMonth('due_date', now()->month)
            ->whereYear('due_date', now()->year)
            ->where('paid_at', null)
            ->sum('loans.monthly_payment');

        $past_due_collectibles = LoanSchedule::join('loans', 'loan_schedules.loan_id', '=', 'loans.id')
            ->where('paid_at', null)
            ->whereDate('due_date', '<', now())
            ->sum('loans.monthly_payment');

        $total_collectible = $current_month_collectibles + $past_due_collectibles;


        return Inertia::render('dashboard', [
            'loan_data' => [
                'value' => $total_loans,
                'change' => $loan_change,
                'trend' => $loan_trend,
            ],

            'members_data' => [
                'value' => $total_members,
                'change' => $members_total_change,
                'trend' => $members_trend,
            ],

            'members_loan_data' => [
                'value' => $total_members_with_loan,
                'change' => $members_loan_change,
                'trend' => $members_loan_trend
            ],
            'past_due_loans_data' => ['value' => $past_due_loans],
            'collectibles_data' => ['value' => $total_collectible]
        ]);
    }
}
