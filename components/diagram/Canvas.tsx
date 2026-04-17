'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowInstance,
  useReactFlow,
  useNodesState,
  useEdgesState,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { useDiagramStore } from '@/lib/store';
import { loadArchitectureData, layoutNodes } from '@/lib/utils';
import { NodeData, NodeType } from '@/lib/types';

const nodeTypes = {
  custom: CustomNode,
};

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { setViewport } = useReactFlow();
  const layerFilter = useDiagramStore((state) => state.layerFilter);
  const setStoreNodes = useDiagramStore((state) => state.setNodes);
  const setStoreEdges = useDiagramStore((state) => state.setEdges);
  const addStoreNode = useDiagramStore((state) => state.addNode);
  const addStoreEdge = useDiagramStore((state) => state.addEdge);

  // Load initial data
  useEffect(() => {
    async function loadInitialData() {
      try {
        const data = await loadArchitectureData();
        // Assign layer: default 'current' for existing, 'proposed' for new (none in initial data)
        const nodesWithLayer = data.nodes.map((node) => ({
          ...node,
          layer: 'current' as const,
        }));
        const { reactFlowNodes, reactFlowEdges } = layoutNodes(nodesWithLayer, data.edges);
        setNodes(reactFlowNodes);
        setEdges(reactFlowEdges);
        setStoreNodes(reactFlowNodes);
        setStoreEdges(reactFlowEdges);
        // Center viewport
        setViewport({ x: 0, y: 0, zoom: 0.8 });
      } catch (error) {
        console.error('Failed to load architecture data:', error);
      }
    }
    loadInitialData();
  }, [setNodes, setEdges, setStoreNodes, setStoreEdges, setViewport]);

  // Sync nodes/edges to store on changes (debounced?)
  useEffect(() => {
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);

  useEffect(() => {
    setStoreEdges(edges);
  }, [edges, setStoreEdges]);

  // Filter nodes/edges by layer
  const filteredNodes = useMemo(() => {
    if (layerFilter === 'all') return nodes;
    return nodes.filter((node) => node.data.layer === layerFilter);
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
      setEdges((eds) => {
        const newEdges = addEdge(params, eds);
        const lastEdge = newEdges[newEdges.length - 1];
        lastEdge.id = `edge_${Date.now()}`;
        addStoreEdge(lastEdge);
        return newEdges;
      });
    },
    [setEdges, addStoreEdge]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

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
          description: 'Drag‑and‑dropped node',
          layer: 'proposed',
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addStoreNode(newNode);
    },
    [setNodes, addStoreNode]
  );

  return (
    <div className="relative flex-1" ref={reactFlowWrapper}>
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
            const type = node.data?.type || 'default';
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
      <div className="absolute left-4 top-4 z-10">
        <div className="rounded-2xl bg-card/80 p-4 backdrop-blur-sm dark:bg-card-dark/80">
          <h3 className="font-heading font-bold">Sunday's Studios</h3>
          <p className="font-body text-sm">Drag nodes from sidebar, connect edges, toggle layers.</p>
        </div>
      </div>
    </div>
  );
}