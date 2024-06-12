import { isAddress } from 'web3-validator';
import createKeccakHash from 'keccak';
import { TfheCompactPublicKey, CompactFheUint160List } from 'node-tfhe';

import { toHexString } from '../utils';
import { ENCRYPTION_TYPES } from './encryptionTypes';
import { fetchJSONRPC } from '../ethCall';

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
  encrypt: () => {
    inputs: string[];
    data: Uint8Array;
  };
  send: () => Promise<{ inputs: string[]; signature: string }>;
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
  (contractAddress: string, userAddress: string, callerAddress?: string) => {
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
        bits.push(ENCRYPTION_TYPES[1]);
        return this;
      },
      add4(value: number | bigint) {
        checkEncryptedValue(value, 4);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[4]);
        return this;
      },
      add8(value: number | bigint) {
        checkEncryptedValue(value, 8);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[8]);
        return this;
      },
      add16(value: number | bigint) {
        checkEncryptedValue(value, 16);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[16]);
        return this;
      },
      add32(value: number | bigint) {
        checkEncryptedValue(value, 32);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[32]);
        return this;
      },
      add64(value: number | bigint) {
        checkEncryptedValue(value, 64);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[64]);
        return this;
      },
      add128(value: number | bigint) {
        checkEncryptedValue(value, 128);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[128]);
        return this;
      },
      addAddress(value: string) {
        if (!isAddress(value)) {
          throw new Error('Value must be a valid address.');
        }
        checkEncryptedValue(BigInt(value), 160);
        values.push(BigInt(value));
        bits.push(ENCRYPTION_TYPES[160]);
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
        const data = encrypted.serialize();
        const hash = createKeccakHash('keccak256')
          .update(toHexString(data))
          .digest();
        const inputs = bits.map((v, i) => {
          const dataInput = new Uint8Array(32);
          dataInput.set(hash, 0);
          dataInput.set([i, bits[v]], 30);
          return createKeccakHash('keccak256')
            .update(toHexString(dataInput))
            .digest('hex');
        });
        return {
          inputs,
          data,
        };
      },
      async send() {
        if (!coprocessorUrl) throw new Error('Coprocessor URL not provided');
        const encrypted = CompactFheUint160List.encrypt_with_compact_public_key(
          values,
          publicKey,
        );
        const ciphertext = encrypted.serialize();

        const data = new Uint8Array(1 + bits.length + ciphertext.length);
        data.set([data.length], 0);
        data.set(bits, 1);
        data.set(ciphertext, data.length + 1);

        const payload = {
          jsonrpc: '2.0',
          method: 'eth_addUserCiphertext',
          params: [toHexString(data), 'latest'],
          id: 1,
        };

        // Set up the fetch request options
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        };
        const response = await fetchJSONRPC(coprocessorUrl, options);
        if (!response) throw new Error('Invalid input');
        return JSON.parse(response);
      },
    };
  };
