'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Pill, User } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { appointments, ehrs } from '@/lib/data';
import { Appointment, Medication } from '@/lib/types';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';

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
            <CardTitle className="text-sm font-medium">นัดหมายที่กำลังจะมาถึง</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <>
                <div className="text-2xl font-bold">{format(new Date(upcomingAppointments[0].date), 'd MMMM yyyy', { locale: th })}</div>
                <p className="text-xs text-muted-foreground">
                  เวลา {upcomingAppointments[0].time} กับ {upcomingAppointments[0].doctorName}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">ไม่มีนัดหมายที่กำลังจะมาถึง</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยาที่ใช้อยู่</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{medications.length}</div>
            <p className="text-xs text-muted-foreground">ยาที่มีการแจ้งเตือน</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">แพทย์ประจำตัว</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {upcomingAppointments.length > 0 ? (
                 <div className="text-2xl font-bold">{upcomingAppointments[0].doctorName}</div>
             ) : (
                <p className="text-sm text-muted-foreground">ยังไม่ได้ตั้งค่า</p>
             )}
            <p className="text-xs text-muted-foreground">ติดต่อหากมีข้อกังวลใดๆ</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>นัดหมายที่กำลังจะมาถึง</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {upcomingAppointments.length > 0 ? upcomingAppointments.slice(0, 3).map((appt: Appointment) => (
                <li key={appt.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{format(new Date(appt.date), 'EEE, d MMM', { locale: th })} เวลา {appt.time}</p>
                    <p className="text-sm text-muted-foreground">กับ {appt.doctorName}</p>
                  </div>
                </li>
              )) : <p className="text-sm text-muted-foreground">ไม่มีนัดหมายที่กำหนดไว้</p>}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>การแจ้งเตือนการใช้ยา</CardTitle>
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
                )): <p className="text-sm text-muted-foreground">ไม่ได้ตั้งค่าการแจ้งเตือนการใช้ยา</p>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
