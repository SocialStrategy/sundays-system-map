import { useRef } from 'react';
import { nodeTypeColors, nodeTypeIcons, nodeTypes } from '@/lib/constants';

export default function NodeLibrary() {
  const dragRef = useRef<HTMLDivElement>(null);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full w-64 overflow-y-auto border-r border-border-light bg-card p-4 dark:border-border-dark dark:bg-card-dark">
      <h2 className="font-heading text-xl font-bold mb-4">Node Library</h2>
      <p className="font-body text-sm text-muted-foreground mb-6">
        Drag and drop node types onto the canvas.
      </p>
      <div className="space-y-3">
        {nodeTypes.map((node) => {
          const colors = nodeTypeColors[node.type] || nodeTypeColors.default;
          const icon = nodeTypeIcons[node.type] || '⬤';
          return (
            <div
              key={node.type}
              ref={dragRef}
              className="flex cursor-grab items-center gap-3 rounded-xl border-2 p-3 transition-all active:cursor-grabbing hover:scale-[1.02] hover:shadow-md"
              style={{ borderColor: colors.border, backgroundColor: colors.bg }}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
            >
              <div className="text-2xl">{icon}</div>
              <div>
                <div className="font-ui font-semibold" style={{ color: colors.text }}>
                  {node.label}
                </div>
                <div className="font-body text-xs opacity-75">{node.description}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8">
        <h3 className="font-ui font-semibold mb-2">How to use</h3>
        <ul className="font-body text-sm space-y-1">
          <li>• Drag a node onto the canvas</li>
          <li>• Connect nodes with edges</li>
          <li>• Toggle layers to see current vs proposed</li>
          <li>• Export PNG for sharing</li>
        </ul>
      </div>
    </div>
  );
}