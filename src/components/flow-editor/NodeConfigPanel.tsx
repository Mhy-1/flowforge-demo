'use client';

/**
 * Node Configuration Panel
 * ========================
 * Right sidebar for configuring selected node properties
 */

import { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { NodeDefinition, PropertyDefinition } from '@/types';
import type { FlowEditorNode } from './types';
import { categoryStyles, categoryConfig } from './types';

interface NodeConfigPanelProps {
  node: FlowEditorNode | null;
  nodeDefinition: NodeDefinition | null;
  onPropertyChange: (nodeId: string, propertyName: string, value: unknown) => void;
  onClose: () => void;
  className?: string;
}

export function NodeConfigPanel({
  node,
  nodeDefinition,
  onPropertyChange,
  onClose,
  className,
}: NodeConfigPanelProps) {
  const [localValues, setLocalValues] = useState<Record<string, unknown>>({});

  // Sync local values when node changes
  useEffect(() => {
    if (node) {
      setLocalValues(node.data.properties || {});
    }
  }, [node]);

  const handleChange = useCallback(
    (propertyName: string, value: unknown) => {
      setLocalValues((prev) => ({ ...prev, [propertyName]: value }));
      if (node) {
        onPropertyChange(node.id, propertyName, value);
      }
    },
    [node, onPropertyChange]
  );

  if (!node || !nodeDefinition) {
    return (
      <div
        className={cn(
          'w-80 border-l border-border bg-surface flex flex-col',
          className
        )}
      >
        <div className="flex items-center justify-center h-full text-text-muted">
          <div className="text-center p-6">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-text-subtle"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <p className="text-sm">Select a node to configure</p>
          </div>
        </div>
      </div>
    );
  }

  const category = node.data.category;
  const styles = categoryStyles[category];
  const config = categoryConfig[category];

  return (
    <div
      className={cn(
        'w-80 border-l border-border bg-surface flex flex-col',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg text-sm',
              styles.accent,
              'text-white'
            )}
          >
            {node.data.icon}
          </div>
          <div>
            <h3 className="text-sm font-medium text-text">{node.data.label}</h3>
            <p className="text-xs text-text-muted">{config.label}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-text-muted hover:text-text hover:bg-surface-hover rounded-md transition-colors"
          aria-label="Close panel"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Description */}
      <div className="px-4 py-3 border-b border-border-subtle">
        <p className="text-xs text-text-muted">{nodeDefinition.description}</p>
      </div>

      {/* Properties */}
      <div className="flex-1 overflow-y-auto p-4">
        <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-3">
          Configuration
        </h4>

        {nodeDefinition.properties.length === 0 ? (
          <p className="text-sm text-text-subtle italic">
            This node has no configurable properties.
          </p>
        ) : (
          <div className="space-y-4">
            {nodeDefinition.properties.map((prop) => (
              <PropertyField
                key={prop.name}
                property={prop}
                value={localValues[prop.name]}
                onChange={(value) => handleChange(prop.name, value)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Node ID Footer */}
      <div className="px-4 py-3 border-t border-border-subtle">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-subtle">Node ID</span>
          <code className="px-2 py-0.5 bg-background rounded text-text-muted font-mono text-[10px]">
            {node.id.slice(0, 12)}...
          </code>
        </div>
      </div>
    </div>
  );
}

// Property Field Component
interface PropertyFieldProps {
  property: PropertyDefinition;
  value: unknown;
  onChange: (value: unknown) => void;
}

function PropertyField({ property, value, onChange }: PropertyFieldProps) {
  const id = `prop-${property.name}`;

  const renderInput = () => {
    switch (property.type) {
      case 'string':
        return (
          <input
            id={id}
            type="text"
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );

      case 'text':
        return (
          <textarea
            id={id}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={property.placeholder}
            rows={4}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        );

      case 'number':
        return (
          <input
            id={id}
            type="number"
            value={(value as number) ?? ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={property.placeholder}
            min={property.min}
            max={property.max}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                id={id}
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => onChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-border rounded-full peer-checked:bg-primary transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-text-subtle rounded-full peer-checked:translate-x-5 peer-checked:bg-white transition-all" />
            </div>
            <span className="text-sm text-text">{value ? 'Enabled' : 'Disabled'}</span>
          </label>
        );

      case 'select':
        return (
          <select
            id={id}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select...</option>
            {property.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label || option.name}
              </option>
            ))}
          </select>
        );

      case 'json':
        return (
          <textarea
            id={id}
            value={
              typeof value === 'string'
                ? value
                : value
                ? JSON.stringify(value, null, 2)
                : ''
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                onChange(parsed);
              } catch {
                onChange(e.target.value);
              }
            }}
            placeholder={property.placeholder || '{}'}
            rows={6}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono"
          />
        );

      case 'expression':
        return (
          <div className="relative">
            <span className="absolute left-3 top-2 text-primary text-sm font-mono">
              {'{{'}
            </span>
            <input
              id={id}
              type="text"
              value={(value as string) || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={property.placeholder || 'expression'}
              className="w-full pl-9 pr-9 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
            />
            <span className="absolute right-3 top-2 text-primary text-sm font-mono">
              {'}}'}
            </span>
          </div>
        );

      default:
        return (
          <input
            id={id}
            type="text"
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        );
    }
  };

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-text">{property.displayName || property.label || property.name}</span>
        {property.required && <span className="text-red-400 text-xs">*</span>}
      </label>
      {property.description && (
        <p className="text-xs text-text-muted">{property.description}</p>
      )}
      {renderInput()}
    </div>
  );
}
