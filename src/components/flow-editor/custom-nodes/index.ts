/**
 * Custom Node Components Index
 */

export { BaseNode } from './BaseNode';
export { TriggerNode } from './TriggerNode';
export { ActionNode } from './ActionNode';
export { OutputNode } from './OutputNode';
export { LogicNode } from './LogicNode';
export { TransformNode } from './TransformNode';

import { TriggerNode } from './TriggerNode';
import { ActionNode } from './ActionNode';
import { OutputNode } from './OutputNode';
import { LogicNode } from './LogicNode';
import { TransformNode } from './TransformNode';

/**
 * Map of node types to their React components
 */
export const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  output: OutputNode,
  logic: LogicNode,
  transform: TransformNode,
};
