import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { router, useForm } from '@inertiajs/react';
import { Calculator, FileText, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    loans: any[];
    members: any[];
    patrol_bases: any[];
}

const Loans = ({ loans, members, patrol_bases }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { data, setData, post, put, processing, errors } = useForm({
        member_id: '',
        patrol_base_id: '',
        principal_loan: '',
        previous_payment:'',
        balance: '',
        share: '',
        zampen_benefits: '100',
        processing_fee: '100',
    });
    const [calculations, setCalculations] = useState({
        principal_deduction: 0,
        monthly_interest: 0,
        unpaid_share_capital: 0,
        total_deductions: 0,
        monthly_payment: 0,
    });
    const { toast } = useToast();

    const filteredLoans = loans.filter(
        (loan) => loan.member?.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => {
            const updated = { ...prev, [field]: value };
            calculateLoan(updated); // recalc based on latest state
            return updated;
        });
    };

    const calculateLoan = (form: typeof data) => {
        const principal_loan = parseFloat(form.principal_loan) || 0;
        const zampen_benefits = parseFloat(form.zampen_benefits) || 1000;
        const processing_fee = parseFloat(form.processing_fee) || 500;

        const principal_deduction = principal_loan  * 0.2;
        const monthly_interest = principal_loan * 0.03;
        const unpaid_share_capital = principal_loan * 0.02; 
        const total_deductions = principal_deduction + monthly_interest + unpaid_share_capital + zampen_benefits + processing_fee;
        const monthly_payment = principal_loan / 5;

        setCalculations({
            principal_deduction,
            monthly_interest,
            unpaid_share_capital,
            total_deductions,
            monthly_payment,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.member_id || !data.patrol_base_id || !data.principal_loan) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            });
            return;
        }

        // toast({
        //     title: 'Loan Application Created',
        //     description: 'Loan application has been submitted for approval',
        // });
        post('/loans');
    };

    const getStatusBadge = (status: string) => {
        const variants: { [key: string]: string } = {
            Active: 'status-active',
            Pending: 'status-pending',
            Completed: 'bg-muted text-muted-foreground',
            Overdue: 'status-rejected',
        };
        return <Badge className={variants[status] || 'status-pending'}>{status}</Badge>;
    };

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Loan Management</h1>
                    <Button onClick={() => setIsFormOpen(!isFormOpen)} className="btn-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        New Loan
                    </Button>
                </div>

                {/* New Loan Form */}
                {isFormOpen && (
                    <Card className="card-dashboard mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="h-5 w-5" />
                                Loan Application
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold">Loan Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="member">Member *</Label>
                                            <Select value={data.member_id} onValueChange={(value) => handleInputChange('member_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select member" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {members.map((member) => (
                                                        <SelectItem key={member.id} value={member.id.toLocaleString()}>
                                                            {member.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="patrol_base">Patrol Base *</Label>
                                            <Select value={data.patrol_base_id} onValueChange={(value) => handleInputChange('patrol_base_id', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select patrol base" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {patrol_bases.map((base) => (
                                                        <SelectItem key={base.id} value={base.id.toLocaleString()}>
                                                            {base.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="principal_loan">Principal Loan *</Label>
                                            <Input
                                                id="principal_loan"
                                                type="number"
                                                value={data.principal_loan}
                                                onChange={(e) => handleInputChange('principal_loan', e.target.value)}
                                                placeholder="₱0.00"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="previous_payment">Previous Payment</Label>
                                            <Input
                                                id="previous_payment"
                                                type="number"
                                                value={data.previous_payment}
                                                onChange={(e) => handleInputChange('previous_payment', e.target.value)}
                                                placeholder="₱0.00"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="balance">Balance</Label>
                                            <Input
                                                id="balance"
                                                type="number"
                                                value={data.balance}
                                                onChange={(e) => handleInputChange('balance', e.target.value)}
                                                placeholder="₱0.00"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="share">Share</Label>
                                            <Input
                                                id="share"
                                                type="number"
                                                value={data.share}
                                                onChange={(e) => handleInputChange('share', e.target.value)}
                                                placeholder="₱0.00"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="zampen_benefits">Zampen Benefits</Label>
                                            <Input
                                                id="zampen_benefits"
                                                type="number"
                                                value={data.zampen_benefits}
                                                onChange={(e) => handleInputChange('zampen_benefits', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="processing_fee">Processing Fee</Label>
                                            <Input
                                                id="processing_fee"
                                                type="number"
                                                value={data.processing_fee}
                                                onChange={(e) => handleInputChange('processing_fee', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Auto Calculations */}
                                {data.principal_loan && (
                                    <div>
                                        <h3 className="mb-4 text-lg font-semibold">Auto Calculations</h3>
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                                    <span className="text-sm font-medium">Principal Deduction (20%/month):</span>
                                                    <span className="font-mono">₱{calculations.principal_deduction.toLocaleString()}</span>
                                                </div>

                                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                                    <span className="text-sm font-medium">Monthly Interest (3%):</span>
                                                    <span className="font-mono">₱{calculations.monthly_interest.toLocaleString()}</span>
                                                </div>

                                                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                                    <span className="text-sm font-medium">Unpaid Share Capital (2%/month):</span>
                                                    <span className="font-mono">₱{calculations.unpaid_share_capital.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 p-3">
                                                    <span className="text-sm font-medium">Total Deductions:</span>
                                                    <span className="font-mono font-bold">₱{calculations.total_deductions.toLocaleString()}</span>
                                                </div>

                                                <div className="flex items-center justify-between rounded-lg border border-warning/20 bg-warning/5 p-3">
                                                    <span className="text-sm font-medium">Monthly Payment:</span>
                                                    <span className="font-mono font-bold text-warning">
                                                        ₱{calculations.monthly_payment.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <Button type="submit" className="btn-primary">
                                        Submit Loan Application
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Loans Table */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Loan Records</CardTitle>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search loans..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-64 pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="table-container">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Loan ID</TableHead>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Patrol Base</TableHead>
                                        <TableHead>Principal</TableHead>
                                        <TableHead>Monthly Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date Approved</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLoans.map((loan) => (
                                        <TableRow key={loan.id}>
                                            <TableCell className="font-mono">{loan.id}</TableCell>
                                            <TableCell className="font-medium">{loan.member?.name || "Deleted Member"}</TableCell>
                                            <TableCell>{loan.patrol_base?.name || "Deleted Patrol Base"}</TableCell>
                                            <TableCell className="font-mono">₱{loan.principal_loan.toLocaleString()}</TableCell>
                                            <TableCell className="font-mono">₱{loan.monthly_payment.toLocaleString()}</TableCell>
                                            <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                            <TableCell>{loan.date_approved || 'Pending'}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => router.visit(`/loans/${loan.id}`)}>
                                                        View Details
                                                    </Button>
                                                    {loan.status === 'Pending' && (
                                                        <Button size="sm" className="btn-success" onClick={() => router.put(`/loans/${loan.id}/approve`)}>
                                                            Approve
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Loans;
