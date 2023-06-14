import { FheUint8, FheUint16, FheUint32 } from 'node-tfhe';
import { createTFHEKey } from '../tfhe';
import { encrypt8, encrypt16, encrypt32 } from './encrypt';

describe('encrypt8', () => {
  it('encrypt/decrypt', async () => {
    const { publicKey, clientKey } = await createTFHEKey();
    const compactList = encrypt8(34, publicKey);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(34);
    });
  });
});

describe('encrypt16', () => {
  it('encrypt/decrypt', async () => {
    const { publicKey, clientKey } = await createTFHEKey();
    const compactList = encrypt16(434, publicKey);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint16) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(434);
    });
  });
});

describe('encrypt32', () => {
  it('encrypt/decrypt', async () => {
    const { publicKey, clientKey } = await createTFHEKey();
    const compactList = encrypt32(30210, publicKey);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint32) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(30210);
    });
  });
});
