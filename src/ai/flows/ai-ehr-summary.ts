'use server';

/**
 * @fileOverview An AI agent to summarize a patient's EHR for doctors.
 *
 * - summarizeEhr - A function that handles the EHR summarization process.
 * - SummarizeEhrInput - The input type for the summarizeEhr function.
 * - SummarizeEhrOutput - The return type for the summarizeEhr function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEhrInputSchema = z.object({
  ehrData: z.string().describe('The patient Electronic Health Record data to summarize.'),
});
export type SummarizeEhrInput = z.infer<typeof SummarizeEhrInputSchema>;

const SummarizeEhrOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient EHR data.'),
});
export type SummarizeEhrOutput = z.infer<typeof SummarizeEhrOutputSchema>;

export async function summarizeEhr(input: SummarizeEhrInput): Promise<SummarizeEhrOutput> {
  return summarizeEhrFlow(input);
}

const summarizeEhrPrompt = ai.definePrompt({
  name: 'summarizeEhrPrompt',
  input: {schema: SummarizeEhrInputSchema},
  output: {schema: SummarizeEhrOutputSchema},
  prompt: `You are an AI assistant helping doctors quickly understand patient medical history.
  Summarize the following Electronic Health Record data into a concise and informative summary.
  EHR Data: {{{ehrData}}}`,
});

const summarizeEhrFlow = ai.defineFlow(
  {
    name: 'summarizeEhrFlow',
    inputSchema: SummarizeEhrInputSchema,
    outputSchema: SummarizeEhrOutputSchema,
  },
  async input => {
    const {output} = await summarizeEhrPrompt(input);
    return output!;
  }
);
