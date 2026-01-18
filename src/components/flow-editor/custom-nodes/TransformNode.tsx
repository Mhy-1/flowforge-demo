'use client';

/**
 * Transform Node Component
 */

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { FlowEditorNode } from '../types';

function TransformNodeComponent(props: NodeProps<FlowEditorNode>) {
  return (
    <BaseNode {...props} showInput={true} showOutput={true}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="text-cyan-400">🔄</span>
          <span>تحويل البيانات</span>
        </div>
      </div>
    </BaseNode>
  );
}

export const TransformNode = memo(TransformNodeComponent);
