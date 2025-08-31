import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CreditCard, DollarSign, TrendingUp, Users } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Empty data - ready for database integration
const patrolBaseData: any[] = [];
const monthlyCollectionData: any[] = [];

const kpiData = [
    {
        title: 'Borrowed Amounts',
        value: '₱0.00',
        change: 'No data',
        icon: DollarSign,
        trend: 'up',
    },
    {
        title: 'Total Members',
        value: '0',
        change: 'No data',
        icon: Users,
        trend: 'up',
    },
    {
        title: 'Members with Loans',
        value: '0',
        change: 'No data',
        icon: CreditCard,
        trend: 'up',
    },
    {
        title: 'Past Due Loans',
        value: '0',
        change: 'No data',
        icon: AlertCircle,
        trend: 'down',
    },
    {
        title: 'Collectible this Month',
        value: '₱0.00',
        change: 'No data',
        icon: TrendingUp,
        trend: 'up',
    },
];

const Dashboard: React.FC = () => {
    return (
        <Layout>
            <div className="page-container">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">Welcome back! Here's your lending system overview.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid-stats mb-6 sm:mb-8">
                    {kpiData.map((kpi, index) => (
                        <Card key={index} className="card-stat">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-medium text-muted-foreground sm:text-sm">{kpi.title}</p>
                                        <p className="mt-1 text-xl font-bold text-foreground sm:text-2xl">{kpi.value}</p>
                                        <p
                                            className={`mt-2 flex items-center gap-1 text-xs ${
                                                kpi.trend === 'up' ? 'text-success' : 'text-destructive'
                                            }`}
                                        >
                                            <TrendingUp className={`h-3 w-3 ${kpi.trend === 'down' ? 'rotate-180' : ''}`} />
                                            <span className="truncate">{kpi.change}</span>
                                        </p>
                                    </div>
                                    <div className="ml-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                                        <kpi.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid-charts mb-6">
                    {/* Per Patrol Base Loans Chart */}
                    <Card className="card-dashboard">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <BarChart className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                <span className="truncate">Per Patrol Base Loans</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={patrolBaseData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                        }}
                                    />
                                    <Bar dataKey="loans" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                        {patrolBaseData.length === 0 && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                                <p className="text-center text-sm text-muted-foreground">No data available</p>
                            </div>
                        )}
                    </Card>

                    {/* Monthly Collection Chart */}
                    <Card className="card-dashboard">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                <TrendingUp className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                                <span className="truncate">Per Month Collection</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyCollectionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tick={{ fontSize: 11 }} />
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
                                        formatter={(value) => [`₱${value.toLocaleString()}`, 'Amount']}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="amount"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={3}
                                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                        {monthlyCollectionData.length === 0 && (
                            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                                <p className="text-center text-sm text-muted-foreground">No data available</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Recent Activity */}
                <Card className="card-dashboard">
                    <CardHeader>
                        <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="py-6 text-center sm:py-8">
                            <p className="text-muted-foreground">No recent activity</p>
                            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">Activity will appear here once you start using the system</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Dashboard;
