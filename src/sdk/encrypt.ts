import { isAddress } from 'web3-validator';
import { Keccak } from 'sha3';
import {
  TfheCompactPublicKey,
  CompactCiphertextList,
  CompactPkePublicParams,
  ZkComputeLoad,
} from 'node-tfhe';

import { bytesToBigInt } from '../utils';
import { ENCRYPTION_TYPES } from './encryptionTypes';

// const publicZkParams = CompactPkePublicParams.deserialize(crsBuffer);
type EncryptionTypes = keyof typeof ENCRYPTION_TYPES;

export type ZKInput = {
  addBool: (value: boolean) => ZKInput;
  add4: (value: number | bigint) => ZKInput;
  add8: (value: number | bigint) => ZKInput;
  add16: (value: number | bigint) => ZKInput;
  add32: (value: number | bigint) => ZKInput;
  add64: (value: number | bigint) => ZKInput;
  add128: (value: number | bigint) => ZKInput;
  add256: (value: number | bigint) => ZKInput;
  addBytes64: (value: Uint8Array) => ZKInput;
  addBytes128: (value: Uint8Array) => ZKInput;
  addBytes256: (value: Uint8Array) => ZKInput;
  addAddress: (value: string) => ZKInput;
  getBits: () => number[];
  encrypt: () => {
    handles: Uint8Array[];
    inputProof: Uint8Array;
  };
  // send: () => Promise<{ handles: Uint8Array[]; inputProof: Uint8Array }>;
};

const checkEncryptedValue = (value: number | bigint, bits: number) => {
  if (value == null) throw new Error('Missing value');
  let limit;
  if (bits >= 8) {
    limit = BigInt(
      `0x${new Array(bits / 8).fill(null).reduce((v) => `${v}ff`, '')}`,
    );
  } else {
    limit = BigInt(2 ** bits - 1);
  }
  if (typeof value !== 'number' && typeof value !== 'bigint')
    throw new Error('Value must be a number or a bigint.');
  if (value > limit) {
    throw new Error(
      `The value exceeds the limit for ${bits}bits integer (${limit.toString()}).`,
    );
  }
};

export type PublicParams = {
  [key in EncryptionTypes]?: CompactPkePublicParams;
};

export const createEncryptedInput =
  (tfheCompactPublicKey?: TfheCompactPublicKey, publicParams?: PublicParams) =>
  (contractAddress: string, callerAddress: string): ZKInput => {
    if (!tfheCompactPublicKey || !publicParams)
      throw new Error(
        'Your instance has been created without the public blockchain key.',
      );

    if (!isAddress(contractAddress)) {
      throw new Error('Contract address is not a valid address.');
    }

    if (!isAddress(callerAddress)) {
      throw new Error('User address is not a valid address.');
    }
    const publicKey: TfheCompactPublicKey = tfheCompactPublicKey;
    const bits: EncryptionTypes[] = [];
    const builder = CompactCiphertextList.builder(publicKey);
    return {
      addBool(value: boolean | number | bigint) {
        if (value == null) throw new Error('Missing value');
        if (
          typeof value !== 'boolean' &&
          typeof value !== 'number' &&
          typeof value !== 'bigint'
        )
          throw new Error('The value must be a boolean, a number or a bigint.');
        if (
          (typeof value !== 'bigint' || typeof value !== 'number') &&
          Number(value) > 1
        )
          throw new Error('The value must be 1 or 0.');
        checkEncryptedValue(Number(value), 1);
        builder.push_boolean(!!value);
        bits.push(1);
        return this;
      },
      add4(value: number | bigint) {
        checkEncryptedValue(value, 4);
        builder.push_u4(Number(value));
        bits.push(4);
        return this;
      },
      add8(value: number | bigint) {
        checkEncryptedValue(value, 8);
        builder.push_u8(Number(value));
        bits.push(8);
        return this;
      },
      add16(value: number | bigint) {
        checkEncryptedValue(value, 16);
        builder.push_u16(Number(value));
        bits.push(16);
        return this;
      },
      add32(value: number | bigint) {
        checkEncryptedValue(value, 32);
        builder.push_u32(Number(value));
        bits.push(32);
        return this;
      },
      add64(value: number | bigint) {
        checkEncryptedValue(value, 64);
        builder.push_u64(BigInt(value));
        bits.push(64);
        return this;
      },
      add128(value: number | bigint) {
        checkEncryptedValue(value, 128);
        builder.push_u128(BigInt(value));
        bits.push(128);
        return this;
      },
      addAddress(value: string) {
        if (!isAddress(value)) {
          throw new Error('The value must be a valid address.');
        }
        builder.push_u160(BigInt(value));
        bits.push(160);
        return this;
      },
      add256(value: number | bigint) {
        checkEncryptedValue(value, 256);
        builder.push_u256(BigInt(value));
        bits.push(256);
        return this;
      },
      addBytes64(value: Uint8Array) {
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 512);
        builder.push_u512(bigIntValue);
        bits.push(512);
        return this;
      },
      addBytes128(value: Uint8Array) {
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 1024);
        builder.push_u1024(bigIntValue);
        bits.push(1024);
        return this;
      },
      addBytes256(value: Uint8Array) {
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 2048);
        builder.push_u2048(bigIntValue);
        bits.push(2048);
        return this;
      },
      getBits() {
        return bits;
      },
      encrypt() {
        const getKeys = <T extends {}>(obj: T) =>
          Object.keys(obj) as Array<keyof T>;

        const totalBits = bits.reduce((total, v) => total + v, 0);
        const now = Date.now();
        // const ppTypes = getKeys(publicParams);
        const ppTypes = getKeys(publicParams);
        const closestPP: EncryptionTypes | undefined = ppTypes.find(
          (k) => Number(k) >= totalBits,
        );
        if (!closestPP) {
          throw new Error(
            `Too many bits in provided values. Maximum is ${
              ppTypes[ppTypes.length - 1]
            }.`,
          );
        }
        const pp = publicParams[closestPP]!;
        const encrypted = builder.build_with_proof_packed(
          pp,
          ZkComputeLoad.Verify,
        );

        const inputProof = encrypted.serialize();
        const hash = new Keccak(256).update(Buffer.from(inputProof)).digest();
        const handles = bits.map((v, i) => {
          const dataWithIndex = new Uint8Array(hash.length + 1);
          dataWithIndex.set(hash, 0);
          dataWithIndex.set([i], hash.length);
          const finalHash = new Keccak(256)
            .update(Buffer.from(dataWithIndex))
            .digest();
          const dataInput = new Uint8Array(32);
          dataInput.set(finalHash, 0);
          dataInput.set([i, ENCRYPTION_TYPES[v], 0], 29);
          return dataInput;
        });
        return {
          handles,
          inputProof,
        };
      },
    };
  };

const convertToInputProof = (data: {
  handlesList: string[];
  signature: string;
}) => {
  const { handlesList, signature } = data;
  const lengthByte = handlesList.length.toString(16).padStart(2, '0');
  const handlesString = handlesList
    .map((handle: string) => handle.slice(2))
    .join('');
  const signatureString = signature.slice(2);
  const inputProof = `0x${lengthByte}${handlesString}${signatureString}`;
  return inputProof;
};
