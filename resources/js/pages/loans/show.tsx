import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
    loan: any;
}

interface Schedule {
    id: number;
    due_date: string;
    amount: number;
    paid_at: string | null;
}

const ViewLoan = ({ loan }: Props) => {
    const paidCount = loan.schedules?.filter((s: Schedule) => s.paid_at).length || 0;
    const totalCount = loan.schedules?.length || 0;

    // Date formatter helper
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Pending';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (value: number | null | undefined) => {
        if (value === null || value === undefined) return '₱0.00';
        return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    };

    const getStatusBadge = (status: string) => {
        const variants: { [key: string]: string } = {
            Active: 'status-active',
            Pending: 'status-pending',
            Completed: 'bg-muted text-muted-foreground',
            Paid: 'bg-muted text-muted-foreground',
            Overdue: 'status-rejected',
        };
        return <Badge className={variants[status] || 'status-pending'}>{status}</Badge>;
    };

    return (
        <Layout>
            <div className="page-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">Loan Details</h1>
                    <Button variant="outline" onClick={() => router.visit('/loans')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Loans
                    </Button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Loan Information */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Loan #{loan.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Borrower Information */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Borrower Information</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label>Member</Label>
                                        <p className="font-medium">{loan.member?.name || '—'}</p>
                                    </div>
                                    <div>
                                        <Label>Patrol Base</Label>
                                        <p>{loan.patrol_base?.name || '—'}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Loan Information */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Loan Information</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label>Principal Loan</Label>
                                        <p className="font-mono">{formatCurrency(loan.principal_loan)}</p>
                                    </div>
                                    <div>
                                        <Label>Status: </Label>
                                        {getStatusBadge(loan.status)}
                                    </div>
                                    <div>
                                        <Label>Date Approved</Label>
                                        <p>{formatDate(loan.date_approved)}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Financial Breakdown */}
                            <div>
                                <h3 className="mb-3 text-lg font-semibold">Financial Breakdown</h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <Label>Principal Deduction</Label>
                                        <p className="font-mono">{formatCurrency(loan.principal_deduction)}</p>
                                    </div>
                                    <div>
                                        <Label>Unpaid Share Capital</Label>
                                        <p className="font-mono">{formatCurrency(loan.unpaid_share_capital)}</p>
                                    </div>
                                    <div>
                                        <Label>Balance</Label>
                                        <p className="font-mono">{formatCurrency(loan.balance)}</p>
                                    </div>
                                    <div>
                                        <Label>Share</Label>
                                        <p className="font-mono">{formatCurrency(loan.share)}</p>
                                    </div>
                                    <div>
                                        <Label>Previous Payment</Label>
                                        <p className="font-mono">{formatCurrency(loan.previous_payment)}</p>
                                    </div>
                                    <div>
                                        <Label>Zampen Benefits</Label>
                                        <p className="font-mono">{formatCurrency(loan.zampen_benefits)}</p>
                                    </div>
                                    <div>
                                        <Label>Processing Fee</Label>
                                        <p className="font-mono">{formatCurrency(loan.processing_fee)}</p>
                                    </div>
                                    <div>
                                        <Label>Total Deduction</Label>
                                        <p className="font-mono">{formatCurrency(loan.total_deduction)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Monthly Interest</Label>
                                        <p className="font-mono text-lg font-bold">{formatCurrency(loan.monthly_interest)}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <Label>Monthly Payment</Label>
                                        <p className="font-mono text-lg font-semibold">{formatCurrency(loan.monthly_payment)}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            {/* Actions */}
                            <div className="flex gap-4">
                                <Button variant="outline" onClick={() => router.visit('/loans')}>
                                    Back
                                </Button>
                                {loan.status === 'Pending' && (
                                    <Button className="btn-success" onClick={() => router.put(`/loans/${loan.id}/approve`)}>
                                        Approve Loan
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan Schedule */}
                    <div className="col-span-2">
                        {/* Summary */}
                        <Card className="col-span-1 shadow-sm md:col-span-2 mb-5">
                            <CardHeader>
                                <CardTitle>Collectibles Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm text-muted-foreground">This Month</Label>
                                    <p className="text-2xl font-bold text-blue-600">
                                        ₱{loan.collectibles_this_month?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label className="text-sm text-muted-foreground">Total Collectibles</Label>
                                    <p className="text-2xl font-bold text-green-600">
                                        ₱{loan.total_collectibles?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>

                                {/* Progress Bar Section */}
                                <div className="col-span-2">
                                    <Label className="mb-1 text-sm text-muted-foreground">Payment Progress</Label>
                                    {(() => {
                                        const total = loan.schedules?.length || 0;
                                        const paid = loan.schedules?.filter((s: any) => s.paid_at).length || 0;
                                        const percentage = total > 0 ? (paid / total) * 100 : 0;

                                        return (
                                            <div className="space-y-1">
                                                <Progress value={percentage} className="h-3" />
                                                <p className="text-xs text-muted-foreground">
                                                    {paid} of {total} installments paid ({percentage.toFixed(0)}%)
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        <h3 className="mb-3 text-lg font-semibold">Loan Schedule</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {loan.schedules && loan.schedules.length > 0 ? (
                                loan.schedules.map((schedule: any, index: number) => (
                                    <Card key={schedule.id} className="border shadow-sm">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center justify-between text-sm font-medium">
                                                Installment #{index + 1}
                                                {getStatusBadge(schedule.paid_at ? 'Completed' : 'Pending')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <Label>Due Date</Label>
                                                <p className="font-medium">{formatDate(schedule.due_date)}</p>
                                            </div>
                                            <div>
                                                <Label>Amount</Label>
                                                <p className="font-mono text-lg">₱{schedule.amount.toLocaleString()}</p>
                                            </div>

                                            {/* Action Button with Confirmation */}
                                            {schedule.paid_at === null ? (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button size="sm" className="btn-success w-full">
                                                            Mark as Paid
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to mark this installment as <b>Paid</b>? This action cannot be
                                                                undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => router.put(`/loans/${loan.id}/schedules/${schedule.id}/pay`)}
                                                            >
                                                                Yes, Mark as Paid
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            ) : (
                                                <div>
                                                    <Label>Paid At</Label>
                                                    <p className="font-medium">{formatDate(schedule.paid_at)}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="p-6 text-center text-muted-foreground">No schedules available</Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ViewLoan;
