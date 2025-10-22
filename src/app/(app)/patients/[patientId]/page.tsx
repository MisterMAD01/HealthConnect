'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { users, ehrs } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HeartPulse, Thermometer, Droplets, Pill, AlertTriangle, FileUp, Save } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea";
import { EhrSummary } from "@/components/doctor/ehr-summary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PatientRecordPage({ params }: { params: { patientId: string } }) {
  const patient = users.find(u => u.uid === params.patientId);
  const ehr = ehrs.find(e => e.patientId === params.patientId);

  if (!patient || !ehr) {
    return (
        <div>
            <PageHeader title="Patient Not Found" />
            <p>The requested patient record could not be found.</p>
            <Button asChild variant="link">
                <Link href="/patients">Return to patient list</Link>
            </Button>
        </div>
    )
  }

  return (
    <>
      <PageHeader
        title={patient.name}
        description={`Viewing the electronic health record for ${patient.name}.`}
      >
        <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <p className="font-medium">{patient.email}</p>
                <p className="text-sm text-muted-foreground">Patient ID: {patient.uid}</p>
            </div>
        </div>
      </PageHeader>

      <div className="space-y-8">
        <EhrSummary initialEhrText={ehr.fullRecord} />

        <Card>
            <CardHeader>
                <CardTitle>Vitals</CardTitle>
                <CardDescription>Last recorded on {new Date(ehr.lastUpdated).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                    <HeartPulse className="h-6 w-6 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Blood Pressure</p><p className="font-semibold">{ehr.bloodPressure}</p></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                    <Droplets className="h-6 w-6 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Heart Rate</p><p className="font-semibold">{ehr.heartRate} BPM</p></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/30 rounded-lg">
                    <Thermometer className="h-6 w-6 text-primary" />
                    <div><p className="text-sm text-muted-foreground">Temperature</p><p className="font-semibold">{ehr.temperature}°F</p></div>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle />Allergies</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {ehr.allergies.map(a => <Badge key={a} variant="destructive">{a}</Badge>)}
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Pill />Medications</CardTitle></CardHeader>
                <CardContent>
                    <ul className="list-disc list-inside space-y-1">
                        {ehr.medications.map(m => <li key={m.id}>{m.name} ({m.dosage})</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Update Record</CardTitle>
                <CardDescription>Add new notes or upload documents to the patient's record.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="notes" className="font-semibold">Doctor's Notes</Label>
                    <Textarea id="notes" placeholder="Enter new notes here..." className="mt-2" defaultValue={ehr.notes} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="document" className="font-semibold">Upload Document</Label>
                    <div className="flex items-center gap-2">
                        <Input id="document" type="file" className="flex-1" />
                        <Button variant="outline"><FileUp className="mr-2 h-4 w-4" />Upload</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">e.g., Lab results, imaging reports. (UI for demonstration)</p>
                </div>
                <div className="flex justify-end">
                    <Button><Save className="mr-2 h-4 w-4" />Save Changes</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
