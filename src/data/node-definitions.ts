/**
 * Node Definitions
 * ================
 * All available node types for the demo
 */

import type { NodeDefinition } from '@/types';

// ============================================
// TRIGGER NODES
// ============================================

export const manualTriggerNode: NodeDefinition = {
  id: 'manual-trigger',
  name: 'Manual Trigger',
  description: 'Starts a flow manually. Use as entry point for flows triggered by user action.',
  category: 'trigger',
  icon: '\u25b6\ufe0f',
  version: 1,
  inputs: [],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'passthrough',
      displayName: 'Pass Through Trigger Data',
      type: 'boolean',
      description: 'Pass trigger data directly to output',
      default: true,
    },
    {
      name: 'initialData',
      displayName: 'Initial Data',
      type: 'json',
      description: 'JSON data to output when triggered',
      default: '{}',
      displayOptions: { show: { passthrough: [false] } },
    },
  ],
  defaults: { passthrough: true, initialData: '{}' },
};

export const webhookTriggerNode: NodeDefinition = {
  id: 'webhook-trigger',
  name: 'Webhook Trigger',
  description: 'Starts a flow when a webhook is received. Useful for integrations.',
  category: 'trigger',
  icon: '\ud83c\udf10',
  version: 1,
  inputs: [],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'path',
      displayName: 'Webhook Path',
      type: 'string',
      description: 'The path for the webhook endpoint',
      required: true,
      placeholder: '/webhook/my-hook',
    },
    {
      name: 'method',
      displayName: 'HTTP Method',
      type: 'select',
      description: 'Accepted HTTP method',
      default: 'POST',
      options: [
        { name: 'POST', value: 'POST' },
        { name: 'GET', value: 'GET' },
        { name: 'PUT', value: 'PUT' },
      ],
    },
  ],
  defaults: { path: '/webhook', method: 'POST' },
};

export const scheduleTriggerNode: NodeDefinition = {
  id: 'schedule-trigger',
  name: 'Schedule Trigger',
  description: 'Starts a flow on a schedule using cron syntax.',
  category: 'trigger',
  icon: '\u23f0',
  version: 1,
  inputs: [],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'schedule',
      displayName: 'Cron Schedule',
      type: 'string',
      description: 'Cron expression (e.g., "0 9 * * *" for 9 AM daily)',
      required: true,
      placeholder: '0 9 * * *',
    },
    {
      name: 'timezone',
      displayName: 'Timezone',
      type: 'string',
      description: 'Timezone for the schedule',
      default: 'UTC',
    },
  ],
  defaults: { schedule: '0 9 * * *', timezone: 'UTC' },
};

// ============================================
// ACTION NODES
// ============================================

export const httpRequestNode: NodeDefinition = {
  id: 'http-request',
  name: 'HTTP Request',
  description: 'Makes HTTP requests to external APIs and services.',
  category: 'action',
  icon: '\ud83c\udf10',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'method',
      displayName: 'Method',
      type: 'select',
      description: 'HTTP method',
      required: true,
      default: 'GET',
      options: [
        { name: 'GET', value: 'GET' },
        { name: 'POST', value: 'POST' },
        { name: 'PUT', value: 'PUT' },
        { name: 'PATCH', value: 'PATCH' },
        { name: 'DELETE', value: 'DELETE' },
      ],
    },
    {
      name: 'url',
      displayName: 'URL',
      type: 'string',
      description: 'Target URL',
      required: true,
      placeholder: 'https://api.example.com/endpoint',
    },
    {
      name: 'headers',
      displayName: 'Headers',
      type: 'json',
      description: 'Custom headers as JSON',
      default: '{}',
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'json',
      description: 'Request body as JSON',
      default: '',
      displayOptions: { show: { method: ['POST', 'PUT', 'PATCH'] } },
    },
  ],
  defaults: { method: 'GET', url: '', headers: '{}', body: '' },
};

export const aiCompletionNode: NodeDefinition = {
  id: 'ai-completion',
  name: 'AI Completion',
  description: 'Generate text using AI language models.',
  category: 'action',
  icon: '\ud83e\udde0',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'model',
      displayName: 'Model',
      type: 'select',
      description: 'AI model to use',
      default: 'gpt-4',
      options: [
        { name: 'GPT-4', value: 'gpt-4' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        { name: 'Claude 3', value: 'claude-3' },
      ],
    },
    {
      name: 'prompt',
      displayName: 'Prompt',
      type: 'string',
      description: 'The prompt to send to the AI',
      required: true,
    },
    {
      name: 'temperature',
      displayName: 'Temperature',
      type: 'number',
      description: 'Randomness (0-1)',
      default: 0.7,
    },
  ],
  defaults: { model: 'gpt-4', prompt: '', temperature: 0.7 },
};

export const jsonTransformNode: NodeDefinition = {
  id: 'json-transform',
  name: 'JSON Transform',
  description: 'Transform and manipulate JSON data.',
  category: 'transform',
  icon: '\ud83d\udd04',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'expression',
      displayName: 'Transform Expression',
      type: 'code',
      description: 'JSONata expression for transformation',
      required: true,
      placeholder: '{ "name": $.data.name }',
    },
  ],
  defaults: { expression: '' },
};

export const codeNode: NodeDefinition = {
  id: 'code-node',
  name: 'Code',
  description: 'Execute custom JavaScript code.',
  category: 'action',
  icon: '\ud83d\udcbb',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'code',
      displayName: 'JavaScript Code',
      type: 'code',
      description: 'Custom JavaScript code to execute',
      required: true,
      placeholder: 'return items.map(item => ({ ...item, processed: true }));',
    },
  ],
  defaults: { code: '' },
};

