/**
 * Sample Mock Flows
 * =================
 * Pre-built flows for demo purposes
 */

import type { Flow } from '@/types';

export const sampleFlows: Flow[] = [
  {
    id: 'flow-welcome-email',
    name: 'مسار رسالة الترحيب',
    description: 'يرسل رسالة ترحيب عند تسجيل مستخدم جديد عبر Webhook',
    status: 'active',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'webhook-trigger',
          label: 'Webhook مستخدم جديد',
          category: 'trigger',
          icon: '🌐',
          properties: {
            path: '/webhook/new-user',
            method: 'POST',
          },
        },
        label: 'Webhook مستخدم جديد',
      },
      {
        id: 'node-2',
        type: 'transform',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'json-transform',
          label: 'تنسيق بيانات البريد',
          category: 'transform',
          icon: '💻',
          properties: {
            expression: '{ "to": $input.email, "name": $input.name }',
          },
        },
        label: 'تنسيق بيانات البريد',
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 600, y: 200 },
        data: {
          nodeType: 'email-node',
          label: 'إرسال رسالة الترحيب',
          category: 'output',
          icon: '📧',
          properties: {
            subject: 'مرحباً بك في منصتنا!',
            template: 'welcome',
          },
        },
        label: 'إرسال رسالة الترحيب',
      },
      {
        id: 'node-4',
        type: 'output',
        position: { x: 850, y: 200 },
        data: {
          nodeType: 'console-log',
          label: 'تسجيل النجاح',
          category: 'output',
          icon: '📝',
          properties: {
            message: 'تم إرسال رسالة الترحيب بنجاح',
            logLevel: 'info',
          },
        },
        label: 'تسجيل النجاح',
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
    name: 'مسار مزامنة البيانات',
    description: 'يجلب البيانات من API ويزامنها مع قاعدة البيانات مع التحويل',
    status: 'active',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'schedule-trigger',
          label: 'مزامنة يومية',
          category: 'trigger',
          icon: '⏰',
          properties: {
            schedule: '0 9 * * *',
            timezone: 'UTC',
          },
        },
        label: 'مزامنة يومية (9 صباحاً)',
      },
      {
        id: 'node-2',
        type: 'action',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'http-request',
          label: 'جلب بيانات API',
          category: 'action',
          icon: '🌐',
          properties: {
            method: 'GET',
            url: 'https://api.example.com/data',
          },
        },
        label: 'جلب بيانات API',
      },
      {
        id: 'node-3',
        type: 'transform',
        position: { x: 600, y: 200 },
        data: {
          nodeType: 'json-transform',
          label: 'تحويل البيانات',
          category: 'transform',
          icon: '🔄',
          properties: {
            mapping: 'standard',
          },
        },
        label: 'تحويل البيانات',
      },
      {
        id: 'node-4',
        type: 'logic',
        position: { x: 850, y: 200 },
        data: {
          nodeType: 'if-node',
          label: 'التحقق من صحة البيانات',
          category: 'logic',
          icon: '🔀',
          properties: {
            condition: 'data.length > 0',
          },
        },
        label: 'التحقق من صحة البيانات',
      },
      {
        id: 'node-5',
        type: 'output',
        position: { x: 1100, y: 150 },
        data: {
          nodeType: 'console-log',
          label: 'تسجيل النجاح',
          category: 'output',
          icon: '✅',
          properties: {
            message: 'اكتملت مزامنة البيانات',
            logLevel: 'info',
          },
        },
        label: 'تسجيل النجاح',
      },
      {
        id: 'node-6',
        type: 'output',
        position: { x: 1100, y: 300 },
        data: {
          nodeType: 'console-log',
          label: 'تسجيل تحذير',
          category: 'output',
          icon: '⚠️',
          properties: {
            message: 'لا توجد بيانات للمزامنة',
            logLevel: 'warn',
          },
        },
        label: 'تسجيل تحذير',
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
    name: 'مسار إشعارات التنبيه',
    description: 'يراقب Webhooks ويرسل إشعارات تيليجرام للأحداث المهمة',
    status: 'active',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'webhook-trigger',
          label: 'Webhook التنبيه',
          category: 'trigger',
          icon: '🌐',
          properties: {
            path: '/webhook/alert',
            method: 'POST',
          },
        },
        label: 'Webhook التنبيه',
      },
      {
        id: 'node-2',
        type: 'logic',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'if-node',
          label: 'فحص الأهمية',
          category: 'logic',
          icon: '🔀',
          properties: {
            condition: 'severity === "high"',
          },
        },
        label: 'فحص الأهمية',
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 600, y: 150 },
        data: {
          nodeType: 'telegram-node',
          label: 'إرسال تنبيه تيليجرام',
          category: 'output',
          icon: '✈️',
          properties: {
            chatId: '@alerts_channel',
            parseMode: 'Markdown',
          },
        },
        label: 'إرسال تنبيه تيليجرام',
      },
      {
        id: 'node-4',
        type: 'output',
        position: { x: 600, y: 300 },
        data: {
          nodeType: 'console-log',
          label: 'تسجيل منخفض الأهمية',
          category: 'output',
          icon: '📝',
          properties: {
            message: 'تم تسجيل تنبيه منخفض الأهمية',
            logLevel: 'debug',
          },
        },
        label: 'تسجيل منخفض الأهمية',
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
    name: 'معالج محتوى AI',
    description: 'يعالج المحتوى باستخدام الذكاء الاصطناعي ويخرج النتائج',
    status: 'draft',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        position: { x: 100, y: 200 },
        data: {
          nodeType: 'manual-trigger',
          label: 'بدء يدوي',
          category: 'trigger',
          icon: '▶️',
          properties: {
            passthrough: true,
          },
        },
        label: 'بدء يدوي',
      },
      {
        id: 'node-2',
        type: 'action',
        position: { x: 350, y: 200 },
        data: {
          nodeType: 'ai-completion',
          label: 'تحليل AI',
          category: 'action',
          icon: '🧠',
          properties: {
            model: 'gpt-4',
            temperature: 0.7,
          },
        },
        label: 'تحليل AI',
      },
      {
        id: 'node-3',
        type: 'output',
        position: { x: 600, y: 200 },
        data: {
          nodeType: 'console-log',
          label: 'إخراج النتيجة',
          category: 'output',
          icon: '📝',
          properties: {
            logLevel: 'info',
            prettyPrint: true,
          },
        },
        label: 'إخراج النتيجة',
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
