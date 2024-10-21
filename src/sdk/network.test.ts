import { TfheCompactPublicKey, TfheClientKey } from 'node-tfhe';
import { createTfheKeypair } from '../tfhe';
import { createEncryptedInput } from './encrypt';
import {
  getChainIdFromNetwork,
  getPublicKeyCallParams,
  getPublicKeyFromCoprocessor,
  getPublicKeyFromNetwork,
} from './network';
import { fromHexString } from '../utils';

describe('network', () => {
  let clientKey: TfheClientKey;
  let publicKey: TfheCompactPublicKey;

  beforeAll(async () => {
    const keypair = createTfheKeypair();
  });

  it('get chainId', async () => {
    const chainId = await getChainIdFromNetwork('https://devnet.zama.ai');
    expect(chainId).toBe(9000);
  });

  it('get network key', async () => {
    const pk = await getPublicKeyFromNetwork('https://devnet.zama.ai');
    expect(pk!.length).toBe(33138);
  });

  it('get public key params', async () => {
    const params = getPublicKeyCallParams();
    expect(params.to).toBe('0x000000000000000000000000000000000000005d');
    expect(params.data).toBe('0xd9d47bb001');
  });
});
