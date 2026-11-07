import { requireAdmin } from '../../../lib/auth';
import { qrFor } from '../../../lib/totp';
import { beginTotp, changePassword, confirmTotp, disableTotp, signOutEverywhere } from '../../../lib/admin-actions';
import { MsgForm } from './forms';

export default async function Security() {
  const admin = await requireAdmin();
  const qr = admin.totpSecret && !admin.totpEnabled ? await qrFor(admin.email, admin.totpSecret) : null;
  return (
    <>
      <h1>Security</h1>
      <section className="card"><h2>Password</h2>
        <MsgForm action={changePassword} submit="Change password">
          <label>Current password<input name="current" type="password" autoComplete="current-password" required /></label>
          <label>New password <small>(12+ characters)</small><input name="next" type="password" autoComplete="new-password" minLength={12} required /></label>
        </MsgForm>
      </section>
      <section className="card"><h2>Two-factor authentication</h2>
        {admin.totpEnabled ? (
          <MsgForm action={disableTotp} submit="Disable 2FA"><p>2FA is on.</p>
            <label>Password to confirm<input name="password" type="password" required /></label></MsgForm>
        ) : qr ? (
          <MsgForm action={confirmTotp} submit="Enable 2FA">
            <p>Scan with an authenticator app, then enter the 6-digit code.</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="2FA QR code" width={200} height={200} />
            <label>Code<input name="code" inputMode="numeric" autoComplete="one-time-code" required /></label>
          </MsgForm>
        ) : <form action={beginTotp}><button>Set up 2FA</button></form>}
      </section>
      <section className="card"><h2>Sessions</h2>
        <form action={signOutEverywhere}><button className="danger">Sign out everywhere</button></form></section>
    </>
  );
}
