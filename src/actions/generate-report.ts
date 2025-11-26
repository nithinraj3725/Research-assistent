"use server";

import { generateProjectReport, type GenerateProjectReportInput } from "@/ai/flows/generate-project-report";
import { z } from "zod";

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required."),
  projectDescription: z.string().min(1, "Project description is required."),
  projectStatus: z.string().min(1, "Project status is required."),
  projectTimeline: z.string().min(1, "Project timeline is required."),
  keyAchievements: z.string().min(1, "Key achievements are required."),
  challengesEncountered: z.string().min(1, "Challenges are required."),
});

export async function generateReportAction(values: GenerateProjectReportInput) {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await generateProjectReport(parsed.data);
        return { report: result.reportContent };
    } catch (e) {
        console.error(e);
        return { error: "An unexpected error occurred while communicating with the AI. Please try again later." };
    }
}
