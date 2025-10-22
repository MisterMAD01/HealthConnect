'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { users } from "@/lib/data";
import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarPlus } from "lucide-react";

export default function AppointmentsPage() {
  const doctors = users.filter(u => u.role === 'Doctor' && u.verificationStatus === 'Verified');
  const { toast } = useToast();

  const handleBookAppointment = (doctor: User) => {
    toast({
      title: "จองนัดหมายสำเร็จ!",
      description: `การนัดหมายของคุณกับ ${doctor.name} ได้รับการจัดตารางแล้ว`,
    });
  };

  return (
    <>
      <PageHeader
        title="ค้นหาแพทย์"
        description="เรียกดูแพทย์ที่มีอยู่และทำการนัดหมาย"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doctor => (
          <Card key={doctor.uid} className="flex flex-col">
            <CardHeader className="items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={doctor.avatarUrl} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>{doctor.email}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex justify-center">
                <Badge variant="outline">ตรวจสอบแล้ว</Badge>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                ดร. รีด เป็นแพทย์โรคหัวใจที่ได้รับการรับรองจากคณะกรรมการและมีประสบการณ์มากกว่า 10 ปี
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleBookAppointment(doctor)}>
                <CalendarPlus className="mr-2 h-4 w-4" />
                จองนัดหมาย
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
