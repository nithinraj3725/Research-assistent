'use server';

/**
 * @fileOverview AI agent to generate a report from a PDF document.
 *
 * - generateReportFromPdf - A function that generates a report from a PDF.
 * - GenerateReportFromPdfInput - The input type for the generateReportFromPdf function.
 * - GenerateReportFromPdfOutput - The return type for the generateReportFromPdf function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReportFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document of a research paper, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type GenerateReportFromPdfInput = z.infer<typeof GenerateReportFromPdfInputSchema>;

const GenerateReportFromPdfOutputSchema = z.object({
  reportContent: z.string().describe('The generated report content based on the PDF.'),
});
export type GenerateReportFromPdfOutput = z.infer<typeof GenerateReportFromPdfOutputSchema>;

export async function generateReportFromPdf(input: GenerateReportFromPdfInput): Promise<GenerateReportFromPdfOutput> {
  return generateReportFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromPdfPrompt',
  input: {schema: GenerateReportFromPdfInputSchema},
  output: {schema: GenerateReportFromPdfOutputSchema},
  prompt: `You are an AI research assistant. Your task is to analyze the provided research paper (PDF).

  First, locate and carefully read the **Conclusion** section of the uploaded research paper.
  
  Within that conclusion, identify any ideas, suggestions, or unanswered questions the author proposes for **future research**.
  
  Then, generate a report that **expands on those specific ideas**. This report should explore the potential of those research paths, suggest possible methodologies, and outline the next steps a researcher could take.

  PDF Document: {{media url=pdfDataUri}}
  `,
});

const generateReportFromPdfFlow = ai.defineFlow(
  {
    name: 'generateReportFromPdfFlow',
    inputSchema: GenerateReportFromPdfInputSchema,
    outputSchema: GenerateReportFromPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
