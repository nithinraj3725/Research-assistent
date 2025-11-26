"use client"

import React, { useContext, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import { ProjectContext } from '@/context/ProjectContext';

const chartConfig = {
  count: {
    label: "Projects",
  },
  inProgress: {
    label: "In Progress",
    color: "hsl(var(--primary))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--accent))",
  },
  onHold: {
    label: "On Hold",
    color: "hsl(var(--chart-4))",
  },
  notStarted: {
    label: "Not Started",
    color: "hsl(var(--muted-foreground))",
  }
} satisfies ChartConfig

export function ProjectStatusChart() {
  const { projects } = useContext(ProjectContext);

  const projectStatusData = useMemo(() => [
    { status: 'In Progress', count: projects.filter(p => p.status === 'In Progress').length, fill: "var(--color-inProgress)" },
    { status: 'Completed', count: projects.filter(p => p.status === 'Completed').length, fill: "var(--color-completed)" },
    { status: 'On Hold', count: projects.filter(p => p.status === 'On Hold').length, fill: "var(--color-onHold)" },
    { status: 'Not Started', count: projects.filter(p => p.status === 'Not Started').length, fill: "var(--color-notStarted)" },
  ], [projects]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Project Overview</CardTitle>
        <CardDescription>A summary of current project statuses.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
            <BarChart accessibilityLayer data={projectStatusData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="status"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="count" radius={4}>
                    {projectStatusData.map((d, index) => (
                        <Bar key={index} dataKey="count" fill={d.fill} />
                    ))}
                </Bar>
            </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
