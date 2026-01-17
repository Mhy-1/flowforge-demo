'use client';

/**
 * Execution Panel Component
 * =========================
 * Bottom panel showing real-time execution logs and status
 */

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { ExecutionLog, Run } from '@/types';

interface ExecutionPanelProps {
  isRunning: boolean;
  currentRun: Run | null;
  logs: ExecutionLog[];
  onClear: () => void;
  className?: string;
}

export function ExecutionPanel({
  isRunning,
  currentRun,
  logs,
  onClear,
  className,
}: ExecutionPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [height, setHeight] = useState(200);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsEndRef.current && isExpanded) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  // Auto-expand when running starts
  useEffect(() => {
    if (isRunning) {
      setIsExpanded(true);
    }
  }, [isRunning]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;

    const startY = e.clientY;
    const startHeight = height;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaY = startY - moveEvent.clientY;
      const newHeight = Math.min(Math.max(startHeight + deltaY, 100), 500);
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const getLogLevelStyles = (level: ExecutionLog['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400 bg-red-500/10';
      case 'warn':
        return 'text-amber-400 bg-amber-500/10';
      case 'info':
        return 'text-blue-400 bg-blue-500/10';
      case 'debug':
        return 'text-gray-400 bg-gray-500/10';
      default:
        return 'text-gray-400 bg-gray-500/10';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div
      className={cn('border-t border-border bg-surface flex flex-col', className)}
      style={{ height: isExpanded ? height : 40 }}
    >
      {/* Resize Handle */}
      {isExpanded && (
        <div
          className="h-1 cursor-ns-resize hover:bg-primary/50 transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-sm font-medium text-text hover:text-primary transition-colors"
          >
            <svg
              className={cn('w-4 h-4 transition-transform', isExpanded && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span>Execution Logs</span>
          </button>

          {isRunning && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span>Running</span>
            </div>
          )}

          {!isRunning && currentRun && (
            <span
              className={cn(
                'text-xs px-2 py-0.5 rounded',
                currentRun.status === 'completed'
                  ? 'text-green-400 bg-green-500/10'
                  : 'text-red-400 bg-red-500/10'
              )}
            >
              {currentRun.status === 'completed' ? 'Completed' : 'Failed'}
            </span>
          )}

          <span className="text-xs text-text-subtle">
            {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <button
          onClick={onClear}
          disabled={logs.length === 0}
          className="text-xs text-text-muted hover:text-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Logs */}
      {isExpanded && (
        <div className="flex-1 overflow-auto font-mono text-xs p-2 space-y-0.5">
          {logs.length === 0 ? (
            <div className="flex items-center justify-center h-full text-text-subtle">
              <p>No logs yet. Run the flow to see execution logs.</p>
            </div>
          ) : (
            <>
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 px-2 py-1 rounded hover:bg-surface-hover"
                >
                  <span className="text-text-subtle shrink-0">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] uppercase font-medium shrink-0',
                      getLogLevelStyles(log.level)
                    )}
                  >
                    {log.level}
                  </span>
                  {log.nodeId && (
                    <span className="text-primary shrink-0">[{log.nodeId.slice(0, 8)}]</span>
                  )}
                  <span className="text-text flex-1 break-all">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
