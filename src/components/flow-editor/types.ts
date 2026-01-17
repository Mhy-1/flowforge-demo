/**
 * Flow Editor Types
 * =================
 * Type definitions for the visual flow editor
 */

import type { Node, Edge } from '@xyflow/react';
import type { NodeDefinition, FlowNode, FlowEdge, NodeCategory } from '@/types';

/**
 * Node execution status during flow run
 */
export type NodeExecutionStatus = 'pending' | 'running' | 'success' | 'error' | 'failed' | 'skipped';

/**
 * Extended node data for React Flow
 */
export interface FlowNodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
  category: NodeCategory;
  icon: string;
  properties: Record<string, unknown>;
  isSelected?: boolean;
  isExecuting?: boolean;
  errors?: string[];
  credentialStatus?: 'configured' | 'missing' | 'none';
  executionStatus?: NodeExecutionStatus;
}

/**
 * React Flow node type with our custom data
 */
export type FlowEditorNode = Node<FlowNodeData>;

/**
 * React Flow edge type
 */
export type FlowEditorEdge = Edge;

/**
 * Node palette item for drag and drop
 */
export interface PaletteItem {
  definition: NodeDefinition;
  category: NodeCategory;
}

/**
 * Grouped palette items by category
 */
export interface PaletteGroup {
  category: NodeCategory;
  label: string;
  icon: string;
  items: PaletteItem[];
}

/**
 * Flow editor state
 */
export interface FlowEditorState {
  nodes: FlowEditorNode[];
  edges: FlowEditorEdge[];
  selectedNodeId: string | null;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Convert FlowForge nodes/edges to React Flow format
 */
export function toReactFlowNodes(nodes: FlowNode[], definitions: Map<string, NodeDefinition>): FlowEditorNode[] {
  return nodes.map((node) => {
    const nodeType = node.type || (node.data?.nodeType as string);
    const definition = definitions.get(nodeType);
    return {
      id: node.id,
      type: (node.data?.category as string) || definition?.category || 'action',
      position: node.position,
      data: {
        nodeType: nodeType,
        label: node.label || (node.data?.label as string) || definition?.name || nodeType,
        category: (node.data?.category as NodeCategory) || definition?.category || 'action',
        icon: (node.data?.icon as string) || definition?.icon || '?',
        properties: (node.data?.properties as Record<string, unknown>) || node.data || {},
      },
    };
  });
}

export function toReactFlowEdges(edges: FlowEdge[]): FlowEditorEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    sourceHandle: edge.sourceHandle,
    target: edge.target,
    targetHandle: edge.targetHandle,
    label: edge.label,
    animated: edge.animated,
  }));
}

/**
 * Convert React Flow format back to FlowForge format
 */
export function fromReactFlowNodes(nodes: FlowEditorNode[]): FlowNode[] {
  return nodes.map((node) => ({
    id: node.id,
    type: node.data.nodeType,
    position: node.position,
    data: {
      nodeType: node.data.nodeType,
      label: node.data.label,
      category: node.data.category,
      icon: node.data.icon,
      properties: node.data.properties,
    },
    label: node.data.label,
  }));
}

export function fromReactFlowEdges(edges: FlowEditorEdge[]): FlowEdge[] {
  return edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    sourceHandle: edge.sourceHandle || 'output',
    target: edge.target,
    targetHandle: edge.targetHandle || 'input',
    label: typeof edge.label === 'string' ? edge.label : undefined,
    animated: edge.animated,
  }));
}

/**
 * Category styling configuration
 */
export const categoryStyles: Record<NodeCategory, { bg: string; border: string; text: string; accent: string }> = {
  trigger: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    accent: 'bg-emerald-500',
  },
  action: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    accent: 'bg-blue-500',
  },
  logic: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    accent: 'bg-amber-500',
  },
  output: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    accent: 'bg-purple-500',
  },
  transform: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    accent: 'bg-cyan-500',
  },
};

/**
 * Category labels and icons
 */
export const categoryConfig: Record<NodeCategory, { label: string; icon: string }> = {
  trigger: { label: 'Triggers', icon: 'Zap' },
  action: { label: 'Actions', icon: 'Play' },
  logic: { label: 'Logic', icon: 'GitBranch' },
  output: { label: 'Outputs', icon: 'Send' },
  transform: { label: 'Transform', icon: 'RefreshCw' },
};
