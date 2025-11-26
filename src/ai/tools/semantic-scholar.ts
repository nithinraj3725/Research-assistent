'use server';

import { ai } from '@/ai/genkit';
import { searchPapers, type Paper } from '@/services/semantic-scholar';
import { z } from 'genkit';

export const searchPapersTool = ai.defineTool(
  {
    name: 'searchPapersTool',
    description: 'Searches for academic papers on Semantic Scholar.',
    input: {
      schema: z.object({
        query: z.string().describe('The search query for academic papers.'),
      }),
    },
    output: {
      schema: z.array(Paper),
    },
  },
  async (input) => {
    console.log(`Searching for papers with query: ${input.query}`);
    try {
        const papers = await searchPapers(input.query);
        console.log(`Found ${papers.length} papers.`);
        return papers;
    } catch (error) {
        console.error("Error searching papers:", error);
        return []; // Return empty array on error
    }
  }
);
