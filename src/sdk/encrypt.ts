import { TfheCompactPublicKey, CompactFheUint8List, CompactFheUint16List, CompactFheUint32List } from 'node-tfhe';

export const encrypt8 = (value: number, publicKey: TfheCompactPublicKey): CompactFheUint8List => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = CompactFheUint8List.encrypt_with_compact_public_key(uint8Array, publicKey);
  return encrypted;
};

export const encrypt16 = (value: number, publicKey: TfheCompactPublicKey): CompactFheUint16List => {
  const uint16Array = new Uint16Array([value]);
  const encrypted = CompactFheUint16List.encrypt_with_compact_public_key(uint16Array, publicKey);
  return encrypted;
};

export const encrypt32 = (value: number, publicKey: TfheCompactPublicKey): CompactFheUint32List => {
  // const encrypted = FheUint32.encrypt_with_compact_public_key(value, publicKey);
  const uint32Array = new Uint32Array([value]);
  const encrypted = CompactFheUint32List.encrypt_with_compact_public_key(uint32Array, publicKey);
  return encrypted;
};
