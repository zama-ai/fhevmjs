import sodium from 'libsodium-wrappers';
import { createInstance } from './index';
import { createTfhePublicKey } from '../tfhe';
import { fromHexString, bigIntToBytes } from '../utils';

describe('index', () => {
  let tfhePublicKey: string;

  beforeAll(async () => {
    await sodium.ready;
    tfhePublicKey = createTfhePublicKey();
  });

  it('creates an instance', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });
    expect(instance.reencrypt).toBeDefined();
    expect(instance.reencrypt.createEIP712).toBeDefined();
    expect(instance.reencrypt.generateKeypair).toBeDefined();
    expect(instance.createEncryptedInput).toBeDefined();
  });

  it('creates an instance for mock', async () => {
    const instance = await createInstance({
      chainId: 1234,
    });
    expect(instance.reencrypt).toBeDefined();
    expect(instance.reencrypt.createEIP712).toBeDefined();
    expect(instance.reencrypt.generateKeypair).toBeDefined();
    expect(instance.createEncryptedInput).toBeDefined();
  });

  it('fails to create an instance', async () => {
    await expect(
      createInstance({
        chainId: BigInt(1234) as any,
        publicKey: tfhePublicKey,
      }),
    ).rejects.toThrow('chainId must be a number');

    await expect(
      createInstance({ chainId: 9000, publicKey: 43 as any }),
    ).rejects.toThrow('publicKey must be a string');
  });
});
