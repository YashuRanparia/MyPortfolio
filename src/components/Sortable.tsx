'use client';
import { useRef } from 'react';

// Native drag-and-drop: drag a card by its ".grip" handle, drop to reorder, then persist the new id order.
// Children must be elements with a data-id; keyboard users keep the ↑/↓ buttons inside each card.
export default function Sortable({ onReorder, children }: { onReorder: (ids: number[]) => Promise<void>; children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const dragging = useRef<HTMLElement | null>(null);

  const card = (t: EventTarget | null) => (t as HTMLElement).closest<HTMLElement>('[data-id]');
  const ids = () => [...root.current!.querySelectorAll<HTMLElement>(':scope > [data-id]')].map((e) => Number(e.dataset.id));

  return (
    <div
      ref={root}
      onDragStart={(e) => {
        if (!(e.target as HTMLElement).closest('.grip')) return e.preventDefault();
        dragging.current = card(e.target);
        if (dragging.current) e.dataTransfer.setDragImage(dragging.current, 20, 20);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(() => dragging.current?.classList.add('dragging'));
      }}
      onDragOver={(e) => {
        const over = card(e.target), cur = dragging.current;
        if (!cur || !over || over === cur || over.parentElement !== root.current) return;
        e.preventDefault();
        const r = over.getBoundingClientRect();
        root.current!.insertBefore(cur, e.clientY < r.top + r.height / 2 ? over : over.nextSibling);
      }}
      onDrop={(e) => e.preventDefault()}
      onDragEnd={async () => { dragging.current?.classList.remove('dragging'); dragging.current = null; await onReorder(ids()); }}
    >
      {children}
    </div>
  );
}
