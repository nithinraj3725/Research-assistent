'use server';
/**
 * @fileOverview A research recommendation AI agent.
 *
 * - getResearchRecommendations - A function that handles the research recommendation process.
 * - GetResearchRecommendationsInput - The input type for the getResearchRecommendations function.
 * - GetResearchRecommendationsOutput - The return type for the getResearchRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetResearchRecommendationsInputSchema = z.object({
  projectHistory: z
    .string()
    .describe('A summary of the user past research projects.'),
  interests: z.string().describe('The research interests of the user.'),
});
export type GetResearchRecommendationsInput = z.infer<
  typeof GetResearchRecommendationsInputSchema
>;

const GetResearchRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('Personalized research recommendations for the user.'),
});
export type GetResearchRecommendationsOutput = z.infer<
  typeof GetResearchRecommendationsOutputSchema
>;

export async function getResearchRecommendations(
  input: GetResearchRecommendationsInput
): Promise<GetResearchRecommendationsOutput> {
  return getResearchRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getResearchRecommendationsPrompt',
  input: {schema: GetResearchRecommendationsInputSchema},
  output: {schema: GetResearchRecommendationsOutputSchema},
  prompt: `You are an expert research assistant. You will provide personalized research recommendations to the user based on their past projects and interests.

Past Projects: {{{projectHistory}}}
Interests: {{{interests}}}

Recommendations:`,
});

const getResearchRecommendationsFlow = ai.defineFlow(
  {
    name: 'getResearchRecommendationsFlow',
    inputSchema: GetResearchRecommendationsInputSchema,
    outputSchema: GetResearchRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
