import sodium from 'libsodium-wrappers';
import { createInstance } from './index';
import { createTfhePublicKey } from '../tfhe';
import { fromHexString, toHexString, numberToBytes } from '../utils';

describe('token', () => {
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
    expect(instance.encrypt8).toBeDefined();
    expect(instance.encrypt16).toBeDefined();
    expect(instance.encrypt32).toBeDefined();
    expect(instance.generatePublicKey).toBeDefined();
    expect(instance.decrypt).toBeDefined();
    expect(instance.serializeKeypairs).toBeDefined();
    expect(instance.getPublicKey).toBeDefined();
    expect(instance.hasKeypair).toBeDefined();
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

  it('creates an instance with keypairs', async () => {
    const keypair = sodium.crypto_box_keypair('hex');

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
      keypairs: {
        [contractAddress]: {
          privateKey: keypair.privateKey,
          publicKey: keypair.publicKey,
          signature: null,
        },
      },
    });

    const value = 937387;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      fromHexString(keypair.publicKey),
      'hex',
    );

    const cleartext = instance.decrypt(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });

  it('controls encrypt', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });

    expect(() => instance.encrypt8(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt16(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt32(undefined as any)).toThrow('Missing value');

    expect(() => instance.encrypt8('wrong value' as any)).toThrow(
      'Value must be a number',
    );
    expect(() => instance.encrypt16('wrong value' as any)).toThrow(
      'Value must be a number',
    );
    expect(() => instance.encrypt32('wrong value' as any)).toThrow(
      'Value must be a number',
    );
  });

  it('controls generateToken', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });
    expect(() => instance.generateToken(undefined as any)).toThrow(
      'Missing contract address',
    );
    expect(() => instance.generateToken({ verifyingContract: '' })).toThrow(
      'Missing contract address',
    );
    expect(() =>
      instance.generateToken({ verifyingContract: '0x847473829d' }),
    ).toThrow('Invalid contract address');
  });

  it('controls generatePublicKey', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });
    expect(() => instance.generatePublicKey(undefined as any)).toThrow(
      'Missing contract address',
    );
    expect(() => instance.generatePublicKey({ verifyingContract: '' })).toThrow(
      'Missing contract address',
    );
    expect(() =>
      instance.generatePublicKey({ verifyingContract: '0x847473829d' }),
    ).toThrow('Invalid contract address');
  });

  it('save generated token', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { eip712, publicKey } = instance.generatePublicKey({
      verifyingContract: contractAddress,
    });

    instance.setSignature(contractAddress, 'signnnn');

    expect(instance.hasKeypair(contractAddress)).toBeTruthy();

    const kp = instance.getPublicKey(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);
  });

  it('save generated token (deprecated)', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = instance.generateToken({
      verifyingContract: contractAddress,
    });

    instance.setTokenSignature(contractAddress, 'signnnn');

    expect(instance.hasKeypair(contractAddress)).toBeTruthy();

    const kp = instance.getTokenSignature(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);
  });

  it("don't export keys without signature", async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { eip712, publicKey } = instance.generatePublicKey({
      verifyingContract: contractAddress,
    });
    const keypairs = instance.serializeKeypairs();
    expect(keypairs[contractAddress]).toBeUndefined();
    const keypair = instance.getPublicKey(contractAddress);
    expect(keypair).toBeNull();
    expect(instance.hasKeypair(contractAddress)).toBeFalsy();
  });

  it('decrypts data', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { eip712, publicKey } = instance.generatePublicKey({
      verifyingContract: contractAddress,
    });

    instance.setTokenSignature(contractAddress, 'signnnn');

    const kp = instance.getPublicKey(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);

    const value = 89290;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      publicKey,
      'hex',
    );
    const cleartext = instance.decrypt(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });
});
