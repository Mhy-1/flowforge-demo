'use client';

/**
 * Output Node Component
 */

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { FlowEditorNode } from '../types';

function OutputNodeComponent(props: NodeProps<FlowEditorNode>) {
  const { data } = props;

  const logLevel = data.properties.logLevel as string | undefined;
  const message = data.properties.message as string | undefined;

  const getLevelStyles = (level: string) => {
    switch (level) {
      case 'debug':
        return 'bg-gray-500/20 text-gray-400';
      case 'info':
        return 'bg-blue-500/20 text-blue-400';
      case 'warn':
        return 'bg-amber-500/20 text-amber-400';
      case 'error':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      debug: 'تصحيح',
      info: 'معلومات',
      warn: 'تحذير',
      error: 'خطأ',
    };
    return labels[level] || level;
  };

  return (
    <BaseNode {...props} showInput={true} showOutput={true}>
      <div className="space-y-1.5">
        {logLevel && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getLevelStyles(
                logLevel
              )}`}
            >
              {getLevelLabel(logLevel)}
            </span>
          </div>
        )}

        {message && (
          <div className="flex items-start gap-1.5 text-xs text-text-muted">
            <span className="text-purple-400">#</span>
            <span className="truncate max-w-[120px]">{message}</span>
          </div>
        )}

        {!logLevel && !message && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-purple-400">◀</span>
            <span>نقطة نهاية المسار</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export const OutputNode = memo(OutputNodeComponent);
