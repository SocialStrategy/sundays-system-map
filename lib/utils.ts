import dagre from 'dagre';
import { ArchitectureData, NodeData, EdgeData, ReactFlowNode, ReactFlowEdge } from './types';

// Load architecture data from JSON
export async function loadArchitectureData(): Promise<ArchitectureData> {
  // In Next.js, we can import JSON directly; but for now we'll fetch from public
  const response = await fetch('/architecture.json');
  if (!response.ok) {
    throw new Error(`Failed to load architecture data: ${response.statusText}`);
  }
  return response.json();
}

// Convert architecture nodes/edges to ReactFlow nodes/edges with layout
export function layoutNodes(
  nodes: NodeData[],
  edges: EdgeData[],
  direction: 'TB' | 'LR' = 'LR'
): { reactFlowNodes: ReactFlowNode[]; reactFlowEdges: ReactFlowEdge[] } {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 100, ranksep: 150 });
  g.setDefaultEdgeLabel(() => ({}));

  // Add nodes to dagre graph with default width/height
  nodes.forEach(node => {
    g.setNode(node.id, { width: 200, height: 80 });
  });

  // Add edges
  edges.forEach(edge => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const reactFlowNodes: ReactFlowNode[] = nodes.map(node => {
    const dagreNode = g.node(node.id);
    return {
      id: node.id,
      type: 'custom',
      position: { x: dagreNode.x - dagreNode.width / 2, y: dagreNode.y - dagreNode.height / 2 },
      data: node,
      style: { width: dagreNode.width, height: dagreNode.height },
    };
  });

  const reactFlowEdges: ReactFlowEdge[] = edges.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
    label: edge.label,
    labelStyle: { fontSize: 12, fontWeight: 500 },
    style: { stroke: '#94a3b8', strokeWidth: 2 },
    markerEnd: 'url(#arrowhead)',
  }));

  return { reactFlowNodes, reactFlowEdges };
}

// Map architecture category to node type for styling
export function getNodeType(category: string): string {
  const map: Record<string, string> = {
    'external': 'external',
    'physical': 'studio',
    'client-facing': 'api',
    'on-prem': 'data-store',
    'internal': 'api',
    'cloud': 'data-store',
    'service': 'vendor',
    'people': 'people',
  };
  return map[category] || 'external';
}

// Generate a unique ID
export function generateId(prefix: string = ''): string {
  return `${prefix}_${Math.random().toString(36).substring(2, 9)}`;
}