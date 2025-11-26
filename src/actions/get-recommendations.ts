// This file is no longer used. The functionality has been split into
// search-papers.ts and summarize-paper.ts
"use server";

import { getResearchRecommendations, type GetResearchRecommendationsInput, type GetResearchRecommendationsOutput } from "@/ai/flows/get-research-recommendations";
import { z } from "zod";

const formSchema = z.object({
  projectHistory: z.string().min(1, "Project history is required."),
  interests: z.string().min(1, "Interests are required."),
});

export async function getRecommendationsAction(values: GetResearchRecommendationsInput): Promise<GetResearchRecommendationsOutput & { error?: string }> {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}`, recommendations: "", papers: [] };
    }

    try {
        const result = await getResearchRecommendations(parsed.data);
        return result;
    } catch (e) {
        console.error(e);
        return { error: "An unexpected error occurred while communicating with the AI. Please try again later.", recommendations: "", papers: [] };
    }
}
