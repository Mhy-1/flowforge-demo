import type { Metadata } from 'next';
import { Cairo, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { DemoBadge } from '@/components/DemoBadge';
import { Footer } from '@/components/Footer';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'فلو فورج - منشئ سير العمل البصري',
  description: 'منشئ سير عمل مرئي للأتمتة. قم بإنشاء وتعديل وتنفيذ سير العمل بواجهة سحب وإفلات. نسخة تجريبية مع حفظ محلي.',
  keywords: ['سير العمل', 'أتمتة', 'محرر بصري', 'سحب وإفلات', 'فلو فورج'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className={`${cairo.variable} ${jetbrainsMono.variable} font-sans`}>
        {children}
        <Footer />
        <DemoBadge />
      </body>
    </html>
  );
}
