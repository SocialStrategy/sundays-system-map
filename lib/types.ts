// Data model for Sunday's Studios ecosystem mapping whiteboard
import { Node, Edge } from 'reactflow';

export type NodeType = 'studio' | 'data-store' | 'api' | 'vendor' | 'people' | 'external' | 'entity' | 'software' | 'service' | 'physical' | 'client-facing' | 'on-prem' | 'internal' | 'cloud' | 'external' | 'entity';

export interface NodeData {
  id: string;
  label: string;
  type: NodeType;
  category?: string;
  description?: string;
  metadata?: Record<string, any>;
  layer?: 'current' | 'proposed';
  position?: { x: number; y: number };
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  label?: string;
  direction?: 'both' | 'to_source' | 'to_target' | 'to_studio_web_app' | 'to_extranet' | 'to_cms' | 'to_website' | 'to_marqwise' | 'to_client_web_app' | 'to_clients';
  metadata?: Record<string, any>;
}

export interface CommentData {
  id: string;
  nodeId: string;
  author: string;
  text: string;
  timestamp: Date;
}

export interface ArchitectureData {
  version: string;
  description: string;
  nodes: NodeData[];
  edges: EdgeData[];
}

// React Flow node/edge types
export type ReactFlowNode = Node<NodeData>;
export type ReactFlowEdge = Edge<EdgeData>;