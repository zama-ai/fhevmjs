import { TfheCompactPublicKey } from 'node-tfhe';
import { encryptInteger } from './encrypt';
import { GenerateTokenParams, generateToken } from './token';

export type ZamaWeb3Instance = {
  encryptInteger: (value: number) => ReturnType<typeof encryptInteger>;
  generateToken: (value: Omit<GenerateTokenParams, 'chainId'>) => ReturnType<typeof generateToken>;
};

export type ZamaWeb3InstanceParams = { chainId: number; publicKey: TfheCompactPublicKey };

export const createInstance = (params: ZamaWeb3InstanceParams): ZamaWeb3Instance => {
  const { chainId, publicKey } = params;

  return {
    encryptInteger(value) {
      return encryptInteger(value, publicKey);
    },

    async generateToken(options) {
      return generateToken({ ...options, chainId });
    },
  };
};
