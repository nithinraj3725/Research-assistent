"use server";

import { getResearchRecommendations, type GetResearchRecommendationsInput } from "@/ai/flows/get-research-recommendations";
import { z } from "zod";

const formSchema = z.object({
  projectHistory: z.string().min(1, "Project history is required."),
  interests: z.string().min(1, "Interests are required."),
});

export async function getRecommendationsAction(values: GetResearchRecommendationsInput) {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await getResearchRecommendations(parsed.data);
        return { recommendations: result.recommendations };
    } catch (e) {
        console.error(e);
        return { error: "An unexpected error occurred while communicating with the AI. Please try again later." };
    }
}
