'use server';

import { summarizeEhr, type SummarizeEhrInput } from '@/ai/flows/ai-ehr-summary';

export async function getEhrSummary(ehrData: string): Promise<{ summary: string } | { error: string }> {
  try {
    const input: SummarizeEhrInput = { ehrData };
    const result = await summarizeEhr(input);
    return result;
  } catch (error) {
    console.error('Error getting EHR summary:', error);
    return { error: 'Failed to generate summary. Please try again.' };
  }
}
