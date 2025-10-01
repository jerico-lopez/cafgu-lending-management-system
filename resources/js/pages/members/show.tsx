import Layout from '@/components/Layout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { router } from '@inertiajs/react';
import { ArrowLeft, Download, File } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface Props {
    member: any;
}

const ViewMember = ({ member }: Props) => {
    const [formData, setFormData] = useState(member);
    const [attachments, setAttachments] = useState(member.attachments || []);
    const [isEditing, setIsEditing] = useState(false);

    // For AlertDialog
    const [attachmentToDelete, setAttachmentToDelete] = useState<any>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setFormData(member);
        setIsEditing(false);
    };
    const handleSave = () => {
        router.put(`/members/${member.id}`, formData, {
            onSuccess: () => {
                toast.success('Member updated successfully');
                setIsEditing(false);
            },
            onError: (errors) => Object.values(errors).forEach((err) => toast.error(String(err))),
        });
    };

    const handleAddAttachments = (files: FileList) => {
        const formDataObj = new FormData();
        Array.from(files).forEach((file) => formDataObj.append('attachments[]', file));

        router.post(`/members/${member.id}/attachments`, formDataObj, {
            forceFormData: true,
            onSuccess: (page: any) => {
                toast.success('Attachment(s) uploaded successfully');
                setAttachments(page.props.member.attachments);
            },
            onError: (errors) => Object.values(errors).forEach((err) => toast.error(String(err))),
        });
    };

    const confirmRemoveAttachment = (file: any) => {
        setAttachmentToDelete(file);
        setIsAlertOpen(true);
    };

    const handleRemoveAttachment = () => {
        if (!attachmentToDelete) return;

        router.delete(`/members/${attachmentToDelete.id}/attachments`, {
            onSuccess: (page: any) => {
                toast.success('Attachment removed');
                setAttachments(page.props.member.attachments);
                setAttachmentToDelete(null);
                setIsAlertOpen(false);
            },
            onError: (errors) => Object.values(errors).forEach((err) => toast.error(String(err))),
        });
    };

    return (
        <Layout>
            <div className="page-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1 className="page-title">Member Details</h1>
                    <Button variant="outline" onClick={() => router.visit('/members')}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Members
                    </Button>
                </div>

                {/* Member Info */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>{formData.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Personal Info */}
                        <div>
                            <h3 className="mb-3 text-lg font-semibold">Personal Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {['first_name', 'middle_name', 'last_name', 'birth_date', 'age', 'gender', 'civil_status', 'religion'].map(
                                    (field) => (
                                        <div key={field}>
                                            <Label className="capitalize">{field.replace('_', ' ')}</Label>
                                            <input
                                                type="text"
                                                name={field}
                                                value={formData[field] ?? ''}
                                                disabled={!isEditing || field === 'age'}
                                                onChange={handleChange}
                                                className={`w-full rounded border p-2 ${
                                                    !isEditing || field === 'age' ? 'bg-gray-100 text-gray-700' : 'bg-white'
                                                }`}
                                            />
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* Membership Info */}
                        <div>
                            <h3 className="mb-3 text-lg font-semibold">Membership Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {[
                                    'membership_number',
                                    'bod_resolution_number',
                                    'membership_type',
                                    'initial_capital_subscription',
                                    'initial_paid_up',
                                    'afp_issued_id',
                                ].map((field) => (
                                    <div key={field}>
                                        <Label className="capitalize">{field.replace('_', ' ')}</Label>
                                        <input
                                            type="text"
                                            name={field}
                                            value={formData[field] ?? ''}
                                            disabled={!isEditing}
                                            onChange={handleChange}
                                            className={`w-full rounded border p-2 ${!isEditing ? 'bg-gray-100 text-gray-700' : 'bg-white'}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <Button onClick={handleEdit}>Edit</Button>
                            ) : (
                                <>
                                    <Button className="btn-success" onClick={handleSave}>
                                        Save
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card className="mt-6">
                    <CardHeader className="flex items-center justify-between gap-3">
                        <CardTitle>Attachments</CardTitle>
                        <div className="flex gap-2">
                            <input
                                type="file"
                                id="attachmentInput"
                                multiple
                                className="hidden"
                                onChange={(e) => e.target.files && handleAddAttachments(e.target.files)}
                            />
                            <Button onClick={() => document.getElementById('attachmentInput')?.click()}>Add Attachment</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {attachments.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {attachments.map((file: any) => (
                                    <Card key={file.id} className="flex flex-col items-center p-3">
                                        <a
                                            href={file.file_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-full flex-col items-center"
                                        >
                                            {file.mime_type.startsWith('image/') ? (
                                                <img src={file.file_path} alt={file.file_name} className="h-32 w-full rounded object-cover" />
                                            ) : (
                                                <File className="h-32 w-32 text-gray-500" />
                                            )}
                                            <p className="mt-2 w-full truncate text-center text-sm font-medium">{file.file_name}</p>
                                            <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                                        </a>
                                        <div className="mt-3 flex gap-2">
                                            <a
                                                href={file.file_path}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                            >
                                                <Download className="h-4 w-4" /> Download
                                            </a>
                                            <Button variant="destructive" size="sm" onClick={() => confirmRemoveAttachment(file)}>
                                                Remove
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No attachments found.</p>
                        )}
                    </CardContent>
                </Card>

                {/* AlertDialog for deletion */}
                <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Removal</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex gap-2">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleRemoveAttachment}>Remove</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Layout>
    );
};

export default ViewMember;
