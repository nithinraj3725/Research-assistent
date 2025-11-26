import { z } from 'zod';

const AuthorSchema = z.object({
    authorId: z.string(),
    name: z.string(),
});

export const Paper = z.object({
    paperId: z.string(),
    url: z.string(),
    title: z.string(),
    venue: z.string().nullable(),
    year: z.number().nullable(),
    authors: z.array(AuthorSchema),
});

export type Paper = z.infer<typeof Paper>;

const API_ENDPOINT = 'https://api.semanticscholar.org/graph/v1';

export async function searchPapers(query: string, limit = 5): Promise<Paper[]> {
    const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
    if (!apiKey) {
        console.warn("SEMANTIC_SCHOLAR_API_KEY is not set. Skipping API call.");
        return [];
    }

    const params = new URLSearchParams({
        query: query,
        limit: limit.toString(),
        fields: 'url,title,venue,year,authors',
    });

    try {
        const response = await fetch(`${API_ENDPOINT}/paper/search?${params}`, {
            headers: {
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Semantic Scholar API Error: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to fetch papers from Semantic Scholar API. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // The API returns an object with a 'data' property which is the array of papers
        const papersData = data.data || [];

        // Validate and parse the data
        const validationResult = z.array(Paper).safeParse(papersData);
        if (!validationResult.success) {
            console.error("Failed to validate Semantic Scholar API response:", validationResult.error);
            return [];
        }

        return validationResult.data;
    } catch (error) {
        console.error("Error calling Semantic Scholar API:", error);
        throw error;
    }
}
