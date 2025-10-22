'use client'

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { users } from "@/lib/data"

const appointmentData = [
    { month: "ม.ค.", total: Math.floor(Math.random() * 100) + 50 },
    { month: "ก.พ.", total: Math.floor(Math.random() * 100) + 50 },
    { month: "มี.ค.", total: Math.floor(Math.random() * 100) + 50 },
    { month: "เม.ย.", total: Math.floor(Math.random() * 100) + 50 },
    { month: "พ.ค.", total: Math.floor(Math.random() * 100) + 50 },
    { month: "มิ.ย.", total: Math.floor(Math.random() * 100) + 50 },
]

const chartConfig = {
  total: {
    label: "การนัดหมาย",
  },
}

const doctorVerificationData = users.filter(u => u.role === 'Doctor').reduce((acc, doctor) => {
    const status = doctor.verificationStatus || 'N/A';
    const statusTH = status === 'Verified' ? 'ตรวจสอบแล้ว' : status === 'Pending' ? 'รอดำเนินการ' : status === 'Rejected' ? 'ถูกปฏิเสธ' : 'N/A';
    const existing = acc.find(item => item.name === statusTH);
    if (existing) {
        existing.value += 1;
    } else {
        acc.push({ name: statusTH, value: 1 });
    }
    return acc;
}, [] as { name: string, value: number }[]);

const COLORS = {
    'ตรวจสอบแล้ว': 'hsl(var(--chart-2))',
    'รอดำเนินการ': 'hsl(var(--chart-4))',
    'ถูกปฏิเสธ': 'hsl(var(--destructive))',
};


export default function AnalyticsPage() {
    return (
        <>
            <PageHeader
                title="การวิเคราะห์แพลตฟอร์ม"
                description="ภาพรวมกิจกรรมของผู้ใช้และประสิทธิภาพของแพลตฟอร์ม"
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>แนวโน้มการนัดหมาย</CardTitle>
                        <CardDescription>การนัดหมายทั้งหมดในช่วง 6 เดือนที่ผ่านมา</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[300px] w-full">
                            <BarChart data={appointmentData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>สถานะการยืนยันตัวตนแพทย์</CardTitle>
                        <CardDescription>การกระจายสถานะบัญชีของแพทย์</CardDescription>
                    </CardHeader>
                     <CardContent className="flex justify-center">
                        <ChartContainer config={{}} className="h-[300px] w-full">
                           <PieChart>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                                <Pie data={doctorVerificationData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {doctorVerificationData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