// ============================================
// LOGIC NODES
// ============================================

export const ifNode: NodeDefinition = {
  id: 'if-node',
  name: 'IF Condition',
  description: 'Route items based on a condition.',
  category: 'logic',
  icon: '\ud83d\udd00',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'true', type: 'output', label: 'True', dataType: 'any' },
    { id: 'false', type: 'output', label: 'False', dataType: 'any' },
  ],
  properties: [
    {
      name: 'condition',
      displayName: 'Condition',
      type: 'string',
      description: 'JavaScript expression that returns true/false',
      required: true,
      placeholder: 'data.status === "active"',
    },
  ],
  defaults: { condition: '' },
};

export const switchNode: NodeDefinition = {
  id: 'switch-node',
  name: 'Switch',
  description: 'Route items to different outputs based on value.',
  category: 'logic',
  icon: '\ud83d\udd00',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'field',
      displayName: 'Field to Match',
      type: 'string',
      description: 'Field path to evaluate',
      required: true,
      placeholder: 'data.type',
    },
    {
      name: 'cases',
      displayName: 'Cases',
      type: 'json',
      description: 'Case definitions as JSON',
      default: '[]',
    },
  ],
  defaults: { field: '', cases: '[]' },
};

export const mergeNode: NodeDefinition = {
  id: 'merge-node',
  name: 'Merge',
  description: 'Merge multiple inputs into one output.',
  category: 'logic',
  icon: '\ud83d\udd17',
  version: 1,
  inputs: [
    { id: 'input1', type: 'input', label: 'Input 1', dataType: 'any' },
    { id: 'input2', type: 'input', label: 'Input 2', dataType: 'any' },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'mode',
      displayName: 'Merge Mode',
      type: 'select',
      description: 'How to merge the inputs',
      default: 'append',
      options: [
        { name: 'Append', value: 'append', description: 'Combine all items' },
        { name: 'Merge by Index', value: 'index', description: 'Merge matching indices' },
        { name: 'Merge by Key', value: 'key', description: 'Merge by a common key' },
      ],
    },
  ],
  defaults: { mode: 'append' },
};

// ============================================
// OUTPUT NODES
// ============================================

export const consoleLogNode: NodeDefinition = {
  id: 'console-log',
  name: 'Console Log',
  description: 'Log data for debugging and inspection.',
  category: 'output',
  icon: '\ud83d\udcdd',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      description: 'Optional message prefix',
      placeholder: 'Debug: current state',
    },
    {
      name: 'logLevel',
      displayName: 'Log Level',
      type: 'select',
      description: 'Severity level',
      default: 'info',
      options: [
        { name: 'Debug', value: 'debug' },
        { name: 'Info', value: 'info' },
        { name: 'Warning', value: 'warn' },
        { name: 'Error', value: 'error' },
      ],
    },
    {
      name: 'passthrough',
      displayName: 'Pass Through',
      type: 'boolean',
      description: 'Pass input data to output',
      default: true,
    },
  ],
  defaults: { message: '', logLevel: 'info', passthrough: true },
};

export const emailNode: NodeDefinition = {
  id: 'email-node',
  name: 'Send Email',
  description: 'Send email notifications.',
  category: 'output',
  icon: '\ud83d\udce7',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'to',
      displayName: 'To',
      type: 'string',
      description: 'Recipient email address',
      required: true,
      placeholder: 'user@example.com',
    },
    {
      name: 'subject',
      displayName: 'Subject',
      type: 'string',
      description: 'Email subject',
      required: true,
    },
    {
      name: 'body',
      displayName: 'Body',
      type: 'string',
      description: 'Email body content',
    },
  ],
  defaults: { to: '', subject: '', body: '' },
};

export const telegramNode: NodeDefinition = {
  id: 'telegram-node',
  name: 'Send Telegram',
  description: 'Send messages via Telegram.',
  category: 'output',
  icon: '\u2708\ufe0f',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'Input', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'Output', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'chatId',
      displayName: 'Chat ID',
      type: 'string',
      description: 'Telegram chat ID or @channel',
      required: true,
      placeholder: '@my_channel or 12345678',
    },
    {
      name: 'message',
      displayName: 'Message',
      type: 'string',
      description: 'Message to send',
      required: true,
    },
    {
      name: 'parseMode',
      displayName: 'Parse Mode',
      type: 'select',
      description: 'Text formatting',
      default: 'Markdown',
      options: [
        { name: 'Markdown', value: 'Markdown' },
        { name: 'HTML', value: 'HTML' },
        { name: 'Plain', value: '' },
      ],
    },
  ],
  defaults: { chatId: '', message: '', parseMode: 'Markdown' },
};

// ============================================
// ALL NODES COLLECTION
// ============================================

export const allNodeDefinitions: NodeDefinition[] = [
  // Triggers
  manualTriggerNode,
  webhookTriggerNode,
  scheduleTriggerNode,
  // Actions
  httpRequestNode,
  aiCompletionNode,
  codeNode,
  // Transform
  jsonTransformNode,
  // Logic
  ifNode,
  switchNode,
  mergeNode,
  // Outputs
  consoleLogNode,
  emailNode,
  telegramNode,
];

/**
 * Get node definition by ID
 */
export function getNodeDefinition(id: string): NodeDefinition | undefined {
  return allNodeDefinitions.find(n => n.id === id);
}

/**
 * Get all node definitions as a Map
 */
export function getNodeDefinitionsMap(): Map<string, NodeDefinition> {
  const map = new Map<string, NodeDefinition>();
  allNodeDefinitions.forEach(node => map.set(node.id, node));
  return map;
}
