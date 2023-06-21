import { createInstance } from './index';
import { createTFHEKey } from '../tfhe';
import sodium from 'libsodium-wrappers';
import { fromHexString, toHexString, numberToBytes } from '../utils';

describe('token', () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  it('creates an instance', async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });
    expect(instance.encrypt8).toBeDefined();
    expect(instance.encrypt16).toBeDefined();
    expect(instance.encrypt32).toBeDefined();
    expect(instance.generateToken).toBeDefined();
    expect(instance.decrypt).toBeDefined();
    expect(instance.serializeKeypairs).toBeDefined();
    expect(instance.getTokenSignature).toBeDefined();
    expect(instance.hasKeypair).toBeDefined();
  });

  it('creates an instance with keypairs', async () => {
    const TFHEkeypair = createTFHEKey();
    const keypair = sodium.crypto_box_keypair('hex');

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
      keypairs: {
        [contractAddress]: {
          privateKey: keypair.privateKey,
          publicKey: keypair.publicKey,
          signature: null,
        },
      },
    });

    const value = 937387;
    const ciphertext = sodium.crypto_box_seal(numberToBytes(value), fromHexString(keypair.publicKey), 'hex');

    const cleartext = await instance.decrypt(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });

  it('controls encrypt', async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });

    expect(() => instance.encrypt8(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt16(undefined as any)).toThrow('Missing value');
    expect(() => instance.encrypt32(undefined as any)).toThrow('Missing value');

    expect(() => instance.encrypt8('wrong value' as any)).toThrow('Value must be a number');
    expect(() => instance.encrypt16('wrong value' as any)).toThrow('Value must be a number');
    expect(() => instance.encrypt32('wrong value' as any)).toThrow('Value must be a number');
  });

  it('controls generateToken', async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });
    await expect(instance.generateToken(undefined as any)).rejects.toThrow('Missing contract address');
    await expect(instance.generateToken({ verifyingContract: '' })).rejects.toThrow('Missing contract address');
  });

  it('save generated token', async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = await instance.generateToken({ verifyingContract: contractAddress });

    instance.setTokenSignature(contractAddress, 'signnnn');

    expect(instance.hasKeypair(contractAddress)).toBeTruthy();

    const kp = instance.getTokenSignature(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);
  });

  it("don't export keys without signature", async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = await instance.generateToken({ verifyingContract: contractAddress });
    const keypairs = instance.serializeKeypairs();
    expect(keypairs[contractAddress]).toBeUndefined();
    const keypair = instance.getTokenSignature(contractAddress);
    expect(keypair).toBeNull();
    expect(instance.hasKeypair(contractAddress)).toBeFalsy();
  });

  it('decrypts data', async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = await instance.generateToken({ verifyingContract: contractAddress });

    instance.setTokenSignature(contractAddress, 'signnnn');

    const kp = instance.getTokenSignature(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);

    const value = 8238290348;
    const ciphertext = sodium.crypto_box_seal(numberToBytes(value), publicKey, 'hex');
    const cleartext = await instance.decrypt(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });
});
