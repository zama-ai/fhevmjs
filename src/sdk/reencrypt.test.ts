import {
  FheUint160,
  CompactFheUint160List,
  TfheCompactPublicKey,
  TfheClientKey,
} from 'node-tfhe';
import { reencryptRequest } from './reencrypt';
import { createTfheKeypair } from '../tfhe';
import { createEncryptedInput } from './encrypt';
import { getPublicKeyCallParams, getPublicKeyFromNetwork } from './network';
import { fromHexString } from '../utils';

describe('reencrypt', () => {
  it('get reencryption for handle', async () => {
    const reencrypt = reencryptRequest('mock');
    const result = await reencrypt(
      BigInt(3333),
      '0xccc',
      '0xcccc',
      '0xccc',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );

    expect(result.toString()).toBe('10');
  });

  it('throw if no reencryption URL is provided', async () => {
    const reencrypt = reencryptRequest();
    const result = reencrypt(
      BigInt(3333),
      '0xccc',
      '0xcccc',
      '0xccc',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );

    expect(result).rejects.toThrow('You must provide a reencryption URL.');
  });
});
