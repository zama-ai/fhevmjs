import { FheUint32 } from 'node-tfhe';
import { createTFHEKey } from '../tfhe';
import { encryptInteger } from './encrypt';

describe('encrypt', () => {
  it('encrypt/decrypt', async () => {
    const { publicKey, clientKey } = await createTFHEKey();
    const compactList = encryptInteger(99, publicKey);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint32) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(99);
    });
  });
});
