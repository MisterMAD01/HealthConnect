'use client';

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { ehrs } from "@/lib/data";
import { Medication } from "@/lib/types";
import { Bell, BellOff, Pill } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function MedicationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const initialMedications = user ? ehrs.find(e => e.patientId === user.uid)?.medications || [] : [];
  const [medications, setMedications] = useState(initialMedications);

  const handleReminderChange = (medId: string, checked: boolean) => {
    setMedications(prevMeds =>
      prevMeds.map(med =>
        med.id === medId ? { ...med, reminders: checked } : med
      )
    );
    toast({
        title: `Reminders ${checked ? 'Enabled' : 'Disabled'}`,
        description: `Push notifications for ${medications.find(m => m.id === medId)?.name} have been updated.`,
    });
  };

  if (!user) return null;

  return (
    <>
      <PageHeader
        title="My Medications"
        description="Manage your prescribed medications and set up reminders."
      />
      <Card>
        <CardHeader>
          <CardTitle>Medication List</CardTitle>
          <CardDescription>
            Enable push notification reminders for your medications below. This would be managed by a server-side process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-6">
            {medications.map((med: Medication) => (
              <li key={med.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-background">
                <div className="flex items-start gap-4">
                  <Pill className="h-8 w-8 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg">{med.name}</p>
                    <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  {med.reminders ? <Bell className="h-4 w-4 text-accent-foreground" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
                  <Label htmlFor={`reminder-${med.id}`} className="mr-2">Reminders</Label>
                  <Switch
                    id={`reminder-${med.id}`}
                    checked={med.reminders}
                    onCheckedChange={(checked) => handleReminderChange(med.id, checked)}
                    aria-label={`Toggle reminders for ${med.name}`}
                  />
                </div>
              </li>
            ))}
             {medications.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No medications have been prescribed.</p>
                </div>
             )}
          </ul>
        </CardContent>
      </Card>
    </>
  );
}
