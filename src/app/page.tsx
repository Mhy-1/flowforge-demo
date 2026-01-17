'use client';

/**
 * Dashboard Page
 * ==============
 * Home page showing all flows and recent execution history
 */

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  getFlows,
  getRuns,
  createFlow,
  deleteFlow,
  duplicateFlow,
  exportFlow,
  initializeMockData,
} from '@/lib/mock-db';
import { ImportFlowDialog } from '@/components/ImportFlowDialog';
import type { Flow, Run } from '@/types';

export default function DashboardPage() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load data on mount
  useEffect(() => {
    initializeMockData();
    setFlows(getFlows());
    setRuns(getRuns());
    setIsLoading(false);
  }, []);

  const handleCreateFlow = useCallback(() => {
    const newFlow = createFlow({
      name: 'Untitled Flow',
      description: '',
      nodes: [],
      edges: [],
      settings: {},
      status: 'draft',
    });
    setFlows(getFlows());
    // Navigate to editor
    window.location.href = `/editor/${newFlow.id}`;
  }, []);

  const handleDeleteFlow = useCallback((flowId: string) => {
    if (confirm('Are you sure you want to delete this flow?')) {
      deleteFlow(flowId);
      setFlows(getFlows());
      setRuns(getRuns());
    }
  }, []);

  const handleDuplicateFlow = useCallback((flowId: string) => {
    duplicateFlow(flowId);
    setFlows(getFlows());
  }, []);

  const handleExportFlow = useCallback((flowId: string) => {
    const json = exportFlow(flowId);
    if (!json) return;
    const flow = flows.find((f) => f.id === flowId);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${flow?.name || 'flow'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [flows]);

  const handleImported = useCallback(() => {
    setFlows(getFlows());
  }, []);

  // Filter flows by search
  const filteredFlows = flows.filter((flow) =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get recent runs
  const recentRuns = runs.slice(0, 5);

  // Get run count for each flow
  const getFlowRunCount = (flowId: string) => runs.filter((r) => r.flowId === flowId).length;

  // Get last run for a flow
  const getLastRun = (flowId: string) =>
    runs.filter((r) => r.flowId === flowId).sort((a, b) =>
      new Date(b.startedAt || b.createdAt).getTime() - new Date(a.startedAt || a.createdAt).getTime()
    )[0];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-text">FlowForge</h1>
                <p className="text-xs text-text-muted">Visual Workflow Builder</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImportDialog(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors"
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Import
              </button>
              <button
                onClick={handleCreateFlow}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Flow
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flows Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-text">Your Flows</h2>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-subtle"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm bg-surface border border-border rounded-lg text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
                />
              </div>
            </div>

            {filteredFlows.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-text-subtle"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-text mb-2">No flows yet</h3>
                <p className="text-sm text-text-muted mb-6">
                  Create your first workflow to get started
                </p>
                <button
                  onClick={handleCreateFlow}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Create Flow
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFlows.map((flow) => {
                  const lastRun = getLastRun(flow.id);
                  const runCount = getFlowRunCount(flow.id);

                  return (
                    <div
                      key={flow.id}
                      className="bg-surface border border-border rounded-xl p-4 hover:border-border-accent transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Link
                          href={`/editor/${flow.id}`}
                          className="flex-1 min-w-0"
                        >
                          <h3 className="text-sm font-medium text-text truncate group-hover:text-primary transition-colors">
                            {flow.name}
                          </h3>
                          <p className="text-xs text-text-muted mt-0.5">
                            {flow.nodes.length} nodes
                          </p>
                        </Link>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleExportFlow(flow.id)}
                            className="p-1.5 text-text-subtle hover:text-text hover:bg-surface-hover rounded-md transition-colors"
                            title="Export"
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
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDuplicateFlow(flow.id)}
                            className="p-1.5 text-text-subtle hover:text-text hover:bg-surface-hover rounded-md transition-colors"
                            title="Duplicate"
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
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteFlow(flow.id)}
                            className="p-1.5 text-text-subtle hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            title="Delete"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-subtle">
                          {runCount} {runCount === 1 ? 'run' : 'runs'}
                        </span>
                        {lastRun && (
                          <span
                            className={cn(
                              'px-1.5 py-0.5 rounded',
                              lastRun.status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : lastRun.status === 'failed'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-amber-500/20 text-amber-400'
                            )}
                          >
                            {lastRun.status}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-border-subtle text-xs text-text-subtle">
                        Updated {formatDate(flow.updatedAt)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Runs Section */}
          <div>
            <h2 className="text-lg font-medium text-text mb-4">Recent Runs</h2>

            {recentRuns.length === 0 ? (
              <div className="bg-surface border border-border rounded-xl p-6 text-center">
                <p className="text-sm text-text-muted">No runs yet</p>
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl divide-y divide-border-subtle">
                {recentRuns.map((run) => {
                  const flow = flows.find((f) => f.id === run.flowId);

                  return (
                    <div key={run.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/editor/${run.flowId}`}
                          className="text-sm font-medium text-text hover:text-primary transition-colors truncate"
                        >
                          {flow?.name || 'Unknown Flow'}
                        </Link>
                        <span
                          className={cn(
                            'text-xs px-1.5 py-0.5 rounded',
                            run.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : run.status === 'failed'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-amber-500/20 text-amber-400'
                          )}
                        >
                          {run.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-subtle">
                        <span>{formatDate(run.startedAt || run.createdAt)}</span>
                        {run.completedAt && run.startedAt && (
                          <span>
                            {Math.round(
                              (new Date(run.completedAt).getTime() -
                                new Date(run.startedAt).getTime()) /
                                1000
                            )}
                            s
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-text">{flows.length}</p>
                <p className="text-xs text-text-muted">Total Flows</p>
              </div>
              <div className="bg-surface border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-semibold text-text">{runs.length}</p>
                <p className="text-xs text-text-muted">Total Runs</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Import Dialog */}
      <ImportFlowDialog
        isOpen={showImportDialog}
        onClose={() => setShowImportDialog(false)}
        onImported={handleImported}
      />
    </div>
  );
}
