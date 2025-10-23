'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarClock,
  FileText,
  Pill,
  Users,
  BarChart2,
  Stethoscope,
  LogOut,
  Hospital,
  User as UserIcon,
  CalendarPlus,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import type { User as UserType } from '@/lib/types';

const patientNav = [
  { href: '/dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { href: '/appointments', label: 'การนัดหมายของฉัน', icon: CalendarClock },
  { href: '/records', label: 'บันทึกของฉัน', icon: FileText },
  { href: '/medications', label: 'ยา', icon: Pill },
];

const doctorNav = [
  { href: '/dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { href: '/appointments', label: 'การนัดหมาย', icon: CalendarPlus },
  { href: '/patients', label: 'ผู้ป่วย', icon: Users },
];

const adminNav = [
  { href: '/dashboard', label: 'แดชบอร์ด', icon: LayoutDashboard },
  { href: '/staff', label: 'จัดการบุคลากร', icon: Stethoscope },
  { href: '/admin-patients', label: 'จัดการผู้ป่วย', icon: Users },
  { href: '/analytics', label: 'การวิเคราะห์', icon: BarChart2 },
];

const navItems = {
  Patient: patientNav,
  Doctor: doctorNav,
  'Hospital Admin': adminNav,
};

const roleTranslations: { [key: string]: string } = {
    Patient: 'ผู้ป่วย',
    Doctor: 'แพทย์',
    'Hospital Admin': 'ผู้ดูแลระบบโรงพยาบาล'
};

export function MainSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Patient': return <UserIcon className="h-4 w-4" />;
      case 'Doctor': return <Stethoscope className="h-4 w-4" />;
      case 'Hospital Admin': return <Hospital className="h-4 w-4" />;
      default: return null;
    }
  }

  if (!user) return null;

  const currentNav = navItems[user.role as keyof typeof navItems];
  const translatedRole = roleTranslations[user.role];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
            {logo && <Image src={logo.imageUrl} alt="HealthConnect Logo" width={40} height={40} data-ai-hint={logo.imageHint} className="rounded-md" />}
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold font-headline">HealthConnect</h2>
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {currentNav.map((item) => (
            <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold truncate">{user.name}</span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {getRoleIcon(user.role)}
                <span>{translatedRole}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          ออกจากระบบ
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
