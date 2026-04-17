'use client';

import { useDiagramStore } from '@/lib/store';
import { clsx } from 'clsx';

export default function LayerToggle() {
  const layerFilter = useDiagramStore((state) => state.layerFilter);
  const setLayerFilter = useDiagramStore((state) => state.setLayerFilter);

  const buttons = [
    { value: 'all' as const, label: 'All', color: 'bg-slate-200 text-slate-800' },
    { value: 'current' as const, label: 'Current', color: 'bg-green-100 text-green-800' },
    { value: 'proposed' as const, label: 'Proposed', color: 'bg-amber-100 text-amber-800' },
  ];

  return (
    <div className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-md dark:bg-card-dark">
      <span className="font-ui text-sm font-semibold px-2">Layers:</span>
      <div className="flex gap-1">
        {buttons.map((btn) => (
          <button
            key={btn.value}
            className={clsx(
              'rounded-xl px-4 py-2 font-ui text-sm font-medium transition-colors',
              layerFilter === btn.value
                ? `${btn.color} shadow-inner`
                : 'bg-transparent text-muted-foreground hover:bg-accent-primary/10'
            )}
            onClick={() => setLayerFilter(btn.value)}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}