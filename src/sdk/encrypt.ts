import { TfheCompactPublicKey, FheUint32, CompactFheUint32, CompactFheUint32List } from 'node-tfhe';

export const encryptInteger = (value: number, publicKey: TfheCompactPublicKey) => {
  // const encrypted = FheUint32.encrypt_with_compact_public_key(value, publicKey);
  const uint32Array = new Uint32Array([value]);
  const encrypted = CompactFheUint32List.encrypt_with_compact_public_key(uint32Array, publicKey);
  return encrypted;
};
