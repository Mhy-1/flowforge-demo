'use client';

/**
 * Action Node Component
 */

import { memo } from 'react';
import { type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { FlowEditorNode } from '../types';

function ActionNodeComponent(props: NodeProps<FlowEditorNode>) {
  const { data } = props;

  const getUrlPreview = () => {
    if (data.nodeType === 'http-request' && data.properties.url) {
      const url = String(data.properties.url);
      try {
        const parsed = new URL(url);
        return parsed.hostname;
      } catch {
        return url.slice(0, 25) + (url.length > 25 ? '...' : '');
      }
    }
    return null;
  };

  const urlPreview = getUrlPreview();
  const method = data.properties.method as string | undefined;

  return (
    <BaseNode {...props} showInput={true} showOutput={true}>
      <div className="space-y-1.5">
        {method && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/20 text-blue-400">
              {method}
            </span>
            {urlPreview && (
              <span className="text-xs text-text-muted truncate max-w-[100px]">
                {urlPreview}
              </span>
            )}
          </div>
        )}

        {!method && (
          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>-&gt;</span>
            <span>Configure action</span>
          </div>
        )}
      </div>
    </BaseNode>
  );
}

export const ActionNode = memo(ActionNodeComponent);
