<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\LoanSchedule;
use App\Models\Member;
use App\Models\PatrolBase;
use DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ========================== Loan Data ===============================
        $total_loans = Loan::where('status', '=', 'Open')->sum('principal_loan');

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

        // ========================== Patrol Base Loans ============================
        // Get all patrol bases
        $patrol_bases = PatrolBase::all();

        // Map each patrol base to total loans
        $patrol_base_data = $patrol_bases->map(function ($base) {
            $loan_count = Loan::where('patrol_base_id', $base->id)->count();
            return [
                'name' => $base->name,
                'loans' => $loan_count,
            ];
        });

        // ========================== Monthly Collection Data ============================
        // Get sum of monthly payments grouped by month for the current year
        $monthly_collection_data = LoanSchedule::join('loans', 'loan_schedules.loan_id', '=', 'loans.id')
            ->select(
                DB::raw('MONTH(loan_schedules.due_date) as month_number'),
                DB::raw('SUM(loans.monthly_payment) as amount')
            )
            ->whereYear('loan_schedules.due_date', now()->year)
            ->whereNull('loan_schedules.paid_at') // only unpaid collections
            ->groupBy('month_number')
            ->orderBy('month_number')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('F', mktime(0, 0, 0, $item->month_number, 1)), // convert month number to name
                    'amount' => $item->amount,
                ];
            });

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
            'collectibles_data' => ['value' => $total_collectible],
            'patrol_base_data' => $patrol_base_data,
            'monthly_collection_data' => $monthly_collection_data
        ]);
    }
}
