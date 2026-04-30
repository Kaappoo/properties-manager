'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Building2, label: 'Imóveis', href: '/' },
  { icon: Users, label: 'Construtoras', href: '/construtoras' },
  { icon: PlusCircle, label: 'Novo Imóvel', href: '/cadastro' },
  { icon: Settings, label: 'Configurações', href: '#', disabled: true },
];

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  if (isAuthPage) return null;

  return (
    <aside className="w-64 h-screen sticky top-0 bg-neutral-950 border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(14,165,233,0.3)] group-hover:scale-105 transition-transform">
            L
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Lumina<span className="text-primary">.</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto mt-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.disabled ? '#' : item.href}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl transition-all group
                ${isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                }
                ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-white/40 group-hover:text-white/70'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4" />}
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-white/5 space-y-4">
        {user ? (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/40 to-emerald-400/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white uppercase">
                {user.name?.[0] || user.email?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{user.name || 'Broker'}</p>
                <p className="text-[10px] text-white/40 truncate">{user.email}</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => signOut()}
              className="w-full text-xs hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair do Sistema
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-xs font-medium hover:bg-white/10 transition-all"
            >
              Registrar
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
