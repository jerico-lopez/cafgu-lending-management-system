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
import { Edit, Plus, Search, Shield, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
    users: any[];
    collectibleThisMonth: number;
}

const roleOptions = ['Admin', 'Treasurer', 'Encoder'];

const Users = ({ users, collectibleThisMonth }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        username: '',
        email: '',
        role: '',
        password: '',
        password_confirmation: '',
    });
    const { toast } = useToast();
    const monthName = new Date().toLocaleString('en-US', { month: 'long' });

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error('Validation Errors:', errors);
        }
    }, [errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.name || !data.username || !data.role) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields',
                variant: 'destructive',
            });
            return;
        }

        if (data.password !== data.password_confirmation) {
            toast({
                title: 'Password Mismatch',
                description: 'Passwords do not match',
                variant: 'destructive',
            });
            return;
        }

        post('/users');
    };

    const handleEdit = (user: any) => {
        toast({
            title: 'Edit User',
            description: `Editing user: ${user.name}`,
        });
    };

    // delete modal
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string>('');
    const handleDeleteClick = (user: any) => {
        setSelectedUserId(user.id);
        setSelectedUserName(user.name);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedUserId) {
            router.delete(`/users/${selectedUserId}`, {
                onSuccess: () => {
                    toast({
                        title: 'User Deleted',
                        description: `${selectedUserName} has been removed`,
                        variant: 'destructive',
                    });
                },
            });
        }
        setIsConfirmOpen(false);
    };

    const getStatusBadge = (status: string) => {
        return status === 'Active' ? <Badge className="status-active">Active</Badge> : <Badge className="status-rejected">Inactive</Badge>;
    };

    const getRoleBadge = (role: string) => {
        const roleColors: { [key: string]: string } = {
            Admin: 'bg-destructive/10 text-destructive border-destructive/20',
            Treasurer: 'bg-warning/10 text-warning border-warning/20',
            Encoder: 'bg-primary/10 text-primary border-primary/20',
        };
        return (
            <Badge className={`${roleColors[role] || 'bg-muted'} rounded-full px-2 py-1 text-xs font-medium`}>
                <Shield className="mr-1 h-3 w-3" />
                {role}
            </Badge>
        );
    };

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">User Management</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {collectibleThisMonth ? `₱${collectibleThisMonth.toLocaleString()}` : '₱0.00'} Collectibles this month ({monthName})
                        </div>
                        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="btn-primary">
                            <Plus className="mr-2 h-4 w-4" />
                            New User
                        </Button>
                    </div>
                </div>

                {/* New User Form */}
                {isFormOpen && (
                    <Card className="card-dashboard mb-6">
                        <CardHeader>
                            <CardTitle>Create New User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            placeholder="Enter full name"
                                            required
                                        />
                                        {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username *</Label>
                                        <Input
                                            id="username"
                                            value={data.username}
                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                            placeholder="Enter username"
                                            required
                                        />
                                        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter email address"
                                        />
                                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role *</Label>
                                        <Select value={data.role} onValueChange={(value) => handleInputChange('role', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select user role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleOptions.map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            placeholder="Enter password"
                                            required
                                        />
                                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation">Confirm Password *</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                            placeholder="Confirm password"
                                            required
                                        />
                                        {errors.password_confirmation && <p style={{ color: 'red' }}>{errors.password_confirmation}</p>}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="submit" className="btn-primary">
                                        Create User
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Users Table */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>System Users</CardTitle>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
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
                                        <TableHead>Username</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Last Login</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredUsers.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell className="font-mono">{user.username}</TableCell>
                                            <TableCell>{getRoleBadge(user.role)}</TableCell>
                                            <TableCell>{getStatusBadge(user.status)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                                                        <Edit className="mr-1 h-4 w-4" />
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(user)}
                                                        disabled={user.username === 'admin'}
                                                    >
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
                                Showing {filteredUsers.length} of {users.length} users
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Active: {users.filter((u) => u.status === 'Active').length}</span>
                                <span>Inactive: {users.filter((u) => u.status === 'Inactive').length}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-lg font-semibold">Delete User?</h2>
                        <p className="mb-6">
                            Are you sure you want to delete <strong>{selectedUserName}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleConfirmDelete}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Users;
