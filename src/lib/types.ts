export type Role = 'Patient' | 'Doctor' | 'Hospital Admin';

export type User = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
  verificationStatus?: 'Verified' | 'Pending' | 'Rejected';
};

export type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  notes?: string;
};

export type EHR = {
  id: string;
  patientId: string;
  lastUpdated: string;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  allergies: string[];
  medications: Medication[];
  notes: string;
  fullRecord: string; // The full text for AI summary
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  reminders: boolean;
};
