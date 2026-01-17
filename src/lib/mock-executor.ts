/**
 * Mock Flow Executor
 * ==================
 * Simulates flow execution with fake processing and logs
 */

import type { Flow, Run, LogEntry, RunStatus, LogLevel, FlowNode } from '@/types';
import { generateId, delay } from './utils';
import { createRun, updateRun, getFlow } from './mock-db';

interface ExecutionCallbacks {
  onLog: (log: LogEntry) => void;
  onNodeStart: (nodeId: string) => void;
  onNodeComplete: (nodeId: string, success: boolean) => void;
  onComplete: (run: Run) => void;
}

/**
 * Create a log entry
 */
function createLog(
  runId: string,
  nodeId: string,
  nodeName: string,
  level: LogLevel,
  message: string,
  data?: unknown
): LogEntry {
  return {
    id: generateId(),
    runId,
    nodeId,
    nodeName,
    level,
    message,
    data,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Get simulated node execution messages based on node type
 */
function getNodeExecutionMessages(node: FlowNode): { start: string; complete: string; data?: unknown } {
  const nodeType = node.type || (node.data?.nodeType as string) || 'unknown';
  const label = node.label || (node.data?.label as string) || nodeType;

  switch (nodeType) {
    case 'manual-trigger':
      return {
        start: 'Manual trigger activated',
        complete: 'Trigger data passed to next node',
        data: { triggered: true, timestamp: new Date().toISOString() },
      };

    case 'webhook-trigger':
      return {
        start: 'Webhook received incoming request',
        complete: 'Webhook payload processed',
        data: { method: 'POST', path: '/webhook/demo', body: { event: 'demo' } },
      };

    case 'schedule-trigger':
      return {
        start: 'Schedule trigger activated',
        complete: 'Schedule executed on time',
        data: { schedule: '0 9 * * *', lastRun: new Date().toISOString() },
      };

    case 'http-request':
      return {
        start: `Making HTTP request to ${(node.data?.properties as Record<string, unknown>)?.url || 'API endpoint'}`,
        complete: 'HTTP request completed successfully',
        data: { statusCode: 200, responseTime: Math.floor(Math.random() * 500) + 100 },
      };

    case 'ai-completion':
      return {
        start: 'Sending request to AI model',
        complete: 'AI response generated',
        data: { model: 'gpt-4', tokens: Math.floor(Math.random() * 500) + 100 },
      };

    case 'json-transform':
      return {
        start: 'Transforming JSON data',
        complete: 'Data transformation complete',
        data: { itemsProcessed: Math.floor(Math.random() * 10) + 1 },
      };

    case 'code-node':
      return {
        start: 'Executing custom code',
        complete: 'Code execution finished',
        data: { executionTime: `${Math.floor(Math.random() * 100)}ms` },
      };

    case 'if-node':
      const conditionResult = Math.random() > 0.5;
      return {
        start: 'Evaluating condition',
        complete: `Condition evaluated: ${conditionResult ? 'TRUE' : 'FALSE'}`,
        data: { result: conditionResult, branch: conditionResult ? 'true' : 'false' },
      };

    case 'switch-node':
      return {
        start: 'Evaluating switch conditions',
        complete: 'Switch routing complete',
        data: { matchedCase: 'case_1' },
      };

    case 'merge-node':
      return {
        start: 'Merging input data streams',
        complete: 'Data merged successfully',
        data: { inputCount: 2, outputItems: 3 },
      };

    case 'console-log':
      return {
        start: 'Logging data to console',
        complete: 'Data logged',
        data: { logLevel: 'info', itemCount: 1 },
      };

    case 'email-node':
      return {
        start: 'Preparing email for delivery',
        complete: 'Email sent successfully',
        data: { to: 'demo@example.com', subject: 'FlowForge Notification' },
      };

    case 'telegram-node':
      return {
        start: 'Sending Telegram message',
        complete: 'Message delivered',
        data: { chatId: '12345678', messageId: Math.floor(Math.random() * 10000) },
      };

    default:
      return {
        start: `Executing ${label}`,
        complete: `${label} completed`,
        data: { processed: true },
      };
  }
}

/**
 * Sort nodes by execution order (triggers first, then by connections)
 */
function getExecutionOrder(flow: Flow): FlowNode[] {
  const nodes = [...flow.nodes];
  const edges = flow.edges;

  // Find trigger nodes (nodes with no incoming edges)
  const nodesWithIncoming = new Set(edges.map(e => e.target));
  const triggers = nodes.filter(n => !nodesWithIncoming.has(n.id));

  // Simple topological sort
  const sorted: FlowNode[] = [];
  const visited = new Set<string>();

  function visit(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);

    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    // Visit nodes that this node connects to
    const outgoing = edges.filter(e => e.source === nodeId);
    for (const edge of outgoing) {
      visit(edge.target);
    }

    sorted.unshift(node);
  }

  // Start with triggers
  for (const trigger of triggers) {
    visit(trigger.id);
  }

  // Add any remaining unvisited nodes
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      sorted.push(node);
    }
  }

  return sorted;
}

