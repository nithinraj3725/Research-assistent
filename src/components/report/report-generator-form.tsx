"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { projects } from '@/lib/placeholder-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateReportAction } from '@/actions/generate-report';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  projectId: z.string().optional(),
  projectName: z.string().min(1, "Project name is required."),
  projectDescription: z.string().min(1, "Project description is required."),
  projectStatus: z.string().min(1, "Project status is required."),
  projectTimeline: z.string().min(1, "Project timeline is required."),
  keyAchievements: z.string().min(1, "Key achievements are required."),
  challengesEncountered: z.string().min(1, "Challenges are required."),
});

type FormValues = z.infer<typeof formSchema>;

export function ReportGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        projectId: '',
        projectName: '',
        projectDescription: '',
        projectStatus: '',
        projectTimeline: '',
        keyAchievements: '',
        challengesEncountered: '',
    },
  });

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        form.setValue('projectId', project.id);
        form.setValue('projectName', project.name);
        form.setValue('projectStatus', project.status);
        form.setValue('projectDescription', `This project explores ${project.name}. The lead researcher is ${project.lead}.`);
        form.setValue('projectTimeline', 'Jan 2023 - Dec 2024');
        form.setValue('keyAchievements', 'Initial setup completed. Preliminary data collected.');
        form.setValue('challengesEncountered', 'Funding delays and equipment procurement issues.');
        form.trigger();
    }
  };

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReport('');
    const result = await generateReportAction(values);
    if (result.report) {
      setReport(result.report);
    } else {
      toast({
        variant: "destructive",
        title: "Error Generating Report",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Report Details</CardTitle>
          <CardDescription>
            Select a project or fill in the details to generate a report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Project (Optional)</FormLabel>
                    <Select onValueChange={handleProjectSelect} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Load data from an existing project" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {projects.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField control={form.control} name="projectName" render={({ field }) => (
                <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField control={form.control} name="projectDescription" render={({ field }) => (
                <FormItem><FormLabel>Project Description</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField control={form.control} name="projectStatus" render={({ field }) => (
                <FormItem><FormLabel>Project Status</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

              <FormField control={form.control} name="projectTimeline" render={({ field }) => (
                <FormItem><FormLabel>Project Timeline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>

              <FormField control={form.control} name="keyAchievements" render={({ field }) => (
                <FormItem><FormLabel>Key Achievements</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <FormField control={form.control} name="challengesEncountered" render={({ field }) => (
                <FormItem><FormLabel>Challenges Encountered</FormLabel><FormControl><Textarea {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )}/>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Report
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline">Generated Report</CardTitle>
          <CardDescription>
            The AI-generated report will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : report ? (
            <div className="rounded-md border p-4 bg-muted/50 h-full max-h-[65vh] overflow-auto">
              <pre className="whitespace-pre-wrap text-sm font-body">{report}</pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground text-center">Your report is waiting to be generated.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
