'use client';

/**
 * Trigger Node Component
 */

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { FlowEditorNode } from '../types';

function TriggerNodeComponent(props: NodeProps<FlowEditorNode>) {
  const { data } = props;

  return (
    <BaseNode {...props} showInput={false} showOutput={true}>
      {data.properties && Object.keys(data.properties).length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span className="text-emerald-400">▶</span>
            <span>نقطة بداية المسار</span>
          </div>
        </div>
      )}
    </BaseNode>
  );
}

export const TriggerNode = memo(TriggerNodeComponent);
