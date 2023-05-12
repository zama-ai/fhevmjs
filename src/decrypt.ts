import { Seed } from './seed';

export const decryptWithSeed = (seed: Seed, ciphertext: bigint): bigint => {
  return BigInt(ciphertext);
};
