import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DemoBadge } from '@/components/DemoBadge';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlowForge Demo - Visual Workflow Builder',
  description: 'A visual workflow automation builder. Create, edit, and execute workflows with a drag-and-drop interface. Demo version with localStorage persistence.',
  keywords: ['workflow', 'automation', 'visual editor', 'drag and drop', 'flowforge'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <DemoBadge />
      </body>
    </html>
  );
}
