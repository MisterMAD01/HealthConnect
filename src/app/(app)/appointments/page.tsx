'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { appointments as initialAppointments, users } from "@/lib/data";
import { Appointment, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

export default function AppointmentsPage() {
    const { user } = useAuth();
    const { toast } = useToast();

    if (!user) return null;

    if (user.role === 'Patient') {
        const patientAppointments = initialAppointments.filter(a => a.patientId === user.uid);

        const getStatusBadge = (status: Appointment['status']) => {
            switch (status) {
                case 'Scheduled':
                    return <Badge variant="secondary">กำหนดเวลาแล้ว</Badge>;
                case 'Completed':
                    return <Badge variant="default" className="bg-green-500">เสร็จสิ้น</Badge>;
                case 'Cancelled':
                    return <Badge variant="destructive">ยกยกเลิก</Badge>;
                default:
                    return <Badge variant="outline">{status}</Badge>;
            }
        };

        return (
            <>
                <PageHeader
                    title="การนัดหมายของฉัน"
                    description="ภาพรวมการนัดหมายทั้งหมดของคุณกับแพทย์"
                />
                <Card>
                    <CardHeader>
                        <CardTitle>ประวัติการนัดหมาย</CardTitle>
                        <CardDescription>นี่คือรายการนัดหมายที่กำลังจะมาถึงและที่ผ่านมาทั้งหมดของคุณ</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {patientAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {patientAppointments.map(appt => (
                                    <li key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background gap-4">
                                        <div className="flex items-start gap-4">
                                            <CalendarClock className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-bold text-lg">กับ {appt.doctorName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(appt.date), 'd MMMM yyyy', { locale: th })} - เวลา {appt.time}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(appt.status)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">คุณยังไม่มีการนัดหมาย</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </>
        );
    }

    if (user.role === 'Doctor') {
        const [appointments, setAppointments] = useState(initialAppointments.filter(a => a.doctorId === user.uid));
        const [isDialogOpen, setIsDialogOpen] = useState(false);
        const [newAppointment, setNewAppointment] = useState({ patientId: '', date: new Date(), time: '' });
        const [date, setDate] = useState<Date | undefined>(new Date());
        const patients = users.filter(u => u.role === 'Patient');

        const handleAddAppointment = () => {
             if (!newAppointment.patientId || !date || !newAppointment.time) {
                toast({ variant: 'destructive', title: 'ข้อมูลไม่ครบถ้วน', description: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
                return;
            }
            const patient = users.find(p => p.uid === newAppointment.patientId);
            if (!patient) return;

            const finalAppointment: Appointment = {
                id: `appt${appointments.length + 5}`,
                patientId: newAppointment.patientId,
                patientName: patient.name,
                doctorId: user.uid,
                doctorName: user.name,
                date: format(date, 'yyyy-MM-dd'),
                time: newAppointment.time,
                status: 'Scheduled',
            };
            setAppointments(prev => [finalAppointment, ...prev]);
            setIsDialogOpen(false);
            setNewAppointment({ patientId: '', date: new Date(), time: '' });
            setDate(new Date());
            toast({ title: 'สร้างนัดหมายสำเร็จ', description: `ได้สร้างนัดหมายสำหรับ ${patient.name} แล้ว` });
        };

        const getStatusBadge = (status: Appointment['status']) => {
            switch (status) {
                case 'Scheduled': return <Badge variant="secondary">กำหนดเวลาแล้ว</Badge>;
                case 'Completed': return <Badge variant="default" className="bg-green-500">เสร็จสิ้น</Badge>;
                case 'Cancelled': return <Badge variant="destructive">ยกเลิก</Badge>;
            }
        };

        return (
            <>
                <PageHeader title="การนัดหมาย" description="จัดการการนัดหมายทั้งหมดสำหรับผู้ป่วยของคุณ">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button><PlusCircle className="mr-2 h-4 w-4" /> เพิ่มนัดหมาย</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>เพิ่มนัดหมายใหม่</DialogTitle>
                                <DialogDescription>กรอกข้อมูลด้านล่างเพื่อสร้างนัดหมายใหม่</DialogDescription>
                            </DialogHeader>
                             <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="patient" className="text-right">ผู้ป่วย</Label>
                                    <Select onValueChange={(value) => setNewAppointment({...newAppointment, patientId: value})}>
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="เลือกผู้ป่วย" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {patients.map(p => <SelectItem key={p.uid} value={p.uid}>{p.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="date" className="text-right">วันที่</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                            "col-span-3 justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarClock className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP", {locale: th}) : <span>เลือกวันที่</span>}
                                        </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="time" className="text-right">เวลา</Label>
                                    <Input id="time" type="time" value={newAppointment.time} onChange={e => setNewAppointment({...newAppointment, time: e.target.value})} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleAddAppointment}>สร้างนัดหมาย</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </PageHeader>
                 <Card>
                    <CardHeader>
                        <CardTitle>รายการนัดหมายทั้งหมด</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {appointments.length > 0 ? (
                            <ul className="space-y-4">
                                {appointments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(appt => (
                                    <li key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background gap-4">
                                        <div className="flex items-start gap-4">
                                            <CalendarClock className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                                            <div>
                                                <p className="font-bold text-lg">กับ {appt.patientName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(new Date(appt.date), 'd MMMM yyyy', { locale: th })} - เวลา {appt.time}
                                                </p>
                                            </div>
                                        </div>
                                        {getStatusBadge(appt.status)}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">ยังไม่มีการนัดหมาย</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </>
        );
    }
    
    return null;
}
