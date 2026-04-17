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
  // Check if any node has pre‑computed position
  const hasCustomPositions = nodes.some(node => node.position);
  
  if (hasCustomPositions) {
    // Use custom positions for nodes that have them; fallback to dagre for others
    const nodesWithPos: NodeData[] = [];
    const nodesWithoutPos: NodeData[] = [];
    
    nodes.forEach(node => {
      if (node.position) {
        nodesWithPos.push(node);
      } else {
        nodesWithoutPos.push(node);
      }
    });
    
    // If all nodes have positions, skip dagre entirely
    if (nodesWithoutPos.length === 0) {
      const reactFlowNodes: ReactFlowNode[] = nodes.map(node => ({
        id: node.id,
        type: 'custom',
        position: node.position!, // already checked
        data: node,
        style: { width: 200, height: 80 },
      }));
      
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
    
    // Otherwise, we need to layout nodes without positions using dagre
    // For simplicity, we still run dagre for all nodes, but override positions for those with custom positions
    // This ensures edges are routed correctly relative to all nodes.
  }
  
  // Default dagre layout (original behavior)
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
    // If node has custom position, use it; otherwise use dagre layout
    const position = node.position 
      ? node.position 
      : { x: dagreNode.x - dagreNode.width / 2, y: dagreNode.y - dagreNode.height / 2 };
    return {
      id: node.id,
      type: 'custom',
      position,
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