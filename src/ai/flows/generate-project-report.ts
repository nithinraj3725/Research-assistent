'use server';

/**
 * @fileOverview AI agent to generate a detailed report of a research project.
 *
 * - generateProjectReport - A function that generates a detailed project report.
 * - GenerateProjectReportInput - The input type for the generateProjectReport function.
 * - GenerateProjectReportOutput - The return type for the generateProjectReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProjectReportInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  projectDescription: z.string().describe('A detailed description of the project, including goals, methodology, and key findings.'),
  projectStatus: z.string().describe('The current status of the project (e.g., in progress, completed, delayed).'),
  projectTimeline: z.string().describe('The timeline of the project, including start and end dates.'),
  keyAchievements: z.string().describe('A summary of the key achievements of the project.'),
  challengesEncountered: z.string().describe('A description of any challenges encountered during the project and how they were addressed.'),
});
export type GenerateProjectReportInput = z.infer<typeof GenerateProjectReportInputSchema>;

const GenerateProjectReportOutputSchema = z.object({
  reportContent: z.string().describe('The generated report content, including an introduction, methodology, findings, and conclusion.'),
});
export type GenerateProjectReportOutput = z.infer<typeof GenerateProjectReportOutputSchema>;

export async function generateProjectReport(input: GenerateProjectReportInput): Promise<GenerateProjectReportOutput> {
  return generateProjectReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectReportPrompt',
  input: {schema: GenerateProjectReportInputSchema},
  output: {schema: GenerateProjectReportOutputSchema},
  prompt: `You are an AI assistant tasked with generating a detailed report for a research project. The report should include an introduction, methodology, key findings, challenges encountered, and a conclusion.

  Project Name: {{{projectName}}}
  Project Description: {{{projectDescription}}}
  Project Status: {{{projectStatus}}}
  Project Timeline: {{{projectTimeline}}}
  Key Achievements: {{{keyAchievements}}}
  Challenges Encountered: {{{challengesEncountered}}}

  Generate a comprehensive report based on the above information. The report should be well-structured, easy to read, and suitable for presentation to stakeholders.
  `,
});

const generateProjectReportFlow = ai.defineFlow(
  {
    name: 'generateProjectReportFlow',
    inputSchema: GenerateProjectReportInputSchema,
    outputSchema: GenerateProjectReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
