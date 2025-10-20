"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CircleDot,
  Settings,
  FileText,
  LogOut,
} from 'lucide-react';
import { CueMasterLogo } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/tables', label: 'Tables', icon: CircleDot },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("cue-master-auth");
    router.push('/');
  };

  return (
    <Sidebar
      collapsible="icon"
      className="hidden sm:flex flex-col"
      variant="sidebar"
    >
      <SidebarHeader className="h-16 flex items-center justify-center p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CueMasterLogo className="w-8 h-8" />
          <span className="font-headline text-lg font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Cue Master
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarMenu className="flex-1 px-4">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === href}
              tooltip={{ children: label, side: 'right' }}
            >
              <Link href={href}>
                <Icon />
                <span>{label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip={{ children: "Logout", side: 'right' }}>
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
