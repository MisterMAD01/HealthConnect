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
            <CardTitle className="text-sm font-medium">จำนวนแพทย์ทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors.length}</div>
            <p className="text-xs text-muted-foreground">บนแพลตฟอร์ม</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">จำนวนผู้ป่วยทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-muted-foreground">ที่ลงทะเบียน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การยืนยันตัวตนที่รอดำเนินการ</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVerification}</div>
            <p className="text-xs text-muted-foreground">แพทย์ที่รอการอนุมัติ</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>การยืนยันตัวตนแพทย์</CardTitle>
                <CardDescription>อนุมัติหรือปฏิเสธบัญชีแพทย์ใหม่</CardDescription>
            </div>
            <Button asChild size="sm">
                <Link href="/staff">จัดการบุคลากร</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {doctors.filter(d => d.verificationStatus === 'Pending').slice(0, 3).map(doctor => (
                <li key={doctor.uid} className="flex items-center justify-between">
                  <p className="font-medium">{doctor.name}</p>
                  <Badge variant="secondary">รอดำเนินการ</Badge>
                </li>
              ))}
               {doctors.filter(d => d.verificationStatus === 'Pending').length === 0 && (
                <p className="text-sm text-muted-foreground">ไม่มีการยืนยันตัวตนที่รอดำเนินการ</p>
              )}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>กิจกรรมล่าสุด</CardTitle>
            <CardDescription>ภาพรวมของการนัดหมายล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentAppointments.map(appt => (
                <li key={appt.id} className="flex items-center justify-between text-sm">
                  <p><span className="font-medium">{appt.patientName}</span> กับ <span className="font-medium">{appt.doctorName}</span></p>
                  <span className="text-muted-foreground">{new Date(appt.date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