/**
 * Execute a flow with mock processing
 */
export async function executeMockFlow(
  flowId: string,
  callbacks: ExecutionCallbacks
): Promise<Run> {
  const flow = getFlow(flowId);

  if (!flow) {
    throw new Error(`Flow not found: ${flowId}`);
  }

  if (flow.nodes.length === 0) {
    throw new Error('Flow has no nodes to execute');
  }

  const startTime = Date.now();
  const logs: LogEntry[] = [];

  // Create run record
  let run = createRun({
    flowId: flow.id,
    flowName: flow.name,
    status: 'running',
    triggerType: 'manual',
    logs: [],
    startedAt: new Date().toISOString(),
  });

  // Initial log
  const startLog = createLog(
    run.id,
    'system',
    'System',
    'info',
    `Starting flow execution: ${flow.name}`,
    { flowId: flow.id, nodeCount: flow.nodes.length }
  );
  logs.push(startLog);
  callbacks.onLog(startLog);

  // Get execution order
  const orderedNodes = getExecutionOrder(flow);

  let finalStatus: RunStatus = 'success';
  let errorMessage: string | undefined;

  // Execute each node
  for (const node of orderedNodes) {
    const nodeLabel = node.label || (node.data?.label as string) || node.type;
    const messages = getNodeExecutionMessages(node);

    // Signal node start
    callbacks.onNodeStart(node.id);

    // Log node start
    const startNodeLog = createLog(
      run.id,
      node.id,
      nodeLabel,
      'info',
      messages.start
    );
    logs.push(startNodeLog);
    callbacks.onLog(startNodeLog);

    // Simulate processing time (300-1500ms)
    const processingTime = 300 + Math.random() * 1200;
    await delay(processingTime);

    // Simulate random failure (5% chance)
    const shouldFail = Math.random() < 0.05;

    if (shouldFail) {
      const errorLog = createLog(
        run.id,
        node.id,
        nodeLabel,
        'error',
        `Error executing ${nodeLabel}: Simulated failure for demo purposes`,
        { error: 'DEMO_ERROR', code: 'E001' }
      );
      logs.push(errorLog);
      callbacks.onLog(errorLog);
      callbacks.onNodeComplete(node.id, false);

      finalStatus = 'failed';
      errorMessage = `Node "${nodeLabel}" failed: Simulated error`;
      break;
    }

    // Log node completion
    const completeNodeLog = createLog(
      run.id,
      node.id,
      nodeLabel,
      'info',
      messages.complete,
      messages.data
    );
    logs.push(completeNodeLog);
    callbacks.onLog(completeNodeLog);

    // Signal node complete
    callbacks.onNodeComplete(node.id, true);
  }

  const endTime = Date.now();
  const durationMs = endTime - startTime;

  // Final log
  const finalLog = createLog(
    run.id,
    'system',
    'System',
    finalStatus === 'success' ? 'info' : 'error',
    finalStatus === 'success'
      ? `Flow completed successfully in ${durationMs}ms`
      : `Flow execution failed: ${errorMessage}`,
    { durationMs, status: finalStatus }
  );
  logs.push(finalLog);
  callbacks.onLog(finalLog);

  // Update run record
  run = updateRun(run.id, {
    status: finalStatus,
    logs,
    error: errorMessage,
    finishedAt: new Date().toISOString(),
    durationMs,
  }) || run;

  callbacks.onComplete(run);

  return run;
}

/**
 * Get execution preview (without actually running)
 */
export function getExecutionPreview(flowId: string): { nodes: string[]; estimatedTime: number } {
  const flow = getFlow(flowId);

  if (!flow || flow.nodes.length === 0) {
    return { nodes: [], estimatedTime: 0 };
  }

  const orderedNodes = getExecutionOrder(flow);

  return {
    nodes: orderedNodes.map(n => n.label || (n.data?.label as string) || n.type),
    estimatedTime: orderedNodes.length * 800, // Estimated 800ms per node
  };
}
