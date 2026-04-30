'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const registerMutation = trpc.user.register.useMutation({
    onSuccess: () => {
      router.push('/login?registered=true');
    },
    onError: (err) => {
      setError(err.message);
      setLoading(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-white/5 bg-black/40 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
          
          <CardHeader className="relative z-10 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Criar Conta</CardTitle>
            <CardDescription className="text-white/50">Entre para o time de corretores da Lumina.</CardDescription>
          </CardHeader>

          <CardContent className="relative z-10">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="ml-1">Nome Completo</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="João Silva"
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="ml-1">E-mail Corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="joao@lumina.com"
                    className="pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="ml-1">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="pl-12"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full group/btn"
              >
                {loading ? 'Criando conta...' : (
                  <>
                    Registrar
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-white/40">
              Já possui uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Entrar
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
