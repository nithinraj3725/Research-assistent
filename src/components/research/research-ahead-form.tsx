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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecommendationsAction } from '@/actions/get-recommendations';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  projectHistory: z.string().min(1, "Please provide your project history."),
  interests: z.string().min(1, "Please provide your interests."),
});

type FormValues = z.infer<typeof formSchema>;

const defaultProjectHistory = `1. "AI-driven Drug Discovery for Neuro-diseases" - Focused on using machine learning models to identify potential drug candidates for Alzheimer's disease.
2. "Graphene-based Supercapacitors" - Explored the potential of graphene as a material for high-capacity energy storage devices.`;

const defaultInterests = `Quantum computing, novel materials science, artificial intelligence applications in biology, sustainable energy solutions.`;

export function ResearchAheadForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState('');
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectHistory: defaultProjectHistory,
      interests: defaultInterests,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setRecommendations('');
    const result = await getRecommendationsAction(values);
    if (result.recommendations) {
      setRecommendations(result.recommendations);
    } else {
      toast({
        variant: "destructive",
        title: "Error Getting Recommendations",
        description: result.error || "An unknown error occurred.",
      });
    }
    setIsLoading(false);
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Your Research Profile</CardTitle>
          <CardDescription>
            Tell us about your work and interests to get personalized research suggestions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Past Project History</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={6} placeholder="Summarize your previous research projects..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Interests</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} placeholder="List your current research interests, keywords, or fields of study..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Find New Research
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="flex flex-col sticky top-20">
        <CardHeader>
          <CardTitle className="font-headline">Research Recommendations</CardTitle>
          <CardDescription>
            AI-powered suggestions for your next big project.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow min-h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recommendations ? (
            <div className="rounded-md border p-4 bg-muted/50 h-full max-h-[60vh] overflow-auto">
               <pre className="whitespace-pre-wrap text-sm font-body">{recommendations}</pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground text-center">Your future research path awaits.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
