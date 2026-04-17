import { ReactFlowNode, ReactFlowEdge } from './types';

// Define the storage structure for Liveblocks
export type Storage = {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  layerFilter: 'all' | 'current' | 'proposed';
};

// Presence type: each user's cursor position and avatar
export type Presence = {
  cursor: { x: number; y: number } | null;
  name: string;
  color: string; // hex color for avatar
  // optional: selected node id, etc.
};

// Room metadata (optional)
export type RoomMetadata = {
  name: string;
  description: string;
  createdAt: string;
};