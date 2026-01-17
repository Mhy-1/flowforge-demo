'use client';

/**
 * Flow Canvas Component
 * =====================
 * Main React Flow canvas with zoom, pan, minimap, and connection handling
 */

import { useCallback, useRef, type DragEvent } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  type ReactFlowInstance,
  type Connection,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { cn } from '@/lib/utils';
import { nodeTypes } from './custom-nodes';
import type { FlowEditorNode, FlowEditorEdge, FlowNodeData } from './types';
import type { NodeDefinition, NodeCategory } from '@/types';

type FlowInstance = ReactFlowInstance<FlowEditorNode, FlowEditorEdge>;

interface FlowCanvasProps {
  nodes: FlowEditorNode[];
  edges: FlowEditorEdge[];
  nodeDefinitions: Map<string, NodeDefinition>;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: FlowEditorNode) => void;
  onPaneClick: () => void;
  onInit: (instance: FlowInstance) => void;
  onNodeAdd: (nodeType: string, position: { x: number; y: number }, data: FlowNodeData) => void;
  className?: string;
}

export function FlowCanvas({
  nodes,
  edges,
  nodeDefinitions,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onInit,
  onNodeAdd,
  className,
}: FlowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<FlowInstance | null>(null);

  const handleInit = useCallback(
    (instance: FlowInstance) => {
      reactFlowInstance.current = instance;
      onInit(instance);
    },
    [onInit]
  );

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData('application/reactflow');
      if (!data || !reactFlowInstance.current || !reactFlowWrapper.current) {
        return;
      }

      try {
        const nodeData = JSON.parse(data);
        const { type, nodeType, name, icon, category } = nodeData;

        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
        });

        const definition = nodeDefinitions.get(nodeType);
        const defaultProperties = definition?.defaults || {};

        const flowNodeData: FlowNodeData = {
          nodeType,
          label: name,
          category: category as NodeCategory,
          icon,
          properties: { ...defaultProperties },
        };

        onNodeAdd(type, position, flowNodeData);
      } catch (error) {
        console.error('Failed to drop node:', error);
      }
    },
    [nodeDefinitions, onNodeAdd]
  );

  const isValidConnection = useCallback(
    (connection: Connection | FlowEditorEdge) => {
      if (connection.source === connection.target) {
        return false;
      }

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);

      if (!sourceNode || !targetNode) {
        return false;
      }

      if (sourceNode.data.category === 'trigger' && targetNode.data.category === 'trigger') {
        return false;
      }

      return true;
    },
    [nodes]
  );

  const getMinimapNodeColor = useCallback((node: FlowEditorNode) => {
    const category = node.data.category;
    const styleMap: Record<NodeCategory, string> = {
      trigger: '#22c55e',
      action: '#3b82f6',
      logic: '#f59e0b',
      output: '#a855f7',
      transform: '#06b6d4',
    };
    return styleMap[category] || '#6366f1';
  }, []);

  return (
    <div ref={reactFlowWrapper} className={cn('flex-1 h-full', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes as NodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onInit={handleInit}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        isValidConnection={isValidConnection}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: false,
          style: {
            stroke: '#3a3a4f',
            strokeWidth: 2,
          },
        }}
        connectionLineStyle={{
          stroke: '#6366f1',
          strokeWidth: 2,
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#2a2a3a"
        />

        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          position="bottom-right"
          className="!bg-surface !border-border !shadow-lg"
        />

        <MiniMap
          nodeColor={getMinimapNodeColor}
          maskColor="rgba(10, 10, 15, 0.8)"
          position="bottom-left"
          className="!bg-surface !border-border !shadow-lg"
          style={{ width: 150, height: 100 }}
        />

        {nodes.length === 0 && (
          <Panel position="top-center" className="mt-32">
            <div className="text-center p-8 bg-surface/80 backdrop-blur-sm rounded-xl border border-border-subtle">
              <div className="w-16 h-16 rounded-full bg-primary-muted flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-text mb-2">Start building your flow</h3>
              <p className="text-sm text-text-muted max-w-xs">
                Drag nodes from the left panel to the canvas, then connect them to create your workflow.
              </p>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
