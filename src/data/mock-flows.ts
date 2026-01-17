/**
 * Sample Mock Flows
 * =================
 * Pre-built flows for demo purposes
 */

import type { Flow } from '@/types';

export const sampleFlows: Flow[] = [
  {
    id: 'flow-welcome-email',
    name: 'Welcome Email Flow',
    description: 'Sends a welcome email when a new user signs up via webhook',
    status: 'active',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'webhook-trigger',
          label: 'New User Webhook',
          category: 'trigger',
          icon: 'Webhook',
          properties: {
            path: '/webhook/new-user',
            method: 'POST',
          },
        },
        label: 'New User Webhook',
      },
      {
        id: 'node-2',
        type: 'transform',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'json-transform',
          label: 'Format Email Data',
          category: 'transform',
          icon: 'Code',
          properties: {
            expression: '{ "to": $input.email, "name": $input.name }',
          },
        },
        label: 'Format Email Data',
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 600, y: 200 },
        data: {
          nodeType: 'email-node',
          label: 'Send Welcome Email',
          category: 'output',
          icon: 'Mail',
          properties: {
            subject: 'Welcome to Our Platform!',
            template: 'welcome',
          },
        },
        label: 'Send Welcome Email',
      },
      {
        id: 'node-4',
        type: 'output',
        position: { x: 850, y: 200 },
        data: {
          nodeType: 'console-log',
          label: 'Log Success',
          category: 'output',
          icon: 'Terminal',
          properties: {
            message: 'Welcome email sent successfully',
            logLevel: 'info',
          },
        },
        label: 'Log Success',
      },
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        sourceHandle: 'output',
        target: 'node-2',
        targetHandle: 'input',
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        sourceHandle: 'output',
        target: 'node-3',
        targetHandle: 'input',
      },
      {
        id: 'edge-3-4',
        source: 'node-3',
        sourceHandle: 'output',
        target: 'node-4',
        targetHandle: 'input',
      },
    ],
    settings: {
      timeout: 30000,
      retryOnFail: true,
      retryCount: 3,
    },
    createdAt: '2024-01-10T10:00:00.000Z',
    updatedAt: '2024-01-15T14:30:00.000Z',
  },
  {
    id: 'flow-data-sync',
    name: 'Data Sync Flow',
    description: 'Fetches data from API and syncs to database with transformation',
    status: 'active',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'schedule-trigger',
          label: 'Daily Sync',
          category: 'trigger',
          icon: 'Clock',
          properties: {
            schedule: '0 9 * * *',
            timezone: 'UTC',
          },
        },
        label: 'Daily Sync (9 AM)',
      },
      {
        id: 'node-2',
        type: 'action',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'http-request',
          label: 'Fetch API Data',
          category: 'action',
          icon: 'Globe',
          properties: {
            method: 'GET',
            url: 'https://api.example.com/data',
          },
        },
        label: 'Fetch API Data',
      },
      {
        id: 'node-3',
        type: 'transform',
        position: { x: 600, y: 200 },
        data: {
          nodeType: 'json-transform',
          label: 'Transform Data',
          category: 'transform',
          icon: 'RefreshCw',
          properties: {
            mapping: 'standard',
          },
        },
        label: 'Transform Data',
      },
      {
        id: 'node-4',
        type: 'logic',
        position: { x: 850, y: 200 },
        data: {
          nodeType: 'if-node',
          label: 'Check Data Valid',
          category: 'logic',
          icon: 'GitBranch',
          properties: {
            condition: 'data.length > 0',
          },
        },
        label: 'Check Data Valid',
      },
      {
        id: 'node-5',
        type: 'output',
        position: { x: 1100, y: 150 },
        data: {
          nodeType: 'console-log',
          label: 'Log Success',
          category: 'output',
          icon: 'CheckCircle',
          properties: {
            message: 'Data sync completed',
            logLevel: 'info',
          },
        },
        label: 'Log Success',
      },
      {
        id: 'node-6',
        type: 'output',
        position: { x: 1100, y: 300 },
        data: {
          nodeType: 'console-log',
          label: 'Log Warning',
          category: 'output',
          icon: 'AlertTriangle',
          properties: {
            message: 'No data to sync',
            logLevel: 'warn',
          },
        },
        label: 'Log Warning',
      },
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        sourceHandle: 'output',
        target: 'node-2',
        targetHandle: 'input',
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        sourceHandle: 'output',
        target: 'node-3',
        targetHandle: 'input',
      },
      {
        id: 'edge-3-4',
        source: 'node-3',
        sourceHandle: 'output',
        target: 'node-4',
        targetHandle: 'input',
      },
      {
        id: 'edge-4-5',
        source: 'node-4',
        sourceHandle: 'true',
        target: 'node-5',
        targetHandle: 'input',
      },
      {
        id: 'edge-4-6',
        source: 'node-4',
        sourceHandle: 'false',
        target: 'node-6',
        targetHandle: 'input',
      },
    ],
    settings: {
      timeout: 60000,
      retryOnFail: true,
      retryCount: 3,
    },
    createdAt: '2024-01-05T08:00:00.000Z',
    updatedAt: '2024-01-14T16:45:00.000Z',
  },
  {
    id: 'flow-notification',
    name: 'Alert Notification Flow',
    description: 'Monitors webhooks and sends Telegram notifications for important events',
    status: 'active',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'webhook-trigger',
          label: 'Alert Webhook',
          category: 'trigger',
          icon: 'Webhook',
          properties: {
            path: '/webhook/alert',
            method: 'POST',
          },
        },
        label: 'Alert Webhook',
      },
      {
        id: 'node-2',
        type: 'logic',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'if-node',
          label: 'Check Severity',
          category: 'logic',
          icon: 'GitBranch',
          properties: {
            condition: 'severity === "high"',
          },
        },
        label: 'Check Severity',
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 600, y: 150 },
        data: {
          nodeType: 'telegram-node',
          label: 'Send Telegram Alert',
          category: 'output',
          icon: 'Send',
          properties: {
            chatId: '@alerts_channel',
            parseMode: 'Markdown',
          },
        },
        label: 'Send Telegram Alert',
      },
      {
        id: 'node-4',
        type: 'output',
        position: { x: 600, y: 300 },
        data: {
          nodeType: 'console-log',
          label: 'Log Low Priority',
          category: 'output',
          icon: 'Terminal',
          properties: {
            message: 'Low priority alert logged',
            logLevel: 'debug',
          },
        },
        label: 'Log Low Priority',
      },
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        sourceHandle: 'output',
        target: 'node-2',
        targetHandle: 'input',
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        sourceHandle: 'true',
        target: 'node-3',
        targetHandle: 'input',
      },
      {
        id: 'edge-2-4',
        source: 'node-2',
        sourceHandle: 'false',
        target: 'node-4',
        targetHandle: 'input',
      },
    ],
    settings: {
      timeout: 15000,
      retryOnFail: false,
    },
    createdAt: '2024-01-12T12:00:00.000Z',
    updatedAt: '2024-01-12T12:00:00.000Z',
  },
  {
    id: 'flow-ai-processor',
    name: 'AI Content Processor',
    description: 'Processes content using AI and outputs results',
    status: 'draft',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'manual-trigger',
          label: 'Manual Start',
          category: 'trigger',
          icon: 'Play',
          properties: {
            passthrough: true,
          },
        },
        label: 'Manual Start',
      },
      {
        id: 'node-2',
        type: 'action',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'ai-completion',
          label: 'AI Analysis',
          category: 'action',
          icon: 'Brain',
          properties: {
            model: 'gpt-4',
            temperature: 0.7,
          },
        },
        label: 'AI Analysis',
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 600, y: 200 },
        data: {
          nodeType: 'console-log',
          label: 'Output Result',
          category: 'output',
          icon: 'Terminal',
          properties: {
            logLevel: 'info',
            prettyPrint: true,
          },
        },
        label: 'Output Result',
      },
    ],
    edges: [
      {
        id: 'edge-1-2',
        source: 'node-1',
        sourceHandle: 'output',
        target: 'node-2',
        targetHandle: 'input',
      },
      {
        id: 'edge-2-3',
        source: 'node-2',
        sourceHandle: 'output',
        target: 'node-3',
        targetHandle: 'input',
      },
    ],
    settings: {
      timeout: 120000,
      retryOnFail: true,
      retryCount: 2,
    },
    createdAt: '2024-01-14T09:30:00.000Z',
    updatedAt: '2024-01-14T09:30:00.000Z',
  },
];
