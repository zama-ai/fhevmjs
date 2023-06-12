import { createTFHEKey, encryptInteger } from './encrypt';

describe('encrypt', () => {
  it('encrypt/decrypt', async () => {
    const { publicKey, clientKey } = await createTFHEKey();
    const encrypted = encryptInteger(99, publicKey);
    const decrypted = encrypted.decrypt(clientKey);
    expect(decrypted).toBe(99);
  });
});
