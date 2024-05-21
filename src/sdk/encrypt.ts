import { isAddress } from 'ethers';
import { TfheCompactPublicKey, CompactFheUint160List } from 'node-tfhe';

// const publicZkParams = CompactPkePublicParams.deserialize(crsBuffer);

export type ZKInput = {
  addBool: (value: boolean) => ZKInput;
  add4: (value: number | bigint) => ZKInput;
  add8: (value: number | bigint) => ZKInput;
  add16: (value: number | bigint) => ZKInput;
  add32: (value: number | bigint) => ZKInput;
  add64: (value: number | bigint) => ZKInput;
  add128: (value: number | bigint) => ZKInput;
  addAddress: (value: string) => ZKInput;
  getValues: () => bigint[];
  getBits: () => number[];
  resetValues: () => ZKInput;
  encrypt: () => Uint8Array;
  encryptAndSend: () => UInt8Array;
};

const checkEncryptedValue = (value: number | bigint, bits: number) => {
  if (value == null) throw new Error('Missing value');
  const limit = BigInt(Math.pow(2, bits));
  if (typeof value !== 'number' && typeof value !== 'bigint')
    throw new Error('Value must be a number or a bigint.');
  if (value >= limit) {
    throw new Error(
      `The value exceeds the limit for ${bits}bits integer (${(
        limit - BigInt(1)
      ).toString()}).`,
    );
  }
};

export const createEncryptedInput =
  (tfheCompactPublicKey?: TfheCompactPublicKey, coprocessorUrl?: string) =>
  (contractAddress: string, userAddress: string) => {
    if (!tfheCompactPublicKey)
      throw new Error(
        'Your instance has been created without the public blockchain key.',
      );

    if (!isAddress(contractAddress)) {
      throw new Error('Contract address is not a valid address.');
    }

    const publicKey: TfheCompactPublicKey = tfheCompactPublicKey;
    const values: bigint[] = [];
    const bits: number[] = [];
    return {
      addBool(value: boolean) {
        if (value == null) throw new Error('Missing value');
        if (
          typeof value !== 'boolean' &&
          typeof value !== 'number' &&
          typeof value !== 'bigint'
        )
          throw new Error('Value must be a boolean, a number or a bigint.');
        if (
          (typeof value !== 'bigint' || typeof value !== 'number') &&
          Number(value) > 1
        )
          throw new Error('Value must be 1 or 0.');
        values.push(BigInt(value));
        bits.push(1);
        return this;
      },
      add4(value: number | bigint) {
        checkEncryptedValue(value, 4);
        values.push(BigInt(value));
        bits.push(4);
        return this;
      },
      add8(value: number | bigint) {
        checkEncryptedValue(value, 8);
        values.push(BigInt(value));
        bits.push(8);
        return this;
      },
      add16(value: number | bigint) {
        checkEncryptedValue(value, 16);
        values.push(BigInt(value));
        bits.push(16);
        return this;
      },
      add32(value: number | bigint) {
        checkEncryptedValue(value, 32);
        values.push(BigInt(value));
        bits.push(32);
        return this;
      },
      add64(value: number | bigint) {
        checkEncryptedValue(value, 64);
        values.push(BigInt(value));
        bits.push(64);
        return this;
      },
      add128(value: number | bigint) {
        checkEncryptedValue(value, 128);
        values.push(BigInt(value));
        bits.push(128);
        return this;
      },
      addAddress(value: string) {
        if (!isAddress(value)) {
          throw new Error('Value must be a valid address.');
        }
        checkEncryptedValue(BigInt(value), 160);
        values.push(BigInt(value));
        bits.push(160);
        return this;
      },
      getValues() {
        return values;
      },
      getBits() {
        return bits;
      },
      resetValues() {
        values.length = 0;
        bits.length = 0;
        return this;
      },
      encrypt() {
        const encrypted = CompactFheUint160List.encrypt_with_compact_public_key(
          values,
          publicKey,
        );
        // const encrypted = ProvenCompactFheUint160List.encrypt_with_compact_public_key(
        //   values,
        //   publicZkParams,
        //   publicKey,
        //   ZkComputeLoad.Proof,
        // );
        return encrypted.serialize();
      },
      encryptAndSend() {
        if (!coprocessorUrl) throw new Error('Coprocessor URL not provided');
        const encrypted = CompactFheUint160List.encrypt_with_compact_public_key(
          values,
          publicKey,
        );
        return BigInt(20);
      },
    };
  };
