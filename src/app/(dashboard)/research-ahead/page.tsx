import { ResearchAheadForm } from "@/components/research/research-ahead-form";

export default function ResearchAheadPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline">Research Ahead</h1>
                <p className="text-muted-foreground">Get personalized research recommendations and insights.</p>
            </div>
            <ResearchAheadForm />
        </div>
    );
}
