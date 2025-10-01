<table>
    <thead>
        <tr>
            <th>No</th>
            <th>Patrol Base</th>
            <th>Name</th>
            <th>Principal Loan</th>
            <th>Prev. Payments</th>
            <th>Principal Deduct</th>
            <th>1 Month Int.</th>
            <th>Proc. Fee</th>
            <th>Zampen Benefits</th>
            <th>Unpd Share Capital</th>
            <th>Total Deduct</th>
            <th>Balance</th>
            <th>Share 2012-2024</th>
        </tr>
    </thead>
    <tbody>
        @php
            $totalPrincipal = 0;
            $totalPrevPayments = 0;
            $totalPrincipalDeduct = 0;
            $totalInterest = 0;
            $totalProcFee = 0;
            $totalZampen = 0;
            $totalUnpaidShare = 0;
            $totalDeduct = 0;
            $totalBalance = 0;
            $totalShare = 0;
        @endphp

        @foreach ($loans as $index => $loan)
            @php
                $totalPrincipal += $loan->principal_loan ?? 0;
                $totalPrevPayments += $loan->previous_payment ?? 0;
                $totalPrincipalDeduct += $loan->principal_deduction ?? 0;
                $totalInterest += $loan->monthly_interest ?? 0;
                $totalProcFee += $loan->processing_fee ?? 0;
                $totalZampen += $loan->zampen_benefits ?? 0;
                $totalUnpaidShare += $loan->unpaid_share_capital ?? 0;
                $totalDeduct += $loan->total_deduction ?? 0;
                $totalBalance += $loan->balance ?? 0;
                $totalShare += $loan->share ?? 0;
            @endphp

            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $loan->patrolBase->name ?? '' }}</td>
                <td>{{ $loan->member->name ?? '' }}</td>
                <td>{{ $loan->principal_loan ?? 0 }}</td>
                <td>{{ $loan->previous_payment ?? 0 }}</td>
                <td>{{ $loan->principal_deduction ?? 0 }}</td>
                <td>{{ $loan->monthly_interest ?? 0 }}</td>
                <td>{{ $loan->processing_fee ?? 0 }}</td>
                <td>{{ $loan->zampen_benefits ?? 0 }}</td>
                <td>{{ $loan->unpaid_share_capital ?? 0 }}</td>
                <td>{{ $loan->total_deduction ?? 0 }}</td>
                <td>{{ $load->balance ?? 0 }}</td>
                <td>{{ $loan->share ?? 0 }}</td>
            </tr>
        @endforeach

        {{-- TOTAL ROW --}}
        <tr style="font-weight: bold; background: #f0f0f0;">
            <td colspan="3" style="text-align: center;">TOTAL</td>
            <td>{{ $totalPrincipal }}</td>
            <td>{{ $totalPrevPayments }}</td>
            <td>{{ $totalPrincipalDeduct }}</td>
            <td>{{ $totalInterest }}</td>
            <td>{{ $totalProcFee }}</td>
            <td>{{ $totalZampen }}</td>
            <td>{{ $totalUnpaidShare }}</td>
            <td>{{ $totalDeduct }}</td>
            <td>{{ $totalBalance }}</td>
            <td>{{ $totalShare }}</td>
        </tr>
    </tbody>
</table>
