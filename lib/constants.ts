// Design constants for node types

export const nodeTypeColors: Record<string, { bg: string; border: string; text: string }> = {
  studio: { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
  'data-store': { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
  api: { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
  vendor: { bg: '#E0E7FF', border: '#8B5CF6', text: '#5B21B6' },
  people: { bg: '#FCE7F3', border: '#EC4899', text: '#9D174D' },
  external: { bg: '#F1F5F9', border: '#64748B', text: '#334155' },
  default: { bg: '#F8FAFC', border: '#CBD5E1', text: '#475569' },
};

export const nodeTypeIcons: Record<string, string> = {
  studio: '🏢',
  'data-store': '🗄️',
  api: '🔌',
  vendor: '🏪',
  people: '👤',
  external: '🌐',
};

// Node type definitions for library
export const nodeTypes = [
  { type: 'studio', label: 'Studio', description: 'Franchise location' },
  { type: 'data-store', label: 'Data Store', description: 'Database or storage' },
  { type: 'api', label: 'API', description: 'Internal or external API' },
  { type: 'vendor', label: 'Vendor', description: 'Third‑party service' },
  { type: 'people', label: 'People', description: 'Team member or stakeholder' },
  { type: 'external', label: 'External', description: 'External entity or system' },
];