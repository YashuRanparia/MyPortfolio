'use client';
import { useState } from 'react';

// Uploads straight to Cloudinary using a short-lived signature from our (admin-only) API.
export default function Upload({ name, defaultValue = '', accept = 'image/*' }: { name: string; defaultValue?: string; accept?: string }) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function onFile(file?: File) {
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const sig = await fetch('/api/admin/upload-signature', { method: 'POST' }).then((r) => r.ok ? r.json() : Promise.reject(new Error('Uploads not configured')));
      const fd = new FormData();
      for (const k of ['api_key', 'timestamp', 'signature', 'folder']) fd.append(k, sig[k]);
      fd.append('file', file);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloud_name}/auto/upload`, { method: 'POST', body: fd });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error?.message ?? 'Upload failed');
      setUrl(out.secure_url);
    } catch (e) { setErr((e as Error).message); }
    setBusy(false);
  }

  return (
    <div className="upload">
      <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://… or upload" />
      <input type="file" accept={accept} onChange={(e) => onFile(e.target.files?.[0])} disabled={busy} />
      {busy && <small>Uploading…</small>}{err && <small className="err">{err}</small>}
    </div>
  );
}
