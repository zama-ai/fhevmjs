import {
  FheUint160,
  CompactFheUint160List,
  TfheCompactPublicKey,
  TfheClientKey,
} from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { createEncryptedInput } from './encrypt';

describe('encrypt', () => {
  let clientKey: TfheClientKey;
  let publicKey: TfheCompactPublicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
    clientKey = keypair.clientKey;
    publicKey = keypair.publicKey;
  });

  it('encrypt/decrypt', async () => {
    const input = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
    );
    input.addBool(false);
    input.add4(2);
    input.add8(BigInt(43));
    input.add32(BigInt(2339389323));
    const buffer = input.encrypt();
    const compactList = CompactFheUint160List.deserialize(buffer.data);
    let encryptedList = compactList.expand();
    expect(encryptedList.length).toBe(4);
    encryptedList.forEach((v: FheUint160, i: number) => {
      const decrypted = v.decrypt(clientKey);
      switch (i) {
        case 0:
          expect(decrypted.toString()).toBe('0');
          break;
        case 1:
          expect(decrypted.toString()).toBe('2');
          break;
        case 2:
          expect(decrypted.toString()).toBe('43');
          break;
        case 3:
          expect(decrypted.toString()).toBe('2339389323');
          break;
      }
    });
  });

  it('encrypt/decrypt one 0 value', async () => {
    const input = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
    );
    input.add128(BigInt(0));
    const buffer = input.encrypt();
    const compactList = CompactFheUint160List.deserialize(buffer.data);
    let encryptedList = compactList.expand();
    expect(encryptedList.length).toBe(1);
    encryptedList.forEach((v: FheUint160, i: number) => {
      const decrypted = v.decrypt(clientKey);
      switch (i) {
        case 0:
          expect(decrypted.toString()).toBe('0');
          break;
      }
    });
  });
});
