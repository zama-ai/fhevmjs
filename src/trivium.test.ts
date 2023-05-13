import { encrypt } from './trivium';

describe('Trivium', () => {
  const te = new TextEncoder();
  const td = new TextDecoder();
  it('encrypt and decrypt one character', () => {
    const key = '80000000000000000000';
    const iv = '00000000000000000000';
    const message = 'a';
    const uint8 = te.encode(message);
    const encrypted = encrypt(key, iv, uint8);
    expect(td.decode(encrypted)).toBe('Y');
    const decrypted = encrypt(key, iv, encrypted);
    expect(td.decode(decrypted)).toBe('a');
  });
  it('encrypt and decrypt multiple word', () => {
    const key = '80000000000000000000';
    const iv = '00000000000000000000';
    const message = 'Trivium';
    const uint8 = te.encode(message);
    const encrypted = encrypt(key, iv, uint8);
    const decrypted = encrypt(key, iv, encrypted);
    expect(td.decode(decrypted)).toBe('Trivium');
  });
});
