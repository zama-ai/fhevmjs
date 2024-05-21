import {
  FheUint160,
  CompactFheUint160List,
  TfheCompactPublicKey,
  TfheClientKey,
} from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { createEncryptedInput } from './encrypt';
import { getPublicKeyCallParams, getPublicKeyFromNetwork } from './network';
import { fromHexString } from '../utils';

describe('reencrypt', () => {
  it('get reencryption for handle', async () => {
    expect(true).toBe(true);
  });
});
