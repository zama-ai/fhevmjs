import sodium from 'libsodium-wrappers';
import { createInstance } from './index';
import { createTfhePublicKey } from '../tfhe';
import { fromHexString, toHexString, numberToBytes } from '../utils';

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
    expect(instance.encryptBool).toBeDefined();
    expect(instance.encrypt4).toBeDefined();
    expect(instance.encrypt8).toBeDefined();
    expect(instance.encrypt16).toBeDefined();
    expect(instance.encrypt32).toBeDefined();
    expect(instance.generatePublicKey).toBeDefined();
    expect(instance.decrypt).toBeDefined();
    expect(instance.serializeKeypairs).toBeDefined();
    expect(instance.getPublicKey).toBeDefined();
    expect(instance.hasKeypair).toBeDefined();
  });

  it('creates an instance for mock', async () => {
    const instance = await createInstance({
      chainId: 1234,
    });
    expect(instance.encrypt8).toBeDefined();
    expect(instance.encrypt16).toBeDefined();
    expect(instance.encrypt32).toBeDefined();
    expect(instance.encrypt64).toBeDefined();
    expect(instance.generatePublicKey).toBeDefined();
    expect(instance.decrypt).toBeDefined();
    expect(instance.serializeKeypairs).toBeDefined();
    expect(instance.getPublicKey).toBeDefined();
    expect(instance.hasKeypair).toBeDefined();

    expect(() => instance.encrypt8(2)).toThrow(
      'Your instance has been created without the public blockchain key',
    );
    expect(() => instance.encrypt16(2)).toThrow(
      'Your instance has been created without the public blockchain key',
    );
    expect(() => instance.encrypt32(2)).toThrow(
      'Your instance has been created without the public blockchain key',
    );
    expect(() => instance.encrypt64(2)).toThrow(
      'Your instance has been created without the public blockchain key',
    );
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
    expect(cleartext.toString()).toBe(`${value}`);
  });

  it('controls encrypt', async () => {
    const instance = await createInstance({
      chainId: 1234,
      publicKey: tfhePublicKey,
    });
    expect(instance.encryptBool(true)).toBeTruthy();

    expect(instance.encryptBool(1)).toBeTruthy();
    expect(instance.encrypt4(2)).toBeTruthy();
    expect(instance.encrypt8(34)).toBeTruthy();
    expect(instance.encrypt16(344)).toBeTruthy();
    expect(instance.encrypt32(3422)).toBeTruthy();
    expect(instance.encrypt64(34)).toBeTruthy();

    expect(instance.encryptBool(BigInt(0))).toBeTruthy();
    expect(instance.encrypt4(BigInt(2))).toBeTruthy();
    expect(instance.encrypt8(BigInt(233))).toBeTruthy();
    expect(instance.encrypt16(BigInt(3342))).toBeTruthy();
    expect(instance.encrypt32(BigInt(838392))).toBeTruthy();
    expect(instance.encrypt64(BigInt(3433434343))).toBeTruthy();

    expect(() => instance.encryptBool(undefined as any)).toThrow(
      'Missing value',
    );
    expect(() => instance.encrypt4(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt8(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt16(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt32(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt64(undefined as any)).toThrow('Missing value');

    expect(() => instance.encryptBool('wrong value' as any)).toThrow(
      'Value must be a boolean',
    );
    expect(() => instance.encrypt4('wrong value' as any)).toThrow(
      'Value must be a number or a bigint.',
    );
    expect(() => instance.encrypt8('wrong value' as any)).toThrow(
      'Value must be a number or a bigint.',
    );
    expect(() => instance.encrypt16('wrong value' as any)).toThrow(
      'Value must be a number or a bigint.',
    );
    expect(() => instance.encrypt32('wrong value' as any)).toThrow(
      'Value must be a number or a bigint.',
    );
    expect(() => instance.encrypt64('wrong value' as any)).toThrow(
      'Value must be a number or a bigint.',
    );

    // Check limit
    expect(instance.encryptBool(1)).toBeTruthy();
    expect(() => instance.encryptBool(34)).toThrow('Value must be 1 or 0.');
    expect(() => instance.encryptBool(BigInt(34))).toThrow(
      'Value must be 1 or 0.',
    );

    expect(instance.encrypt4(Math.pow(2, 4) - 1)).toBeTruthy();
    expect(() => instance.encrypt4(BigInt(34))).toThrow(
      'The value exceeds the limit for 4bits integer (15).',
    );

    expect(instance.encrypt8(Math.pow(2, 8) - 1)).toBeTruthy();
    expect(() => instance.encrypt8(BigInt(256))).toThrow(
      'The value exceeds the limit for 8bits integer (255).',
    );

    expect(instance.encrypt16(Math.pow(2, 16) - 1)).toBeTruthy();
    expect(() => instance.encrypt16(BigInt(70000))).toThrow(
      'The value exceeds the limit for 16bits integer (65535).',
    );

    expect(instance.encrypt32(Math.pow(2, 32) - 1)).toBeTruthy();
    expect(() => instance.encrypt32(BigInt(Math.pow(2, 32)) as any)).toThrow(
      'The value exceeds the limit for 32bits integer (4294967295).',
    );

    expect(
      instance.encrypt64(BigInt(Math.pow(2, 64)) - BigInt(1)),
    ).toBeTruthy();
    expect(() => instance.encrypt64(BigInt(Math.pow(2, 64)) as any)).toThrow(
      'The value exceeds the limit for 64bits integer (18446744073709551615).',
    );
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

  it('save generated public key', async () => {
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

    instance.setSignature(contractAddress, 'signnnn');

    const kp = instance.getPublicKey(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);

    const value = 89290;
    const ciphertext = sodium.crypto_box_seal(
      numberToBytes(value),
      publicKey,
      'hex',
    );
    const cleartext = instance.decrypt(contractAddress, ciphertext);
    expect(cleartext.toString()).toBe(`${value}`);
  });
});
