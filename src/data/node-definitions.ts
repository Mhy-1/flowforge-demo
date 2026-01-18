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
  name: 'تشغيل يدوي',
  description: 'يبدأ المسار يدوياً. استخدمه كنقطة بداية للمسارات التي يتم تشغيلها بواسطة المستخدم.',
  category: 'trigger',
  icon: '\u25b6\ufe0f',
  version: 1,
  inputs: [],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'passthrough',
      displayName: 'تمرير بيانات التشغيل',
      type: 'boolean',
      description: 'تمرير بيانات التشغيل مباشرة إلى المخرج',
      default: true,
    },
    {
      name: 'initialData',
      displayName: 'البيانات الأولية',
      type: 'json',
      description: 'بيانات JSON للإخراج عند التشغيل',
      default: '{}',
      displayOptions: { show: { passthrough: [false] } },
    },
  ],
  defaults: { passthrough: true, initialData: '{}' },
};

export const webhookTriggerNode: NodeDefinition = {
  id: 'webhook-trigger',
  name: 'مشغل Webhook',
  description: 'يبدأ المسار عند استلام Webhook. مفيد للتكاملات.',
  category: 'trigger',
  icon: '\ud83c\udf10',
  version: 1,
  inputs: [],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'path',
      displayName: 'مسار Webhook',
      type: 'string',
      description: 'مسار نقطة نهاية Webhook',
      required: true,
      placeholder: '/webhook/my-hook',
    },
    {
      name: 'method',
      displayName: 'طريقة HTTP',
      type: 'select',
      description: 'طريقة HTTP المقبولة',
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
  name: 'جدولة',
  description: 'يبدأ المسار وفق جدول زمني باستخدام صيغة cron.',
  category: 'trigger',
  icon: '\u23f0',
  version: 1,
  inputs: [],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'schedule',
      displayName: 'جدولة Cron',
      type: 'string',
      description: 'تعبير Cron (مثال: "0 9 * * *" للساعة 9 صباحاً يومياً)',
      required: true,
      placeholder: '0 9 * * *',
    },
    {
      name: 'timezone',
      displayName: 'المنطقة الزمنية',
      type: 'string',
      description: 'المنطقة الزمنية للجدولة',
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
  name: 'طلب HTTP',
  description: 'يرسل طلبات HTTP إلى واجهات API والخدمات الخارجية.',
  category: 'action',
  icon: '\ud83c\udf10',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'method',
      displayName: 'الطريقة',
      type: 'select',
      description: 'طريقة HTTP',
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
      displayName: 'الرابط URL',
      type: 'string',
      description: 'الرابط المستهدف',
      required: true,
      placeholder: 'https://api.example.com/endpoint',
    },
    {
      name: 'headers',
      displayName: 'الترويسات',
      type: 'json',
      description: 'ترويسات مخصصة بصيغة JSON',
      default: '{}',
    },
    {
      name: 'body',
      displayName: 'المحتوى',
      type: 'json',
      description: 'محتوى الطلب بصيغة JSON',
      default: '',
      displayOptions: { show: { method: ['POST', 'PUT', 'PATCH'] } },
    },
  ],
  defaults: { method: 'GET', url: '', headers: '{}', body: '' },
};

export const aiCompletionNode: NodeDefinition = {
  id: 'ai-completion',
  name: 'إكمال AI',
  description: 'توليد نص باستخدام نماذج الذكاء الاصطناعي.',
  category: 'action',
  icon: '\ud83e\udde0',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'model',
      displayName: 'النموذج',
      type: 'select',
      description: 'نموذج AI المستخدم',
      default: 'gpt-4',
      options: [
        { name: 'GPT-4', value: 'gpt-4' },
        { name: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
        { name: 'Claude 3', value: 'claude-3' },
      ],
    },
    {
      name: 'prompt',
      displayName: 'الطلب',
      type: 'string',
      description: 'الطلب المرسل إلى AI',
      required: true,
    },
    {
      name: 'temperature',
      displayName: 'الحرارة',
      type: 'number',
      description: 'العشوائية (0-1)',
      default: 0.7,
    },
  ],
  defaults: { model: 'gpt-4', prompt: '', temperature: 0.7 },
};

export const jsonTransformNode: NodeDefinition = {
  id: 'json-transform',
  name: 'تحويل JSON',
  description: 'تحويل ومعالجة بيانات JSON.',
  category: 'transform',
  icon: '\ud83d\udd04',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'expression',
      displayName: 'تعبير التحويل',
      type: 'code',
      description: 'تعبير JSONata للتحويل',
      required: true,
      placeholder: '{ "name": $.data.name }',
    },
  ],
  defaults: { expression: '' },
};

