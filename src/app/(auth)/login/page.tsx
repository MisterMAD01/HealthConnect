'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, User, Shield, Hospital } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

const roles = [
  { name: 'Patient', icon: User },
  { name: 'Doctor', icon: Stethoscope },
  { name: 'Hospital Admin', icon: Hospital },
];

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const logo = PlaceHolderImages.find(img => img.id === 'logo');

  useEffect(() => {
    setIsClient(true);
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = (role: 'Patient' | 'Doctor' | 'Hospital Admin') => {
    login(role);
  };

  if (loading || (isClient && user)) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
       <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            {logo && (
              <Image 
                src={logo.imageUrl}
                alt={logo.description}
                width={80}
                height={80}
                data-ai-hint={logo.imageHint}
                className="rounded-full"
              />
            )}
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome to HealthConnect</CardTitle>
          <CardDescription>Your integrated healthcare platform. Please select your role to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roles.map((role) => (
              <Button
                key={role.name}
                onClick={() => handleLogin(role.name as 'Patient' | 'Doctor' | 'Hospital Admin')}
                className="w-full justify-start text-base py-6 transition-transform hover:scale-105"
                variant="outline"
              >
                <role.icon className="mr-4 h-6 w-6 text-primary" />
                <span>Sign in as {role.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} HealthConnect. All rights reserved.</p>
        <p className="mt-1">A secure and reliable healthcare solution.</p>
      </footer>
    </div>
  );
}
