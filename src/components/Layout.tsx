import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-[56px] min-h-screen">
      <main className="max-w-[1100px] mx-auto px-6 py-10 pb-16">
        {children}
      </main>
    </div>
  );
}
