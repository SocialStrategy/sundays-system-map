import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData } from '@/lib/types';
import { getNodeType } from '@/lib/utils';
import { nodeTypeColors, nodeTypeIcons } from '@/lib/constants';

export default function CustomNode({ data }: NodeProps<NodeData>) {
  const type = getNodeType(data.category || 'external');
  const colors = nodeTypeColors[type] || nodeTypeColors.default;
  const icon = nodeTypeIcons[type] || '⬤';

  return (
    <div
      className="relative rounded-2xl border-2 p-4 shadow-lg transition-all hover:shadow-xl"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        minWidth: '200px',
        maxWidth: '300px',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: colors.border }} />
      <Handle type="source" position={Position.Right} style={{ background: colors.border }} />
      <div className="flex items-start gap-3">
        <div className="text-2xl">{icon}</div>
        <div className="flex-1">
          <div className="font-heading text-lg font-bold">{data.label}</div>
          {data.description && (
            <div className="font-body mt-1 text-sm opacity-80">{data.description}</div>
          )}
          {data.metadata && Object.keys(data.metadata).length > 0 && (
            <div className="font-mono mt-2 text-xs">
              {Object.entries(data.metadata).map(([key, value]) => (
                <div key={key}>
                  <span className="font-semibold">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}
          {data.layer && (
            <div className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                 style={{ backgroundColor: data.layer === 'current' ? '#DCFCE7' : '#FEF3C7',
                          color: data.layer === 'current' ? '#166534' : '#92400E' }}>
              {data.layer === 'current' ? 'Existing' : 'Proposed'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}