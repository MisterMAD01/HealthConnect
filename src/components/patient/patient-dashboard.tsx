'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Pill, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { appointments, ehrs } from '@/lib/data';
import { Appointment, Medication } from '@/lib/types';
import { format } from 'date-fns';

export function PatientDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const upcomingAppointments = appointments
    .filter(a => a.patientId === user.uid && a.status === 'Scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const patientEhr = ehrs.find(e => e.patientId === user.uid);
  const medications = patientEhr?.medications.filter(m => m.reminders) || [];

  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{format(new Date(upcomingAppointments[0].date), 'MMMM d, yyyy')}</div>
                <p className="text-xs text-muted-foreground">
                  at {upcomingAppointments[0].time} with {upcomingAppointments[0].doctorName}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">medications with reminders</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Doctor</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {upcomingAppointments.length > 0 ? (
                 <div className="text-2xl font-bold">{upcomingAppointments[0].doctorName}</div>
             ) : (
                <p className="text-sm text-muted-foreground">Not set</p>
             )}
            <p className="text-xs text-muted-foreground">Contact for any concerns</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingAppointments.length > 0 ? upcomingAppointments.slice(0, 3).map((appt: Appointment) => (
                <li key={appt.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{format(new Date(appt.date), 'EEE, MMM d')} at {appt.time}</p>
                    <p className="text-sm text-muted-foreground">with {appt.doctorName}</p>
                  </div>
                </li>
              )) : <p className="text-sm text-muted-foreground">No appointments scheduled.</p>}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Medication Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {medications.length > 0 ? medications.slice(0, 3).map((med: Medication) => (
                    <li key={med.id} className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{med.name} ({med.dosage})</p>
                        <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    </div>
                    </li>
                )): <p className="text-sm text-muted-foreground">No medication reminders set up.</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
