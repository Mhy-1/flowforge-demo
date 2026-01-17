'use client';

/**
 * Demo Badge Component
 * ====================
 * Visual indicator that this is a demo version with localStorage persistence
 */

import { useState } from 'react';
import { cn } from '@/lib/utils';

export function DemoBadge() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cn(
          'bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg transition-all duration-300',
          isExpanded ? 'p-4 w-80' : 'px-3 py-1.5'
        )}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-white w-full"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="text-sm font-medium">Demo Mode</span>
          <svg
            className={cn(
              'w-4 h-4 ml-auto transition-transform',
              isExpanded && 'rotate-180'
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3 text-white/90">
            <p className="text-xs leading-relaxed">
              This is a demo version of FlowForge. Data is stored in your browser's
              localStorage and will persist until cleared.
            </p>

            <div className="space-y-2 text-xs">
              <h4 className="font-medium text-white">Demo Features:</h4>
              <ul className="space-y-1 text-white/80">
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Visual flow editor
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Mock flow execution
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Import/Export flows
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  localStorage persistence
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t border-white/20">
              <p className="text-[10px] text-white/60">
                No database required. All data stays in your browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
