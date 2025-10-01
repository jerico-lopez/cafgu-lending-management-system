<?php

namespace App\Exports;

use App\Models\Loan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithColumnFormatting;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LoanReportExport implements FromCollection, WithHeadings, WithColumnFormatting, WithStyles, ShouldAutoSize
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

    public function collection()
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

        $loans = $query->get();

        // Map loans into rows
        return $loans->map(function ($loan, $index) {
            return [
                $index + 1,
                $loan->patrolBase->name ?? '',
                $loan->member->name ?? '',
                $loan->principal_loan ?? 0,
                $loan->previous_payment ?? 0,
                $loan->principal_deduction ?? 0,
                $loan->monthly_interest ?? 0,
                $loan->processing_fee ?? 0,
                $loan->zampen_benefits ?? 0,
                $loan->unpaid_share_capital ?? 0,
                $loan->total_deduction ?? 0,
                $loan->balance ?? 0,
                $loan->share ?? 0,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Patrol Base',
            'Name',
            'Principal Loan',
            'Prev. Payments',
            'Principal Deduct',
            '1 Month Int.',
            'Proc. Fee',
            'Zampen Benefits',
            'Unpd Share Capital',
            'Total Deduct',
            'Balance',
            'Share 2012-2024',
        ];
    }

    public function columnFormats(): array
    {
        return [
            'D' => NumberFormat::FORMAT_NUMBER_00,
            'E' => NumberFormat::FORMAT_NUMBER_00,
            'F' => NumberFormat::FORMAT_NUMBER_00,
            'G' => NumberFormat::FORMAT_NUMBER_00,
            'H' => NumberFormat::FORMAT_NUMBER_00,
            'I' => NumberFormat::FORMAT_NUMBER_00,
            'J' => NumberFormat::FORMAT_NUMBER_00,
            'K' => NumberFormat::FORMAT_NUMBER_00,
            'L' => NumberFormat::FORMAT_NUMBER_00,
            'M' => NumberFormat::FORMAT_NUMBER_00,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]], // header row
        ];
    }
}
