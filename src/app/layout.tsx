import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Provider from '@/lib/trpc/Provider';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lumina | Imóveis Premium',
  description: 'Gerenciador de catálogo de imóveis de alto padrão para venda e aluguel.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Provider>
          <Navbar />
          <main className="flex-1 w-full relative">
            {children}
          </main>
        </Provider>
      </body>
    </html>
  );
}
