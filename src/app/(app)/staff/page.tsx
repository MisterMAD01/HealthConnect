'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users } from "@/lib/data";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, MoreHorizontal, X, UserPlus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function StaffPage() {
  const [staff, setStaff] = useState<User[]>(users.filter(u => u.role === 'Doctor'));
  const [isNewStaffDialogOpen, setIsNewStaffDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', email: '' });
  const { toast } = useToast();

  const handleStatusChange = (userId: string, newStatus: 'Verified' | 'Rejected') => {
    setStaff(currentStaff => 
        currentStaff.map(user => 
            user.uid === userId ? { ...user, verificationStatus: newStatus } : user
        )
    );
    toast({
        title: "อัปเดตสถานะแล้ว",
        description: `บัญชีแพทย์ได้รับการ ${newStatus === 'Verified' ? 'อนุมัติ' : 'ปฏิเสธ'} แล้ว`
    })
  };

  const getStatusBadge = (status: User['verificationStatus']) => {
    switch (status) {
      case 'Verified':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">ตรวจสอบแล้ว</Badge>;
      case 'Pending':
        return <Badge variant="secondary">รอดำเนินการ</Badge>;
      case 'Rejected':
        return <Badge variant="destructive">ถูกปฏิเสธ</Badge>;
      default:
        return <Badge variant="outline">N/A</Badge>;
    }
  };

  const handleAddStaff = () => {
     if (!newStaff.name || !newStaff.email) {
      toast({
        variant: 'destructive',
        title: 'ข้อมูลไม่ครบถ้วน',
        description: 'กรุณากรอกชื่อและอีเมล'
      });
      return;
    }
    const newUser: User = {
        uid: `doctor${staff.length + 10}`, // Fake UID
        name: newStaff.name,
        email: newStaff.email,
        role: 'Doctor',
        avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
        verificationStatus: 'Pending'
    };
    setStaff(prev => [...prev, newUser]);
    setIsNewStaffDialogOpen(false);
    setNewStaff({ name: '', email: '' });
    toast({
        title: "เพิ่มบุคลากรสำเร็จ",
        description: `บุคลากร ${newUser.name} ถูกเพิ่มเข้าสู่ระบบแล้ว และรอการยืนยันตัวตน`,
    });
  }

  return (
    <>
      <PageHeader
        title="การจัดการบุคลากร"
        description="อนุมัติ จัดการ และดูบัญชีแพทย์ทั้งหมดบนแพลตฟอร์ม"
      >
        <Dialog open={isNewStaffDialogOpen} onOpenChange={setIsNewStaffDialogOpen}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    เพิ่มบุคลากร
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>เพิ่มบุคลากรใหม่</DialogTitle>
                    <DialogDescription>ป้อนข้อมูลสำหรับแพทย์ใหม่ด้านล่าง</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">ชื่อ</Label>
                        <Input id="name" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">อีเมล</Label>
                        <Input id="email" type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleAddStaff}>เพิ่มบุคลากร</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>แพทย์</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>สถานะการยืนยันตัวตน</TableHead>
                <TableHead><span className="sr-only">การดำเนินการ</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((doctor) => (
                <TableRow key={doctor.uid}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                        <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{doctor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>
                    {getStatusBadge(doctor.verificationStatus)}
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
                        <DropdownMenuItem onClick={() => handleStatusChange(doctor.uid, 'Verified')}>
                          <Check className="mr-2 h-4 w-4" /> อนุมัติ
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(doctor.uid, 'Rejected')}>
                          <X className="mr-2 h-4 w-4" /> ปฏิเสธ
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
