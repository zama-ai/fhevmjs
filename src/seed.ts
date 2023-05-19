export type Seed = string;

export const generateEncryptedSeed = async (): Promise<Seed> => {
  const key = await crypto.subtle.generateKey({ name: 'AES-CTR', length: 128 }, true, ['encrypt', 'decrypt']);
  const seed = await crypto.subtle.exportKey('raw', key);
  return bufferToHex(seed).substring(0, 20); // get only 80 bits;
};

function bufferToHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
