'use client';

import { LiveblocksProvider } from '@liveblocks/react';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <LiveblocksProvider publicApiKey={process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY!}>
      {children}
    </LiveblocksProvider>
  );
}