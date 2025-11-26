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
  reportType: z.string().describe('The type of report to generate (e.g., Executive Summary, Literature Review, Technical Analysis).'),
});
export type GenerateReportFromPdfInput = z.infer<typeof GenerateReportFromPdfInputSchema>;

const GenerateReportFromPdfOutputSchema = z.object({
  reportContent: z.string().describe('The generated report content based on the PDF and report type.'),
});
export type GenerateReportFromPdfOutput = z.infer<typeof GenerateReportFromPdfOutputSchema>;

export async function generateReportFromPdf(input: GenerateReportFromPdfInput): Promise<GenerateReportFromPdfOutput> {
  return generateReportFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportFromPdfPrompt',
  input: {schema: GenerateReportFromPdfInputSchema},
  output: {schema: GenerateReportFromPdfOutputSchema},
  prompt: `You are an AI research assistant. Your task is to analyze the provided research paper (PDF) and generate a specific type of report based on its content.

  Report Type Requested: {{{reportType}}}

  Analyze the document and generate a comprehensive and well-structured "{{{reportType}}}".

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
