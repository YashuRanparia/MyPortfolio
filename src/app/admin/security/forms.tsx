'use client';
import { useActionState } from 'react';
import type { Msg } from '../../../lib/admin-actions';

export function MsgForm({ action, children, submit }: { action: (s: Msg, f: FormData) => Promise<Msg>; children: React.ReactNode; submit: string }) {
  const [m, run, pending] = useActionState(action, null);
  return (
    <form action={run} className="stack">
      {children}
      {m?.err && <p className="err" role="alert">{m.err}</p>}{m?.ok && <p className="ok">{m.ok}</p>}
      <button disabled={pending}>{submit}</button>
    </form>
  );
}
