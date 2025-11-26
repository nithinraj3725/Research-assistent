import { LoginForm } from '@/components/auth/login-form';
import { Beaker } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-full mb-4">
            <Beaker className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-headline font-bold text-center">
            Welcome to Research Hub
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Sign in to manage your research projects.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