export const codeNode: NodeDefinition = {
  id: 'code-node',
  name: 'كود',
  description: 'تنفيذ كود JavaScript مخصص.',
  category: 'action',
  icon: '\ud83d\udcbb',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'code',
      displayName: 'كود JavaScript',
      type: 'code',
      description: 'كود JavaScript مخصص للتنفيذ',
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
  name: 'شرط IF',
  description: 'توجيه العناصر بناءً على شرط.',
  category: 'logic',
  icon: '\ud83d\udd00',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'true', type: 'output', label: 'صحيح', dataType: 'any' },
    { id: 'false', type: 'output', label: 'خطأ', dataType: 'any' },
  ],
  properties: [
    {
      name: 'condition',
      displayName: 'الشرط',
      type: 'string',
      description: 'تعبير JavaScript يرجع صحيح/خطأ',
      required: true,
      placeholder: 'data.status === "active"',
    },
  ],
  defaults: { condition: '' },
};

export const switchNode: NodeDefinition = {
  id: 'switch-node',
  name: 'تبديل',
  description: 'توجيه العناصر إلى مخرجات مختلفة بناءً على القيمة.',
  category: 'logic',
  icon: '\ud83d\udd00',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'field',
      displayName: 'الحقل للمطابقة',
      type: 'string',
      description: 'مسار الحقل للتقييم',
      required: true,
      placeholder: 'data.type',
    },
    {
      name: 'cases',
      displayName: 'الحالات',
      type: 'json',
      description: 'تعريفات الحالات بصيغة JSON',
      default: '[]',
    },
  ],
  defaults: { field: '', cases: '[]' },
};

export const mergeNode: NodeDefinition = {
  id: 'merge-node',
  name: 'دمج',
  description: 'دمج مدخلات متعددة في مخرج واحد.',
  category: 'logic',
  icon: '\ud83d\udd17',
  version: 1,
  inputs: [
    { id: 'input1', type: 'input', label: 'المدخل 1', dataType: 'any' },
    { id: 'input2', type: 'input', label: 'المدخل 2', dataType: 'any' },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'mode',
      displayName: 'وضع الدمج',
      type: 'select',
      description: 'كيفية دمج المدخلات',
      default: 'append',
      options: [
        { name: 'إلحاق', value: 'append', description: 'جمع كل العناصر' },
        { name: 'دمج بالفهرس', value: 'index', description: 'دمج الفهارس المتطابقة' },
        { name: 'دمج بالمفتاح', value: 'key', description: 'دمج بمفتاح مشترك' },
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
  name: 'سجل التصحيح',
  description: 'تسجيل البيانات للتصحيح والفحص.',
  category: 'output',
  icon: '\ud83d\udcdd',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'message',
      displayName: 'الرسالة',
      type: 'string',
      description: 'بادئة الرسالة (اختياري)',
      placeholder: 'تصحيح: الحالة الحالية',
    },
    {
      name: 'logLevel',
      displayName: 'مستوى السجل',
      type: 'select',
      description: 'مستوى الخطورة',
      default: 'info',
      options: [
        { name: 'تصحيح', value: 'debug' },
        { name: 'معلومات', value: 'info' },
        { name: 'تحذير', value: 'warn' },
        { name: 'خطأ', value: 'error' },
      ],
    },
    {
      name: 'passthrough',
      displayName: 'تمرير',
      type: 'boolean',
      description: 'تمرير بيانات المدخل إلى المخرج',
      default: true,
    },
  ],
  defaults: { message: '', logLevel: 'info', passthrough: true },
};

export const emailNode: NodeDefinition = {
  id: 'email-node',
  name: 'إرسال بريد',
  description: 'إرسال إشعارات بالبريد الإلكتروني.',
  category: 'output',
  icon: '\ud83d\udce7',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'to',
      displayName: 'إلى',
      type: 'string',
      description: 'عنوان البريد الإلكتروني للمستلم',
      required: true,
      placeholder: 'user@example.com',
    },
    {
      name: 'subject',
      displayName: 'الموضوع',
      type: 'string',
      description: 'موضوع البريد',
      required: true,
    },
    {
      name: 'body',
      displayName: 'المحتوى',
      type: 'string',
      description: 'محتوى البريد',
    },
  ],
  defaults: { to: '', subject: '', body: '' },
};

export const telegramNode: NodeDefinition = {
  id: 'telegram-node',
  name: 'إرسال تيليجرام',
  description: 'إرسال رسائل عبر تيليجرام.',
  category: 'output',
  icon: '\u2708\ufe0f',
  version: 1,
  inputs: [
    { id: 'input', type: 'input', label: 'المدخل', dataType: 'any', multiple: true },
  ],
  outputs: [
    { id: 'output', type: 'output', label: 'المخرج', dataType: 'any', multiple: true },
  ],
  properties: [
    {
      name: 'chatId',
      displayName: 'معرف المحادثة',
      type: 'string',
      description: 'معرف محادثة تيليجرام أو @القناة',
      required: true,
      placeholder: '@my_channel or 12345678',
    },
    {
      name: 'message',
      displayName: 'الرسالة',
      type: 'string',
      description: 'الرسالة المراد إرسالها',
      required: true,
    },
    {
      name: 'parseMode',
      displayName: 'وضع التنسيق',
      type: 'select',
      description: 'تنسيق النص',
      default: 'Markdown',
      options: [
        { name: 'Markdown', value: 'Markdown' },
        { name: 'HTML', value: 'HTML' },
        { name: 'عادي', value: '' },
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
