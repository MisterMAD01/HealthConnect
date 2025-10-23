'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { users } from "@/lib/data";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, Search, Trash2, X, UserPlus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


export default function AdminPatientsPage() {
  const allSystemPatients = users.filter(u => u.role === 'Patient');
  const [patientList, setPatientList] = useState<User[]>(allSystemPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStatusChange = (userId: string, newStatus: 'Verified' | 'Rejected') => {
    setPatientList(currentList => 
        currentList.map(user => 
            user.uid === userId ? { ...user, verificationStatus: newStatus } : user
        )
    );
    toast({
        title: "อัปเดตสถานะแล้ว",
        description: `บัญชีผู้ป่วยได้รับการ ${newStatus === 'Verified' ? 'เปิดใช้งาน' : 'ระงับ'} แล้ว`
    })
  };

  const getStatusBadge = (status: User['verificationStatus']) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">ใช้งานอยู่</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">ถูกระงับ</Badge>;
      default:
        return <Badge variant="secondary">N/A</Badge>;
    }
  };
  
  const filteredPatients = patientList.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    if (!selectedPatientId) {
      toast({
        variant: 'destructive',
        title: 'ไม่ได้เลือกผู้ป่วย',
        description: 'กรุณาเลือกผู้ป่วยจากรายการ'
      });
      return;
    }

    if (patientList.some(p => p.uid === selectedPatientId)) {
       toast({
        variant: 'destructive',
        title: 'ผู้ป่วยอยู่ในรายการแล้ว',
        description: 'ผู้ป่วยที่คุณเลือกอยู่ในรายการจัดการแล้ว'
      });
      return;
    }

    const patientToAdd = allSystemPatients.find(p => p.uid === selectedPatientId);
    if (patientToAdd) {
        setPatientList(prev => [...prev, patientToAdd]);
        toast({
            title: "เพิ่มผู้ป่วยสำเร็จ",
            description: `ผู้ป่วย ${patientToAdd.name} ถูกเพิ่มเข้าสู่รายการจัดการแล้ว`,
        });
    }
    
    setIsNewPatientDialogOpen(false);
    setSelectedPatientId(null);
  };

  const deletePatient = (userId: string) => {
    setPatientList(currentList => currentList.filter(user => user.uid !== userId));
    toast({
      title: 'ลบบัญชีสำเร็จ',
      description: 'บัญชีผู้ป่วยได้ถูกลบออกจากระบบแล้ว',
    });
  };


  return (
    <>
      <PageHeader
        title="จัดการบัญชีผู้ป่วย"
        description="ดู ค้นหา และจัดการบัญชีผู้ป่วยทั้งหมดบนแพลตฟอร์ม"
      >
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="ค้นหาผู้ป่วยด้วยชื่อ..."
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
                        <DialogTitle>เพิ่มผู้ป่วยเข้าสู่รายการจัดการ</DialogTitle>
                        <DialogDescription>เลือกผู้ป่วยจากในระบบเพื่อเพิ่มเข้ามาในรายการ</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="patient" className="text-right">ชื่อผู้ป่วย</Label>
                            <Select onValueChange={setSelectedPatientId}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="เลือกผู้ป่วย" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allSystemPatients.map(p => (
                                        <SelectItem key={p.uid} value={p.uid}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" onClick={handleAddPatient}>เพิ่มเข้าในรายการ</Button>
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
                <TableHead>ผู้ป่วย</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>สถานะบัญชี</TableHead>
                <TableHead className="text-right">การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
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
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>
                    {getStatusBadge(patient.verificationStatus)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">การดำเนินการ</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleStatusChange(patient.uid, 'Verified')}>
                          <Check className="mr-2 h-4 w-4" /> เปิดใช้งาน
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(patient.uid, 'Rejected')}>
                          <X className="mr-2 h-4 w-4" /> ระงับบัญชี
                        </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive" onClick={() => deletePatient(patient.uid)}>
                          <Trash2 className="mr-2 h-4 w-4" /> ลบบัญชี
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {filteredPatients.length === 0 && (
            <div className="text-center p-8 text-muted-foreground">
              ไม่พบผู้ป่วยที่ตรงกับคำค้นหา
            </div>
           )}
        </CardContent>
      </Card>
    </>
  );
}
