'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  Edge,
  Node,
  useReactFlow,
  useNodesState,
  useEdgesState,
  OnConnect,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { loadArchitectureData, layoutNodes } from '@/lib/utils';
import { NodeData, NodeType } from '@/lib/types';

const nodeTypes = {
  custom: CustomNode,
};

interface CanvasProps {
  layerFilter: 'all' | 'current' | 'proposed';
}

export default function Canvas({ layerFilter }: CanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Load architecture data on mount
  useEffect(() => {
    async function load() {
      try {
        const data = await loadArchitectureData();
        const nodesWithLayer = data.nodes.map((node) => ({
          ...node,
          layer: 'current' as const,
        }));
        const { reactFlowNodes, reactFlowEdges } = layoutNodes(nodesWithLayer, data.edges);
        setNodes(reactFlowNodes);
        setEdges(reactFlowEdges);
        // Give React Flow a tick to render, then fit
        setTimeout(() => fitView({ padding: 0.12 }), 100);
      } catch (error) {
        console.error('Failed to load architecture data:', error);
      }
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter nodes/edges by layer
  const filteredNodes = useMemo(() => {
    if (layerFilter === 'all') return nodes;
    return nodes.filter((node) => (node.data as NodeData).layer === layerFilter);
  }, [nodes, layerFilter]);

  const filteredEdges = useMemo(() => {
    if (layerFilter === 'all') return edges;
    const visibleNodeIds = new Set(filteredNodes.map((n) => n.id));
    return edges.filter(
      (edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
    );
  }, [edges, filteredNodes, layerFilter]);

  const onConnect: OnConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, id: `edge_${Date.now()}` }, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node<NodeData> = {
        id: `node_${Date.now()}`,
        type: 'custom',
        position,
        data: {
          id: `node_${Date.now()}`,
          label: `New ${type}`,
          type: type as NodeType,
          description: 'New node',
          layer: 'proposed',
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return (
    <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={filteredNodes}
        edges={filteredEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background-light dark:bg-background-dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeStrokeColor="#000"
          nodeColor={(node) => {
            const type = (node.data as NodeData)?.type || 'default';
            const colors: Record<string, string> = {
              studio: '#F59E0B',
              'data-store': '#3B82F6',
              api: '#10B981',
              vendor: '#8B5CF6',
              people: '#EC4899',
              external: '#64748B',
            };
            return colors[type] || '#CBD5E1';
          }}
          maskColor="rgba(255, 255, 255, 0.6)"
        />
      </ReactFlow>

    </div>
  );
}
