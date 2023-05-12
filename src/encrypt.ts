import { Shortint } from 'tfhe';
import globalPublicKey from './key/globalPks.bin';
import { encryptWithSeed, Seed } from './seed';

function str2Uint8Array(str: string): Uint8Array {
  var array = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array;
}

export const encrypt = (seed: Seed, plaintext: bigint): bigint => {
  const message = encryptWithSeed(seed, plaintext);
  // const globalPublicKeyAB = str2Uint8Array(globalPublicKey);
  // // const publicKey = Shortint. .deserialize_compressed_public_key(globalPublicKeyAB);
  // // const ciphertext = Shortint.encrypt_with_compressed_public_key(publicKey, message);
  return BigInt(plaintext);
};
