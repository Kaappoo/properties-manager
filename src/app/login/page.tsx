'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BuildingIcon, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email }),
      });
      
      if (res.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center -mt-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10" />
      
      <div className="w-full max-w-md p-8 glass-card border-white/10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(14,165,233,0.15)]">
            <BuildingIcon className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Portal do Corretor</h1>
          <p className="text-sm text-white/50 mt-2">Faça login para acessar o sistema interno</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">E-mail corporativo</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-light"
              placeholder="corretor@lumina.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Senha</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-light"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                Entrar no Sistema
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-white/30">
            Dica: Qualquer credencial é válida nesta simulação.
          </p>
        </div>
      </div>
    </div>
  );
}
