'use client';

/**
 * Logic Node Component
 */

import { memo } from 'react';
import { type NodeProps, Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import type { FlowEditorNode } from '../types';
import { categoryStyles } from '../types';

function LogicNodeComponent(props: NodeProps<FlowEditorNode>) {
  const { data, selected } = props;
  const styles = categoryStyles[data.category];

  return (
    <div
      className={cn(
        'relative min-w-[180px] rounded-lg border-2 transition-all duration-200',
        styles.bg,
        styles.border,
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent',
        'hover:shadow-lg hover:shadow-black/20'
      )}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className={cn(
          '!w-3 !h-3 !bg-surface-active !border-2 transition-colors',
          '!border-border-accent hover:!border-primary hover:!bg-primary'
        )}
      />

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
        </div>

        {/* Logic indicator */}
        <div className="mt-2 pt-2 border-t border-border-subtle">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-amber-400">/</span>
            <span>Conditional branching</span>
          </div>
        </div>
      </div>

      {/* Multiple Output Handles for branches */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: '35%' }}
        className={cn(
          '!w-3 !h-3 !bg-success !border-2 transition-colors',
          '!border-success/50 hover:!border-success'
        )}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: '65%' }}
        className={cn(
          '!w-3 !h-3 !bg-error !border-2 transition-colors',
          '!border-error/50 hover:!border-error'
        )}
      />

      {/* Branch Labels */}
      <div className="absolute right-6 top-[35%] -translate-y-1/2 text-[10px] text-success font-medium">
        TRUE
      </div>
      <div className="absolute right-6 top-[65%] -translate-y-1/2 text-[10px] text-error font-medium">
        FALSE
      </div>

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

export const LogicNode = memo(LogicNodeComponent);
