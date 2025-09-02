import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CreditCard, DollarSign, TrendingUp } from 'lucide-react';
import React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Empty data - ready for database integration
const performanceData: any[] = [];
const riskAnalysisData: any[] = [];
const collectionTrendsData: any[] = [];

const Analytics: React.FC = () => {
    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <h1 className="page-title">Analytics Dashboard</h1>
                    <p className="text-muted-foreground">Advanced insights and performance metrics for your lending operations</p>
                </div>

                {/* Key Metrics */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="card-stat">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                                    <p className="text-3xl font-bold text-muted-foreground">0%</p>
                                    <p className="mt-1 text-xs text-muted-foreground">No data available</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/20">
                                    <TrendingUp className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-stat">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Collection Rate</p>
                                    <p className="text-3xl font-bold text-muted-foreground">0%</p>
                                    <p className="mt-1 text-xs text-muted-foreground">No data available</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/20">
                                    <DollarSign className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-stat">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                                    <p className="text-3xl font-bold text-muted-foreground">-</p>
                                    <p className="mt-1 text-xs text-muted-foreground">No data available</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/20">
                                    <AlertTriangle className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-stat">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Efficiency</p>
                                    <p className="text-3xl font-bold text-muted-foreground">0%</p>
                                    <p className="mt-1 text-xs text-muted-foreground">No data available</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/20">
                                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Performance Trends */}
                <div className="grid-charts mb-6 sm:mb-8">
                    <Card className="card-dashboard">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg">Performance Trends</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorLoans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="loans"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorLoans)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                        {performanceData.length === 0 && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                                <p className="text-center text-sm text-muted-foreground">No data available</p>
                            </div>
                        )}
                    </Card>

                    <Card className="card-dashboard">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg">Collection vs Target</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={collectionTrendsData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                        formatter={(value) => [`₱${value.toLocaleString()}`, '']}
                                    />
                                    <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="actual" fill="hsl(var(--success))" name="Actual" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                        {collectionTrendsData.length === 0 && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                                <p className="text-center text-sm text-muted-foreground">No data available</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Risk Analysis & Member Growth */}
                <div className="grid-charts mb-6">
                    <Card className="card-dashboard">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg">Risk Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            {riskAnalysisData.length === 0 ? (
                                <div className="py-6 text-center sm:py-8">
                                    <p className="text-sm text-muted-foreground">No data available</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {riskAnalysisData.map((risk, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3 sm:p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className={`h-4 w-4 rounded-full ${
                                                        risk.category === 'Low Risk'
                                                            ? 'bg-success'
                                                            : risk.category === 'Medium Risk'
                                                              ? 'bg-warning'
                                                              : 'bg-destructive'
                                                    }`}
                                                />
                                                <span className="text-sm font-medium sm:text-base">{risk.category}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold sm:text-base">{risk.count}</p>
                                                <p className="text-xs text-muted-foreground sm:text-sm">{risk.percentage}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="card-dashboard">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-base sm:text-lg">Member Growth</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={performanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="members"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                        {performanceData.length === 0 && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                                <p className="text-center text-sm text-muted-foreground">No data available</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Key Insights */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="py-6 text-center sm:py-8">
                            <p className="text-muted-foreground">No insights available</p>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                Insights will appear here once you have data in the system
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Analytics;
