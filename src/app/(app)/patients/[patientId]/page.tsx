'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users, ehrs } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HeartPulse, Thermometer, Droplets, Pill, AlertTriangle, FileUp, Save, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea";
import { EhrSummary } from "@/components/doctor/ehr-summary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PatientRecordPage({ params }: { params: { patientId: string } }) {
  const patient = users.find(u => u.uid === params.patientId);
  const ehrData = ehrs.find(e => e.patientId === params.patientId);
  
  const [isEditing, setIsEditing] = useState(false);
  const [ehr, setEhr] = useState(ehrData);
  const { toast } = useToast();

  if (!patient || !ehr) {
    return (
      <div>
        <PageHeader title="ไม่พบผู้ป่วย" />
        <p>ไม่พบบันทึกผู้ป่วยที่ร้องขอ</p>
        <Button asChild variant="link">
          <Link href="/patients">กลับไปที่รายชื่อผู้ป่วย</Link>
        </Button>
      </div>
    )
  }

  const handleSave = () => {
    // ในแอปจริง ส่วนนี้จะทำการบันทึกข้อมูล `ehr` ลงฐานข้อมูล
    console.log("บันทึกข้อมูล EHR:", ehr);
    setIsEditing(false);
    toast({
        title: "บันทึกข้อมูลสำเร็จ",
        description: `ข้อมูลสุขภาพของ ${patient.name} ได้รับการอัปเดตแล้ว`,
    });
  }

  return (
    <>
      <PageHeader
        title={patient.name}
        description={`กำลังดูบันทึกสุขภาพอิเล็กทรอนิกส์สำหรับ ${patient.name}`}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.avatarUrl} alt={patient.name} />
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{patient.email}</p>
            <p className="text-sm text-muted-foreground">รหัสผู้ป่วย: {patient.uid}</p>
          </div>
        </div>
      </PageHeader>

      <div className="space-y-8">
        <EhrSummary initialEhrText={ehr.fullRecord} />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>สัญญาณชีพ</CardTitle>
                <CardDescription>บันทึกล่าสุดเมื่อ {new Date(ehr.lastUpdated).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <HeartPulse className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">ความดันโลหิต</p>
                    {isEditing ? (
                        <Input value={ehr.bloodPressure} onChange={(e) => setEhr({...ehr, bloodPressure: e.target.value})} className="font-semibold p-1 h-8" />
                    ) : (
                        <p className="font-semibold">{ehr.bloodPressure}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <Droplets className="h-6 w-6 text-primary" />
                 <div>
                    <p className="text-sm text-muted-foreground">อัตราการเต้นของหัวใจ (BPM)</p>
                     {isEditing ? (
                        <Input type="number" value={ehr.heartRate} onChange={(e) => setEhr({...ehr, heartRate: parseInt(e.target.value)})} className="font-semibold p-1 h-8" />
                    ) : (
                        <p className="font-semibold">{ehr.heartRate} BPM</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                <Thermometer className="h-6 w-6 text-primary" />
                <div>
                    <p className="text-sm text-muted-foreground">อุณหภูมิ (°F)</p>
                    {isEditing ? (
                        <Input type="number" step="0.1" value={ehr.temperature} onChange={(e) => setEhr({...ehr, temperature: parseFloat(e.target.value)})} className="font-semibold p-1 h-8" />
                    ) : (
                        <p className="font-semibold">{ehr.temperature}°F</p>
                    )}
                </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle />ประวัติการแพ้</CardTitle></CardHeader>
            <CardContent>
                 {isEditing ? (
                     <Input value={ehr.allergies.join(', ')} onChange={(e) => setEhr({...ehr, allergies: e.target.value.split(',').map(s => s.trim())})} placeholder="คั่นด้วยจุลภาค, เช่น ถั่ว,นม" />
                 ) : (
                    <div className="flex flex-wrap gap-2">
                        {ehr.allergies.length > 0 && ehr.allergies[0] !== '' ? ehr.allergies.map(a => <Badge key={a} variant="destructive">{a}</Badge>) : <p className="text-sm text-muted-foreground">ไม่มีประวัติการแพ้</p>}
                    </div>
                 )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Pill />ยาที่ใช้</CardTitle></CardHeader>
            <CardContent>
               {isEditing ? (
                    <Textarea value={ehr.medications.map(m => `${m.name} (${m.dosage})`).join('\n')} 
                    onChange={(e) => {
                        const meds = e.target.value.split('\n').map((line, index) => {
                            const parts = line.match(/(.*) \((.*)\)/);
                            return { id: `med${index+1}`, name: parts ? parts[1] : line, dosage: parts ? parts[2] : 'N/A', frequency: 'N/A', reminders: false };
                        });
                        setEhr({...ehr, medications: meds});
                    }}
                    placeholder="หนึ่งบรรทัดต่อหนึ่งยา, เช่น Lisinopril (10mg)"
                    />
               ) : (
                <ul className="list-disc list-inside space-y-1">
                  {ehr.medications.map(m => <li key={m.id}>{m.name} ({m.dosage})</li>)}
                </ul>
               )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>อัปเดตบันทึก</CardTitle>
              <CardDescription>เพิ่มบันทึกใหม่หรืออัปเดตข้อมูลสุขภาพของผู้ป่วย</CardDescription>
            </div>
            {!isEditing && (
                 <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    แก้ไขบันทึก
                </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="notes" className="font-semibold">บันทึกของแพทย์</Label>
              <Textarea id="notes" placeholder="ป้อนบันทึกใหม่ที่นี่..." className="mt-2" value={ehr.notes} onChange={(e) => setEhr({...ehr, notes: e.target.value})} readOnly={!isEditing}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="document" className="font-semibold">อัปโหลดเอกสาร</Label>
              <div className="flex items-center gap-2">
                <Input id="document" type="file" className="flex-1" disabled={!isEditing} />
                <Button variant="outline" disabled={!isEditing}><FileUp className="mr-2 h-4 w-4" />อัปโหลด</Button>
              </div>
              <p className="text-xs text-muted-foreground">เช่น ผลตรวจทางห้องปฏิบัติการ, รายงานภาพถ่าย (UI สำหรับการสาธิต)</p>
            </div>
             {isEditing && (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => { setIsEditing(false); setEhr(ehrData); }}>ยกเลิก</Button>
                    <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />บันทึกการเปลี่ยนแปลง</Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
