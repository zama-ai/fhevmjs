import { TfheCompactPublicKey } from 'node-tfhe';
import sodium from 'libsodium-wrappers';
import {
  encrypt4,
  encrypt8,
  encrypt16,
  encrypt32,
  encrypt64,
  encryptAddress,
  encryptBool,
} from './encrypt';
import {
  EIP712,
  GeneratePublicKeyParams,
  generatePublicKey,
} from './publicKey';
import { decrypt } from './decrypt';
import { fromHexString, isAddress, toHexString } from '../utils';
import { ContractKeypairs } from './types';

export type FhevmInstance = {
  encryptBool: (value: boolean | number | bigint) => Uint8Array;
  encrypt4: (value: number | bigint) => Uint8Array;
  encrypt8: (value: number | bigint) => Uint8Array;
  encrypt16: (value: number | bigint) => Uint8Array;
  encrypt32: (value: number | bigint) => Uint8Array;
  encrypt64: (value: number | bigint) => Uint8Array;
  encryptAddress: (value: string) => Uint8Array;
  generatePublicKey: (
    options: GeneratePublicKeyParams & {
      force?: boolean;
    },
  ) => {
    publicKey: Uint8Array;
    eip712: EIP712;
  };
  setSignature: (contractAddress: string, signature: string) => void;
  getPublicKey: (
    contractAddress: string,
  ) => { publicKey: Uint8Array; signature: string } | null;
  hasKeypair: (contractAddress: string) => boolean;
  decrypt: (contractAddress: string, ciphertext: string) => bigint;
  serializeKeypairs: () => ExportedContractKeypairs;
};

export type TokenSignature = {
  publicKey: Uint8Array;
  signature: string;
};

export type ExportedContractKeypairs = {
  [key: string]: {
    publicKey: string;
    privateKey: string;
    signature?: string | null;
  };
};

export type FhevmInstanceParams = {
  chainId: number;
  publicKey?: string;
  keypairs?: ExportedContractKeypairs;
};

export const getPublicKeyCallParams = () => ({
  to: '0x000000000000000000000000000000000000005d',
  data: '0xd9d47bb001',
});

export const createInstance = async (
  params: FhevmInstanceParams,
): Promise<FhevmInstance> => {
  await sodium.ready;
  const { chainId, publicKey, keypairs } = params;
  if (typeof chainId !== 'number') throw new Error('chainId must be a number');
  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');
  let tfheCompactPublicKey: TfheCompactPublicKey;
  if (publicKey) {
    const buff = fromHexString(publicKey);
    tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
  }

  let contractKeypairs: ContractKeypairs = {};

  if (keypairs) {
    Object.keys(keypairs).forEach((contractAddress) => {
      if (isAddress(contractAddress)) {
        const oKeys = Object.keys(keypairs[contractAddress]);
        if (
          ['signature', 'privateKey', 'publicKey'].every((v) =>
            oKeys.includes(v),
          )
        ) {
          contractKeypairs[contractAddress] = {
            signature: keypairs[contractAddress].signature,
            publicKey: fromHexString(keypairs[contractAddress].publicKey),
            privateKey: fromHexString(keypairs[contractAddress].privateKey),
          };
        }
      }
    });
  }

  const hasKeypair = (contractAddress: string) => {
    return (
      contractKeypairs[contractAddress] != null &&
      !!contractKeypairs[contractAddress].signature
    );
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

  return {
    // Parameters
    encryptBool(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
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
      return encryptBool(Boolean(value), tfheCompactPublicKey);
    },
    encrypt4(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
      checkEncryptedValue(value, 4);
      return encrypt4(Number(value), tfheCompactPublicKey);
    },
    encrypt8(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
      checkEncryptedValue(value, 8);
      return encrypt8(Number(value), tfheCompactPublicKey);
    },
    encrypt16(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
      checkEncryptedValue(value, 16);
      return encrypt16(Number(value), tfheCompactPublicKey);
    },

    encrypt32(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
      checkEncryptedValue(value, 32);
      return encrypt32(Number(value), tfheCompactPublicKey);
    },

    encrypt64(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
      checkEncryptedValue(value, 64);
      return encrypt64(value, tfheCompactPublicKey);
    },

    encryptAddress(value) {
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key.',
        );
      if (!isAddress(value)) throw new Error('Value must be a valid address.');
      return encryptAddress(value, tfheCompactPublicKey);
    },

    // Reencryption
    generatePublicKey(options) {
      if (!options || !options.verifyingContract)
        throw new Error('Missing contract address');
      if (!isAddress(options.verifyingContract))
        throw new Error('Invalid contract address');
      let kp;
      if (!options.force && contractKeypairs[options.verifyingContract]) {
        kp = contractKeypairs[options.verifyingContract];
      }
      const { eip712, keypair } = generatePublicKey({
        verifyingContract: options.verifyingContract,
        name: options.name,
        version: options.version,
        chainId,
        keypair: kp,
      });
      contractKeypairs[options.verifyingContract] = {
        privateKey: keypair.privateKey,
        publicKey: keypair.publicKey,
        signature: null,
      };
      return { eip712, publicKey: keypair.publicKey };
    },

    setSignature(contractAddress: string, signature: string) {
      if (
        contractKeypairs[contractAddress] &&
        contractKeypairs[contractAddress].privateKey
      ) {
        contractKeypairs[contractAddress].signature = signature;
      }
    },

    getPublicKey(contractAddress: string): TokenSignature | null {
      if (hasKeypair(contractAddress)) {
        return {
          publicKey: contractKeypairs[contractAddress].publicKey,
          signature: contractKeypairs[contractAddress].signature!,
        };
      }
      return null;
    },

    hasKeypair,

    decrypt(contractAddress, ciphertext) {
      if (!ciphertext) throw new Error('Missing ciphertext.');
      if (!contractAddress) throw new Error('Missing contract address.');
      const kp = contractKeypairs[contractAddress];
      if (!kp) throw new Error(`Missing keypair for ${contractAddress}.`);
      return decrypt(kp, ciphertext);
    },

    serializeKeypairs() {
      const stringKeypairs: ExportedContractKeypairs = {};
      Object.keys(contractKeypairs).forEach((contractAddress) => {
        const signature = contractKeypairs[contractAddress].signature;
        if (!signature) return;
        stringKeypairs[contractAddress] = {
          signature,
          publicKey: toHexString(contractKeypairs[contractAddress].publicKey),
          privateKey: toHexString(contractKeypairs[contractAddress].privateKey),
        };
      });
      return stringKeypairs;
    },
  };
};
