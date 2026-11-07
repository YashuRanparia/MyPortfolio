'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="auth"><div className="lost"><h1>Something went wrong</h1><p>The stars hiccuped. Try again in a moment.</p><button onClick={reset}>Retry</button></div></main>
  );
}
