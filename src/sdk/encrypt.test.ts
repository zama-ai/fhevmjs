import {
  FheUint8,
  FheUint16,
  FheUint32,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  TfheCompactPublicKey,
  TfheClientKey,
} from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { encrypt8, encrypt16, encrypt32 } from './encrypt';

describe('encrypt8', () => {
  let clientKey: TfheClientKey;
  let publicKey: TfheCompactPublicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
    clientKey = keypair.clientKey;
    publicKey = keypair.publicKey;
  });

  it('encrypt/decrypt 8bits', async () => {
    const buffer = encrypt8(34, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(34);
    });
  });

  it('encrypt/decrypt 16bits', async () => {
    const buffer = encrypt16(434, publicKey);
    const compactList = CompactFheUint16List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint16) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(434);
    });
  });

  it('encrypt/decrypt 32bits', async () => {
    const buffer = encrypt32(30210, publicKey);
    const compactList = CompactFheUint32List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint32) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(30210);
    });
  });
});
