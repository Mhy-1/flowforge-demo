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
        start: 'تم تفعيل التشغيل اليدوي',
        complete: 'تم تمرير بيانات التشغيل إلى العقدة التالية',
        data: { triggered: true, timestamp: new Date().toISOString() },
      };

    case 'webhook-trigger':
      return {
        start: 'تم استلام طلب Webhook',
        complete: 'تمت معالجة بيانات Webhook',
        data: { method: 'POST', path: '/webhook/demo', body: { event: 'demo' } },
      };

    case 'schedule-trigger':
      return {
        start: 'تم تفعيل مشغل الجدولة',
        complete: 'تم تنفيذ الجدولة في وقتها',
        data: { schedule: '0 9 * * *', lastRun: new Date().toISOString() },
      };

    case 'http-request':
      return {
        start: `إرسال طلب HTTP إلى ${(node.data?.properties as Record<string, unknown>)?.url || 'نقطة نهاية API'}`,
        complete: 'اكتمل طلب HTTP بنجاح',
        data: { statusCode: 200, responseTime: Math.floor(Math.random() * 500) + 100 },
      };

    case 'ai-completion':
      return {
        start: 'إرسال الطلب إلى نموذج الذكاء الاصطناعي',
        complete: 'تم توليد استجابة الذكاء الاصطناعي',
        data: { model: 'gpt-4', tokens: Math.floor(Math.random() * 500) + 100 },
      };

    case 'json-transform':
      return {
        start: 'تحويل بيانات JSON',
        complete: 'اكتمل تحويل البيانات',
        data: { itemsProcessed: Math.floor(Math.random() * 10) + 1 },
      };

    case 'code-node':
      return {
        start: 'تنفيذ الكود المخصص',
        complete: 'انتهى تنفيذ الكود',
        data: { executionTime: `${Math.floor(Math.random() * 100)}ms` },
      };

    case 'if-node':
      const conditionResult = Math.random() > 0.5;
      return {
        start: 'تقييم الشرط',
        complete: `نتيجة تقييم الشرط: ${conditionResult ? 'صحيح' : 'خطأ'}`,
        data: { result: conditionResult, branch: conditionResult ? 'true' : 'false' },
      };

    case 'switch-node':
      return {
        start: 'تقييم حالات التبديل',
        complete: 'اكتمل توجيه التبديل',
        data: { matchedCase: 'case_1' },
      };

    case 'merge-node':
      return {
        start: 'دمج مصادر البيانات المدخلة',
        complete: 'تم دمج البيانات بنجاح',
        data: { inputCount: 2, outputItems: 3 },
      };

    case 'console-log':
      return {
        start: 'تسجيل البيانات في السجل',
        complete: 'تم تسجيل البيانات',
        data: { logLevel: 'info', itemCount: 1 },
      };

    case 'email-node':
      return {
        start: 'تحضير البريد الإلكتروني للإرسال',
        complete: 'تم إرسال البريد الإلكتروني بنجاح',
        data: { to: 'demo@example.com', subject: 'إشعار من فلو فورج' },
      };

    case 'telegram-node':
      return {
        start: 'إرسال رسالة تيليجرام',
        complete: 'تم تسليم الرسالة',
        data: { chatId: '12345678', messageId: Math.floor(Math.random() * 10000) },
      };

    default:
      return {
        start: `تنفيذ ${label}`,
        complete: `اكتمل تنفيذ ${label}`,
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
    'النظام',
    'info',
    `بدء تنفيذ المسار: ${flow.name}`,
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
        `خطأ في تنفيذ ${nodeLabel}: فشل محاكاة لأغراض العرض التجريبي`,
        { error: 'DEMO_ERROR', code: 'E001' }
      );
      logs.push(errorLog);
      callbacks.onLog(errorLog);
      callbacks.onNodeComplete(node.id, false);

      finalStatus = 'failed';
      errorMessage = `فشلت العقدة "${nodeLabel}": خطأ محاكاة`;
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
    'النظام',
    finalStatus === 'success' ? 'info' : 'error',
    finalStatus === 'success'
      ? `اكتمل المسار بنجاح خلال ${durationMs} مللي ثانية`
      : `فشل تنفيذ المسار: ${errorMessage}`,
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
