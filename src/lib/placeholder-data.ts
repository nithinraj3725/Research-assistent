export type Project = {
  id: string;
  name: string;
  status: 'Completed' | 'In Progress' | 'On Hold' | 'Not Started';
  progress: number;
  lead: string;
  team: string[];
};

export const projects: Project[] = [];

export const projectStatusData = [
  { status: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length, fill: "var(--color-inProgress)" },
  { status: 'Completed', count: projects.filter(p => p.status === 'Completed').length, fill: "var(--color-completed)" },
  { status: 'On Hold', count: projects.filter(p => p.status === 'On Hold').length, fill: "var(--color-onHold)" },
  { status: 'Not Started', count: projects.filter(p => p.status === 'Not Started').length, fill: "var(--color-notStarted)" },
];
