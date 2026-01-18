'use client';

/**
 * Flow Toolbar Component
 * ======================
 * Top toolbar with flow name, save, run, and utility actions
 */

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { Flow, Run } from '@/types';

interface FlowToolbarProps {
  flow: Flow;
  isRunning: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastRun?: Run;
  onSave: () => void;
  onRun: () => void;
  onExport: () => void;
  onImport: () => void;
  onNameChange: (name: string) => void;
  onBack: () => void;
  className?: string;
}

export function FlowToolbar({
  flow,
  isRunning,
  isSaving,
  hasUnsavedChanges,
  lastRun,
  onSave,
  onRun,
  onExport,
  onImport,
  onNameChange,
  onBack,
  className,
}: FlowToolbarProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(flow.name);

  const handleNameSubmit = useCallback(() => {
    if (editName.trim() && editName !== flow.name) {
      onNameChange(editName.trim());
    } else {
      setEditName(flow.name);
    }
    setIsEditingName(false);
  }, [editName, flow.name, onNameChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleNameSubmit();
      } else if (e.key === 'Escape') {
        setEditName(flow.name);
        setIsEditingName(false);
      }
    },
    [handleNameSubmit, flow.name]
  );

  const getStatusColor = () => {
    if (isRunning) return 'bg-amber-500';
    if (lastRun?.status === 'completed') return 'bg-green-500';
    if (lastRun?.status === 'failed') return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getStatusText = () => {
    if (isRunning) return 'جاري التشغيل...';
    if (lastRun?.status === 'completed') return 'آخر تشغيل: نجاح';
    if (lastRun?.status === 'failed') return 'آخر تشغيل: فشل';
    return 'لم يتم التشغيل';
  };

  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-3 border-b border-border bg-surface',
        className
      )}
    >
      {/* Left Section - Back & Flow Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
          aria-label="العودة للوحة التحكم"
        >
          <svg
            className="w-4 h-4 rtl-flip"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>رجوع</span>
        </button>

        <div className="h-6 w-px bg-border" />

        {isEditingName ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={handleKeyDown}
            className="px-2 py-1 text-lg font-medium bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary text-text"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="flex items-center gap-2 text-lg font-medium text-text hover:text-primary transition-colors group"
          >
            {flow.name}
            <svg
              className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        )}

        {hasUnsavedChanges && (
          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
            غير محفوظ
          </span>
        )}
      </div>

      {/* Center Section - Status */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <span className={cn('w-2 h-2 rounded-full', getStatusColor())} />
        <span>{getStatusText()}</span>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-2">
        {/* Import */}
        <button
          onClick={onImport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          title="استيراد مسار"
        >
          <svg
            className="w-4 h-4"
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
          <span>استيراد</span>
        </button>

        {/* Export */}
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
          title="تصدير مسار"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>تصدير</span>
        </button>

        <div className="h-6 w-px bg-border mx-1" />

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
          className={cn(
            'flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg transition-colors',
            hasUnsavedChanges
              ? 'bg-surface-hover text-text hover:bg-border'
              : 'bg-surface-hover/50 text-text-subtle cursor-not-allowed'
          )}
        >
          {isSaving ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span>حفظ</span>
            </>
          )}
        </button>

        {/* Run */}
        <button
          onClick={onRun}
          disabled={isRunning}
          className={cn(
            'flex items-center gap-1.5 px-4 py-1.5 text-sm rounded-lg transition-colors',
            isRunning
              ? 'bg-amber-500/20 text-amber-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-hover text-white'
          )}
        >
          {isRunning ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>جاري التشغيل...</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>تشغيل</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
