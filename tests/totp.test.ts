import { generateSync } from 'otplib';
import { describe, expect, it } from 'vitest';
import { checkCode, newSecret } from '../src/lib/totp';

describe('totp', () => {
  it('accepts the current code (with spaces) and rejects a wrong one', () => {
    const secret = newSecret(), code = generateSync({ secret });
    expect(checkCode(secret, code)).toBe(true);
    expect(checkCode(secret, `${code.slice(0, 3)} ${code.slice(3)}`)).toBe(true);
    expect(checkCode(secret, '000000')).toBe(false);
  });
});
