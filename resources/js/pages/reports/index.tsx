import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

interface Props {
    reportData: any[];
    patrolBases: { id: number; name: string }[];
    filters: {
        month?: string;
        year?: string;
        patrol_base?: string;
    };
}

const ReportView = ({ reportData, patrolBases, filters }: Props) => {
    const [month, setMonth] = useState(filters.month || '');
    const [year, setYear] = useState(filters.year || '');
    const [patrolBase, setPatrolBase] = useState(filters.patrol_base || '');

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
        }).format(value);

    // Apply filters client-side
    const filteredData = reportData.filter((item) => {
        const createdAt = new Date(item.date_approved);
        const itemMonth = (createdAt.getMonth() + 1).toString();
        const itemYear = createdAt.getFullYear().toString();

        const matchesMonth = month ? itemMonth === month : true;
        const matchesYear = year ? itemYear === year : true;
        const matchesPatrolBase = patrolBase ? item.patrol_base_id.toString() === patrolBase : true;

        return matchesMonth && matchesYear && matchesPatrolBase;
    });

    const reportTitle = month && year ? `Loan Report ${month}/${year}` : 'Loan Report';

    return (
        <Layout>
            <div className="page-container p-4">
                {/* Header with logos and company info */}
                <div className="mb-4 flex items-center justify-evenly">
                    <img src="/lovable-uploads/c220bffd-33c5-49db-b365-5c1a2681bdc8.png" alt="Left Logo" className="h-24 w-24 rounded-full" />
                    <div className="text-center">
                        <p className="text-lg font-bold">CAFGU ZAMPEN COOPERATIVE</p>
                        <p>So DK, Brgy Libertad, Municipality of Tungawan,</p>
                        <p>Zamboanga Sibugay Province</p>
                        <p>XDA REG No. 9520-10900000000-256-00</p>
                        <p>TIN No. 477424593000</p>
                    </div>
                    <img src="/lovable-uploads/f79c8a91-7753-4751-8606-1624c268d377.png" alt="Right Logo" className="h-24 w-24 rounded-full" />
                </div>

                {/* Report Title */}
                <h2 className="mb-6 text-center text-xl font-bold">{reportTitle}</h2>

                {/* Filters */}
                <Card className="mb-6 p-4">
                    <div className="flex flex-wrap items-end gap-4">
                        <div>
                            <label className="mb-1 block font-medium">Month</label>
                            <Select value={month} onValueChange={setMonth}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i} value={(i + 1).toString()}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Year</label>
                            <Input type="number" placeholder="e.g. 2025" value={year} onChange={(e) => setYear(e.target.value)} className="w-32" />
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">Patrol Base</label>
                            <Select value={patrolBase} onValueChange={setPatrolBase}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Select Base" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patrolBases.map((base) => (
                                        <SelectItem key={base.id} value={base.id.toString()}>
                                            {base.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="mt-2">Filter</Button>
                        <Button asChild>
                            <a href={`/reports/export?month=${month}&year=${year}&patrol_base=${patrolBase}`} target="_blank">
                                Export to Excel
                            </a>
                        </Button>
                    </div>
                </Card>

                {/* Report Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-2 py-1 text-center">No</th>
                                <th className="border px-2 py-1 text-center">Patrol Base</th>
                                <th className="border px-2 py-1 text-center">Names</th>
                                <th className="border px-2 py-1 text-center">Principal Loan</th>
                                <th className="border px-2 py-1 text-center">Prev. Payments</th>
                                <th className="border px-2 py-1 text-center">Principal Deduct</th>
                                <th className="border px-2 py-1 text-center">1 Month Int.</th>
                                <th className="border px-2 py-1 text-center">Proc. Fee</th>
                                <th className="border px-2 py-1 text-center">Zampen Benefits</th>
                                <th className="border px-2 py-1 text-center">Unpd Share Capital</th>
                                <th className="border px-2 py-1 text-center">Total Deduct</th>
                                <th className="border px-2 py-1 text-center">Balance</th>
                                <th className="border px-2 py-1 text-center">Share 2012-2024</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((loan: any, index: number) => {
                                const balance = loan.principal_loan - (loan.previous_payment + loan.total_deduction);
                                return (
                                    <tr key={loan.id}>
                                        <td className="border px-2 py-1 text-center">{index + 1}</td>
                                        <td className="border px-2 py-1 text-center">{loan.patrol_base?.name}</td>
                                        <td className="border px-2 py-1 text-center">{loan.member?.name}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.principal_loan || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.previous_payment || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.principal_deduction || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.monthly_interest || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.processing_fee || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.zampen_benefits || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.unpaid_share_capital || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.total_deduction || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.balance || 0)}</td>
                                        <td className="border px-2 py-1 text-right">{formatCurrency(loan.share || 0)}</td>
                                    </tr>
                                );
                            })}

                            {/* Totals Row */}
                            <tr className="bg-gray-200 font-bold">
                                <td colSpan={3} className="border px-2 py-1 text-center">
                                    TOTAL
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.principal_loan || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.previous_payment || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.principal_deduction || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.monthly_interest || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.processing_fee || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.zampen_benefits || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.unpaid_share_capital || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.total_deduction || 0), 0))}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(
                                        filteredData.reduce(
                                            (sum, loan) =>
                                                sum +
                                                (Number(loan.principal_loan || 0) -
                                                    (Number(loan.previous_payment || 0) + Number(loan.total_deduction || 0))),
                                            0,
                                        ),
                                    )}
                                </td>
                                <td className="border px-2 py-1 text-right">
                                    {formatCurrency(filteredData.reduce((sum, loan) => sum + Number(loan.share || 0), 0))}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default ReportView;
