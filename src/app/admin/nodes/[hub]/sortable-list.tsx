'use client';
import Sortable from '../../../../components/Sortable';
import { reorderNodes } from '../../../../lib/admin-actions';

export default function SortableNodes({ hub, children }: { hub: string; children: React.ReactNode }) {
  return <Sortable onReorder={(ids) => reorderNodes(hub, ids)}>{children}</Sortable>;
}
