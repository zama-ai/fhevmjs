import crypto from 'crypto';
import { encrypt } from './encrypt';

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: crypto.webcrypto.subtle,
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
  },
});

describe('Encryption', () => {
  it('generate a key', () => {
    const key = encrypt(BigInt(2), BigInt(1));
    expect(key).toBeDefined();
  });
});
