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

    const instance = await createInstance({
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

    expect(() => instance.encrypt8(undefined as any)).toThrow();
    expect(() => instance.encrypt16(undefined as any)).toThrow();
    expect(() => instance.encrypt32(undefined as any)).toThrow();
  });

  it('save generated tokens', async () => {
    const TFHEkeypair = createTFHEKey();
    const instance = await createInstance({
      chainId: 1234,
      publicKey: TFHEkeypair.publicKey,
    });

    const contractAddress = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';

    const { token, publicKey } = await instance.generateToken({ verifyingContract: contractAddress });

    const keypairs = instance.serializeKeypairs();
    expect(keypairs[contractAddress]).toBeUndefined();
    const keypair = instance.getTokenSignature(contractAddress);
    expect(keypair).toBeNull();

    instance.setTokenSignature(contractAddress, 'signnnn');
    const kp = instance.getTokenSignature(contractAddress);
    expect(kp!.publicKey).toBe(publicKey);

    const keypairs2 = instance.serializeKeypairs();
    expect(keypairs2[contractAddress].publicKey).toBe(toHexString(publicKey));
    const keypair2 = instance.getTokenSignature(contractAddress);
    expect(keypair2?.publicKey).toBe(publicKey);

    const value = 8238290348;
    const ciphertext = sodium.crypto_box_seal(numberToBytes(value), publicKey, 'hex');
    const cleartext = await instance.decrypt(contractAddress, ciphertext);
    expect(cleartext).toBe(value);
  });
});
