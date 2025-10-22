'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { users, ehrs } from "@/lib/data";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Search } from 'lucide-react';

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // ในแอปจริง นี่จะเป็นรายชื่อผู้ป่วยที่กรองแล้วของแพทย์คนใดคนหนึ่ง
  const allPatients = users.filter(u => u.role === 'Patient');

  const filteredPatients = allPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getPatientLastUpdate = (patientId: string) => {
    const ehr = ehrs.find(e => e.patientId === patientId);
    return ehr ? new Date(ehr.lastUpdated).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  }

  return (
    <>
      <PageHeader
        title="ผู้ป่วยของฉัน"
        description="ดูและจัดการบันทึกผู้ป่วยของคุณ"
      >
        <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="ค้นหาผู้ป่วย..."
                className="pl-8 sm:w-[300px]"
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
                      <Link href={`/patients/${patient.uid}`}>ดูบันทึก</Link>
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
