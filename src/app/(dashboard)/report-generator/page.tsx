import { ReportGeneratorForm } from "@/components/report/report-generator-form";

export default function ReportGeneratorPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold font-headline">Report Generator</h1>
                <p className="text-muted-foreground">Automatically create detailed project reports using AI.</p>
            </div>
            <ReportGeneratorForm />
        </div>
    );
}
