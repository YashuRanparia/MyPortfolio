import { requireAdmin } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { asc, eq } from 'drizzle-orm';
import { db } from '../../../../db';
import { HUBS, nodes, type Hub } from '../../../../db/schema';
import Upload from '../../../../components/Upload';
import LivePreview from '../../../../components/LivePreview';
import SortableNodes from './sortable-list';
import { DEFAULT_HUBS, HINTS } from '../../../../lib/hubs';
import { deleteNode, moveNode, saveNode } from '../../../../lib/admin-actions';

type Node = typeof nodes.$inferSelect;

function NodeForm({ hub, node, color }: { hub: Hub; node?: Node; color: string }) {
  const h = HINTS[hub];
  return (
    <form action={saveNode} className="stack editor">
      <div className="fields stack">
      {node && <input type="hidden" name="id" value={node.id} />}
      <input type="hidden" name="hub" value={hub} />
      <label>Title<input name="title" required maxLength={120} defaultValue={node?.title} placeholder={h.title} /></label>
      <label>Summary<input name="summary" maxLength={300} defaultValue={node?.summary} placeholder={h.summary} /></label>
      <label>Details <small>(Markdown: **bold**, lists, [links](https://…))</small><textarea name="body" rows={8} defaultValue={node?.body} /></label>
      <label>Link<input name="url" defaultValue={node?.url} placeholder={h.url} /></label>
      <label>Tags<input name="tags" defaultValue={node?.tags.join(', ')} placeholder={h.tags} /></label>
      <label>Image<Upload name="imageUrl" defaultValue={node?.imageUrl} /></label>
      <label className="row"><input type="checkbox" name="published" defaultChecked={node?.published ?? true} /> Published</label>
      <button>{node ? 'Save changes' : 'Add star'}</button>
      </div>
      <LivePreview color={color} hub={hub} />
    </form>
  );
}

export default async function HubPage({ params }: { params: Promise<{ hub: string }> }) {
  await requireAdmin();
  const { hub } = await params;
  if (!HUBS.includes(hub as Hub)) notFound();
  const cfg = (await db.query.settings.findFirst())?.hubs ?? DEFAULT_HUBS;
  const color = cfg[hub as Hub].color;
  const list = await db.select().from(nodes).where(eq(nodes.hub, hub as Hub)).orderBy(asc(nodes.position), asc(nodes.id));
  return (
    <>
      <h1 style={{ textTransform: 'capitalize' }}>{hub}</h1>
      <SortableNodes hub={hub}>
      {list.map((n) => (
        <details key={n.id} data-id={n.id} className="card">
          <summary><span className="grip" draggable title="Drag to reorder">⋮⋮</span> {n.title} {!n.published && <em>(draft)</em>}</summary>
          <NodeForm hub={hub as Hub} node={n} color={color} />
          <div className="row">
            <form action={moveNode}><input type="hidden" name="id" value={n.id} /><button name="dir" value="up" className="ghost">↑</button><button name="dir" value="down" className="ghost">↓</button></form>
            <form action={deleteNode}><input type="hidden" name="id" value={n.id} /><button className="danger">Delete</button></form>
          </div>
        </details>
      ))}
      </SortableNodes>
      <details className="card" open={list.length === 0}><summary>＋ New star</summary><NodeForm hub={hub as Hub} color={color} /></details>
    </>
  );
}
