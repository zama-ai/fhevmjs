export type Seed = bigint;
export const generateEncryptedSeed = (): Seed => {
  const seed = crypto.subtle.generateKey({ name: 'AES-CTR', length: 128 }, true, ['encrypt', 'decrypt']);
  return BigInt(94839292);
};

export const encryptWithSeed = (seed: Seed, data: bigint): bigint => data;
