import Link from 'next/link';
import { auth, signOut } from '@/auth';

export default async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/90 backdrop-blur-xl transition-all">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.2)] group-hover:scale-105 transition-transform text-sm">
            L
          </div>
          <span className="text-lg font-medium tracking-wide">
            Lumina<span className="font-light text-white/50">Internal</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm text-white/50 hidden md:block">
                Corretor: <strong className="text-white/80">{user.name || user.email}</strong>
              </span>
              
              <Link 
                href="/cadastro" 
                className="text-sm font-medium hover:text-primary transition-colors text-white/80"
              >
                Novo Imóvel
              </Link>
              
              <form
                action={async () => {
                  'use server';
                  await signOut();
                }}
              >
                <button className="text-sm font-medium text-white/40 hover:text-red-400 transition-colors">
                  Sair
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-medium px-4 py-2 rounded-lg transition-all"
              >
                Registrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
