import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import Md from '../src/components/Md';

const html = (md: string) => renderToStaticMarkup(<Md>{md}</Md>);

// Admin-authored text is rendered publicly, so it must never be able to inject script.
describe('Md', () => {
  it('renders basic markdown', () => expect(html('**hi**')).toContain('<strong>hi</strong>'));
  it('escapes raw HTML', () => {
    const out = html('<script>alert(1)</script><img src=x onerror=alert(1)>');
    expect(out).not.toContain('<script');
    expect(out).not.toContain('<img');
  });
  it('drops javascript: links and hardens normal ones', () => {
    expect(html('[x](javascript:alert(1))')).not.toContain('javascript:');
    const ok = html('[x](https://example.com)');
    expect(ok).toContain('rel="noopener noreferrer"');
    expect(ok).toContain('target="_blank"');
  });
});
