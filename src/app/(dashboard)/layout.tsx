import type { Metadata } from 'next';
import {
  ChevronDown,
  Beaker,
} from 'lucide-react';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { NavLinks } from '@/components/layout/nav-links';
import { ProjectProvider } from '@/context/ProjectContext';

export const metadata: Metadata = {
  title: 'Research Hub Dashboard',
  description: 'Manage your research projects with ease.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <ProjectProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/projects" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <Beaker className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold font-headline">Research Hub</h2>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <NavLinks />
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            {/* Footer content if any */}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center justify-between lg:justify-end border-b bg-card px-4 lg:px-6 sticky top-0 z-30">
              <SidebarTrigger className="lg:hidden" />
              <div className="w-full flex-1 lg:hidden">
                  {/* Could add a search bar here if needed */}
              </div>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full flex items-center gap-2 p-0 lg:p-2 lg:w-auto">
                      <Avatar className="h-8 w-8">
                      {userAvatar && <AvatarImage src={userAvatar?.imageUrl} alt="User Avatar" data-ai-hint={userAvatar?.imageHint} />}
                      <AvatarFallback>FS</AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline">Dr. Faustus</span>
                      <ChevronDown className="hidden lg:inline h-4 w-4" />
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                      <Link href="/">Logout</Link>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </header>
          <main className="flex-1 p-4 sm:p-6 bg-background">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProjectProvider>
  );
}
