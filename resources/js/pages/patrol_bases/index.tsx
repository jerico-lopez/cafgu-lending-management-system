import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { router, useForm } from '@inertiajs/react';
import { Edit, Plus, Search, Trash2 } from 'lucide-react';
import React, { useState } from 'react';


interface Props {
    patrol_bases: any[];
    collectibleThisMonth: number;
}

const PatrolBase = ({ patrol_bases, collectibleThisMonth }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        location: '',
        command_officer: '',
    });
    const { toast } = useToast();
    const monthName = new Date().toLocaleString('en-US', { month: 'long' });

    const filteredBases = patrol_bases.filter(
        (base) => base.name.toLowerCase().includes(searchTerm.toLowerCase()) || base.location.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name.trim()) {
            toast({
                title: 'Missing Information',
                description: 'Please enter patrol base name',
                variant: 'destructive',
            });
            return;
        }

        post('/patrol-bases');

        setData({ name: '', location: '', command_officer: '' });
        setIsFormOpen(false);
    };

    const handleEdit = (base: any) => {
        toast({
            title: 'Edit Patrol Base',
            description: `Editing ${base.name}`,
        });
    };

    const handleDelete = (base: any) => {
        toast({
            title: 'Patrol Base Deleted',
            description: `${base.name} has been removed`,
            variant: 'destructive',
        });
    };

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Patrol Base Management</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {collectibleThisMonth ? `₱${collectibleThisMonth.toLocaleString()}` : '₱0.00'} Collectibles this month ({monthName})
                        </div>
                        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="btn-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            New Patrol Base
                        </Button>
                    </div>
                </div>

                {/* New Patrol Base Form */}
                {isFormOpen && (
                    <Card className="card-dashboard mb-6">
                        <CardHeader>
                            <CardTitle>New Patrol Base</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Base Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter patrol base name"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => handleInputChange('location', e.target.value)}
                                            placeholder="Enter location/sector"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="command_officer">Command Officer</Label>
                                        <Input
                                            id="command_officer"
                                            value={data.command_officer}
                                            onChange={(e) => handleInputChange('command_officer', e.target.value)}
                                            placeholder="Enter officer name"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" className="btn-primary">
                                        Create Patrol Base
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Patrol Base Table */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Patrol Bases</CardTitle>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search patrol bases..."
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
                                        <TableHead>Base Name</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Command Officer</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBases.map((base) => (
                                        <TableRow key={base.id}>
                                            <TableCell className="font-medium">{base.name}</TableCell>
                                            <TableCell>{base.location}</TableCell>
                                            <TableCell>{base.command_officer}</TableCell>
                                            <TableCell>
                                                <span className="status-active">Active</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(base)}>
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => { handleDelete(base); router.delete(`patrol-bases/${base.id}`); }}>
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

                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredBases.length} of {patrol_bases.length} patrol bases
                            </div>
                            <div className="text-sm text-muted-foreground">Total Active Bases: {patrol_bases.length}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default PatrolBase;
