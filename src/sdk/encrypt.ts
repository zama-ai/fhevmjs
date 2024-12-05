import { getAddress, isAddress } from 'ethers';
import createKeccakHash from 'keccak';
import {
  TfheCompactPublicKey,
  CompactCiphertextList,
  CompactPkePublicParams,
  ZkComputeLoad,
} from 'node-tfhe';

import {
  bytesToBigInt,
  fromHexString,
  numberToHex,
  SERIALIZED_SIZE_LIMIT_CIPHERTEXT,
  toHexString,
} from '../utils';
import { ENCRYPTION_TYPES } from './encryptionTypes';

type EncryptionTypes = keyof typeof ENCRYPTION_TYPES;

export type GatewayEncryptResponse = {
  response: {
    proof_of_storage: string;
    handles: string[];
    kms_signatures: string[];
    coproc_signature: string;
  };
  status: string;
};

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
  _getClosestPP: () => EncryptionTypes;
  _prove: () => Promise<Buffer>;
  _verify: (ciphertext: Buffer) => Promise<{
    handles: Uint8Array[];
    inputProof: Uint8Array;
  }>;
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
  [key in EncryptionTypes]?: { publicParams: T; publicParamsId: string };
};

export const createEncryptedInput =
  (
    aclContractAddress: string,
    chainId: number,
    gateway: string,
    tfheCompactPublicKey: TfheCompactPublicKey,
    publicKeyId: string,
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
      _getClosestPP() {
        const getKeys = <T extends {}>(obj: T) =>
          Object.keys(obj) as Array<keyof T>;

        const totalBits = bits.reduce((total, v) => total + v, 0);
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
        return closestPP;
      },
      async _prove() {
        const closestPP = this._getClosestPP();
        const pp = publicParams[closestPP]!.publicParams;
        const buffContract = fromHexString(contractAddress);
        const buffUser = fromHexString(callerAddress);
        const buffAcl = fromHexString(aclContractAddress);
        const buffChainId = fromHexString(chainId.toString(16));
        const auxData = new Uint8Array(
          buffContract.length + buffUser.length + buffAcl.length + 32, // buffChainId.length,
        );
        auxData.set(buffContract, 0);
        auxData.set(buffUser, 20);
        auxData.set(buffAcl, 40);
        auxData.set(buffChainId, auxData.length - buffChainId.length);
        const encrypted = builder.build_with_proof_packed(
          pp,
          auxData,
          ZkComputeLoad.Verify,
        );

        const ciphertext = Buffer.from(
          encrypted.safe_serialize(SERIALIZED_SIZE_LIMIT_CIPHERTEXT),
        );
        return ciphertext;
      },
      async _verify(ciphertext: Buffer) {
        const closestPP = this._getClosestPP();
        const ppId = publicParams[closestPP]!.publicParamsId;
        const payload = {
          contract_address: getAddress(contractAddress),
          caller_address: getAddress(callerAddress),
          ct_proof: ciphertext.toString('hex'),
          key_id: publicKeyId,
          crs_id: ppId,
        };

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        };

        let json: GatewayEncryptResponse;
        try {
          const response = await fetch(`${gateway}verify_proven_ct`, options);
          json = await response.json();
        } catch (e) {
          throw new Error("Gateway didn't response correctly", { cause: e });
        }

        // Note that the hex strings returned by the gateway do have have the 0x prefix
        let handles: Uint8Array[] = [];
        if (json.response.handles && json.response.handles.length > 0) {
          handles = json.response.handles.map(fromHexString);
        }

        const kmsSignatures = json.response.kms_signatures;

        // inputProof is len(list_handles) + numSignersKMS + hashCT + list_handles + signatureCopro + signatureKMSSigners (1+1+32+NUM_HANDLES*32+65+65*numSignersKMS)
        let inputProof = numberToHex(handles.length); // for coprocessor : numHandles + numSignersKMS + hashCT + list_handles + signatureCopro + signatureKMSSigners (total len : 1+1+32+NUM_HANDLES*32+65+65*numSignersKMS)
        // for native : numHandles + numSignersKMS + list_handles + signatureKMSSigners + bundleCiphertext (total len : 1+1+NUM_HANDLES*32+65*numSignersKMS+bundleCiphertext.length)
        const numSigners = kmsSignatures.length;
        inputProof += numberToHex(numSigners);
        if (json.response.proof_of_storage) {
          // coprocessor
          const hash = createKeccakHash('keccak256')
            .update(Buffer.from(ciphertext))
            .digest();
          inputProof += hash.toString('hex');

          const listHandlesStr = handles.map((i) => toHexString(i));
          listHandlesStr.map((handle) => (inputProof += handle));
          inputProof += json.response.proof_of_storage;

          kmsSignatures.map((sigKMS) => (inputProof += sigKMS));
        } else {
          // native
          const listHandlesStr = handles.map((i) => toHexString(i));
          listHandlesStr.map((handle) => (inputProof += handle));

          kmsSignatures.map((sigKMS) => (inputProof += sigKMS));

          inputProof += toHexString(ciphertext);
        }

        return {
          handles,
          inputProof: fromHexString(inputProof),
        };
      },
      async encrypt() {
        let start = Date.now();
        const ciphertext = await this._prove();
        console.log(
          `Encrypting and proving in ${
            Math.round((Date.now() - start) / 100) / 10
          }s`,
        );

        start = Date.now();
        const verification = await this._verify(ciphertext);
        console.log(
          `Verifying in ${Math.round((Date.now() - start) / 100) / 10}s`,
        );
        return verification;
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
