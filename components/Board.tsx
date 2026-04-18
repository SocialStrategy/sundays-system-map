'use client';

import { useCallback } from 'react';
import { Tldraw, Editor, createShapeId, createBindingId } from 'tldraw';
import 'tldraw/tldraw.css';

interface ArchNode {
  id: string;
  label: string;
  category?: string;
  description?: string;
  metadata?: Record<string, string | number>;
}
interface ArchEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}
interface ArchData { nodes: ArchNode[]; edges: ArchEdge[]; }

function toRichText(lines: string[]) {
  return {
    type: 'doc',
    content: lines.map((line, i) => ({
      type: 'paragraph',
      content: line
        ? [{ type: 'text', text: line, ...(i === 0 ? { marks: [{ type: 'bold' }] } : {}) }]
        : [],
    })),
  };
}

function catColor(cat: string) {
  const map: Record<string, string> = {
    external: 'grey',
    physical: 'yellow',
    'client-facing': 'light-green',
    'on-prem': 'light-blue',
    internal: 'light-violet',
    cloud: 'light-red',
  };
  return map[cat] || 'grey';
}

const LANES = [
  { key: 'clients', label: '👥 Clients & Apps', x: 0 },
  { key: 'studios', label: '🏢 Studios (40 locations)', x: 520 },
  { key: 'hq', label: '🖥️ HQ / Internal', x: 1040 },
  { key: 'vendors', label: '🌐 External Vendors', x: 1560 },
];

function assignLane(node: ArchNode): string {
  if (['clients', 'client_web_app', 'client_data_cloud', 'website'].includes(node.id)) return 'clients';
  const cat = node.category || 'external';
  if (['physical', 'on-prem'].includes(cat)) return 'studios';
  if (cat === 'internal') return 'hq';
  return 'vendors';
}

function buildScene(editor: Editor, data: ArchData) {
  const LANE_W = 440;
  const NODE_W = 380;
  const NODE_GAP = 30;
  const LANE_HEADER = 80;
  const LANE_PAD = 30;
  const NODE_H = 140;

  const laneNodes: Record<string, ArchNode[]> = {};
  for (const l of LANES) laneNodes[l.key] = [];
  for (const n of data.nodes) laneNodes[assignLane(n)].push(n);

  const shapeIds: Record<string, ReturnType<typeof createShapeId>> = {};
  const shapePositions: Record<string, { x: number; y: number; w: number; h: number }> = {};

  for (const lane of LANES) {
    const nodes = laneNodes[lane.key];
    const laneH = LANE_HEADER + nodes.length * (NODE_H + NODE_GAP) + LANE_PAD * 2;

    editor.createShape({
      id: createShapeId(`frame_${lane.key}`),
      type: 'frame',
      x: lane.x,
      y: 0,
      props: { w: LANE_W, h: Math.max(laneH, 600), name: lane.label },
    });

    nodes.forEach((node, i) => {
      const sid = createShapeId(node.id);
      shapeIds[node.id] = sid;

      const lines = [node.label];
      if (node.description) lines.push(node.description);
      if (node.metadata) {
        const meta = Object.entries(node.metadata).map(([k, v]) => `${k}: ${v}`).join(' · ');
        if (meta) lines.push(meta);
      }

      const nodeX = lane.x + (LANE_W - NODE_W) / 2;
      const nodeY = LANE_HEADER + LANE_PAD + i * (NODE_H + NODE_GAP);
      shapePositions[node.id] = { x: nodeX, y: nodeY, w: NODE_W, h: NODE_H };

      editor.createShape({
        id: sid,
        type: 'note',
        x: nodeX,
        y: nodeY,
        props: {
          color: catColor(node.category || 'external'),
          size: 's',
          font: 'sans',
          align: 'start' as const,
          verticalAlign: 'start' as const,
          richText: toRichText(lines),
        } as any,
      });
    });
  }

  for (const edge of data.edges) {
    const srcId = shapeIds[edge.source];
    const tgtId = shapeIds[edge.target];
    if (!srcId || !tgtId) continue;

    const srcPos = shapePositions[edge.source];
    const tgtPos = shapePositions[edge.target];
    if (!srcPos || !tgtPos) continue;

    const arrowId = createShapeId(edge.id);
    editor.createShape({
      id: arrowId,
      type: 'arrow',
      x: 0,
      y: 0,
      props: {
        color: 'grey' as const,
        size: 's' as const,
        font: 'sans' as const,
        richText: toRichText([edge.label || '']),
        start: { x: srcPos.x + srcPos.w / 2, y: srcPos.y + srcPos.h / 2 },
        end: { x: tgtPos.x + tgtPos.w / 2, y: tgtPos.y + tgtPos.h / 2 },
      } as any,
    });

    editor.createBinding({
      type: 'arrow',
      fromId: arrowId,
      toId: srcId,
      props: {
        terminal: 'start',
        normalizedAnchor: { x: 0.5, y: 0.5 },
        isExact: false,
        isPrecise: false,
      } as any,
    });

    editor.createBinding({
      type: 'arrow',
      fromId: arrowId,
      toId: tgtId,
      props: {
        terminal: 'end',
        normalizedAnchor: { x: 0.5, y: 0.5 },
        isExact: false,
        isPrecise: false,
      } as any,
    });
  }

  setTimeout(() => editor.zoomToFit({ animation: { duration: 400 } }), 200);
}

export default function Board() {
  const handleMount = useCallback((editor: Editor) => {
    fetch('/architecture.json')
      .then((r) => r.json())
      .then((data: ArchData) => buildScene(editor, data))
      .catch((err) => console.error('Failed to load architecture:', err));
  }, []);

  return <Tldraw onMount={handleMount} />;
}
