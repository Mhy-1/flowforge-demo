'use client';

/**
 * Footer Component
 * ================
 * Copyright footer with demo badge
 */

import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // The editor is a fixed full-screen (h-screen) app view; a footer appended
  // after it would add extra height below the viewport and enable a stray
  // page-level scroll that reveals a sliver of footer under the canvas.
  if (pathname?.startsWith('/editor')) {
    return null;
  }

  return (
    <footer className="border-t border-border bg-surface py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded text-xs font-medium">
            نسخة تجريبية
          </span>
          <span className="text-sm text-text-muted">
            البيانات محفوظة في المتصفح فقط
          </span>
        </div>
        <p className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} م. مشاري دعجم
        </p>
      </div>
    </footer>
  );
}
