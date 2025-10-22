import type { User, Appointment, EHR, Medication } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getAvatar = (id: string) => PlaceHolderImages.find(img => img.id === id)?.imageUrl || '';

export const users: User[] = [
  { uid: 'patient1', name: 'เลียม คาร์เตอร์', email: 'liam.carter@example.com', role: 'Patient', avatarUrl: getAvatar('avatar-1') },
  { uid: 'patient2', name: 'โอลิเวีย เฉิน', email: 'olivia.chen@example.com', role: 'Patient', avatarUrl: getAvatar('avatar-2') },
  { uid: 'doctor1', name: 'พญ. เอเวลิน รีด', email: 'evelyn.reed@clinic.com', role: 'Doctor', avatarUrl: getAvatar('avatar-3'), verificationStatus: 'Verified' },
  { uid: 'doctor2', name: 'นพ. เบน สโตน', email: 'ben.stone@clinic.com', role: 'Doctor', avatarUrl: getAvatar('avatar-4'), verificationStatus: 'Pending' },
  { uid: 'admin1', name: 'โนอาห์ พาเทล', email: 'noah.patel@hospital.com', role: 'Hospital Admin', avatarUrl: getAvatar('avatar-5') },
  { uid: 'doctor3', name: 'พญ. โคลอี้ คิง', email: 'chloe.king@clinic.com', role: 'Doctor', avatarUrl: getAvatar('avatar-6'), verificationStatus: 'Rejected' },
];

export const appointments: Appointment[] = [
  { id: 'appt1', patientId: 'patient1', patientName: 'เลียม คาร์เตอร์', doctorId: 'doctor1', doctorName: 'พญ. เอเวลิน รีด', date: new Date().toISOString().split('T')[0], time: '10:00 น.', status: 'Scheduled' },
  { id: 'appt2', patientId: 'patient2', patientName: 'โอลิเวีย เฉิน', doctorId: 'doctor1', doctorName: 'พญ. เอเวลิน รีด', date: new Date().toISOString().split('T')[0], time: '11:30 น.', status: 'Scheduled' },
  { id: 'appt3', patientId: 'patient1', patientName: 'เลียม คาร์เตอร์', doctorId: 'doctor2', doctorName: 'นพ. เบน สโตน', date: '2024-08-15', time: '14:00 น.', status: 'Completed' },
  { id: 'appt4', patientId: 'patient2', patientName: 'โอลิเวีย เฉิน', doctorId: 'doctor3', doctorName: 'พญ. โคลอี้ คิง', date: '2024-08-18', time: '09:00 น.', status: 'Cancelled' },
];

const medications: Medication[] = [
    { id: 'med1', name: 'Lisinopril', dosage: '10mg', frequency: 'วันละครั้ง', reminders: true },
    { id: 'med2', name: 'Metformin', dosage: '500mg', frequency: 'วันละสองครั้ง', reminders: true },
    { id: 'med3', name: 'Ibuprofen', dosage: '200mg', frequency: 'เมื่อมีอาการปวด', reminders: false },
];

