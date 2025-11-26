export type Project = {
  id: string;
  name: string;
  status: 'Completed' | 'In Progress' | 'On Hold' | 'Not Started';
  progress: number;
  lead: string;
  team: string[];
};

export const projects: Project[] = [
  { id: 'PROJ-001', name: 'Quantum Entanglement in Macro Systems', status: 'In Progress', progress: 75, lead: 'Dr. Evelyn Reed', team: ['Alice', 'Bob'] },
  { id: 'PROJ-002', name: 'AI-driven Drug Discovery for Neuro-diseases', status: 'Completed', progress: 100, lead: 'Dr. Kenji Tanaka', team: ['Charlie', 'David'] },
  { id: 'PROJ-003', name: 'Graphene-based Supercapacitors', status: 'In Progress', progress: 40, lead: 'Dr. Maria Garcia', team: ['Eve', 'Frank'] },
  { id: 'PROJ-004', name: 'Historical Analysis of Ancient Trade Routes', status: 'On Hold', progress: 20, lead: 'Dr. Samuel Chen', team: ['Grace', 'Heidi'] },
  { id: 'PROJ-005', name: 'Machine Learning for Climate Change Modeling', status: 'In Progress', progress: 65, lead: 'Dr. Evelyn Reed', team: ['Ivan', 'Judy'] },
  { id: 'PROJ-006', name: 'Sociological Impact of Social Media', status: 'Not Started', progress: 0, lead: 'Dr. Maria Garcia', team: ['Mallory', 'Niaj'] },
];

export const projectStatusData = [
  { status: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length, fill: "var(--color-inProgress)" },
  { status: 'Completed', count: projects.filter(p => p.status === 'Completed').length, fill: "var(--color-completed)" },
  { status: 'On Hold', count: projects.filter(p => p.status === 'On Hold').length, fill: "var(--color-onHold)" },
  { status: 'Not Started', count: projects.filter(p => p.status === 'Not Started').length, fill: "var(--color-notStarted)" },
];
