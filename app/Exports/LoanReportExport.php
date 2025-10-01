<?php

namespace App\Exports;

use App\Models\Loan;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LoanReportExport implements FromView, WithColumnFormatting, WithStyles, ShouldAutoSize
{
    protected $month;
    protected $year;
    protected $patrolBase;

    public function __construct($month, $year, $patrolBase)
    {
        $this->month = $month;
        $this->year = $year;
        $this->patrolBase = $patrolBase;
    }

    public function view(): View
    {
        $query = Loan::with(['member', 'patrolBase']);

        if ($this->month) {
            $query->whereMonth('created_at', $this->month);
        }
        if ($this->year) {
            $query->whereYear('created_at', $this->year);
        }
        if ($this->patrolBase) {
            $query->where('patrol_base_id', $this->patrolBase);
        }

        return view('exports.loan_report', [
            'loans' => $query->get()
        ]);
    }

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_NUMBER_00, // Principal Loan
            'E' => NumberFormat::FORMAT_NUMBER_00, // Prev. Payments
            'F' => NumberFormat::FORMAT_NUMBER_00, // Principal Deduct
            'G' => NumberFormat::FORMAT_NUMBER_00, // 1 Month Int.
            'H' => NumberFormat::FORMAT_NUMBER_00, // Proc. Fee
            'I' => NumberFormat::FORMAT_NUMBER_00, // Zampen Benefits
            'J' => NumberFormat::FORMAT_NUMBER_00, // Unpd Share Capital
            'K' => NumberFormat::FORMAT_NUMBER_00, // Total Deduct
            'L' => NumberFormat::FORMAT_NUMBER_00, // Balance
            'M' => NumberFormat::FORMAT_NUMBER_00, // Share 2012-2024
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Bold header row (row 1)
            1 => ['font' => ['bold' => true]],
        ];
    }
}
