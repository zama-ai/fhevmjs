import { isAddress } from 'ethers';
import { Keccak } from 'sha3';
import {
  TfheCompactPublicKey,
  CompactCiphertextList,
  CompactPkePublicParams,
  ZkComputeLoad,
} from 'node-tfhe';

import {
  bytesToBigInt,
  fromHexString,
  SERIALIZED_SIZE_LIMIT_CIPHERTEXT,
} from '../utils';
import { ENCRYPTION_TYPES } from './encryptionTypes';

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
  encrypt: () => Promise<{
    handles: Uint8Array[];
    inputProof: Uint8Array;
  }>;
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

export type PublicParams<T = CompactPkePublicParams> = {
  [key in EncryptionTypes]?: T;
};

export const createEncryptedInput =
  (
    aclContractAddress: string,
    chainId: number,
    gateway: string,
    tfheCompactPublicKey: TfheCompactPublicKey,
    publicParams: PublicParams,
  ) =>
  (contractAddress: string, callerAddress: string): ZKInput => {
    if (!isAddress(contractAddress)) {
      throw new Error('Contract address is not a valid address.');
    }

    if (!isAddress(callerAddress)) {
      throw new Error('User address is not a valid address.');
    }
    const publicKey: TfheCompactPublicKey = tfheCompactPublicKey;
    const bits: EncryptionTypes[] = [];
    const builder = CompactCiphertextList.builder(publicKey);
    const checkLimit = (added: number) => {
      if (bits.reduce((acc, val) => acc + Math.max(2, val), 0) + added > 2048) {
        throw Error(
          'Packing more than 2048 bits in a single input ciphertext is unsupported',
        );
      }
      if (bits.length + 1 > 256)
        throw Error(
          'Packing more than 256 variables in a single input ciphertext is unsupported',
        );
    };
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
        checkLimit(2);
        builder.push_boolean(!!value);
        bits.push(1); // ebool takes 2 encrypted bits
        return this;
      },
      add4(value: number | bigint) {
        checkEncryptedValue(value, 4);
        checkLimit(4);
        builder.push_u4(Number(value));
        bits.push(4);
        return this;
      },
      add8(value: number | bigint) {
        checkEncryptedValue(value, 8);
        checkLimit(8);
        builder.push_u8(Number(value));
        bits.push(8);
        return this;
      },
      add16(value: number | bigint) {
        checkEncryptedValue(value, 16);
        checkLimit(16);
        builder.push_u16(Number(value));
        bits.push(16);
        return this;
      },
      add32(value: number | bigint) {
        checkEncryptedValue(value, 32);
        checkLimit(32);
        builder.push_u32(Number(value));
        bits.push(32);
        return this;
      },
      add64(value: number | bigint) {
        checkEncryptedValue(value, 64);
        checkLimit(64);
        builder.push_u64(BigInt(value));
        bits.push(64);
        return this;
      },
      add128(value: number | bigint) {
        checkEncryptedValue(value, 128);
        checkLimit(128);
        builder.push_u128(BigInt(value));
        bits.push(128);
        return this;
      },
      addAddress(value: string) {
        if (!isAddress(value)) {
          throw new Error('The value must be a valid address.');
        }
        checkLimit(160);
        builder.push_u160(BigInt(value));
        bits.push(160);
        return this;
      },
      add256(value: number | bigint) {
        checkEncryptedValue(value, 256);
        checkLimit(256);
        builder.push_u256(BigInt(value));
        bits.push(256);
        return this;
      },
      addBytes64(value: Uint8Array) {
        if (value.length !== 64)
          throw Error(
            'Uncorrect length of input Uint8Array, should be 64 for an ebytes64',
          );
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 512);
        checkLimit(512);
        builder.push_u512(bigIntValue);
        bits.push(512);
        return this;
      },
      addBytes128(value: Uint8Array) {
        if (value.length !== 128)
          throw Error(
            'Uncorrect length of input Uint8Array, should be 128 for an ebytes128',
          );
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 1024);
        checkLimit(1024);
        builder.push_u1024(bigIntValue);
        bits.push(1024);
        return this;
      },
      addBytes256(value: Uint8Array) {
        if (value.length !== 256)
          throw Error(
            'Uncorrect length of input Uint8Array, should be 256 for an ebytes256',
          );
        const bigIntValue = bytesToBigInt(value);
        checkEncryptedValue(bigIntValue, 2048);
        checkLimit(2048);
        builder.push_u2048(bigIntValue);
        bits.push(2048);
        return this;
      },
      getBits() {
        return bits;
      },
      async encrypt() {
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
        const buffContract = fromHexString(contractAddress);
        const buffUser = fromHexString(callerAddress);
        const buffAcl = fromHexString(aclContractAddress);
        const buffChainId = fromHexString(chainId.toString(16));
        const auxData = new Uint8Array(
          buffContract.length +
            buffUser.length +
            buffAcl.length +
            buffChainId.length,
        );
        auxData.set(buffContract, 0);
        auxData.set(buffUser, 20);
        auxData.set(buffAcl, 40);
        auxData.set(buffChainId, 60);
        const encrypted = builder.build_with_proof_packed(
          pp,
          auxData,
          ZkComputeLoad.Verify,
        );

        const inputProof = encrypted.safe_serialize(
          SERIALIZED_SIZE_LIMIT_CIPHERTEXT,
        );

        const payload = {
          client_address: contractAddress,
          caller_address: callerAddress,
          ct_proof: inputProof,
          max_num_bits: 2048,
        };

        // TODO Send payload
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        };

        let json;
        try {
          const response = await fetch(`${gateway}zkp`, options);
          json = await response.json();
        } catch (e) {
          console.log(`${gateway}zkp`);
          throw new Error("Gateway didn't response correctly");
        }
        let handles: Uint8Array[] = [];
        if (json.response.handles && json.response.handles.length > 0) {
          handles = json.response.handles.map(fromHexString);
        }

        // if no handles has been returned by the gateway, create them
        if (!handles.length) {
          const hash = new Keccak(256).update(Buffer.from(inputProof)).digest();
          handles = bits.map((v, i) => {
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
        }
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
