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
import { Check, MoreHorizontal, Search, Trash2, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

export default function AdminPatientsPage() {
  const [patientList, setPatientList] = useState<User[]>(users.filter(u => u.role === 'Patient'));
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleStatusChange = (userId: string, newStatus: 'Verified' | 'Rejected') => {
    setPatientList(currentList => 
        currentList.map(user => 
            user.uid === userId ? { ...user, verificationStatus: newStatus } : user
        )
    );
    toast({
        title: "อัปเดตสถานะแล้ว",
        description: `บัญชีผู้ป่วยได้รับการอัปเดตแล้ว`
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

  return (
    <>
      <PageHeader
        title="จัดการบัญชีผู้ป่วย"
        description="ดูและจัดการบัญชีผู้ป่วยทั้งหมดบนแพลตฟอร์ม"
      >
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
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ป่วย</TableHead>
                <TableHead>อีเมล</TableHead>
                <TableHead>สถานะบัญชี</TableHead>
                <TableHead><span className="sr-only">การดำเนินการ</span></TableHead>
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
                         <DropdownMenuItem className="text-destructive">
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
              ไม่พบผู้ป่วย
            </div>
           )}
        </CardContent>
      </Card>
    </>
  );
}
