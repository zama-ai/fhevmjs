import {
  TfheCompactPublicKey,
  CompactFheBoolList,
  CompactFheUint4List,
  CompactFheUint8List,
  CompactFheUint16List,
  CompactFheUint32List,
  CompactFheUint64List,
} from 'node-tfhe';

export const encrypt4 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = CompactFheUint4List.encrypt_with_compact_public_key(
    uint8Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encryptBool = (
  value: boolean,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const encrypted = CompactFheBoolList.encrypt_with_compact_public_key(
    [value],
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt8 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = CompactFheUint8List.encrypt_with_compact_public_key(
    uint8Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt16 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint16Array = new Uint16Array([value]);
  const encrypted = CompactFheUint16List.encrypt_with_compact_public_key(
    uint16Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt32 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint32Array = new Uint32Array([value]);
  const encrypted = CompactFheUint32List.encrypt_with_compact_public_key(
    uint32Array,
    publicKey,
  );
  return encrypted.serialize();
};

export const encrypt64 = (
  value: number | bigint,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint64Array = new BigUint64Array([BigInt(value)]);
  const encrypted = CompactFheUint64List.encrypt_with_compact_public_key(
    uint64Array,
    publicKey,
  );
  return encrypted.serialize();
};
