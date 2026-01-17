/**
 * FlowForge Demo Types
 * ====================
 * All TypeScript interfaces for the demo workflow editor
 */

// ============================================
// NODE TYPES
// ============================================

/**
 * Categories of nodes
 */
export type NodeCategory = 'trigger' | 'action' | 'logic' | 'output' | 'transform';

/**
 * Property types for node configuration
 */
export type PropertyType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'select'
  | 'multiSelect'
  | 'json'
  | 'code'
  | 'expression'
  | 'credential';

/**
 * Definition of a property that can be configured on a node
 */
export interface PropertyDefinition {
  name: string;
  displayName: string;
  label?: string; // Alias for displayName (UI compat)
  type: PropertyType;
  description?: string;
  required?: boolean;
  default?: unknown;
  placeholder?: string;
  min?: number;
  max?: number;
  options?: Array<{
    name: string;
    value: string | number;
    label?: string;
    description?: string;
  }>;
  displayOptions?: {
    show?: Record<string, unknown[]>;
    hide?: Record<string, unknown[]>;
  };
  credentialType?: string;
}

/**
 * Handle definition for node connections
 */
export interface HandleDefinition {
  id: string;
  type: 'input' | 'output';
  label?: string;
  dataType?: string;
  multiple?: boolean;
}

/**
 * Node definition - the blueprint for a node type
 */
export interface NodeDefinition {
  id: string;
  name: string;
  description: string;
  category: NodeCategory;
  icon: string;
  version: number;
  inputs: HandleDefinition[];
  outputs: HandleDefinition[];
  properties: PropertyDefinition[];
  defaults?: Record<string, unknown>;
  credentials?: Array<{
    name: string;
    required: boolean;
    description?: string;
  }>;
}

// ============================================
// FLOW TYPES
// ============================================

/**
 * Flow status
 */
export type FlowStatus = 'draft' | 'active' | 'paused' | 'archived';

/**
 * A node instance within a flow
 */
export interface FlowNode {
  id: string;
  type: string;
  nodeType?: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    nodeType: string;
    label: string;
    category: NodeCategory;
    icon: string;
    properties: Record<string, unknown>;
    isExecuting?: boolean;
    executionStatus?: 'success' | 'error';
  };
  label?: string;
}

/**
 * Connection between two nodes
 */
export interface FlowEdge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  label?: string;
  animated?: boolean;
}

/**
 * Flow settings
 */
export interface FlowSettings {
  timeout?: number;
  retryOnFail?: boolean;
  retryCount?: number;
  retryDelayMs?: number;
  saveToHistory?: boolean;
  notifyOnSuccess?: boolean;
  notifyOnFailure?: boolean;
}

/**
 * Complete flow definition
 */
export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  settings: FlowSettings;
  status: FlowStatus;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// RUN TYPES (Demo Mock)
// ============================================

/**
 * Run status
 */
export type RunStatus = 'pending' | 'running' | 'success' | 'completed' | 'failed' | 'cancelled';

/**
 * Log level
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Trigger type
 */
export type TriggerType = 'manual' | 'webhook' | 'schedule' | 'event';

/**
 * Execution log entry
 */
export interface LogEntry {
  id: string;
  runId: string;
  nodeId: string;
  nodeName?: string;
  level: LogLevel;
  message: string;
  data?: unknown;
  createdAt: string;
}

/**
 * Flow run (execution instance)
 */
export interface Run {
  id: string;
  flowId: string;
  flowName: string;
  status: RunStatus;
  triggerType: TriggerType;
  logs: LogEntry[];
  error?: string;
  startedAt?: string;
  finishedAt?: string;
  completedAt?: string;
  durationMs?: number;
  createdAt: string;
}

/**
 * Simplified execution log for UI
 */
export interface ExecutionLog {
  timestamp: string;
  level: LogLevel;
  message: string;
  nodeId?: string;
  data?: unknown;
}
