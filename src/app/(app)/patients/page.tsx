'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { users, ehrs } from "@/lib/data";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Search, UserPlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [allPatients, setAllPatients] = useState<User[]>(users.filter(u => u.role === 'Patient'));
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', email: '' });
  const { toast } = useToast();

  const filteredPatients = allPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getPatientLastUpdate = (patientId: string) => {
    const ehr = ehrs.find(e => e.patientId === patientId);
    return ehr ? new Date(ehr.lastUpdated).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  }

  const handleAddPatient = () => {
    const newUser: User = {
        uid: `patient${allPatients.length + 2}`, // Fake UID
        name: newPatient.name,
        email: newPatient.email,
        role: 'Patient',
        avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
    };
    setAllPatients(prev => [...prev, newUser]);
    setIsNewPatientDialogOpen(false);
    setNewPatient({ name: '', email: '' });
    toast({
        title: "เพิ่มผู้ป่วยสำเร็จ",
        description: `ผู้ป่วย ${newUser.name} ถูกเพิ่มเข้าสู่ระบบแล้ว`,
    });
  }

  return (
    <>
      <PageHeader
        title="ผู้ป่วยของฉัน"
        description="ดูและจัดการบันทึกผู้ป่วยของคุณ"
      >
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="ค้นหาผู้ป่วย..."
                    className="pl-8 sm:w-[250px] md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        เพิ่มผู้ป่วย
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>เพิ่มผู้ป่วยใหม่</DialogTitle>
                        <DialogDescription>ป้อนข้อมูลสำหรับผู้ป่วยใหม่ด้านล่าง</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">ชื่อ</Label>
                            <Input id="name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">อีเมล</Label>
                            <Input id="email" type="email" value={newPatient.email} onChange={e => setNewPatient({...newPatient, email: e.target.value})} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleAddPatient}>เพิ่มผู้ป่วย</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead className="hidden md:table-cell">อีเมล</TableHead>
                <TableHead className="hidden sm:table-cell">อัปเดตล่าสุด</TableHead>
                <TableHead><span className="sr-only">การดำเนินการ</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient: User) => (
                <TableRow key={patient.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                        <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{patient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{patient.email}</TableCell>
                  <TableCell className="hidden sm:table-cell">{getPatientLastUpdate(patient.uid)}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/patients/${patient.uid}`}>ดู/แก้ไขบันทึก</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredPatients.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              ไม่พบผู้ป่วย
            </div>
           )}
        </CardContent>
      </Card>
    </>
  );
}
