'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, UserCheck, Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { appointments } from '@/lib/data';
import { Appointment } from '@/lib/types';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { users } from '@/lib/data';

export function DoctorDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(
    a => a.doctorId === user.uid && a.date === today && a.status === 'Scheduled'
  ).sort((a,b) => a.time.localeCompare(b.time));

  const completedAppointments = appointments.filter(
    a => a.doctorId === user.uid && a.date === today && a.status === 'Completed'
  ).length;

  const getPatientAvatar = (patientId: string) => {
    return users.find(u => u.uid === patientId)?.avatarUrl || '';
  }

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysAppointments.length}</div>
            <p className="text-xs text-muted-foreground">scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Seen Today</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">appointments completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {todaysAppointments.length > 0 ? (
                <>
                 <div className="text-2xl font-bold">{todaysAppointments[0].time}</div>
                 <p className="text-xs text-muted-foreground">with {todaysAppointments[0].patientName}</p>
                </>
             ) : (
                <p className="text-sm text-muted-foreground">No more appointments today.</p>
             )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>A list of your appointments for today.</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {todaysAppointments.length > 0 ? todaysAppointments.map((appt: Appointment) => (
              <li key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={getPatientAvatar(appt.patientId)} />
                    <AvatarFallback>{appt.patientName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{appt.patientName}</p>
                    <p className="text-sm text-muted-foreground"><Clock className="inline-block h-3 w-3 mr-1.5" />{appt.time}</p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/patients/${appt.patientId}`}>View Record</Link>
                </Button>
              </li>
            )) : <p className="text-sm text-muted-foreground text-center py-4">Your schedule is clear for the rest of the day.</p>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
