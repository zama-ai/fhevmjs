import sodium from 'libsodium-wrappers';
import { decrypt, decryptAddress } from './decrypt';
import { bigIntToBytes } from '../utils';
import { getAddress } from 'ethers';

describe('decrypt', () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  it('decrypts a hex value', async () => {
    const keypair = sodium.crypto_box_keypair();

    const value = BigInt(28482);
    const ciphertext = sodium.crypto_box_seal(
      bigIntToBytes(value),
      keypair.publicKey,
      'hex',
    );
    const cleartext = decrypt(keypair, ciphertext);
    expect(cleartext.toString()).toBe(`${value}`);
  });

  it('decrypts a Uint8Array value', async () => {
    const keypair = sodium.crypto_box_keypair();

    const value = BigInt('10000939393388484938938389392929298383');
    const ciphertext = sodium.crypto_box_seal(
      bigIntToBytes(value),
      keypair.publicKey,
    );
    const cleartext = decrypt(keypair, ciphertext);
    expect(cleartext.toString()).toBe(value.toString());
  });

  it('decrypts an address Uint8Array value', async () => {
    const keypair = sodium.crypto_box_keypair();

    const value = BigInt('0x8ba1f109551bd432803012645ac136ddd64dba72');
    const ciphertext = sodium.crypto_box_seal(
      bigIntToBytes(value),
      keypair.publicKey,
    );
    const cleartext = decryptAddress(keypair, ciphertext);
    expect(cleartext).toBe(getAddress(value.toString(16)));
  });
});
