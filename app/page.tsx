'use client';

import { ReactFlowProvider } from 'reactflow';
import NodeLibrary from '@/components/diagram/NodeLibrary';
import Canvas from '@/components/diagram/Canvas';
import LayerToggle from '@/components/diagram/LayerToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useDiagramStore } from '@/lib/store';

export default function HomePage() {
  const layerFilter = useDiagramStore((state) => state.layerFilter);

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
              <LayerToggle />
              <div className="font-ui text-sm">
                Showing: <span className="font-semibold">{layerFilter === 'all' ? 'All layers' : layerFilter}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-border-light bg-card px-4 py-2 font-ui text-sm font-medium transition-colors hover:bg-accent-primary hover:text-white dark:border-border-dark dark:bg-card-dark">
                Export PNG
              </button>
              <button className="rounded-lg bg-accent-primary px-4 py-2 font-ui text-sm font-medium text-white transition-colors hover:bg-accent-secondary">
                Share Link
              </button>
              <ThemeToggle />
              <div className="h-8 w-8 rounded-full bg-accent-primary/20 flex items-center justify-center cursor-pointer">
                <span className="font-ui text-sm font-semibold text-accent-primary">?</span>
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}