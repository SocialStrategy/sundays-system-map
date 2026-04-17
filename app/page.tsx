'use client';

import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import NodeLibrary from '@/components/diagram/NodeLibrary';
import Canvas from '@/components/diagram/Canvas';
import LayerToggle from '@/components/diagram/LayerToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function HomePage() {
  const [layerFilter, setLayerFilter] = useState<'all' | 'current' | 'proposed'>('all');

  return (
    <ReactFlowProvider>
      <div className="flex h-full">
        {/* Sidebar with node library */}
        <NodeLibrary />

        {/* Main canvas area */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Top toolbar */}
          <div className="flex items-center justify-between border-b border-border-light bg-card p-4 dark:border-border-dark dark:bg-card-dark">
            <div className="flex items-center gap-6">
              <LayerToggle value={layerFilter} onChange={setLayerFilter} />
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-border-light bg-card px-4 py-2 font-ui text-sm font-medium transition-colors hover:bg-accent-primary hover:text-white dark:border-border-dark dark:bg-card-dark">
                Export PNG
              </button>
              <button className="rounded-lg bg-accent-primary px-4 py-2 font-ui text-sm font-medium text-white transition-colors hover:bg-accent-secondary">
                Share Link
              </button>
              <ThemeToggle />
            </div>
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
              <Canvas layerFilter={layerFilter} />
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
