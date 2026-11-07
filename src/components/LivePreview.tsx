'use client';
import { useEffect, useRef, useState } from 'react';
import Md from './Md';

type V = { title: string; summary: string; body: string; url: string; imageUrl: string; tags: string };

// Mirrors the public side panel. Reads the surrounding form, so it needs no wiring to the fields.
export default function LivePreview({ color, hub }: { color: string; hub: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState<V | null>(null);

  useEffect(() => {
    const form = ref.current!.closest('form')!;
    const read = () => {
      const f = new FormData(form), g = (k: string) => String(f.get(k) ?? '');
      const next = { title: g('title'), summary: g('summary'), body: g('body'), url: g('url'), imageUrl: g('imageUrl'), tags: g('tags') };
      setV((p) => (p && JSON.stringify(p) === JSON.stringify(next) ? p : next));
    };
    read();
    form.addEventListener('input', read);
    const id = setInterval(read, 500); // catches value changes made by the upload widget
    return () => { form.removeEventListener('input', read); clearInterval(id); };
  }, []);

  return (
    <div ref={ref} className="preview side open" style={{ ['--col' as string]: color }}>
      <div className="tag">{hub} · live preview</div>
      {v && <>
        <h2>{v.title || 'Untitled'}</h2>
        {/^https:\/\//.test(v.imageUrl) && /* eslint-disable-next-line @next/next/no-img-element */ <img src={v.imageUrl} alt="" />}
        {v.summary && <p className="lead">{v.summary}</p>}
        {v.body && <Md>{v.body}</Md>}
        <div className="chips">{v.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => <span key={t}>{t}</span>)}</div>
        {v.url && <span className="cta">Open ↗</span>}
      </>}
    </div>
  );
}
