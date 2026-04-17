'use client';

import { ReactFlowProvider } from 'reactflow';
import { RoomProvider, useUndo, useRedo } from '@liveblocks/react';
import NodeLibrary from '@/components/diagram/NodeLibrary';
import Canvas from '@/components/diagram/Canvas';
import LayerToggle from '@/components/diagram/LayerToggle';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Storage, Presence } from '@/lib/liveblocks';

function UndoRedoButtons() {
  const undo = useUndo();
  const redo = useRedo();
  return (
    <>
      <button
        onClick={undo}
        className="rounded-lg border border-border-light bg-card px-3 py-2 font-ui text-sm font-medium transition-colors hover:bg-accent-primary hover:text-white dark:border-border-dark dark:bg-card-dark"
      >
        Undo
      </button>
      <button
        onClick={redo}
        className="rounded-lg border border-border-light bg-card px-3 py-2 font-ui text-sm font-medium transition-colors hover:bg-accent-primary hover:text-white dark:border-border-dark dark:bg-card-dark"
      >
        Redo
      </button>
    </>
  );
}

const ROOM_ID = 'sundays-system-map';

const initialStorage: Storage = {
  nodes: [],
  edges: [],
  layerFilter: 'all',
};

export default function HomePage() {
  return (
    <RoomProvider
      id={ROOM_ID}
      initialStorage={initialStorage as any}
      initialPresence={{ cursor: null, name: 'Anonymous', color: '#FF7A3D' }}
    >
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
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-lg border border-border-light bg-card px-4 py-2 font-ui text-sm font-medium transition-colors hover:bg-accent-primary hover:text-white dark:border-border-dark dark:bg-card-dark">
                Export PNG
              </button>
              <UndoRedoButtons />
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
    </RoomProvider>
  );
}