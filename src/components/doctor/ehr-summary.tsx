'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { getEhrSummary } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Loader2 } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

interface EhrSummaryProps {
  initialEhrText: string;
}

export function EhrSummary({ initialEhrText }: EhrSummaryProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setSummary('');
    const result = await getEhrSummary(initialEhrText);
    setIsLoading(false);

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'ข้อผิดพลาด',
        description: result.error,
      });
    } else {
      setSummary(result.summary);
      toast({
        title: 'สร้างสรุปสำเร็จ',
        description: 'สรุปที่ขับเคลื่อนด้วย AI พร้อมใช้งานแล้ว',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>สรุป EHR ด้วย AI</CardTitle>
        <CardDescription>
          ใช้ AI เพื่อสร้างสรุปที่กระชับของบันทึกสุขภาพอิเล็กทรอนิกส์ฉบับเต็มของผู้ป่วย
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">บันทึกฉบับเต็ม</h3>
            <ScrollArea className="h-72 w-full rounded-md border p-4">
              <pre className="text-sm whitespace-pre-wrap font-sans">{initialEhrText}</pre>
            </ScrollArea>
          </div>
          <div>
            <h3 className="font-semibold mb-2">สรุปที่สร้างขึ้น</h3>
            <div className="h-72 w-full rounded-md border p-4 bg-secondary/50 relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {summary ? (
                <ScrollArea className="h-full">
                    <p className="text-sm">{summary}</p>
                </ScrollArea>
              ) : (
                !isLoading && <p className="text-sm text-muted-foreground">คลิก "สร้างสรุป" เพื่อดูผลลัพธ์ที่ขับเคลื่อนด้วย AI ที่นี่</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleGenerateSummary} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            สร้างสรุป
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
