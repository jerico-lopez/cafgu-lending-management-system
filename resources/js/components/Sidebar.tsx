import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Link, usePage, router } from '@inertiajs/react';
import { BarChart3, Building2, CreditCard, FileText, Home, LogOut, Menu, Shield, UserPlus, Users } from 'lucide-react';
import React from 'react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ComponentType<any>;
    isHeader?: boolean;
}

const navigation: NavItem[] = [
    { title: 'Analytics', href: '/analytics', icon: BarChart3 },
    { title: 'Dashboard', href: '/dashboard', icon: Home },
    { title: 'MANAGE', href: '', icon: Menu, isHeader: true },
    { title: 'Borrowers', href: '/borrowers', icon: UserPlus },
    { title: 'Members', href: '/members', icon: Users },
    { title: 'Loans', href: '/loans', icon: CreditCard },
    { title: 'Patrol Base', href: '/patrol-base', icon: Building2 },
    { title: 'Users', href: '/users', icon: Shield },
    { title: 'PRINTABLES', href: '', icon: FileText, isHeader: true },
    { title: 'Reports', href: '/reports', icon: FileText },
];

interface SidebarProps {
    className?: string;
}

const logout = () => {
    router.post('/logout');
};

const SidebarContent: React.FC<SidebarProps> = ({ className }) => {
    const { auth } = usePage<{ auth: { user: { name: string; roles: { name: string }[] } | null } }>().props;
    return (
        <div className={cn('h-full w-64 pb-12', className)}>
            <div className="flex h-full flex-col space-y-4 py-4">
                {/* Logo */}
                <div className="flex-shrink-0 px-6 py-2">
                    <h2 className="text-2xl font-bold text-sidebar-foreground">CZMPC</h2>
                    <p className="text-sm text-sidebar-foreground/80">Lending System</p>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;

                            if (item.isHeader) {
                                return (
                                    <div
                                        key={item.title}
                                        className="mt-6 px-3 py-2 text-xs font-semibold tracking-wider text-sidebar-foreground/70 uppercase first:mt-0"
                                    >
                                        {item.title}
                                    </div>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:text-sidebar-foreground',
                                        isActive
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50',
                                    )}
                                >
                                    <item.icon
                                        className={cn(
                                            'mr-3 h-4 w-4 transition-transform duration-200',
                                            'group-hover:scale-110',
                                            isActive && 'scale-110',
                                        )}
                                    />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* User Info & Logout */}
                <div className="mt-auto flex-shrink-0 px-3">
                    <div className="mb-3 rounded-lg bg-sidebar-accent/30 p-3 transition-all duration-200 hover:bg-sidebar-accent/40">
                        <p className="truncate text-sm font-medium text-sidebar-foreground">{auth.user?.name}</p>
                        <p className="text-xs text-sidebar-foreground/70">{auth.user?.roles[0]?.name}</p>
                    </div>

                    <Button
                        onClick={logout}
                        variant="ghost"
                        className="group w-full justify-start text-sidebar-foreground/80 transition-all duration-200 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    >
                        <LogOut className="mr-3 h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Desktop Sidebar
export const Sidebar: React.FC = () => {
    return (
        <div className="z-50 hidden border-r border-sidebar-border bg-sidebar shadow-[var(--shadow-lg)] md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
            <SidebarContent />
        </div>
    );
};

// Mobile Sidebar
export const MobileSidebar: React.FC = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 transition-colors hover:bg-muted/50 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
                <SidebarContent />
            </SheetContent>
        </Sheet>
    );
};
