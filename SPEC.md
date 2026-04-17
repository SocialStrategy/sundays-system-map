# Sunday's System Mapping Whiteboard – Specification

## Goal
Build a collaborative, Miro‑like whiteboard website for mapping Sunday's Studios ecosystem (40 locations, ~1M visits/year, 8M promo emails, 2M SMS) and proposing a new architecture.

## Core Requirements
1. **Sundai (operations agent) can easily update/restructure** as new info arrives
2. **Presents nicely to share** with stakeholders (Jack, Ted) – professional, clean, branded
3. **Optional commenting** – stakeholders can leave comments directly on the board

## User Stories
- Sundai loads the board, edits nodes/edges, toggles layers, exports PNG/PDF
- Jack/Ted open a shareable link, view the map, add comment pins
- Multiple users can collaborate in real time (cursors, presence)

## Tech Stack
- **Framework**: Next.js 15 (App Router) with TypeScript
- **UI Library**: React Flow (`reactflow`) for diagramming
- **Real‑time Collaboration**: Liveblocks (rooms, presence, comments)
- **State Management**: Zustand (local UI state)
- **Styling**: Tailwind CSS with CSS custom properties
- **Deployment**: Vercel (auto‑deploy from GitHub)
- **Fonts**: Google Fonts (Share Tech headings, Montserrat body, Poppins UI, JetBrains Mono data)

## Design Language (adapted from Pete's style guide)
- **Colors**: Light background (`#f8fafc`), white cards, warm orange accent (`#FF7A3D`)
- **Typography**: Share Tech 700 headings, Montserrat 400 body, Poppins 500 UI labels
- **Layout**: Infinite canvas, node library sidebar, layer toggle toolbar, comment panel
- **Components**: Rounded cards (20px), subtle shadows, glass‑morphism nav, pill‑shaped tags

## Data Model
- **Nodes**: `{ id, type, position, data, layer }`
  - Types: `studio`, `data‑store`, `api`, `vendor`, `people`, `external`
  - Data: label, description, metadata (scale, frequency, etc.)
- **Edges**: `{ id, source, target, label, direction }`
- **Layers**: `current` (existing setup), `proposed` (new architecture)
- **Comments**: `{ id, nodeId, author, text, timestamp }`

## Key Features
1. **React Flow canvas** with Sunday’s‑specific node types (pre‑built library)
2. **Liveblocks room** – real‑time sync, presence avatars, cursors
3. **Layer toggling** – switch between current/proposed views (filter nodes/edges)
4. **JSON import/export** – load from `architecture.json` (already extracted), save updates
5. **Comment pins** – click node to open comment thread, stored in Liveblocks
6. **Export options** – PNG, PDF (via html2canvas + jsPDF)
7. **Undo/redo** – local history within session
8. **Shareable link** – no login required (view‑only), edit with secret token

## Project Structure
```
app/
  layout.tsx
  page.tsx          # main canvas
  api/liveblocks/   # Liveblocks auth endpoints
components/
  diagram/
    Canvas.tsx
    NodeLibrary.tsx
    NodeCustom.tsx
    EdgeCustom.tsx
    LayerToggle.tsx
  collaboration/
    Presence.tsx
    CommentPanel.tsx
  ui/
    Sidebar.tsx
    Toolbar.tsx
    ExportButton.tsx
lib/
  data/
    architecture.json   # initial data
    types.ts
    utils.ts
  liveblocks/
    client.ts
    room.ts
styles/
  globals.css
  theme.css
```

## Implementation Priority
1. **Phase 1** – Next.js setup, React Flow canvas, node rendering, basic layout (1 day)
2. **Phase 2** – Liveblocks integration, presence, real‑time sync (1 day)
3. **Phase 3** – Layer toggling, JSON import/export, comment pins (1 day)
4. **Phase 4** – Export PNG/PDF, polish, deploy (1 day)

## Dependencies (to install)
```json
{
  "reactflow": "^12.0.0",
  "@liveblocks/client": "^1.8.0",
  "@liveblocks/react": "^1.8.0",
  "zustand": "^5.0.0",
  "date‑fns": "^4.0.0",
  "html2canvas": "^1.4.0",
  "jspdf": "^2.5.0",
  "tailwind‑merge": "^2.5.0",
  "clsx": "^2.1.0"
}
```

## Environment Variables
```bash
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_...
LIVEBLOCKS_SECRET_KEY=sk_...
```

## Success Criteria
- Sundai can load the board, drag new studio nodes, connect edges, toggle layers
- Jack/Ted can open link, see the map, add a comment without logging in
- Real‑time cursors work for multiple editors
- Board survives refresh (data persisted in Liveblocks)
- Exported PNG looks professional

---

*This spec is for the DeepSeek Reasoner coding‑agent to implement.*