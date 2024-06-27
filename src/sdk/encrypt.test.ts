import {
  FheUint160,
  CompactFheUint160List,
  TfheCompactPublicKey,
  TfheClientKey,
  CompactFheUint2048List,
  FheUint2048,
} from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { createEncryptedInput } from './encrypt';
import { fetchJSONRPC } from '../ethCall';
import { fromHexString } from '../utils';

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
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    input.addBool(BigInt(0));
    input.add4(2);
    input.add8(BigInt(43));
    input.add16(BigInt(87));
    input.add32(BigInt(2339389323));
    input.add64(BigInt(23393893233));
    input.add128(BigInt(233938932390));
    input.addAddress('0xa5e1defb98EFe38EBb2D958CEe052410247F4c80');
    const buffer = input.encrypt();
    const compactList = CompactFheUint160List.deserialize(buffer.inputProof);
    let encryptedList = compactList.expand();
    expect(encryptedList.length).toBe(8);
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
          expect(decrypted.toString()).toBe('87');
          break;
        case 3:
          expect(decrypted.toString()).toBe('2339389323');
          break;
        case 5:
          expect(decrypted.toString()).toBe('23393893233');
          break;
        case 6:
          expect(decrypted.toString()).toBe('233938932390');
          break;
        case 7:
          expect(decrypted.toString()).toBe(
            '947020569397242089359429103430823793539382463616',
          );
          break;
      }
    });
    input.resetValues();
    expect(input.getBits().length).toBe(0);
    expect(input.getValues().length).toBe(0);
  });

  it('encrypt/decrypt one 0 value', async () => {
    const input = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    input.add128(BigInt(0));
    const buffer = input.encrypt();
    const compactList = CompactFheUint160List.deserialize(buffer.inputProof);
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

  it('encrypt/decrypt one 2048 value', async () => {
    const input = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    const data = new Uint8Array(64);
    data.set([255], 63);
    input.addBytes256(data);
    const buffer = input.encrypt();
    const compactList = CompactFheUint2048List.deserialize(buffer.inputProof);
    let encryptedList = compactList.expand();
    expect(encryptedList.length).toBe(1);
    encryptedList.forEach((v: FheUint2048, i: number) => {
      const decrypted = v.decrypt(clientKey);
      switch (i) {
        case 0:
          expect(decrypted.toString()).toBe('255');
          break;
      }
    });
  });

  it('throws errors', async () => {
    expect(() =>
      createEncryptedInput()(
        '0x8ba1f109551bd432803012645ac136ddd64dba72',
        '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
      ),
    ).toThrow(
      'Your instance has been created without the public blockchain key.',
    );
    expect(() =>
      createEncryptedInput(publicKey)(
        '0x8ba1f109551bd432803012645ac136ddd64dba',
        '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
      ),
    ).toThrow('Contract address is not a valid address.');

    expect(() =>
      createEncryptedInput(publicKey)(
        '0x8ba1f109551bd432803012645ac136ddd64dba72',
        '0xa5e1defb98EFe38EBb2D958CEe052410247F4c',
      ),
    ).toThrow('User address is not a valid address.');

    const input = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    expect(() => input.addBool('hello' as any)).toThrow(
      'The value must be a boolean, a number or a bigint.',
    );
    expect(() => input.addBool({} as any)).toThrow(
      'The value must be a boolean, a number or a bigint.',
    );
    expect(() => input.addBool(29393)).toThrow('The value must be 1 or 0.');
    expect(() => input.add4(29393)).toThrow(
      'The value exceeds the limit for 4bits integer (15)',
    );
    expect(() => input.add8(2 ** 8)).toThrow(
      'The value exceeds the limit for 8bits integer (255)',
    );
    expect(() => input.add16(2 ** 16)).toThrow(
      `The value exceeds the limit for 16bits integer (65535).`,
    );
    expect(() => input.add32(2 ** 32)).toThrow(
      'The value exceeds the limit for 32bits integer (4294967295).',
    );
    expect(() => input.add64(BigInt('0xffffffffffffffff') + BigInt(1))).toThrow(
      'The value exceeds the limit for 64bits integer (18446744073709551615).',
    );
    expect(() =>
      input.add128(BigInt('0xffffffffffffffffffffffffffffffff') + BigInt(1)),
    ).toThrow(
      'The value exceeds the limit for 128bits integer (340282366920938463463374607431768211455).',
    );

    expect(() => input.addAddress('0x00')).toThrow(
      'The value must be a valid address.',
    );

    expect(input.getBits().length).toBe(0);
    expect(input.getValues().length).toBe(0);
  });

  it('throws if total bits is above 2048', async () => {
    const input2 = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    input2.addBytes256(new Uint8Array(64));
    input2.addBool(false);
    expect(() => input2.encrypt()).toThrow(
      'Too many bits in provided values. Maximum is 2048.',
    );
  });

  it('throws if more than 12 values', async () => {
    const input2 = createEncryptedInput(publicKey)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    for (let i = 0; i < 13; i++) {
      input2.addBool(false);
    }

    expect(() => input2.encrypt()).toThrow(
      "You can't pack more than 12 values.",
    );
  });
});

/*
describe('encryptWithCoprocessor', () => {
  let publicKey: TfheCompactPublicKey;
  const coprocessorNode = 'http://127.0.0.1:8645';

  beforeAll(async () => {
    const pkeyOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'eth_getPublicFhevmKey',
        params: [],
        id: 1,
        jsonrpc: '2.0',
      }),
    };
    const pkeyRes = await fetchJSONRPC(coprocessorNode, pkeyOptions);

    publicKey = TfheCompactPublicKey.deserialize(
      fromHexString(pkeyRes.publicKey),
    );
  });

  it('encrypt with coprocessor', async () => {
    // encrypted inputs, we pass coprocessor node url
    const input = createEncryptedInput(publicKey, coprocessorNode)(
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    // add inputs
    input.addBool(BigInt(0));
    input.add4(2);
    input.add8(BigInt(43));
    input.add16(BigInt(87));
    input.add32(BigInt(2339389323));
    input.add64(BigInt(23393893233));
    //input.add128(BigInt(233938932390)); // 128 bits not supported yet in coprocessor
    input.addAddress('0xa5e1defb98EFe38EBb2D958CEe052410247F4c80');

    //send to the coprocessor
    const res = await input.send();
    //receive handlesList, callerAddress, contractAddress and EIP712 signature
    expect(res.handles).toBeDefined();
    expect(res.handles.length).toBe(7);
    //expect(res.callerAddress).toBe('0xa5e1defb98EFe38EBb2D958CEe052410247F4c80');
    //expect(res.contractAddress).toBe('0x8ba1f109551bD432803012645Ac136ddd64DBA72');
    expect(res.inputProof).toBeDefined();
  });
});
*/
