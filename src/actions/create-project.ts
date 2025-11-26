'use server';

// This file is no longer used for project creation as it has been moved to client-side state.
// It is kept for potential future use with a database.

import { z } from 'zod';
import { redirect } from 'next/navigation';

const formSchema = z.object({
  projectName: z.string().min(1, 'Project name is required.'),
  projectDescription: z.string().min(1, 'Project description is required.'),
  projectLead: z.string().min(1, 'Project lead is required.'),
});

export async function createProjectAction(values: unknown) {
  const parsed = formSchema.safeParse(values);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => i.message).join(' ');
    return { error: `Invalid input: ${issues}` };
  }

  // Here you would typically save the data to a database.
  // For now, we'll just log it and redirect.
  console.log('New project created:', parsed.data);

  redirect('/projects');
}
