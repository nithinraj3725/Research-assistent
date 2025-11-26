"use server";

import { searchPapers, type Paper } from "@/services/semantic-scholar";
import { z } from "zod";

const formSchema = z.object({
  query: z.string().min(3, "Query must be at least 3 characters."),
});

export async function searchPapersAction(values: { query: string }): Promise<{ papers?: Paper[], error?: string }> {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const papers = await searchPapers(parsed.data.query);
        return { papers };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "An unexpected error occurred while searching for papers." };
    }
}
