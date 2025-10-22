'use client';

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { ehrs } from "@/lib/data";
import { HeartPulse, Thermometer, Droplets, Pill, Stethoscope, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RecordsPage() {
  const { user } = useAuth();
  const ehr = user ? ehrs.find(e => e.patientId === user.uid) : null;

  if (!user) return null;

  if (!ehr) {
    return (
      <>
        <PageHeader title="My Records" description="A summary of your health information." />
        <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No Records Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Your health record has not been created yet.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="My Medical Record"
        description={`Here is a summary of your health information, last updated on ${new Date(ehr.lastUpdated).toLocaleDateString()}.`}
      />
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Vitals</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                 <div className="flex items-start gap-4">
                    <HeartPulse className="h-8 w-8 text-primary mt-1" />
                    <div>
                        <p className="text-sm text-muted-foreground">Blood Pressure</p>
                        <p className="font-bold text-lg">{ehr.bloodPressure}</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <Droplets className="h-8 w-8 text-primary mt-1" />
                    <div>
                        <p className="text-sm text-muted-foreground">Heart Rate</p>
                        <p className="font-bold text-lg">{ehr.heartRate} BPM</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <Thermometer className="h-8 w-8 text-primary mt-1" />
                    <div>
                        <p className="text-sm text-muted-foreground">Temperature</p>
                        <p className="font-bold text-lg">{ehr.temperature}°F</p>
                    </div>
                 </div>
            </CardContent>
        </Card>
        
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />Allergies</CardTitle>
                </CardHeader>
                <CardContent>
                    {ehr.allergies.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {ehr.allergies.map(allergy => <Badge key={allergy} variant="destructive">{allergy}</Badge>)}
                        </div>
                    ) : <p className="text-sm text-muted-foreground">No known allergies.</p>}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5" />Medications</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2">
                        {ehr.medications.length > 0 ? ehr.medications.map(med => (
                            <li key={med.id}>
                                <span className="font-medium">{med.name}</span> - {med.dosage}, {med.frequency}
                            </li>
                        )) : <p className="text-sm text-muted-foreground">No medications prescribed.</p>}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5" />Doctor's Notes</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground italic">"{ehr.notes}"</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
}
