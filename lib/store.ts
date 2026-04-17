import { create } from 'zustand';
import { ReactFlowNode, ReactFlowEdge } from './types';

interface DiagramState {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  layerFilter: 'all' | 'current' | 'proposed';
  setNodes: (nodes: ReactFlowNode[]) => void;
  setEdges: (edges: ReactFlowEdge[]) => void;
  setLayerFilter: (filter: 'all' | 'current' | 'proposed') => void;
  addNode: (node: ReactFlowNode) => void;
  addEdge: (edge: ReactFlowEdge) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
}

export const useDiagramStore = create<DiagramState>((set) => ({
  nodes: [],
  edges: [],
  layerFilter: 'all',
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  setLayerFilter: (layerFilter) => set({ layerFilter }),
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  removeNode: (id) => set((state) => ({ nodes: state.nodes.filter((n) => n.id !== id) })),
  removeEdge: (id) => set((state) => ({ edges: state.edges.filter((e) => e.id !== id) })),
}));