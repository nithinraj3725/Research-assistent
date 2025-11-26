import { config } from 'dotenv';
config({ path: `.env.local` });
config();

import '@/ai/flows/get-research-recommendations.ts';
import '@/ai/flows/generate-project-report.ts';
import '@/ai/flows/generate-report-from-pdf.ts';
