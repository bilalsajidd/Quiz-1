import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { MainNav } from '@/components/app/main-nav';
import { Header } from '@/components/app/header';
import { AuthProvider } from '@/components/app/auth-provider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <MainNav />
        <div className="flex flex-col flex-1 md:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-300 ease-in-out group-data-[sidebar-collapsed=true]/sidebar-wrapper:ml-0 group-data-[sidebar-collapsed=true]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]">
          <Header />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
