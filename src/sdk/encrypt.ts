import {
  TfheCompactPublicKey,
  CompactPkeCrs,
  ProvenCompactFheBoolList,
  ProvenCompactFheUint4List,
  ProvenCompactFheUint8List,
  ProvenCompactFheUint16List,
  ProvenCompactFheUint32List,
  ProvenCompactFheUint64List,
  ProvenCompactFheUint160List,
  ShortintParameters,
  ShortintParametersName,
  ZkComputeLoad,
} from 'node-tfhe';

const crs = CompactPkeCrs.from_parameters(
  new ShortintParameters(
    ShortintParametersName.PARAM_MESSAGE_1_CARRY_2_COMPACT_PK_KS_PBS_TUNIFORM_2M40,
  ),
  1,
);

const publicZkParams = crs.public_params();

export const encrypt4 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = ProvenCompactFheUint4List.encrypt_with_compact_public_key(
    uint8Array,
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};

export const encryptBool = (
  value: boolean,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const encrypted = ProvenCompactFheBoolList.encrypt_with_compact_public_key(
    [value],
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};

export const encrypt8 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint8Array = new Uint8Array([value]);
  const encrypted = ProvenCompactFheUint8List.encrypt_with_compact_public_key(
    uint8Array,
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};

export const encrypt16 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint16Array = new Uint16Array([value]);
  const encrypted = ProvenCompactFheUint16List.encrypt_with_compact_public_key(
    uint16Array,
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};

export const encrypt32 = (
  value: number,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint32Array = new Uint32Array([value]);
  const encrypted = ProvenCompactFheUint32List.encrypt_with_compact_public_key(
    uint32Array,
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};

export const encrypt64 = (
  value: number | bigint,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  const uint64Array = new BigUint64Array([BigInt(value)]);
  const encrypted = ProvenCompactFheUint64List.encrypt_with_compact_public_key(
    uint64Array,
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};

export const encryptAddress = (
  value: string,
  publicKey: TfheCompactPublicKey,
): Uint8Array => {
  // value is something like 0x8ba1f109551bd432803012645ac136ddd64dba72
  const encrypted = ProvenCompactFheUint160List.encrypt_with_compact_public_key(
    [BigInt(value)],
    publicZkParams,
    publicKey,
    ZkComputeLoad.Proof,
  );
  return encrypted.serialize();
};
