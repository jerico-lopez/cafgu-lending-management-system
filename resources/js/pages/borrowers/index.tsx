import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Eye, Plus, Search } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
    members: any[];
    loans: any[];
    patrol_bases: any[];
    collectibleThisMonth: number;
}

const Borrowers: React.FC<Props> = ({ members, loans, patrol_bases, collectibleThisMonth }) => {
    const [selectedMember, setSelectedMember] = useState('');
    const [selectedPatrolBase, setSelectedPatrolBase] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();
    const monthName = new Date().toLocaleString('en-US', { month: 'long' });

    const filteredMembers = members.filter(
        (member) => member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.tin_number.includes(searchTerm),
    );

    const activeLoans = loans.filter((loan) => loan.member !== null);

    const handleCreateRecord = () => {
        if (!selectedMember || !selectedPatrolBase) {
            toast({
                title: 'Missing Information',
                description: 'Please select both member and patrol base',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Record Created',
            description: 'Borrower record has been created successfully',
        });

        setSelectedMember('');
        setSelectedPatrolBase('');
    };

    const getStatusBadge = (status: string) => {
        const variants: { [key: string]: string } = {
            Pending: 'status-pending',
            Approved: 'status-active',
            Rejected: 'status-rejected',
        };
        return <Badge className={variants[status] || 'status-pending'}>{status}</Badge>;
    };

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Borrowers Management</h1>
                    <div className="text-sm text-muted-foreground">
                        {collectibleThisMonth ? `₱${collectibleThisMonth.toLocaleString()}` : '₱0.00'} Collectibles this month ({monthName})
                    </div>
                </div>

                {/* New Borrower Form */}
                <Card className="card-dashboard mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5" />
                            New Borrower
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="member">Member *</Label>
                                <Select value={selectedMember} onValueChange={setSelectedMember}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select member" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem key={member.id} value={member.id.toString()}>
                                                {member.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="patrolBase">Patrol Base *</Label>
                                <Select value={selectedPatrolBase} onValueChange={setSelectedPatrolBase}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select patrol base" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patrol_bases.map((base) => (
                                            <SelectItem key={base.id} value={base.id.toString()}>
                                                {base.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex items-end">
                                <Button onClick={handleCreateRecord} className="btn-primary w-full">
                                    Create Record
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Members Table */}
                <Card className="card-dashboard mb-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Members</CardTitle>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder="Search members..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-64 pl-9"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="table-container">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>TIN</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Birthdate</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-8 text-center">
                                                <p className="text-muted-foreground">No members found</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Add members to start managing borrowers</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredMembers.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell className="font-mono">{member.tin_number}</TableCell>
                                                <TableCell className="font-medium">{member.name}</TableCell>
                                                <TableCell>{member.birth_date}</TableCell>
                                                <TableCell>{member.age}</TableCell>
                                                <TableCell>{member.gender}</TableCell>
                                                <TableCell>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        View Record
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredMembers.length} of {members.length} members
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Per Page:</span>
                                <Select defaultValue="10">
                                    <SelectTrigger className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="10">10</SelectItem>
                                        <SelectItem value="25">25</SelectItem>
                                        <SelectItem value="50">50</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loan Records Section */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <CardTitle>Loan Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="table-container">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Borrower</TableHead>
                                        <TableHead>Amount</TableHead>
                                        {/* <TableHead>Actions</TableHead> */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {activeLoans.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-8 text-center">
                                                <p className="text-muted-foreground">No loan records found</p>
                                                <p className="mt-1 text-sm text-muted-foreground">Loan records will appear here once created</p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        activeLoans.map((loan) => (
                                            <TableRow key={loan.id}>
                                                <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                                <TableCell className="font-medium">{loan.member?.name || 'Deleted Member'}</TableCell>
                                                <TableCell className="font-medium">{loan.principal_loan}</TableCell>
                                                {/* <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="mr-1 h-4 w-4" />
                                                            View
                                                        </Button>
                                                        {loan.status === 'Pending' && (
                                                            <>
                                                                <Button size="sm" className="btn-success">
                                                                    Approve
                                                                </Button>
                                                                <Button variant="destructive" size="sm">
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell> */}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Borrowers;
