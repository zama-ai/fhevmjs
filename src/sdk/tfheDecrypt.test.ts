import {
  CompactFheBoolList,
  CompactFheUint4List,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  CompactFheUint64List,
  CompactFheUint160List,
  TfheClientKey,
  TfheCompactPublicKey,
} from 'node-tfhe';

import {
  decryptBool,
  decrypt4,
  decrypt8,
  decrypt16,
  decrypt32,
  decrypt64,
  decryptAddress,
} from './tfheDecrypt';
import { createTfheKeypair } from '../tfhe';
import {
  encryptBool,
  encrypt4,
  encrypt8,
  encrypt16,
  encrypt32,
  encrypt64,
  encryptAddress,
} from './tfheEncrypt';
import { toHexString } from '../utils';

describe('tfheDecrypt', () => {
  let clientKey: TfheClientKey;
  let publicKey: TfheCompactPublicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
    clientKey = keypair.clientKey;
    publicKey = keypair.publicKey;
  });

  it('decrypt false bool', async () => {
    const compact = encryptBool(false, publicKey);
    const ct = CompactFheBoolList.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decryptBool(ser, clientKey);
    expect(decrypted).toBe(false);
  });

  it('decrypt false true', async () => {
    const compact = encryptBool(true, publicKey);
    const ct = CompactFheBoolList.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decryptBool(ser, clientKey);
    expect(decrypted).toBe(true);
  });

  it('decrypt 0 4 bits', async () => {
    const compact = encrypt4(0, publicKey);
    const ct = CompactFheUint4List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt4(ser, clientKey);
    expect(decrypted).toBe(0);
  });

  it('decrypt 4 bits', async () => {
    const compact = encrypt4(3, publicKey);
    const ct = CompactFheUint4List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt4(ser, clientKey);
    expect(decrypted).toBe(3);
  });

  it('decrypt 0 8 bits', async () => {
    const compact = encrypt8(0, publicKey);
    const ct = CompactFheUint8List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt8(ser, clientKey);
    expect(decrypted).toBe(0);
  });

  it('decrypt 8 bits', async () => {
    const compact = encrypt8(76, publicKey);
    const ct = CompactFheUint8List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt8(ser, clientKey);
    expect(decrypted).toBe(76);
  });

  it('decrypt 0 16 bits', async () => {
    const compact = encrypt16(0, publicKey);
    const ct = CompactFheUint16List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt16(ser, clientKey);
    expect(decrypted).toBe(0);
  });

  it('decrypt 16 bits', async () => {
    const compact = encrypt16(1185, publicKey);
    const ct = CompactFheUint16List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt16(ser, clientKey);
    expect(decrypted).toBe(1185);
  });

  it('decrypt 0 32 bits', async () => {
    const compact = encrypt32(0, publicKey);
    const ct = CompactFheUint32List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt32(ser, clientKey);
    expect(decrypted).toBe(0);
  });

  it('decrypt 32 bits', async () => {
    const compact = encrypt32(68467, publicKey);
    const ct = CompactFheUint32List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt32(ser, clientKey);
    expect(decrypted).toBe(68467);
  });

  it('decrypt 0 64 bits', async () => {
    const compact = encrypt64(BigInt('0'), publicKey);
    const ct = CompactFheUint64List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt64(ser, clientKey);
    expect(decrypted).toBe(BigInt('0'));
  });

  it('decrypt 64 bits', async () => {
    const compact = encrypt64(BigInt('309671'), publicKey);
    const ct = CompactFheUint64List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decrypt64(ser, clientKey);
    expect(decrypted).toBe(BigInt('309671'));
  });

  it('decrypt 0 eaddress', async () => {
    const compact = encryptAddress(
      '0x0000000000000000000000000000000000000000',
      publicKey,
    );
    const ct = CompactFheUint160List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decryptAddress(ser, clientKey);
    expect(decrypted).toBe('0x0000000000000000000000000000000000000000');
  });

  it('decrypt eaddress', async () => {
    const compact = encryptAddress(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      publicKey,
    );
    const ct = CompactFheUint160List.deserialize(compact).expand().at(0);
    const ser = toHexString(ct.serialize());
    const decrypted = decryptAddress(ser, clientKey);
    expect(decrypted).toBe('0x8ba1f109551bd432803012645ac136ddd64dba72');
  });
});
