import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download, FileText, Filter, Printer } from 'lucide-react';
import React, { useState } from 'react';

// Sample data for demonstration - matches the document format
const sampleReportData = [
    {
        particulars: 'CASH/DEMAND BANK DEPOSIT',
        june: '25,000.00',
        july: '30,000.00',
        august: '35,000.00',
        total: '90,000.00',
    },
    {
        particulars: 'CASH SAVINGS DEPOSIT',
        june: '15,000.00',
        july: '20,000.00',
        august: '25,000.00',
        total: '60,000.00',
    },
    {
        particulars: 'CASH SHARE CAPITAL FUND',
        june: '10,000.00',
        july: '15,000.00',
        august: '20,000.00',
        total: '45,000.00',
    },
    {
        particulars: 'CASH EDUCATION DEVELOPMENT',
        june: '5,000.00',
        july: '7,500.00',
        august: '10,000.00',
        total: '22,500.00',
    },
];

const Reports: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('monthly');
    const [selectedYear, setSelectedYear] = useState('2024');
    const [selectedReport, setSelectedReport] = useState('summary');
    const { toast } = useToast();

    const handlePrint = () => {
        window.print();
        toast({
            title: 'Print Report',
            description: 'Report is being prepared for printing',
        });
    };

    const handleExport = (format: string) => {
        toast({
            title: 'Export Report',
            description: `Report exported as ${format.toUpperCase()}`,
        });
    };

    return (
        <Layout>
            <div className="min-h-screen bg-background">
                {/* Print Header - Only visible when printing */}
                <div className="hidden print:block">
                    <div className="mb-6 border-b-2 border-primary pb-4 text-center">
                        <img
                            src="/lovable-uploads/c220bffd-33c5-49db-b365-5c1a2681bdc8.png"
                            alt="Bayang Tungawan Logo"
                            className="mx-auto mb-2 h-16 w-16"
                        />
                        <h1 className="text-xl font-bold">ZAMBOANGA SIBUGAY AREA</h1>
                        <h2 className="text-lg font-semibold">BAYANG TUNGAWAN POLICE STATION</h2>
                        <p className="text-sm text-muted-foreground">Financial Report - {selectedYear}</p>
                    </div>
                </div>

                <div className="page-container print:max-w-none print:p-4">
                    {/* Screen Header */}
                    <div className="page-header print:hidden">
                        <h1 className="page-title">Reports & Analytics</h1>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" />
                                Print
                            </Button>
                            <Button variant="outline" onClick={() => handleExport('pdf')}>
                                <Download className="mr-2 h-4 w-4" />
                                Export PDF
                            </Button>
                            <Button variant="outline" onClick={() => handleExport('excel')}>
                                <FileText className="mr-2 h-4 w-4" />
                                Export Excel
                            </Button>
                        </div>
                    </div>

                    {/* Report Filters - Hidden when printing */}
                    <Card className="card-dashboard mb-6 print:hidden">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Report Filters
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Report Type</label>
                                    <Select value={selectedReport} onValueChange={setSelectedReport}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="summary">Financial Summary</SelectItem>
                                            <SelectItem value="collections">Collection Report</SelectItem>
                                            <SelectItem value="members">Member Report</SelectItem>
                                            <SelectItem value="patrol">Patrol Base Report</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Period</label>
                                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="quarterly">Quarterly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Year</label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                            <SelectItem value="2022">2022</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button className="btn-primary w-full">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Generate Report
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Official Report Document */}
                    <div className="rounded-lg border bg-white p-6 shadow-sm print:rounded-none print:border-0 print:bg-white print:p-0 print:shadow-none">
                        {/* Report Title */}
                        <div className="mb-6 text-center print:mb-4">
                            <h2 className="mb-2 text-2xl font-bold text-foreground print:text-xl">CASH TOTAL POSITION AS OF JUNE 2024</h2>
                            <p className="text-sm text-muted-foreground">TIN No. 247498900 | Cash Count Deduction as of June 2025</p>
                        </div>

                        {/* Main Financial Table */}
                        <div className="overflow-x-auto">
                            <Table className="border-collapse border border-border">
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="border border-border py-3 text-center font-bold">PARTICULARS</TableHead>
                                        <TableHead className="border border-border text-center font-bold">JUNE</TableHead>
                                        <TableHead className="border border-border text-center font-bold">JULY</TableHead>
                                        <TableHead className="border border-border text-center font-bold">AUGUST</TableHead>
                                        <TableHead className="border border-border text-center font-bold">TOTAL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sampleReportData.map((row, index) => (
                                        <TableRow key={index} className="hover:bg-muted/25">
                                            <TableCell className="border border-border px-3 py-2 font-medium">{row.particulars}</TableCell>
                                            <TableCell className="border border-border px-3 py-2 text-right font-mono">₱{row.june}</TableCell>
                                            <TableCell className="border border-border px-3 py-2 text-right font-mono">₱{row.july}</TableCell>
                                            <TableCell className="border border-border px-3 py-2 text-right font-mono">₱{row.august}</TableCell>
                                            <TableCell className="border border-border px-3 py-2 text-right font-mono font-bold">
                                                ₱{row.total}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell className="border border-border px-3 py-3">TOTAL</TableCell>
                                        <TableCell className="border border-border px-3 py-3 text-right font-mono">₱115,000.00</TableCell>
                                        <TableCell className="border border-border px-3 py-3 text-right font-mono">₱142,500.00</TableCell>
                                        <TableCell className="border border-border px-3 py-3 text-right font-mono">₱180,000.00</TableCell>
                                        <TableCell className="border border-border px-3 py-3 text-right font-mono text-lg">₱437,500.00</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>

                        {/* Signature Section */}
                        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 print:mt-6 print:gap-4">
                            <div className="text-center">
                                <div className="mx-auto mb-2 h-12 w-48 border-b border-border"></div>
                                <p className="text-sm font-medium">Prepared by:</p>
                                <p className="text-xs text-muted-foreground">Finance Officer</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-2 h-12 w-48 border-b border-border"></div>
                                <p className="text-sm font-medium">Reviewed by:</p>
                                <p className="text-xs text-muted-foreground">Station Commander</p>
                            </div>
                            <div className="text-center">
                                <div className="mx-auto mb-2 h-12 w-48 border-b border-border"></div>
                                <p className="text-sm font-medium">Approved by:</p>
                                <p className="text-xs text-muted-foreground">Area Director</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground print:mt-4">
                            <p>Document generated on {new Date().toLocaleDateString()}</p>
                            <p>Bayang Tungawan Police Station Financial Report System</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Reports;
