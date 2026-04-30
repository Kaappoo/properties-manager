import type { Metadata } from 'next';
import { Outfit, Geist } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import Provider from '@/lib/trpc/Provider';
import { auth } from '@/auth';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumina | Dashboard Interno',
  description: 'Sistema de gestão de imóveis premium.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", outfit.variable, "font-sans", geist.variable)}>
      <body className="h-full bg-background text-foreground overflow-hidden">
        <Provider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar user={session?.user} />
            <main className="flex-1 overflow-y-auto bg-[#0a0a0a] relative">
              {children}
            </main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
