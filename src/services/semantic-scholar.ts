import { z } from 'zod';

const AuthorSchema = z.object({
    authorId: z.string().nullable(),
    name: z.string(),
});

export const Paper = z.object({
    paperId: z.string(),
    url: z.string(),
    title: z.string(),
    venue: z.string().nullable().optional(),
    year: z.number().nullable().optional(),
    authors: z.array(AuthorSchema),
    abstract: z.string().nullable().optional(),
});

export type Paper = z.infer<typeof Paper>;

const API_ENDPOINT = 'https://api.semanticscholar.org/graph/v1';

async function callSemanticScholarAPI(path: string, params: URLSearchParams) {
    const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
    if (!apiKey) {
        const errorMessage = "SEMANTIC_SCHOLAR_API_KEY is not set. Please add it to your .env.local file.";
        console.warn(errorMessage);
        // Throw an error that can be caught by the action and displayed to the user.
        throw new Error(errorMessage);
    }
    
    try {
        const response = await fetch(`${API_ENDPOINT}/${path}?${params}`, {
            headers: {
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Semantic Scholar API Error: ${response.status} ${response.statusText}`, errorBody);
            throw new Error(`Failed to fetch data from Semantic Scholar API. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling Semantic Scholar API:", error);
        throw error;
    }
}


export async function searchPapers(query: string, limit = 10): Promise<Paper[]> {
    const params = new URLSearchParams({
        query: query,
        limit: limit.toString(),
        fields: 'url,title,venue,year,authors',
    });

    const data = await callSemanticScholarAPI('paper/search', params);
    
    // The API returns an object with a 'data' property which is the array of papers
    const papersData = data.data || [];

    // Validate and parse the data
    const validationResult = z.array(Paper).safeParse(papersData);
    if (!validationResult.success) {
        console.error("Failed to validate Semantic Scholar API response (search):", validationResult.error);
        return []; // Return empty array on validation failure
    }

    return validationResult.data;
}


export async function getPaper(paperId: string): Promise<Paper> {
    const params = new URLSearchParams({
        fields: 'url,title,abstract,authors,year',
    });

    const data = await callSemanticScholarAPI(`paper/${paperId}`, params);

    const validationResult = Paper.safeParse(data);
    if (!validationResult.success) {
        console.error("Failed to validate Semantic Scholar API response (getPaper):", validationResult.error);
        throw new Error("Could not parse paper details from API.");
    }
    
    return validationResult.data;
}
