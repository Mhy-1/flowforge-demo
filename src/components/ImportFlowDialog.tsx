'use client';

/**
 * Import Flow Dialog Component
 * ============================
 * Modal for importing flows from JSON files or pasted JSON
 */

import { useState, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { importFlow } from '@/lib/mock-db';
import type { Flow } from '@/types';

interface ImportFlowDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: (flow: Flow) => void;
}

export function ImportFlowDialog({ isOpen, onClose, onImported }: ImportFlowDialogProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(() => {
    if (!jsonInput.trim()) {
      setError('الرجاء لصق JSON أو رفع ملف');
      return;
    }

    try {
      const data = JSON.parse(jsonInput);
      const flow = importFlow(data);
      if (!flow) {
        setError('فشل استيراد المسار. بيانات المسار غير صالحة.');
        return;
      }
      onImported(flow);
      setJsonInput('');
      setError(null);
      onClose();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('تنسيق JSON غير صالح');
      } else {
        setError(err instanceof Error ? err.message : 'فشل استيراد المسار');
      }
    }
  }, [jsonInput, onImported, onClose]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('فشل قراءة الملف');
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file && file.type === 'application/json') {
        handleFileUpload(file);
      } else {
        setError('الرجاء إسقاط ملف JSON');
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-surface border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-muted rounded-lg">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-medium text-text">استيراد مسار</h2>
              <p className="text-xs text-text-muted">
                استيراد مسار من ملف JSON أو لصق JSON
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
              isDragging
                ? 'border-primary bg-primary-muted/20'
                : 'border-border hover:border-border-accent'
            )}
          >
            <svg
              className="w-10 h-10 mx-auto mb-3 text-text-subtle"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-text-muted mb-2">
              اسحب وأفلت ملف JSON هنا، أو
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary hover:text-primary-hover font-medium"
            >
              تصفح الملفات
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-subtle">أو الصق JSON</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* JSON Input */}
          <textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError(null);
            }}
            placeholder='{"name": "My Flow", "nodes": [...], "edges": [...]}'
            rows={6}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono resize-none"
          />

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border-subtle">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonInput.trim()}
            className="px-4 py-2 text-sm bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            استيراد المسار
          </button>
        </div>
      </div>
    </div>
  );
}
