import { TfheCompactPublicKey } from 'node-tfhe';
import sodium from 'libsodium-wrappers';
import { encrypt4, encrypt8, encrypt16, encrypt32, encrypt64 } from './encrypt';
import {
  EIP712,
  GeneratePublicKeyParams,
  generatePublicKey,
} from './publicKey';
import { decrypt } from './decrypt';
import { fromHexString, isAddress, toHexString } from '../utils';
import { ContractKeypairs } from './types';

export type FhevmInstance = {
  encrypt4: (value: number) => Uint8Array;
  encrypt8: (value: number) => Uint8Array;
  encrypt16: (value: number) => Uint8Array;
  encrypt32: (value: number) => Uint8Array;
  encrypt64: (value: number) => Uint8Array;
  generateToken: (
    options: GeneratePublicKeyParams & {
      force?: boolean;
    },
  ) => {
    publicKey: Uint8Array;
    token: EIP712;
  };
  generatePublicKey: (
    options: GeneratePublicKeyParams & {
      force?: boolean;
    },
  ) => {
    publicKey: Uint8Array;
    eip712: EIP712;
  };
  setTokenSignature: (contractAddress: string, signature: string) => void;
  getTokenSignature: (
    contractAddress: string,
  ) => { publicKey: Uint8Array; signature: string } | null;
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

  return {
    // Parameters
    encrypt4(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key',
        );
      return encrypt4(value, tfheCompactPublicKey);
    },
    encrypt8(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key',
        );
      return encrypt8(value, tfheCompactPublicKey);
    },
    encrypt16(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key',
        );
      return encrypt16(value, tfheCompactPublicKey);
    },

    encrypt32(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key',
        );
      return encrypt32(value, tfheCompactPublicKey);
    },

    encrypt64(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      if (!tfheCompactPublicKey)
        throw new Error(
          'Your instance has been created without the public blockchain key',
        );
      return encrypt64(value, tfheCompactPublicKey);
    },

    /**
     * @deprecated Since version 0.3.0. Will be deleted in version 0.4.0. Use generatePublicKey instead.
     */
    generateToken(options) {
      console.warn(
        'generateToken is deprecated. Use generatePublicKey instead',
      );
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
      return { token: eip712, publicKey: keypair.publicKey };
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

    /**
     * @deprecated Since version 0.3.0. Will be deleted in version 0.4.0. Use generatePublicKey instead.
     */
    setTokenSignature(contractAddress: string, signature: string) {
      console.warn(
        'setTokenSignature is deprecated. Use generatePublicKey instead',
      );
      if (
        contractKeypairs[contractAddress] &&
        contractKeypairs[contractAddress].privateKey
      ) {
        contractKeypairs[contractAddress].signature = signature;
      }
    },

    setSignature(contractAddress: string, signature: string) {
      if (
        contractKeypairs[contractAddress] &&
        contractKeypairs[contractAddress].privateKey
      ) {
        contractKeypairs[contractAddress].signature = signature;
      }
    },

    /**
     * @deprecated Since version 0.3.0. Will be deleted in version 0.4.0. Use generatePublicKey instead.
     */
    getTokenSignature(contractAddress: string): TokenSignature | null {
      console.warn(
        'setTokenSignature is deprecated. Use generatePublicKey instead',
      );
      if (hasKeypair(contractAddress)) {
        return {
          publicKey: contractKeypairs[contractAddress].publicKey,
          signature: contractKeypairs[contractAddress].signature!,
        };
      }
      return null;
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
      if (!ciphertext) throw new Error('Missing ciphertext');
      if (!contractAddress) throw new Error('Missing contract address');
      const kp = contractKeypairs[contractAddress];
      if (!kp) throw new Error(`Missing keypair for ${contractAddress}`);
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
