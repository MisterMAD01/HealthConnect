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
import { Check, MoreHorizontal, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function StaffPage() {
  const [staff, setStaff] = useState<User[]>(users.filter(u => u.role === 'Doctor'));
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

  return (
    <>
      <PageHeader
        title="การจัดการบุคลากร"
        description="อนุมัติ จัดการ และดูบัญชีแพทย์ทั้งหมดบนแพลตฟอร์ม"
      />
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
