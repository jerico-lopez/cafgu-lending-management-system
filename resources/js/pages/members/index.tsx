import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Edit, Plus, Search, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';

const members: any[] = [];

const religionOptions = ['Catholic', 'Protestant', 'Islam', 'Buddhism', 'Others'];
const genderOptions = ['Male', 'Female'];
const civilStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
const educationOptions = ['Elementary', 'High School', 'College', 'Vocational', 'Graduate'];

const Members: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        address: '',
        tin: '',
        dateOfBirth: '',
        gender: '',
        civilStatus: '',
        educationalAttainment: '',
        occupation: '',
        dependents: '',
        religion: '',
        annualIncome: '',
        membershipNumber: '',
        bodResolutionNumber: '',
        membershipType: '',
        initialCapitalSubscription: '',
        initialPaidUp: '',
        afpIssuedId: '',
    });
    const { toast } = useToast();

    const filteredMembers = members.filter(
        (member) =>
            member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.tin.includes(searchTerm),
    );

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Auto-calculate age when date of birth changes
        if (field === 'dateOfBirth' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            setFormData((prev) => ({ ...prev, age: age.toString() }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        toast({
            title: 'Member Added',
            description: 'New member has been successfully registered',
        });

        setFormData({
            lastName: '',
            firstName: '',
            middleName: '',
            address: '',
            tin: '',
            dateOfBirth: '',
            gender: '',
            civilStatus: '',
            educationalAttainment: '',
            occupation: '',
            dependents: '',
            religion: '',
            annualIncome: '',
            membershipNumber: '',
            bodResolutionNumber: '',
            membershipType: '',
            initialCapitalSubscription: '',
            initialPaidUp: '',
            afpIssuedId: '',
        });
        setIsFormOpen(false);
    };

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Members Management</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">₱0.00 Collectibles this month (August)</div>
                        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="btn-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            New Member
                        </Button>
                    </div>
                </div>

                {/* New Member Form */}
                {isFormOpen && (
                    <Card className="card-dashboard mb-6">
                        <CardHeader>
                            <CardTitle>Member Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Personal Information */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name *</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="middleName">Middle Name</Label>
                                            <Input
                                                id="middleName"
                                                value={formData.middleName}
                                                onChange={(e) => handleInputChange('middleName', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Address *</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tin">TIN *</Label>
                                            <Input
                                                id="tin"
                                                value={formData.tin}
                                                onChange={(e) => handleInputChange('tin', e.target.value)}
                                                placeholder="XXX-XXX-XXX-XXX"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                            <Input
                                                id="dateOfBirth"
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender *</Label>
                                            <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {genderOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="civilStatus">Civil Status *</Label>
                                            <Select value={formData.civilStatus} onValueChange={(value) => handleInputChange('civilStatus', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select civil status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {civilStatusOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="educationalAttainment">Educational Attainment</Label>
                                            <Select
                                                value={formData.educationalAttainment}
                                                onValueChange={(value) => handleInputChange('educationalAttainment', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select education level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {educationOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="occupation">Occupation</Label>
                                            <Input
                                                id="occupation"
                                                value={formData.occupation}
                                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="dependents">Number of Dependents</Label>
                                            <Input
                                                id="dependents"
                                                type="number"
                                                value={formData.dependents}
                                                onChange={(e) => handleInputChange('dependents', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="religion">Religion</Label>
                                            <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select religion" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {religionOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="annualIncome">Annual Income</Label>
                                            <Input
                                                id="annualIncome"
                                                type="number"
                                                value={formData.annualIncome}
                                                onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                                                placeholder="₱"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Information */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold">Membership Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="membershipNumber">Membership Number</Label>
                                            <Input
                                                id="membershipNumber"
                                                value={formData.membershipNumber}
                                                onChange={(e) => handleInputChange('membershipNumber', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bodResolutionNumber">BOD Resolution Number</Label>
                                            <Input
                                                id="bodResolutionNumber"
                                                value={formData.bodResolutionNumber}
                                                onChange={(e) => handleInputChange('bodResolutionNumber', e.target.value)}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="membershipType">Membership Type</Label>
                                            <Select
                                                value={formData.membershipType}
                                                onValueChange={(value) => handleInputChange('membershipType', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select membership type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="regular">Regular</SelectItem>
                                                    <SelectItem value="associate">Associate</SelectItem>
                                                    <SelectItem value="honorary">Honorary</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="initialCapitalSubscription">Initial Capital Subscription</Label>
                                            <Input
                                                id="initialCapitalSubscription"
                                                type="number"
                                                value={formData.initialCapitalSubscription}
                                                onChange={(e) => handleInputChange('initialCapitalSubscription', e.target.value)}
                                                placeholder="₱"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="initialPaidUp">Initial Paid-Up</Label>
                                            <Input
                                                id="initialPaidUp"
                                                type="number"
                                                value={formData.initialPaidUp}
                                                onChange={(e) => handleInputChange('initialPaidUp', e.target.value)}
                                                placeholder="₱"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="afpIssuedId">AFP Issued ID</Label>
                                            <Input
                                                id="afpIssuedId"
                                                value={formData.afpIssuedId}
                                                onChange={(e) => handleInputChange('afpIssuedId', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold">Attachments</h3>
                                    <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                                        <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                                        <p className="mb-2 text-muted-foreground">Upload member documents</p>
                                        <Button variant="outline" type="button">
                                            Browse Files
                                        </Button>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" className="btn-primary">
                                        Save Member
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Members Table */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Members List</CardTitle>
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
                    </CardHeader>
                    <CardContent>
                        <div className="table-container">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>TIN</TableHead>
                                        <TableHead>Date of Birth</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Gender</TableHead>
                                        <TableHead>Civil Status</TableHead>
                                        <TableHead>Occupation</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredMembers.map((member) => (
                                        <TableRow key={member.id}>
                                            <TableCell className="font-medium">
                                                {`${member.firstName} ${member.middleName} ${member.lastName}`}
                                            </TableCell>
                                            <TableCell className="font-mono">{member.tin}</TableCell>
                                            <TableCell>{member.dateOfBirth}</TableCell>
                                            <TableCell>{member.age}</TableCell>
                                            <TableCell>{member.gender}</TableCell>
                                            <TableCell>{member.civilStatus}</TableCell>
                                            <TableCell>{member.occupation}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="mr-1 h-4 w-4" />
                                                        Delete
                                                    </Button>
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

export default Members;
