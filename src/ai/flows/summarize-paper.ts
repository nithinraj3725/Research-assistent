'use server';

/**
 * @fileOverview AI agent to generate an executive summary for a research paper.
 * 
 * - summarizePaper - A function that generates the summary.
 * - SummarizePaperInput - The input type for the summarizePaper function.
 * - SummarizePaperOutput - The return type for the summarizePaper function.
 */

import {ai} from '@/ai/genkit';
import { getPaper } from '@/services/semantic-scholar';
import {z} from 'genkit';

const SummarizePaperInputSchema = z.object({
  paperId: z.string().describe('The Semantic Scholar ID of the paper.'),
  title: z.string().describe('The title of the paper.'),
});
export type SummarizePaperInput = z.infer<typeof SummarizePaperInputSchema>;

const SummarizePaperOutputSchema = z.object({
  summary: z.string().describe('The generated executive summary of the paper.'),
});
export type SummarizePaperOutput = z.infer<typeof SummarizePaperOutputSchema>;

export async function summarizePaper(input: SummarizePaperInput): Promise<SummarizePaperOutput> {
  return summarizePaperFlow(input);
}

const summarizePaperFlow = ai.defineFlow(
  {
    name: 'summarizePaperFlow',
    inputSchema: SummarizePaperInputSchema,
    outputSchema: SummarizePaperOutputSchema,
  },
  async (input) => {
    // First, get the paper's abstract using the ID
    const paperDetails = await getPaper(input.paperId);
    
    if (!paperDetails.abstract) {
        // If there's no abstract, we can't generate a good summary.
        // We could try to use the title, but the result will be poor.
        // Let's try to summarize from title alone as a fallback.
        const { output: titleSummary } = await ai.generate({
            prompt: `The research paper titled "${input.title}" does not have an available abstract. Based on the title alone, provide a brief, one-paragraph educated guess about its content and purpose.`,
            output: {
                schema: SummarizePaperOutputSchema,
            }
        });
        return titleSummary!;
    }
    
    // Now, generate the summary from the abstract
    const { output } = await ai.generate({
      prompt: `Generate a concise, one-paragraph executive summary for a research paper titled "${paperDetails.title}". The summary should be easy for a non-expert to understand. Base the summary on the following abstract:
      
      ---
      Abstract: ${paperDetails.abstract}
      ---
      `,
      output: { schema: SummarizePaperOutputSchema },
    });

    return output!;
  }
);
