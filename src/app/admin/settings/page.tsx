import { requireAdmin } from '../../../lib/auth';
import { db } from '../../../db';
import { HUBS } from '../../../db/schema';
import { DEFAULT_HUBS } from '../../../lib/hubs';
import Upload from '../../../components/Upload';
import { saveSettings } from '../../../lib/admin-actions';

export default async function Settings() {
  await requireAdmin();
  const s = await db.query.settings.findFirst();
  const hubs = s?.hubs ?? DEFAULT_HUBS;
  return (
    <>
      <h1>Site settings</h1>
      <form action={saveSettings} className="stack">
        <label>Your name<input name="siteName" required defaultValue={s?.siteName} /></label>
        <label>Tagline<input name="tagline" defaultValue={s?.tagline} /></label>
        <label>Resume (PDF)<Upload name="resumeUrl" defaultValue={s?.resumeUrl} accept="application/pdf" /></label>
        {HUBS.map((h) => (
          <fieldset key={h}><legend>{h} constellation</legend>
            <label>Name<input name={`${h}.name`} required defaultValue={hubs[h].name} /></label>
            <label>Intro text<textarea name={`${h}.blurb`} rows={2} defaultValue={hubs[h].blurb} /></label>
            <label>Colour<input type="color" name={`${h}.color`} defaultValue={hubs[h].color} /></label>
          </fieldset>
        ))}
        <button>Save settings</button>
      </form>
    </>
  );
}
