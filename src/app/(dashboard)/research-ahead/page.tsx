import { ResearchPaperFinder } from "@/components/research/research-paper-finder";

export default function ResearchAheadPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline">Paper Analyzer</h1>
                <p className="text-muted-foreground">Find a research paper on Semantic Scholar and get an instant AI-generated summary.</p>
            </div>
            <ResearchPaperFinder />
        </div>
    );
}
