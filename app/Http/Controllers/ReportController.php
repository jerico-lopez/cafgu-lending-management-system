<?php

namespace App\Http\Controllers;

use App\Exports\LoanReportExport;
use App\Models\Loan;
use App\Models\PatrolBase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        // Get filter inputs
        $month = $request->input('month');
        $year = $request->input('year');
        $patrolBase = $request->input('patrol_base');

        // Query the report data with relationships
        $query = Loan::with(['member', 'patrolBase']);

        if ($month) {
            $query->whereMonth('created_at', $month);
        }

        if ($year) {
            $query->whereYear('created_at', $year);
        }

        if ($patrolBase) {
            $query->where('patrol_base_id', $patrolBase);
        }

        $reportData = $query->get();

        // Get patrol base options with id & name
        $patrolBases = PatrolBase::select('id', 'name')->get();

        return Inertia::render('reports/index', [
            'reportData' => $reportData,
            'patrolBases' => $patrolBases,
            'filters' => [
                'month' => $month,
                'year' => $year,
                'patrol_base' => $patrolBase,
            ],
        ]);
    }

    public function exportExcel(Request $request)
    {
        $month = $request->input('month');
        $year = $request->input('year');
        $patrolBase = $request->input('patrol_base');

        return Excel::download(new LoanReportExport($month, $year, $patrolBase), 'loan_report.xlsx');
    }
}
