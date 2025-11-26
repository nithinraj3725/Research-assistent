"use server";

import { generateReportFromPdf, type GenerateReportFromPdfInput } from "@/ai/flows/generate-report-from-pdf";
import { z } from "zod";

const formSchema = z.object({
  pdfDataUri: z.string().min(1, "PDF file is required."),
});

export async function generateReportFromPdfAction(values: GenerateReportFromPdfInput) {
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
        const issues = parsed.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }

    try {
        const result = await generateReportFromPdf(parsed.data);
        return { report: result.reportContent };
    } catch (e) {
        console.error(e);
        return { error: "An unexpected error occurred while communicating with the AI. Please try again later." };
    }
}
