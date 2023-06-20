import { CompactFheUint16List, TfheCompactPublicKey } from 'node-tfhe';
import { StringKeyPair, KeyPair } from 'libsodium-wrappers';
import { encrypt8, encrypt16, encrypt32 } from './encrypt';
import { EIP712, GenerateTokenParams, generateToken } from './token';
import { decrypt } from './decrypt';
import { fromHexString, isAddress, toHexString } from '../utils';

export type ZamaWeb3Instance = {
  encrypt8: (value: number) => Uint8Array;
  encrypt16: (value: number) => Uint8Array;
  encrypt32: (value: number) => Uint8Array;
  generateToken: (
    value: Omit<GenerateTokenParams, 'chainId' | 'keypair'>
  ) => Promise<{ publicKey: string; token: EIP712 }>;
  decrypt: (contractAddress: string, ciphertext: string) => Promise<number>;
  getContractKeypairs: () => ExportedContractKeypairs;
};

export type ExportedContractKeypairs = {
  [key: string]: StringKeyPair;
};

export type ContractKeypairs = {
  [key: string]: KeyPair;
};

export type ZamaWeb3InstanceParams = {
  chainId: number;
  publicKey: TfheCompactPublicKey;
  keypairs?: ExportedContractKeypairs;
};

export const createInstance = (params: ZamaWeb3InstanceParams): ZamaWeb3Instance => {
  const { chainId, publicKey, keypairs } = params;

  let contractKeypairs: ContractKeypairs = {};

  if (keypairs) {
    Object.keys(keypairs).forEach((contractAddress) => {
      if (isAddress(contractAddress)) {
        const oKeys = Object.keys(keypairs[contractAddress]);
        if (['keyType', 'privateKey', 'publicKey'].every((v) => oKeys.includes(v))) {
          contractKeypairs[contractAddress] = {
            keyType: keypairs[contractAddress].keyType,
            publicKey: fromHexString(keypairs[contractAddress].publicKey),
            privateKey: fromHexString(keypairs[contractAddress].privateKey),
          };
        }
      }
    });
  }

  return {
    encrypt8(value) {
      if (!value) throw new Error('Missing value');
      return encrypt8(value, publicKey);
    },
    encrypt16(value) {
      if (!value) throw new Error('Missing value');
      return encrypt16(value, publicKey);
    },

    encrypt32(value) {
      if (!value) throw new Error('Missing value');

      return encrypt32(value, publicKey);
    },

    async generateToken(options) {
      if (!options.verifyingContract) throw new Error('Missing contract address');
      if (!isAddress(options.verifyingContract)) throw new Error('Invalid contract address');
      const kp = contractKeypairs[options.verifyingContract] || null;
      const { token, keypair } = await generateToken({ ...options, chainId, keypair: kp });
      contractKeypairs[options.verifyingContract] = keypair;
      return { token, publicKey: toHexString(keypair.publicKey) };
    },

    async decrypt(contractAddress, ciphertext) {
      if (!ciphertext) throw new Error('Missing ciphertext');
      if (!contractAddress) throw new Error('Missing contract address');
      const kp = contractKeypairs[contractAddress];
      if (!kp) throw new Error(`Missing keypair for ${contractAddress}`);

      return decrypt(kp, ciphertext);
    },

    getContractKeypairs() {
      const stringKeypairs: ExportedContractKeypairs = {};
      Object.keys(contractKeypairs).forEach((contractAddress) => {
        stringKeypairs[contractAddress] = {
          keyType: contractKeypairs[contractAddress].keyType,
          publicKey: toHexString(contractKeypairs[contractAddress].publicKey),
          privateKey: toHexString(contractKeypairs[contractAddress].privateKey),
        };
      });
      return stringKeypairs;
    },
  };
};
