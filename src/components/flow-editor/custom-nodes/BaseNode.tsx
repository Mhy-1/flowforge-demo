'use client';

/**
 * Base Node Component
 * ===================
 * Shared wrapper component for all custom nodes
 */

import { memo, type ReactNode } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';
import type { FlowEditorNode, NodeExecutionStatus } from '../types';
import { categoryStyles } from '../types';

interface BaseNodeProps extends NodeProps<FlowEditorNode> {
  children?: ReactNode;
  showInput?: boolean;
  showOutput?: boolean;
}

/**
 * Execution status indicator configuration
 */
const executionStatusConfig: Record<
  NodeExecutionStatus,
  {
    className: string;
    bgClassName: string;
    animate?: boolean;
    label: string;
  }
> = {
  pending: {
    className: 'text-text-subtle',
    bgClassName: 'bg-surface-active',
    label: 'معلق',
  },
  running: {
    className: 'text-primary',
    bgClassName: 'bg-primary/20',
    animate: true,
    label: 'جاري',
  },
  success: {
    className: 'text-success',
    bgClassName: 'bg-success/20',
    label: 'نجاح',
  },
  error: {
    className: 'text-error',
    bgClassName: 'bg-error/20',
    label: 'خطأ',
  },
  failed: {
    className: 'text-error',
    bgClassName: 'bg-error/20',
    label: 'فشل',
  },
  skipped: {
    className: 'text-text-muted',
    bgClassName: 'bg-surface',
    label: 'تخطي',
  },
};

function BaseNodeComponent({
  data,
  selected,
  showInput = true,
  showOutput = true,
  children,
}: BaseNodeProps) {
  const styles = categoryStyles[data.category];

  return (
    <div
      className={cn(
        'relative min-w-[180px] rounded-lg border-2 transition-all duration-200',
        styles.bg,
        styles.border,
        selected && !data.executionStatus && 'ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent',
        data.executionStatus === 'running' && 'ring-2 ring-primary ring-offset-2 ring-offset-background border-primary animate-pulse',
        data.executionStatus === 'success' && 'border-success',
        data.executionStatus === 'failed' && 'ring-2 ring-error ring-offset-2 ring-offset-background border-error',
        'hover:shadow-lg hover:shadow-black/20'
      )}
    >
      {/* Input Handle - Right side for RTL */}
      {showInput && (
        <Handle
          type="target"
          position={Position.Right}
          id="input"
          className={cn(
            '!w-3 !h-3 !bg-surface-active !border-2 transition-colors',
            '!border-border-accent hover:!border-primary hover:!bg-primary'
          )}
        />
      )}

      {/* Node Content */}
      <div className="p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <div
            className={cn(
              'flex items-center justify-center w-7 h-7 rounded-md text-sm',
              styles.accent,
              'text-white'
            )}
          >
            {data.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-text truncate">{data.label}</h3>
          </div>
          {/* Execution Status Indicator */}
          {data.executionStatus && (
            <div
              className={cn(
                'flex items-center px-1.5 py-0.5 rounded text-xs',
                executionStatusConfig[data.executionStatus].bgClassName,
                executionStatusConfig[data.executionStatus].className
              )}
              title={executionStatusConfig[data.executionStatus].label}
            >
              {data.executionStatus === 'running' && (
                <span className="animate-spin mr-1">*</span>
              )}
              {executionStatusConfig[data.executionStatus].label}
            </div>
          )}
        </div>

        {/* Custom Content */}
        {children && <div className="mt-2 pt-2 border-t border-border-subtle">{children}</div>}

        {/* Validation Errors */}
        {data.errors && data.errors.length > 0 && (
          <div className="mt-2 pt-2 border-t border-error/30">
            {data.errors.map((error, index) => (
              <p key={index} className="text-xs text-error">
                {error}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Output Handle - Left side for RTL */}
      {showOutput && (
        <Handle
          type="source"
          position={Position.Left}
          id="output"
          className={cn(
            '!w-3 !h-3 !bg-surface-active !border-2 transition-colors',
            '!border-border-accent hover:!border-primary hover:!bg-primary'
          )}
        />
      )}

      {/* Category Indicator */}
      <div
        className={cn(
          'absolute -top-px left-3 right-3 h-0.5 rounded-b',
          styles.accent
        )}
      />
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);
