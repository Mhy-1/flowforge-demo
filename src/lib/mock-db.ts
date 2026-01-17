/**
 * Mock Database Layer
 * ===================
 * localStorage-based CRUD operations for demo mode
 */

import type { Flow, Run } from '@/types';
import { generateId } from './utils';

const STORAGE_KEYS = {
  FLOWS: 'flowforge-demo-flows',
  RUNS: 'flowforge-demo-runs',
} as const;

// ============================================
// FLOW OPERATIONS
// ============================================

/**
 * Get all flows from localStorage
 */
export function getFlows(): Flow[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.FLOWS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get a single flow by ID
 */
export function getFlow(id: string): Flow | null {
  const flows = getFlows();
  return flows.find(f => f.id === id) || null;
}

/**
 * Create a new flow
 */
export function createFlow(flow: Omit<Flow, 'id' | 'createdAt' | 'updatedAt'>): Flow {
  const flows = getFlows();
  const now = new Date().toISOString();

  const newFlow: Flow = {
    ...flow,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };

  flows.push(newFlow);
  localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(flows));

  return newFlow;
}

/**
 * Update an existing flow
 */
export function updateFlow(id: string, updates: Partial<Omit<Flow, 'id' | 'createdAt'>>): Flow | null {
  const flows = getFlows();
  const index = flows.findIndex(f => f.id === id);

  if (index === -1) return null;

  const updatedFlow: Flow = {
    ...flows[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  flows[index] = updatedFlow;
  localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(flows));

  return updatedFlow;
}

/**
 * Delete a flow
 */
export function deleteFlow(id: string): boolean {
  const flows = getFlows();
  const filtered = flows.filter(f => f.id !== id);

  if (filtered.length === flows.length) return false;

  localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(filtered));

  // Also delete associated runs
  const runs = getRuns();
  const filteredRuns = runs.filter(r => r.flowId !== id);
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(filteredRuns));

  return true;
}

/**
 * Duplicate a flow
 */
export function duplicateFlow(id: string): Flow | null {
  const flow = getFlow(id);
  if (!flow) return null;

  return createFlow({
    name: `${flow.name} (Copy)`,
    description: flow.description,
    nodes: flow.nodes,
    edges: flow.edges,
    settings: flow.settings,
    status: 'draft',
  });
}

// ============================================
// RUN OPERATIONS
// ============================================

/**
 * Get all runs from localStorage
 */
export function getRuns(): Run[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEYS.RUNS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Get runs for a specific flow
 */
export function getFlowRuns(flowId: string): Run[] {
  return getRuns().filter(r => r.flowId === flowId);
}

/**
 * Get a single run by ID
 */
export function getRun(id: string): Run | null {
  const runs = getRuns();
  return runs.find(r => r.id === id) || null;
}

/**
 * Create a new run
 */
export function createRun(run: Omit<Run, 'id' | 'createdAt'>): Run {
  const runs = getRuns();

  const newRun: Run = {
    ...run,
    id: generateId(),
    createdAt: new Date().toISOString(),
  };

  runs.unshift(newRun); // Add to beginning (most recent first)

  // Keep only last 50 runs
  const trimmedRuns = runs.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(trimmedRuns));

  return newRun;
}

/**
 * Update a run
 */
export function updateRun(id: string, updates: Partial<Omit<Run, 'id' | 'createdAt'>>): Run | null {
  const runs = getRuns();
  const index = runs.findIndex(r => r.id === id);

  if (index === -1) return null;

  const updatedRun: Run = {
    ...runs[index],
    ...updates,
  };

  runs[index] = updatedRun;
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(runs));

  return updatedRun;
}

// ============================================
// STATS
// ============================================

/**
 * Get dashboard statistics
 */
export function getStats() {
  const flows = getFlows();
  const runs = getRuns();

  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentRuns = runs.filter(r => new Date(r.createdAt) > last24h);
  const successfulRuns = recentRuns.filter(r => r.status === 'success');
  const failedRuns = recentRuns.filter(r => r.status === 'failed');

  return {
    totalFlows: flows.length,
    activeFlows: flows.filter(f => f.status === 'active').length,
    totalRuns: runs.length,
    runsLast24h: recentRuns.length,
    successRate: recentRuns.length > 0
      ? Math.round((successfulRuns.length / recentRuns.length) * 100)
      : 100,
    failedRuns: failedRuns.length,
  };
}

// ============================================
// IMPORT/EXPORT
// ============================================

/**
 * Export a flow as JSON
 */
export function exportFlow(id: string): string | null {
  const flow = getFlow(id);
  if (!flow) return null;

  // Remove internal IDs for export
  const exportData = {
    name: flow.name,
    description: flow.description,
    nodes: flow.nodes,
    edges: flow.edges,
    settings: flow.settings,
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import a flow from JSON
 */
export function importFlow(jsonString: string): Flow | null {
  try {
    const data = JSON.parse(jsonString);

    // Validate required fields
    if (!data.name || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
      throw new Error('Invalid flow format');
    }

    return createFlow({
      name: data.name,
      description: data.description || '',
      nodes: data.nodes,
      edges: data.edges,
      settings: data.settings || {},
      status: 'draft',
    });
  } catch {
    return null;
  }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Check if demo data needs to be initialized
 */
export function needsInitialization(): boolean {
  if (typeof window === 'undefined') return false;
  return getFlows().length === 0;
}

/**
 * Initialize with sample data
 */
export function initializeSampleData(): void {
  // Import sample flows
  const { sampleFlows } = require('@/data/mock-flows');
  const { sampleRuns } = require('@/data/mock-runs');

  localStorage.setItem(STORAGE_KEYS.FLOWS, JSON.stringify(sampleFlows));
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(sampleRuns));
}

/**
 * Initialize mock data if needed (called on app start)
 */
export function initializeMockData(): void {
  if (needsInitialization()) {
    initializeSampleData();
  }
}

/**
 * Add a run to storage (alias for createRun)
 */
export function addRun(run: Run): void {
  const runs = getRuns();
  runs.unshift(run);
  const trimmedRuns = runs.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.RUNS, JSON.stringify(trimmedRuns));
}
