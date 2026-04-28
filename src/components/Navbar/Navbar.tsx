import Link from 'next/link';
import { cookies } from 'next/headers';
import ClientLogoutButton from './ClientLogoutButton';

export default async function Navbar() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('user-name')?.value;

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
        
        {userName && (
          <div className="flex items-center gap-6">
            <span className="text-sm text-white/50 hidden md:block">
              Corretor: <strong className="text-white/80">{userName}</strong>
            </span>
            
            <Link 
              href="/cadastro" 
              className="text-sm font-medium hover:text-primary transition-colors text-white/80"
            >
              Novo Imóvel
            </Link>
            
            <ClientLogoutButton />
          </div>
        )}
      </div>
    </header>
  );
}
