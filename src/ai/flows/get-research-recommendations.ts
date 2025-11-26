'use server';
/**
 * @fileOverview A research recommendation AI agent.
 *
 * - getResearchRecommendations - A function that handles the research recommendation process.
 * - GetResearchRecommendationsInput - The input type for the getResearchRecommendations function.
 * - GetResearchRecommendationsOutput - The return type for the getResearchRecommendations function.
 */

import {ai} from '@/ai/genkit';
import { searchPapersTool } from '@/ai/tools/semantic-scholar';
import { Paper } from '@/services/semantic-scholar';
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
    .describe('Personalized research recommendations for the user. This should be a concise summary of promising research directions.'),
  papers: z.array(Paper)
    .describe('A list of relevant academic papers to support the recommendations.')
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
  tools: [searchPapersTool],
  prompt: `You are an expert research assistant. Your task is to provide personalized research recommendations and suggest relevant papers based on the user's profile.

  Analyze the user's past projects and current interests to identify 2-3 promising new research directions.
  
  For each recommendation, provide a brief (2-3 sentences) justification.
  
  Then, use the searchPapersTool to find 3-5 relevant and recent academic papers that support your recommendations. Your search query for the tool should be based on the user's most compelling interests.

  Past Projects: {{{projectHistory}}}
  Interests: {{{interests}}}
  `,
});

const getResearchRecommendationsFlow = ai.defineFlow(
  {
    name: 'getResearchRecommendationsFlow',
    inputSchema: GetResearchRecommendationsInputSchema,
    outputSchema: GetResearchRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    
    // Ensure we have a valid output, even if the tool call fails or returns nothing.
    if (!output) {
      return {
        recommendations: "Could not generate recommendations at this time.",
        papers: [],
      };
    }
    
    return output;
  }
);
