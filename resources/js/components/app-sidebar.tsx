import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
} from '@/components/ui/sidebar';
import { useMockRole } from '@/hooks/use-mock-data';
import { type NavItem } from '@/types';
import { Briefcase, FileText, LayoutGrid, Users } from 'lucide-react';

// Admin navigation
const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
    { title: 'User Management', href: '/admin/users', icon: Users },
    { title: 'Offers', href: '/admin/offers', icon: Briefcase },
    { title: 'Applications', href: '/admin/applications', icon: FileText },
];

// Candidate navigation
const candidateNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
    { title: 'Offers', href: '/offers', icon: Briefcase },
    { title: 'My Applications', href: '/my-applications', icon: FileText },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const { isAdmin } = useMockRole();
    const navItems = isAdmin ? adminNavItems : candidateNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarContent>
                <NavMain items={navItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
