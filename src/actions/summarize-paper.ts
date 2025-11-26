"use server";

import { summarizePaper, type SummarizePaperInput } from "@/ai/flows/summarize-paper";
import { z } from "zod";

const formSchema = z.object({
  paperId: z.string().min(1, "Paper ID is required."),
  title: z.string().min(1, "Title is required."),
});

export async function summarizePaperAction(values: SummarizePaperInput) {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await summarizePaper(parsed.data);
        return { summary: result.summary };
    } catch (e: any) {
        console.error(e);
        return { error: e.message || "An unexpected error occurred while communicating with the AI." };
    }
}
