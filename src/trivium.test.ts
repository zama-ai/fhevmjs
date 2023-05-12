import { encrypt, stringToHex } from './trivium';

describe('Trivium', () => {
  it('encrypt and decrypt one character', () => {
    const key = '80000000000000000000';
    const iv = '00000000000000000000';
    const message = 'a';
    const encrypted = encrypt(key, iv, message);
    expect(encrypted).toBe('Y');
    const decrypted = encrypt(key, iv, encrypted);
    expect(decrypted).toBe('a');
  });
  it('encrypt and decrypt multiple word', () => {
    const key = '80000000000000000000';
    const iv = '00000000000000000000';
    const message = 'Trivium';
    const encrypted = encrypt(key, iv, message);
    expect(stringToHex(encrypted)).toBe('6c99ef891a7817');
    const decrypted = encrypt(key, iv, encrypted);
    expect(decrypted).toBe('Trivium');
  });
});
