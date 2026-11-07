'use client';
import { useActionState } from 'react';
import { login } from './actions';

export default function Login() {
  const [error, action, pending] = useActionState(login, null);
  return (
    <main className="auth">
      <form action={action} className="card">
        <h1>Admin</h1>
        <label>Email<input name="email" type="email" autoComplete="username" required autoFocus /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <label>Authenticator code <small>(only if you enabled 2FA)</small>
          <input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" />
        </label>
        {error && <p className="err" role="alert">{error}</p>}
        <button disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  );
}
