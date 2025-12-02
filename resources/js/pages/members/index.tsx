import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { router, useForm } from '@inertiajs/react';
import { File, Plus, Search, Trash2, Upload, View, X } from 'lucide-react';
import React, { useState } from 'react';

const religionOptions = ['Catholic', 'Protestant', 'Islam', 'Buddhism', 'Others'];
const genderOptions = ['Male', 'Female'];
const civil_statusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
const educationOptions = ['Elementary', 'High School', 'College', 'Vocational', 'Graduate'];

interface Props {
    members: any[];
    collectibleThisMonth: number;
}

interface AttachmentWithName {
    file: File;
    file_name: string;
}

const Members = ({ members, collectibleThisMonth }: Props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const monthName = new Date().toLocaleString('en-US', { month: 'long' });

    const [previewUrls, setPreviewUrls] = useState<(string | null)[]>([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        last_name: '',
        first_name: '',
        middle_name: '',
        address: '',
        tin_number: '',
        birth_date: '',
        gender: '',
        civil_status: '',
        educational_attainment: '',
        occupation: '',
        number_of_dependents: '',
        religion: '',
        annual_income: '',
        membership_number: '',
        bod_resolution_number: '',
        membership_type: '',
        initial_capital_subscription: '',
        initial_paid_up: '',
        afp_issued_id: '',
        attachments: [] as AttachmentWithName[],
    });

    const { toast } = useToast();

    const filteredMembers = members.filter(
        (member) =>
            member.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.tin_number.includes(searchTerm),
    );

    const handleInputChange = (field: string, value: string) => {
        setData((prev) => ({ ...prev, [field]: value }));

        // Auto-calculate age when date of birth changes
        if (field === 'dateOfBirth' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            setData((prev) => ({ ...prev, age: age.toString() }));
        }
    };

    // Handle File Change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? []);
        const newAttachments = selectedFiles.map((file) => ({
            file,
            file_name: file.name,
        }));
        const updatedFiles = [...data.attachments, ...newAttachments];
        setData('attachments', updatedFiles);

        // Preview File
        previewFiles(updatedFiles);
    };

    // Handle File Drop
    const handleFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer.files ?? []);
        const newAttachments = selectedFiles.map((file) => ({
            file,
            file_name: file.name,
        }));
        const updatedFiles = [...data.attachments, ...newAttachments];
        setData('attachments', updatedFiles);

        // Preview File
        previewFiles(updatedFiles);
    };

    const previewFiles = (attachments: AttachmentWithName[]) => {
        const previews: string[] = [];

        attachments.forEach((attachment, index) => {
            if (attachment.file.type.startsWith('image/')) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    previews[index] = reader.result as string;

                    if (previews.length === attachments.length) {
                        setPreviewUrls([...previews]);
                    }
                };

                reader.readAsDataURL(attachment.file);
            } else {
                previews[index] = '';
                if (previews.length === attachments.length) {
                    setPreviewUrls([...previews]);
                }
            }

            setPreviewUrls(previews);
        });
    };

    const handleFileRemove = (index: number) => {
        const updatedFiles = [...data.attachments];
        const updatedPreview = [...previewUrls];

        updatedFiles.splice(index, 1);
        updatedPreview.splice(index, 1);

        setData('attachments', updatedFiles);
        setPreviewUrls(updatedPreview);
    };

    const handleFileNameChange = (index: number, name: string) => {
        const updatedFiles = [...data.attachments];
        updatedFiles[index] = {
            ...updatedFiles[index],
            file_name: name,
        };
        setData('attachments', updatedFiles);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        // Append text input
        Object.keys(data).forEach((key) => {
            if (key !== 'attachments') {
                formData.append(key, (data as any)[key] ?? '');
            }
        });

        // Append files
        data.attachments.forEach((attachment, index) => {
            formData.append(`attachments[${index}]`, attachment.file);
            formData.append(`attachments[${index}][file_name]`, attachment.file_name);
        });

        router.post('members', formData, {
            forceFormData: true, // important so Inertia treats it as multipart/form-data
            onError: (errors) => {
                Object.entries(errors).forEach(([field, messages]) => {
                    const msgArray = Array.isArray(messages) ? messages : [messages];
                    msgArray.forEach((msg, index) => {
                        toast({ title: `${msg}`, duration: 5000, variant: 'destructive', key: `${index}` });
                    });
                });
            },
        });

        //     post('members', {
        //         onError: (errors) => {
        //             Object.entries(errors).forEach(([field, messages]) => {
        //                 // Ensure messages is always an array
        //                 const msgArray = Array.isArray(messages) ? messages : [messages];

        //                 msgArray.forEach((msg, index) => {
        //                     toast({ title: `${msg}`, duration: 5000, variant: 'destructive', key: `${index}` });
        //                 });
        //             });
        //         },
        //     });
    };

    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Members Management</h1>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                            {collectibleThisMonth ? `₱${collectibleThisMonth.toLocaleString()}` : '₱0.00'} Collectibles this month ({monthName})
                        </div>
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
                                            <Label htmlFor="last_name">Last Name *</Label>
                                            <Input
                                                id="last_name"
                                                value={data.last_name}
                                                onChange={(e) => handleInputChange('last_name', e.target.value)}
                                            />
                                            {errors.last_name && <p style={{ color: 'red' }}>{errors.last_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First Name *</Label>
                                            <Input
                                                id="first_name"
                                                value={data.first_name}
                                                onChange={(e) => handleInputChange('first_name', e.target.value)}
                                            />
                                            {errors.first_name && <p style={{ color: 'red' }}>{errors.first_name}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="middle_name">Middle Name</Label>
                                            <Input
                                                id="middle_name"
                                                value={data.middle_name}
                                                onChange={(e) => handleInputChange('middle_name', e.target.value)}
                                            />
                                            {errors.middle_name && <p style={{ color: 'red' }}>{errors.middle_name}</p>}
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Address *</Label>
                                            <Textarea
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => handleInputChange('address', e.target.value)}
                                            />
                                            {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tin_number">TIN_number *</Label>
                                            <Input
                                                id="tin_number"
                                                value={data.tin_number}
                                                onChange={(e) => handleInputChange('tin_number', e.target.value)}
                                                placeholder="XXX-XXX-XXX-XXX"
                                            />
                                            {errors.tin_number && <p style={{ color: 'red' }}>{errors.tin_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="birth_date">Date of Birth *</Label>
                                            <Input
                                                id="birth_date"
                                                type="date"
                                                value={data.birth_date}
                                                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                                            />
                                            {errors.birth_date && <p style={{ color: 'red' }}>{errors.birth_date}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="gender">Gender *</Label>
                                            <Select value={data.gender} onValueChange={(value) => handleInputChange('gender', value)}>
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
                                            {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="civil_status">Civil Status *</Label>
                                            <Select value={data.civil_status} onValueChange={(value) => handleInputChange('civil_status', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select civil status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {civil_statusOptions.map((option) => (
                                                        <SelectItem key={option} value={option}>
                                                            {option}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.civil_status && <p style={{ color: 'red' }}>{errors.civil_status}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="educational_attainment">Educational Attainment</Label>
                                            <Select
                                                value={data.educational_attainment}
                                                onValueChange={(value) => handleInputChange('educational_attainment', value)}
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
                                            {errors.educational_attainment && <p style={{ color: 'red' }}>{errors.educational_attainment}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="occupation">Occupation</Label>
                                            <Input
                                                id="occupation"
                                                value={data.occupation}
                                                onChange={(e) => handleInputChange('occupation', e.target.value)}
                                            />
                                            {errors.occupation && <p style={{ color: 'red' }}>{errors.occupation}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="number_of_dependents">Number of Dependents</Label>
                                            <Input
                                                id="number_of_dependents"
                                                type="number"
                                                value={data.number_of_dependents}
                                                onChange={(e) => handleInputChange('number_of_dependents', e.target.value)}
                                            />
                                            {errors.number_of_dependents && <p style={{ color: 'red' }}>{errors.number_of_dependents}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="religion">Religion</Label>
                                            <Select value={data.religion} onValueChange={(value) => handleInputChange('religion', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select religion" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {religionOptions.map((religion) => (
                                                        <SelectItem key={religion} value={religion}>
                                                            {religion}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.religion && <p style={{ color: 'red' }}>{errors.religion}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="annual_income">Annual Income</Label>
                                            <Input
                                                id="annual_income"
                                                type="number"
                                                value={data.annual_income}
                                                onChange={(e) => handleInputChange('annual_income', e.target.value)}
                                                placeholder="₱"
                                            />
                                            {errors.annual_income && <p style={{ color: 'red' }}>{errors.annual_income}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Membership Information */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold">Membership Information</h3>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="membership_number">Membership Number</Label>
                                            <Input
                                                id="membership_number"
                                                value={data.membership_number}
                                                onChange={(e) => handleInputChange('membership_number', e.target.value)}
                                            />
                                            {errors.membership_number && <p style={{ color: 'red' }}>{errors.membership_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bod_resolution_number">BOD Resolution Number</Label>
                                            <Input
                                                id="bod_resolution_number"
                                                value={data.bod_resolution_number}
                                                onChange={(e) => handleInputChange('bod_resolution_number', e.target.value)}
                                            />
                                            {errors.bod_resolution_number && <p style={{ color: 'red' }}>{errors.bod_resolution_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="membership_type">Membership Type</Label>
                                            <Select
                                                value={data.membership_type}
                                                onValueChange={(value) => handleInputChange('membership_type', value)}
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
                                            {errors.membership_type && <p style={{ color: 'red' }}>{errors.membership_type}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="initial_capital_subscription">Initial Capital Subscription</Label>
                                            <Input
                                                id="initial_capital_subscription"
                                                type="number"
                                                value={data.initial_capital_subscription}
                                                onChange={(e) => handleInputChange('initial_capital_subscription', e.target.value)}
                                                placeholder="₱"
                                            />
                                            {errors.initial_capital_subscription && (
                                                <p style={{ color: 'red' }}>{errors.initial_capital_subscription}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="initial_paid_up">Initial Paid-Up</Label>
                                            <Input
                                                id="initial_paid_up"
                                                type="number"
                                                value={data.initial_paid_up}
                                                onChange={(e) => handleInputChange('initial_paid_up', e.target.value)}
                                                placeholder="₱"
                                            />
                                            {errors.initial_paid_up && <p style={{ color: 'red' }}>{errors.initial_paid_up}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="afp_issued_id">AFP Issued ID</Label>
                                            <Input
                                                id="afp_issued_id"
                                                value={data.afp_issued_id}
                                                onChange={(e) => handleInputChange('afp_issued_id', e.target.value)}
                                            />
                                            {errors.afp_issued_id && <p style={{ color: 'red' }}>{errors.afp_issued_id}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Attachments */}
                                <div>
                                    <h3 className="mb-4 text-lg font-semibold">Attachments</h3>
                                    <label
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                        }}
                                        onDrop={handleFileDrop}
                                        htmlFor="dropzone"
                                        className="flex h-70 w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed border-input bg-background transition hover:bg-gray-100"
                                    >
                                        <input onChange={handleFileChange} type="file" id="dropzone" multiple className="hidden" />
                                        <Upload className="h-16 w-16 text-gray-500" />
                                        <p className="text-gray-500">Click to browse files or drag and drop to upload</p>
                                        <p className="text-sm text-gray-500">Any file type (max 5MB each)</p>
                                    </label>

                                    {/* File Preview for Images */}
                                    {previewUrls.some((url) => url) && (
                                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {data.attachments.map((attachment, index) =>
                                                previewUrls[index] ? (
                                                    <div
                                                        key={index}
                                                        className="relative flex items-center gap-3 rounded-md border border-gray-300 bg-white p-2 shadow-md"
                                                    >
                                                        {/* Preview Image */}
                                                        <img
                                                            src={previewUrls[index] as string}
                                                            alt={`preview-${index}`}
                                                            className="h-32 w-32 rounded-md object-cover"
                                                        />

                                                        <div className="flex w-full flex-col gap-1">
                                                            <Label htmlFor={`file_name_${index}`}>File Name</Label>
                                                            <Input
                                                                id={`file_name_${index}`}
                                                                value={attachment.file_name}
                                                                onChange={(e) => handleFileNameChange(index, e.target.value)}
                                                            />
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => handleFileRemove(index)}
                                                            type="button"
                                                            className="absolute top-1 right-1 flex cursor-pointer flex-row items-center gap-2 rounded-md border border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ) : null,
                                            )}
                                        </div>
                                    )}

                                    {/* For  Non Images */}
                                    {data.attachments.some((_, index) => !previewUrls[index]) && (
                                        <div className="grid-col-1 mt-3 grid gap-2">
                                            {data.attachments.map((attachment, index) =>
                                                !previewUrls[index] ? (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between rounded-md border border-gray-300 bg-white p-2 shadow-md"
                                                    >
                                                        <div className="flex flex-col gap-2">
                                                            <File />
                                                            <span>{attachment.file.name}</span>
                                                        </div>

                                                        {/* Remove Button */}
                                                        <button
                                                            onClick={() => handleFileRemove(index)}
                                                            type="button"
                                                            className="flex cursor-pointer flex-row items-center gap-2 rounded-md border border-red-500 p-2 text-red-500 hover:bg-red-500 hover:text-white"
                                                        >
                                                            <X className="h-4 w-4" /> Remove
                                                        </button>
                                                    </div>
                                                ) : null,
                                            )}
                                        </div>
                                    )}
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
                                                {`${member.first_name} ${member.middle_name ? member.middle_name + ' ' : ''}${member.last_name}`}
                                            </TableCell>
                                            <TableCell className="font-mono">{member.tin_number}</TableCell>
                                            <TableCell>{member.birth_date}</TableCell>
                                            <TableCell>{member.age}</TableCell>
                                            <TableCell>{member.gender}</TableCell>
                                            <TableCell>{member.civil_status}</TableCell>
                                            <TableCell>{member.occupation}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm" onClick={() => router.get(`members/${member.id}`)}>
                                                        <View className="mr-1 h-4 w-4" />
                                                        View
                                                    </Button>
                                                    <Button variant="destructive" size="sm" onClick={() => router.delete(`members/${member.id}`)}>
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
