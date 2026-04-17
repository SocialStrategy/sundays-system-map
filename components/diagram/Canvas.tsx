'use client';

import { useCallback, useEffect, useMemo, useRef, MouseEvent } from 'react';
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
import { useStorage, useMutation, useOthers, useMyPresence, useStatus } from '@liveblocks/react';
import { Presence } from '@/lib/liveblocks';
import CustomNode from './CustomNode';
import { loadArchitectureData, layoutNodes } from '@/lib/utils';
import { NodeData, NodeType } from '@/lib/types';

const nodeTypes = {
  custom: CustomNode,
};

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { setViewport } = useReactFlow();
  const layerFilter = (useStorage((root) => root.layerFilter) ?? 'all') as 'all' | 'current' | 'proposed';
  const nodes = (useStorage((root) => root.nodes) ?? []) as unknown as Node<NodeData>[];
  const edges = (useStorage((root) => root.edges) ?? []) as unknown as Edge[];
  const setNodesMutation = useMutation(({ storage }, newNodes: Node<NodeData>[]) => {
    storage.set('nodes', newNodes as any);
  }, []);
  const setEdgesMutation = useMutation(({ storage }, newEdges: Edge[]) => {
    storage.set('edges', newEdges as any);
  }, []);
  const addNodeMutation = useMutation(({ storage }, node: Node<NodeData>) => {
    const nodes = storage.get('nodes') as any;
    nodes.push(node as any);
  }, []);
  const addEdgeMutation = useMutation(({ storage }, edge: Edge) => {
    const edges = storage.get('edges') as any;
    edges.push(edge as any);
  }, []);
  const status = useStatus();
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  // Load initial data
  const loadedRef = useRef(false);
  useEffect(() => {
    if (status !== 'connected' || loadedRef.current) return;
    async function loadInitialData() {
      try {
        const data = await loadArchitectureData();
        // Assign layer: default 'current' for existing, 'proposed' for new (none in initial data)
        const nodesWithLayer = data.nodes.map((node) => ({
          ...node,
          layer: 'current' as const,
        }));
        const { reactFlowNodes, reactFlowEdges } = layoutNodes(nodesWithLayer, data.edges);
        // Only set if storage is still empty (maybe check nodes length)
        setNodesMutation(reactFlowNodes);
        setEdgesMutation(reactFlowEdges);
        // Center viewport
        setViewport({ x: 0, y: 0, zoom: 0.8 });
        loadedRef.current = true;
      } catch (error) {
        console.error('Failed to load architecture data:', error);
      }
    }
    loadInitialData();
  }, [status, setNodesMutation, setEdgesMutation, setViewport]);

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
      const newEdge = addEdge(params, edges);
      // addEdge returns a new edges array with the new edge appended (without id)
      // we need to add id to the last edge
      const edgeWithId = { ...newEdge[newEdge.length - 1], id: `edge_${Date.now()}` };
      const updatedEdges = [...edges, edgeWithId];
      setEdgesMutation(updatedEdges);
    },
    [edges, setEdgesMutation]
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges(changes, nodes);
      setNodesMutation(updatedNodes);
    },
    [nodes, setNodesMutation]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      const updatedEdges = applyEdgeChanges(changes, edges);
      setEdgesMutation(updatedEdges);
    },
    [edges, setEdgesMutation]
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

      addNodeMutation(newNode);
    },
    [addNodeMutation]
  );

  // Presence: update cursor position on mouse move
  const onPaneMouseMove = useCallback((event: React.MouseEvent) => {
    if (!reactFlowWrapper.current) return;
    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    updateMyPresence({ cursor: { x, y } });
  }, [updateMyPresence]);

  const onPaneMouseLeave = useCallback(() => {
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

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
        onPaneMouseMove={onPaneMouseMove as any}
        onPaneMouseLeave={onPaneMouseLeave}
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
      {/* Other users' cursors */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {others.map((other) => {
          const presence = other.presence as Presence;
          if (!presence?.cursor) return null;
          const { x, y } = presence.cursor;
          return (
            <div
              key={other.connectionId}
              className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{
                left: x - 8,
                top: y - 8,
                backgroundColor: presence.color || '#FF7A3D',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {presence.name || 'Anonymous'}
              </div>
            </div>
          );
        })}
      </div>
      {/* Presence panel */}
      <div className="absolute right-4 bottom-4 z-10 bg-card/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg dark:bg-card-dark/80">
        <h4 className="font-ui font-semibold text-sm mb-2">Collaborators</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-primary flex items-center justify-center text-xs text-white">
              {(myPresence as Presence).name?.charAt(0) || 'A'}
            </div>
            <span className="font-body text-sm">You</span>
          </div>
          {others.map((other) => {
            const presence = other.presence as Presence;
            return (
              <div key={other.connectionId} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white"
                  style={{ backgroundColor: presence.color || '#FF7A3D' }}
                >
                  {presence.name?.charAt(0) || '?'}
                </div>
                <span className="font-body text-sm">{presence.name || 'Anonymous'}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute left-4 top-4 z-10">
        <div className="rounded-2xl bg-card/80 p-4 backdrop-blur-sm dark:bg-card-dark/80">
          <h3 className="font-heading font-bold">Sunday's Studios</h3>
          <p className="font-body text-sm">Drag nodes from sidebar, connect edges, toggle layers.</p>
        </div>
      </div>
    </div>
  );
}