'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Users, UserCheck, UserX, Clock } from 'lucide-react';
import { users, appointments } from '@/lib/data';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export function AdminDashboard() {
  const doctors = users.filter(u => u.role === 'Doctor');
  const patients = users.filter(u => u.role === 'Patient');

  const pendingVerification = doctors.filter(d => d.verificationStatus === 'Pending').length;
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors.length}</div>
            <p className="text-xs text-muted-foreground">on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">registered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVerification}</div>
            <p className="text-xs text-muted-foreground">doctors awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Doctor Verification</CardTitle>
                <CardDescription>Approve or reject new doctor accounts.</CardDescription>
            </div>
            <Button asChild size="sm">
                <Link href="/staff">Manage Staff</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {doctors.filter(d => d.verificationStatus === 'Pending').slice(0, 3).map(doctor => (
                <li key={doctor.uid} className="flex items-center justify-between">
                  <p className="font-medium">{doctor.name}</p>
                  <Badge variant="secondary">Pending</Badge>
                </li>
              ))}
               {doctors.filter(d => d.verificationStatus === 'Pending').length === 0 && (
                <p className="text-sm text-muted-foreground">No pending verifications.</p>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Overview of recent appointments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentAppointments.map(appt => (
                <li key={appt.id} className="flex items-center justify-between text-sm">
                  <p><span className="font-medium">{appt.patientName}</span> with <span className="font-medium">{appt.doctorName}</span></p>
                  <span className="text-muted-foreground">{new Date(appt.date).toLocaleDateString()}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
