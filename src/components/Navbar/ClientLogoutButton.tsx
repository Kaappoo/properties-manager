'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function ClientLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/login');
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1.5 rounded-md"
    >
      <LogOut className="w-4 h-4" />
      Sair
    </button>
  );
}
