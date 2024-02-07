import {
  FheUint8,
  FheUint16,
  FheUint32,
  FheUint64,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  CompactFheUint64List,
  TfheCompactPublicKey,
  TfheClientKey,
} from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { encrypt8, encrypt16, encrypt32, encrypt64 } from './encrypt';

describe('encrypt8', () => {
  let clientKey: TfheClientKey;
  let publicKey: TfheCompactPublicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
    clientKey = keypair.clientKey;
    publicKey = keypair.publicKey;
  });

  it('encrypt/decrypt 0 8bits', async () => {
    const buffer = encrypt8(0, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
    });
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

  it('encrypt/decrypt 0 16bits', async () => {
    const buffer = encrypt16(0, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
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

  it('encrypt/decrypt 0 32bits', async () => {
    const buffer = encrypt32(0, publicKey);
    const compactList = CompactFheUint8List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint8) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted).toBe(0);
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

  it('encrypt/decrypt 32bits', async () => {
    const buffer = encrypt64(3021094839202949, publicKey);
    const compactList = CompactFheUint64List.deserialize(buffer);
    let encryptedList = compactList.expand();
    encryptedList.forEach((v: FheUint64) => {
      const decrypted = v.decrypt(clientKey);
      expect(decrypted.toString()).toBe('3021094839202949');
    });
  });
});
