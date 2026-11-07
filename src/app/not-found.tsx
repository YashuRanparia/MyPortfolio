import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="auth"><div className="lost"><h1>Lost in space</h1><p>That page drifted out of the sky.</p><Link href="/">Back to the constellation →</Link></div></main>
  );
}
