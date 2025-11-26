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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateReportFromPdfAction } from '@/actions/generate-report-from-pdf';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  reportType: z.string().min(1, "Report type is required."),
  pdfFile: z
    .any()
    .refine(files => files?.length > 0, "A PDF file is required.")
    .refine(files => files?.[0]?.type === "application/pdf", "Only PDF files are allowed."),
});

type FormValues = z.infer<typeof formSchema>;

const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export function ReportGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        reportType: 'Executive Summary',
    },
  });
  
  const fileRef = form.register("pdfFile");

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReport('');

    try {
        const pdfFile = values.pdfFile[0];
        const pdfDataUri = await fileToDataUri(pdfFile);

        const result = await generateReportFromPdfAction({
            reportType: values.reportType,
            pdfDataUri: pdfDataUri
        });

        if (result.report) {
            setReport(result.report);
        } else {
            toast({
                variant: "destructive",
                title: "Error Generating Report",
                description: result.error || "An unknown error occurred.",
            });
        }
    } catch (e) {
        console.error(e);
        toast({
            variant: "destructive",
            title: "Error Processing File",
            description: "There was a problem reading the PDF file.",
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
            Upload a PDF and specify the type of report to generate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="pdfFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Research Paper (PDF)</FormLabel>
                    <FormControl>
                      <Input type="file" accept="application/pdf" {...fileRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reportType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Report Type</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Executive Summary, Literature Review, Technical Analysis" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
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
