import type { Metadata } from 'next';
import { Share_Tech, Montserrat, Poppins, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import '../styles/theme.css';
import { ReactNode } from 'react';

const shareTech = Share_Tech({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-heading',
});

const montserrat = Montserrat({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-body',
});

const poppins = Poppins({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-ui',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: "Sunday's Studios System Map",
  description: "Interactive whiteboard mapping Sunday's Studios ecosystem and proposed architecture.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className={`${shareTech.variable} ${montserrat.variable} ${poppins.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">
        <div className="flex h-screen flex-col overflow-hidden">
          {/* Top header */}
          <header className="flex items-center justify-between border-b border-border-light bg-card px-6 py-4 dark:border-border-dark dark:bg-card-dark">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-accent-primary" />
                <h1 className="font-heading text-2xl font-bold tracking-tight">
                  Sunday&apos;s <span className="text-accent-primary">System Map</span>
                </h1>
              </div>
              <div className="hidden text-sm text-muted-foreground md:block">
                Interactive architecture diagram — 40 franchise locations
              </div>
            </div>
          </header>
          <main className="flex flex-1 overflow-hidden">
            {children}
          </main>
          <footer className="border-t border-border-light bg-card px-6 py-3 text-center text-xs text-muted-foreground dark:border-border-dark dark:bg-card-dark">
            <span className="font-ui">Sunday&apos;s Studios</span> • System Architecture Map
          </footer>
        </div>
      </body>
    </html>
  );
}
