import { isAddress } from 'web3-validator';
import { Keccak } from 'sha3';
import {
  TfheCompactPublicKey,
  CompactFheUint160List,
  CompactFheUint2048List,
} from 'node-tfhe';

import { bytesToBigInt, fromHexString, toHexString } from '../utils';
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
    handles: Uint8Array[];
    inputProof: Uint8Array;
  };
  send: () => Promise<{ handles: Uint8Array[]; inputProof: Uint8Array }>;
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

const getListType = (bits: (keyof typeof ENCRYPTION_TYPES)[]) => {
  // We limit to 12 items because for now we are using FheUint160List
  if (bits.length > 12) {
    throw new Error("You can't pack more than 12 values.");
  }

  if (bits.reduce((total, v) => total + v, 0) > 2048) {
    throw new Error('Too many bits in provided values. Maximum is 2048.');
  }

  if (bits.some((v) => v === 2048)) {
    return 2048;
  } else {
    return 160;
  }
};

export const createEncryptedInput =
  (tfheCompactPublicKey?: TfheCompactPublicKey, coprocessorUrl?: string) =>
  (contractAddress: string, callerAddress: string) => {
    if (!tfheCompactPublicKey)
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
    const values: bigint[] = [];
    const bits: (keyof typeof ENCRYPTION_TYPES)[] = [];
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
          throw new Error('The value must be a valid address.');
        }
        values.push(BigInt(value));
        bits.push(160);
        return this;
      },
      addBytes256(value: Uint8Array) {
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 2048);
        values.push(bigIntValue);
        bits.push(2048);
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
        const listType = getListType(bits);

        let encrypted;

        switch (listType) {
          case 160: {
            encrypted = CompactFheUint160List.encrypt_with_compact_public_key(
              values,
              publicKey,
            );
            break;
          }
          case 2048: {
            encrypted = CompactFheUint2048List.encrypt_with_compact_public_key(
              values,
              publicKey,
            );
            break;
          }
        }

        const inputProof = encrypted.serialize();
        const hash = new Keccak(256).update(Buffer.from(inputProof)).digest();
        // const encrypted = ProvenCompactFheUint160List.encrypt_with_compact_public_key(
        //   values,
        //   publicZkParams,
        //   publicKey,
        //   ZkComputeLoad.Proof,
        // );
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
      async send() {
        if (!coprocessorUrl) throw new Error('Coprocessor URL not provided');
        const encrypted = CompactFheUint160List.encrypt_with_compact_public_key(
          values,
          publicKey,
        );
        const ciphertext = encrypted.serialize();

        const data = new Uint8Array(1 + bits.length + ciphertext.length);
        data.set([bits.length], 0);
        bits.forEach((value, index) => {
          data.set([ENCRYPTION_TYPES[value] & 0xff], 1 + index);
        });
        data.set(ciphertext, bits.length + 1);

        const payload = {
          jsonrpc: '2.0',
          method: 'eth_addUserCiphertext',
          params: ['0x' + toHexString(data), contractAddress, callerAddress],
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
        let resJson;
        try {
          resJson = await fetchJSONRPC(coprocessorUrl, options);
        } catch (e) {
          throw new Error(
            'Impossible to send input to coprocessor (wrong url?)',
          );
        }
        const inputProof = convertToInputProof(resJson);
        return {
          handles: resJson.handlesList.map((handle: string) =>
            fromHexString(handle),
          ),
          inputProof: fromHexString(inputProof),
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
