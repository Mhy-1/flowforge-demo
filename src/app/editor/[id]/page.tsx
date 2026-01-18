'use client';

/**
 * Flow Editor Page
 * ================
 * Main visual editor for creating and editing flows
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type ReactFlowInstance,
} from '@xyflow/react';
import { cn } from '@/lib/utils';
import {
  getFlow,
  updateFlow,
  exportFlow,
  initializeMockData,
  addRun,
} from '@/lib/mock-db';
import { executeMockFlow } from '@/lib/mock-executor';
import { allNodeDefinitions } from '@/data/node-definitions';
import {
  FlowCanvas,
  FlowToolbar,
  NodePalette,
  NodeConfigPanel,
  ExecutionPanel,
} from '@/components/flow-editor';
import { ImportFlowDialog } from '@/components/ImportFlowDialog';
import type { FlowEditorNode, FlowEditorEdge, FlowNodeData } from '@/components/flow-editor/types';
import type { Flow, Run, ExecutionLog } from '@/types';

interface PageProps {
  params: { id: string };
}

export default function EditorPage({ params }: PageProps) {
  const router = useRouter();
  const flowId = params.id;

  // Flow state
  const [flow, setFlow] = useState<Flow | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowEditorNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEditorEdge>([]);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance<FlowEditorNode, FlowEditorEdge> | null>(null);

  // UI state
  const [selectedNode, setSelectedNode] = useState<FlowEditorNode | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<Run | null>(null);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);

  // Node definitions map
  const allNodeDefinitionsMap = useMemo(() => {
    const map = new Map();
    allNodeDefinitions.forEach((def) => map.set(def.id, def));
    return map;
  }, []);

  // Load flow on mount
  useEffect(() => {
    initializeMockData();
    const loadedFlow = getFlow(flowId);
    if (!loadedFlow) {
      router.push('/');
      return;
    }

    setFlow(loadedFlow);

    // Convert flow nodes to React Flow format
    const rfNodes: FlowEditorNode[] = loadedFlow.nodes.map((node) => ({
      id: node.id,
      type: node.data.category,
      position: node.position,
      data: {
        nodeType: node.data.nodeType,
        label: node.data.label,
        category: node.data.category,
        icon: node.data.icon,
        properties: node.data.properties || {},
      },
    }));

    // Convert flow edges to React Flow format
    const rfEdges: FlowEditorEdge[] = loadedFlow.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle || undefined,
      targetHandle: edge.targetHandle || undefined,
      type: 'smoothstep',
      animated: false,
    }));

    setNodes(rfNodes);
    setEdges(rfEdges);
  }, [flowId, router, setNodes, setEdges]);

  // Track changes
  useEffect(() => {
    if (flow) {
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges, flow?.name]);

  // Handle node connection
  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'smoothstep' }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowEditorNode) => {
      setSelectedNode(node);
    },
    []
  );

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle adding new node
  const handleNodeAdd = useCallback(
    (nodeType: string, position: { x: number; y: number }, data: FlowNodeData) => {
      const newNode: FlowEditorNode = {
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: nodeType,
        position,
        data,
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Handle property change
  const handlePropertyChange = useCallback(
    (nodeId: string, propertyName: string, value: unknown) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  properties: {
                    ...node.data.properties,
                    [propertyName]: value,
                  },
                },
              }
            : node
        )
      );

      // Update selected node if it's the one being edited
      setSelectedNode((prev) =>
        prev?.id === nodeId
          ? {
              ...prev,
              data: {
                ...prev.data,
                properties: {
                  ...prev.data.properties,
                  [propertyName]: value,
                },
              },
            }
          : prev
      );
    },
    [setNodes]
  );

  // Handle name change
  const handleNameChange = useCallback((name: string) => {
    setFlow((prev) => (prev ? { ...prev, name } : prev));
  }, []);

  // Save flow
  const handleSave = useCallback(() => {
    if (!flow) return;

    setIsSaving(true);

    // Convert React Flow nodes back to flow format (preserving data structure)
    const updatedFlow: Flow = {
      ...flow,
      name: flow.name,
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.type || node.data.category,
        position: node.position,
        data: {
          nodeType: node.data.nodeType,
          label: node.data.label,
          category: node.data.category,
          icon: node.data.icon,
          properties: node.data.properties,
        },
        label: node.data.label,
      })),
      edges: edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle || 'output',
        targetHandle: edge.targetHandle || 'input',
      })),
      updatedAt: new Date().toISOString(),
    };

    updateFlow(flow.id, updatedFlow);
    setFlow(updatedFlow);
    setHasUnsavedChanges(false);
    setIsSaving(false);
  }, [flow, nodes, edges]);

  // Run flow
  const handleRun = useCallback(async () => {
    if (!flow || isRunning) return;

    // Save first
    handleSave();

    setIsRunning(true);
    setExecutionLogs([]);
    setExecutingNodeId(null);

    try {
      const run = await executeMockFlow(flow.id, {
        onNodeStart: (nodeId) => {
          setExecutingNodeId(nodeId);
          // Highlight executing node
          setNodes((nds) =>
            nds.map((n) => ({
              ...n,
              data: {
                ...n.data,
                isExecuting: n.id === nodeId,
              },
            }))
          );
        },
        onNodeComplete: (nodeId, success) => {
          setNodes((nds) =>
            nds.map((n) => ({
              ...n,
              data: {
                ...n.data,
                isExecuting: false,
                executionStatus: n.id === nodeId ? (success ? 'success' : 'error') : n.data.executionStatus,
              },
            }))
          );
        },
        onLog: (log) => {
          setExecutionLogs((prev) => [...prev, {
            timestamp: log.createdAt,
            level: log.level,
            message: log.message,
            nodeId: log.nodeId,
            data: log.data,
          }]);
        },
        onComplete: (completedRun) => {
          setCurrentRun(completedRun);
        },
      });

      setCurrentRun(run);
      addRun(run);
    } catch (error) {
      console.error('Execution failed:', error);
      setExecutionLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          level: 'error',
          message: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ]);
    } finally {
      setIsRunning(false);
      setExecutingNodeId(null);
      // Clear execution states after a delay
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: {
              ...n.data,
              isExecuting: false,
              executionStatus: undefined,
            },
          }))
        );
      }, 3000);
    }
  }, [flow, isRunning, handleSave, setNodes]);

  // Export flow
  const handleExport = useCallback(() => {
    if (!flow) return;
    handleSave(); // Save first
    const json = exportFlow(flow.id);
    if (!json) return;
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flow.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [flow, handleSave]);

  // Handle import
  const handleImported = useCallback(
    (importedFlow: Flow) => {
      router.push(`/editor/${importedFlow.id}`);
    },
    [router]
  );

  // Clear logs
  const handleClearLogs = useCallback(() => {
    setExecutionLogs([]);
    setCurrentRun(null);
  }, []);

  // Get selected node definition
  const selectedNodeDefinition = selectedNode
    ? allNodeDefinitionsMap.get(selectedNode.data.nodeType)
    : null;

  if (!flow) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Notice */}
      <div className="lg:hidden bg-amber-500/20 border-b border-amber-500/30 px-4 py-3 text-center">
        <p className="text-sm text-amber-400">
          للحصول على أفضل تجربة، استخدم جهاز الكمبيوتر لتعديل المسارات
        </p>
      </div>

      {/* Toolbar */}
      <FlowToolbar
        flow={flow}
        isRunning={isRunning}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        lastRun={currentRun || undefined}
        onSave={handleSave}
        onRun={handleRun}
        onExport={handleExport}
        onImport={() => setShowImportDialog(true)}
        onNameChange={handleNameChange}
        onBack={() => router.push('/')}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette */}
        <NodePalette nodes={allNodeDefinitions} />

        {/* Flow Canvas */}
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          nodeDefinitions={allNodeDefinitionsMap}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onInit={setReactFlowInstance}
          onNodeAdd={handleNodeAdd}
          className="flex-1"
        />

        {/* Node Config Panel */}
        <NodeConfigPanel
          node={selectedNode}
          nodeDefinition={selectedNodeDefinition}
          onPropertyChange={handlePropertyChange}
          onClose={() => setSelectedNode(null)}
        />
      </div>

      {/* Execution Panel */}
      <ExecutionPanel
        isRunning={isRunning}
        currentRun={currentRun}
        logs={executionLogs}
        onClear={handleClearLogs}
      />

      {/* Import Dialog */}
      <ImportFlowDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImported={handleImported}
      />
    </div>
  );
}
