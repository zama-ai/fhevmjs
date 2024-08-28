import { createInstance } from './index';
import { publicKey, publicParams } from '../test';
import { bytesToHex } from 'src/utils';

describe('index', () => {
  it('creates an instance', async () => {
    const serializedPublicKey = bytesToHex(publicKey.serialize());
    const serializedPublicParams = bytesToHex(publicParams.serialize(false));
    const instance = await createInstance({
      chainId: 1234,
      publicKey: serializedPublicKey,
      publicParams: serializedPublicParams,
    });
    expect(instance.reencrypt).toBeDefined();
    expect(instance.createEIP712).toBeDefined();
    expect(instance.generateKeypair).toBeDefined();
    expect(instance.createEncryptedInput).toBeDefined();
    expect(instance.getPublicKey()).toBe(serializedPublicKey);
  });

  it('creates an instance for mock', async () => {
    const instance = await createInstance({
      chainId: 1234,
    });
    expect(instance.reencrypt).toBeDefined();
    expect(instance.createEIP712).toBeDefined();
    expect(instance.generateKeypair).toBeDefined();
    expect(instance.createEncryptedInput).toBeDefined();
  });

  it('fails to create an instance', async () => {
    const serializedPublicKey = bytesToHex(publicKey.serialize());
    await expect(
      createInstance({
        chainId: BigInt(1234) as any,
        publicKey: serializedPublicKey,
      }),
    ).rejects.toThrow('chainId must be a number');

    await expect(
      createInstance({ chainId: 9000, publicKey: 43 as any }),
    ).rejects.toThrow('publicKey must be a string');
  });
});
