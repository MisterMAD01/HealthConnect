'use client'

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import { users } from "@/lib/data"

const appointmentData = [
  { month: "Jan", total: Math.floor(Math.random() * 100) + 50 },
  { month: "Feb", total: Math.floor(Math.random() * 100) + 50 },
  { month: "Mar", total: Math.floor(Math.random() * 100) + 50 },
  { month: "Apr", total: Math.floor(Math.random() * 100) + 50 },
  { month: "May", total: Math.floor(Math.random() * 100) + 50 },
  { month: "Jun", total: Math.floor(Math.random() * 100) + 50 },
]

const chartConfig = {
  total: {
    label: "Appointments",
  },
}

const doctorVerificationData = users.filter(u => u.role === 'Doctor').reduce((acc, doctor) => {
    const status = doctor.verificationStatus || 'N/A';
    const existing = acc.find(item => item.name === status);
    if (existing) {
        existing.value += 1;
    } else {
        acc.push({ name: status, value: 1 });
    }
    return acc;
}, [] as { name: string, value: number }[]);

const COLORS = {
    'Verified': 'hsl(var(--chart-2))',
    'Pending': 'hsl(var(--chart-4))',
    'Rejected': 'hsl(var(--destructive))',
};


export default function AnalyticsPage() {
    return (
        <>
            <PageHeader
                title="Platform Analytics"
                description="An overview of user activity and platform performance."
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments Trend</CardTitle>
                        <CardDescription>Total appointments over the last 6 months.</CardDescription>
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
                        <CardTitle>Doctor Verification Status</CardTitle>
                        <CardDescription>Distribution of doctor account statuses.</CardDescription>
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