export const ehrs: EHR[] = [
  { 
    id: 'ehr1', 
    patientId: 'patient1', 
    lastUpdated: '2024-07-20', 
    bloodPressure: '120/80 mmHg', 
    heartRate: 72, 
    temperature: 98.6, 
    allergies: ['ถั่วลิสง'], 
    medications: medications,
    notes: 'ผู้ป่วยมีสุขภาพดี ติดตามผลใน 6 เดือน',
    fullRecord: `
Patient: Liam Carter (DOB: 1985-05-15)
Last Visit: 2024-07-20
Chief Complaint: Annual Checkup

Vitals:
- Blood Pressure: 120/80 mmHg
- Heart Rate: 72 bpm
- Temperature: 98.6°F (37°C)
- Weight: 180 lbs
- Height: 6'0"

History of Present Illness:
Patient presents for a routine annual physical examination. Reports feeling well, with no acute complaints. He maintains an active lifestyle, exercising 3-4 times per week. Diet is generally balanced. No new medications or supplements.

Past Medical History:
- Hypertension, diagnosed 2022, well-controlled on Lisinopril.
- No history of surgeries.

Allergies:
- Known allergy to Peanuts (anaphylaxis). Patient carries an EpiPen.

Medications:
- Lisinopril 10mg, once daily.

Family History:
- Father with hypertension and type 2 diabetes.
- Mother is healthy.

Social History:
- Non-smoker, occasional alcohol use (2-3 drinks per week).
- Works as a software engineer.

Review of Systems:
- All systems reviewed and are negative except as noted in HPI.

Physical Examination:
- GENERAL: Well-appearing, well-nourished male in no acute distress.
- HEENT: Normocephalic, atraumatic. PERRLA. TMs clear.
- CARDIOVASCULAR: Regular rate and rhythm, no murmurs, rubs, or gallops.
- PULMONARY: Lungs clear to auscultation bilaterally.
- ABDOMEN: Soft, non-tender, non-distended.
- SKIN: Warm and dry, no rashes or lesions.

Assessment and Plan:
1.  **Stable Hypertension:** Continue Lisinopril 10mg daily. Patient's blood pressure is well-controlled. Advised to continue monitoring at home.
2.  **Health Maintenance:** Patient is up to date on all vaccinations. Encouraged to continue healthy lifestyle habits.
3.  **Peanut Allergy:** Reminded patient to avoid peanuts and to carry his EpiPen at all times.

Follow-up in 6 months for blood pressure check. Return sooner if any new concerns arise.
`
  },
  { 
    id: 'ehr2', 
    patientId: 'patient2', 
    lastUpdated: '2024-07-18', 
    bloodPressure: '130/85 mmHg', 
    heartRate: 80, 
    temperature: 99.1, 
    allergies: ['ไม่มี'], 
    medications: [],
    notes: 'ความดันโลหิตสูงเล็กน้อย แนะนำให้เปลี่ยนแปลงอาหารและการออกกำลังกาย',
    fullRecord: `
Patient: Olivia Chen (DOB: 1992-11-22)
Last Visit: 2024-07-18
Chief Complaint: Follow-up for borderline high blood pressure.

Vitals:
- Blood Pressure: 130/85 mmHg
- Heart Rate: 80 bpm
- Temperature: 99.1°F (37.3°C)
- Weight: 145 lbs
- Height: 5'5"

History of Present Illness:
Ms. Chen returns for a follow-up visit to discuss her blood pressure, which was noted to be borderline elevated at her last visit three months ago. She reports some work-related stress but has been trying to incorporate more walking into her daily routine. Denies headaches, chest pain, or dizziness.

Past Medical History:
- No significant past medical history.
- G1P1, normal spontaneous vaginal delivery in 2020.

Allergies:
- No known drug allergies.

Medications:
- None.

Family History:
- Mother has hypertension.
- Father is healthy.

Social History:
- Non-smoker, denies alcohol or illicit drug use.
- Works as a graphic designer, reports long hours and deadlines.

Review of Systems:
- Constitutional: Reports some fatigue, attributes to work.
- All other systems reviewed and are negative.

Physical Examination:
- GENERAL: Alert and oriented female, appears slightly fatigued but in no distress.
- CARDIOVASCULAR: RRR, S1/S2 normal. No edema.
- PULMONARY: Lungs clear.
- ABDOMEN: Soft, non-tender.

Assessment and Plan:
1.  **Elevated Blood Pressure:** BP remains in the elevated range. Discussed lifestyle modifications as the first line of treatment.
    -   Recommended DASH diet, focusing on reducing sodium intake.
    -   Advised increasing physical activity to 150 minutes of moderate-intensity exercise per week.
    -   Provided resources for stress management techniques (e.g., mindfulness apps).
2.  **Health Maintenance:** Patient is due for a Pap smear, which was scheduled.

Plan to recheck blood pressure in 3 months. If still elevated, will consider starting pharmacotherapy. Patient agreeable to the plan.
`
  },
];
