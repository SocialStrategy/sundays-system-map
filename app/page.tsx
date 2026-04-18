'use client';

import dynamic from 'next/dynamic';

const Board = dynamic(() => import('@/components/Board'), { ssr: false });

export default function Page() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Board />
    </div>
  );
}
