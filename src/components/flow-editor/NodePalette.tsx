'use client';

/**
 * Node Palette Component
 * ======================
 * Sidebar with draggable node types grouped by category
 */

import { useState, useMemo, useCallback, type DragEvent } from 'react';
import { cn } from '@/lib/utils';
import type { NodeDefinition, NodeCategory } from '@/types';
import { categoryStyles, categoryConfig } from './types';

interface NodePaletteProps {
  nodes: NodeDefinition[];
  onDragStart?: (event: DragEvent, nodeDefinition: NodeDefinition) => void;
}

const categoryOrder: NodeCategory[] = ['trigger', 'action', 'logic', 'transform', 'output'];

export function NodePalette({ nodes, onDragStart }: NodePaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<NodeCategory>>(
    new Set(categoryOrder)
  );

  // Group nodes by category
  const groupedNodes = useMemo(() => {
    const groups = new Map<NodeCategory, NodeDefinition[]>();

    for (const category of categoryOrder) {
      groups.set(category, []);
    }

    for (const node of nodes) {
      const category = node.category;
      const existing = groups.get(category) || [];
      groups.set(category, [...existing, node]);
    }

    return groups;
  }, [nodes]);

  // Filter nodes by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return groupedNodes;
    }

    const query = searchQuery.toLowerCase();
    const filtered = new Map<NodeCategory, NodeDefinition[]>();

    Array.from(groupedNodes.entries()).forEach(([category, categoryNodes]) => {
      const matchingNodes = categoryNodes.filter(
        (node) =>
          node.name.toLowerCase().includes(query) ||
          node.description.toLowerCase().includes(query)
      );

      if (matchingNodes.length > 0) {
        filtered.set(category, matchingNodes);
      }
    });

    return filtered;
  }, [groupedNodes, searchQuery]);

  const toggleCategory = useCallback((category: NodeCategory) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }, []);

  const handleDragStart = useCallback(
    (event: DragEvent, nodeDefinition: NodeDefinition) => {
      event.dataTransfer.setData('application/reactflow', JSON.stringify({
        type: nodeDefinition.category,
        nodeType: nodeDefinition.id,
        name: nodeDefinition.name,
        icon: nodeDefinition.icon,
        category: nodeDefinition.category,
      }));
      event.dataTransfer.effectAllowed = 'move';

      onDragStart?.(event, nodeDefinition);
    },
    [onDragStart]
  );

  return (
    <div className="w-64 border-r border-border bg-surface flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-sm font-medium text-text mb-3">Nodes</h2>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-background border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Node Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {categoryOrder.map((category) => {
          const categoryNodes = filteredGroups.get(category);
          if (!categoryNodes || categoryNodes.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const config = categoryConfig[category];
          const styles = categoryStyles[category];

          return (
            <div key={category} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-text-muted hover:text-text rounded-md hover:bg-surface-hover transition-colors"
              >
                <span className={cn('w-4 h-4 flex items-center justify-center', styles.text)}>
                  {isExpanded ? '\u25bc' : '\u25b6'}
                </span>
                <span>{config.label}</span>
                <span className="ml-auto text-xs text-text-subtle">
                  {categoryNodes.length}
                </span>
              </button>

              {/* Category Nodes */}
              {isExpanded && (
                <div className="mt-1 space-y-1 pl-2">
                  {categoryNodes.map((node) => (
                    <div
                      key={node.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg cursor-grab',
                        'border border-transparent transition-all duration-200',
                        'hover:border-border-accent hover:bg-surface-hover',
                        'active:cursor-grabbing active:scale-[0.98]',
                        styles.bg
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-center w-6 h-6 rounded text-xs',
                          styles.accent,
                          'text-white'
                        )}
                      >
                        {node.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {node.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {node.description.slice(0, 50)}
                          {node.description.length > 50 ? '...' : ''}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {filteredGroups.size === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-text-muted">No nodes found</p>
            <p className="text-xs text-text-subtle mt-1">
              Try a different search term
            </p>
          </div>
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-3 border-t border-border-subtle">
        <p className="text-xs text-text-subtle text-center">
          Drag nodes to the canvas
        </p>
      </div>
    </div>
  );
}
