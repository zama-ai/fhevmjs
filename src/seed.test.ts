import { generateEncryptedSeed } from './seed';

import crypto from 'crypto';

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: crypto.webcrypto.subtle,
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
  },
});

describe('Generate seed', () => {
  const te = new TextEncoder();
  const td = new TextDecoder();
  it('encrypt and decrypt one character', async () => {
    const seed = await generateEncryptedSeed();
    expect(seed.length).toBe(20);
  });
});
