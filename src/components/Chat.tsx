'use client';
import { useRef, useState } from 'react';

type Msg = { role: 'user' | 'assistant'; content: string };

// Asks the guide; on replies, strips [[node:ID]] tags and reports the first one so the sky can fly to it.
export default function Chat({ onNode }: { onNode: (id: number) => void }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.current!.value.trim();
    if (!text || busy) return;
    input.current!.value = '';
    const next: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next); setBusy(true);
    let reply = 'The guide is unavailable right now.';
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: next.slice(-10) }) });
      const out = await res.json();
      reply = res.ok ? out.reply : out.error ?? reply;
    } catch { /* keep default message */ }
    const tag = /\[\[node:(\d+)\]\]/.exec(reply);
    setMsgs([...next, { role: 'assistant', content: reply.replace(/\s*\[\[node:\d+\]\]/g, '').trim() }]);
    setBusy(false);
    if (tag) onNode(Number(tag[1]));
    setTimeout(() => log.current?.scrollTo(0, 1e6), 50);
  }

  return (
    <div className={`chat ${open ? 'open' : ''}`}>
      {open && (
        <div className="chatbox">
          <div className="chatlog" ref={log} aria-live="polite">
            {msgs.length === 0 && <p className="dim">Ask me anything about this portfolio. I&apos;ll point you to the right star.</p>}
            {msgs.map((m, i) => <p key={i} className={m.role}>{m.content}</p>)}
            {busy && <p className="assistant dim">…</p>}
          </div>
          <form onSubmit={send}><input ref={input} maxLength={600} placeholder="e.g. Which projects use Postgres?" aria-label="Your question" /><button disabled={busy}>Ask</button></form>
        </div>
      )}
      <button className="chatfab" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? '×' : '✦ Ask'}</button>
    </div>
  );
}
