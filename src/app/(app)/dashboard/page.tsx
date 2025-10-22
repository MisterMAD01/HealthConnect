'use client';

import { useAuth } from '@/hooks/use-auth';
import { PatientDashboard } from '@/components/patient/patient-dashboard';
import { DoctorDashboard } from '@/components/doctor/doctor-dashboard';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { PageHeader } from '@/components/page-header';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading || !user) {
    return (
        <div>
            <PageHeader title="Dashboard" description="Loading your personalized dashboard..." />
            <div className="grid gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-64" />
            </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'Patient':
        return <PatientDashboard />;
      case 'Doctor':
        return <DoctorDashboard />;
      case 'Hospital Admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid user role.</div>;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  return (
    <div>
      <PageHeader
        title={`${getGreeting()}, ${user.name.split(' ')[0]}!`}
        description={
            user.role === 'Patient' ? "Here's a summary of your health and appointments." : 
            user.role === 'Doctor' ? "Here's what your day looks like." :
            "Here's an overview of the platform's activity."
        }
      />
      {renderDashboard()}
    </div>
  );
}
