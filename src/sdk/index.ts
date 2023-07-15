import { TfheCompactPublicKey } from 'node-tfhe';
import sodium from 'libsodium-wrappers';
import { encrypt8, encrypt16, encrypt32 } from './encrypt';
import { EIP712, generateToken } from './token';
import { decrypt } from './decrypt';
import { fromHexString, isAddress, toHexString } from '../utils';
import { ContractKeypairs } from './types';

export type FhevmInstance = {
  encrypt8: (value: number) => Uint8Array;
  encrypt16: (value: number) => Uint8Array;
  encrypt32: (value: number) => Uint8Array;
  generateToken: (options: { verifyingContract: string; name?: string; version?: string; force?: boolean }) => {
    publicKey: Uint8Array;
    token: EIP712;
  };
  setTokenSignature: (contractAddress: string, signature: string) => void;
  getTokenSignature: (contractAddress: string) => { publicKey: Uint8Array; signature: string } | null;
  hasKeypair: (contractAddress: string) => boolean;
  decrypt: (contractAddress: string, ciphertext: string) => number;
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
  publicKey: string;
  keypairs?: ExportedContractKeypairs;
};

export const createInstance = async (params: FhevmInstanceParams): Promise<FhevmInstance> => {
  await sodium.ready;
  const { chainId, publicKey, keypairs } = params;
  const buff = fromHexString(publicKey);
  const tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);

  let contractKeypairs: ContractKeypairs = {};

  if (keypairs) {
    Object.keys(keypairs).forEach((contractAddress) => {
      if (isAddress(contractAddress)) {
        const oKeys = Object.keys(keypairs[contractAddress]);
        if (['signature', 'privateKey', 'publicKey'].every((v) => oKeys.includes(v))) {
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
    return contractKeypairs[contractAddress] != null && !!contractKeypairs[contractAddress].signature;
  };

  return {
    // Parameters
    encrypt8(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      return encrypt8(value, tfheCompactPublicKey);
    },
    encrypt16(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      return encrypt16(value, tfheCompactPublicKey);
    },

    encrypt32(value) {
      if (value == null) throw new Error('Missing value');
      if (typeof value !== 'number') throw new Error('Value must be a number');
      return encrypt32(value, tfheCompactPublicKey);
    },

    // Reencryption
    generateToken(options) {
      if (!options || !options.verifyingContract) throw new Error('Missing contract address');
      if (!isAddress(options.verifyingContract)) throw new Error('Invalid contract address');
      let kp;
      if (!options.force && contractKeypairs[options.verifyingContract]) {
        kp = contractKeypairs[options.verifyingContract];
      }
      const { token, keypair } = generateToken({
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
      return { token, publicKey: keypair.publicKey };
    },

    setTokenSignature(contractAddress: string, signature: string) {
      if (contractKeypairs[contractAddress] && contractKeypairs[contractAddress].privateKey) {
        contractKeypairs[contractAddress].signature = signature;
      }
    },

    getTokenSignature(contractAddress: string): TokenSignature | null {
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
