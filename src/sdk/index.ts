import { TfheCompactPublicKey } from 'node-tfhe';
import { encrypt8, encrypt16, encrypt32 } from './encrypt';
import { GenerateTokenParams, generateToken } from './token';

export type ZamaWeb3Instance = {
  chainId: number;
  publicKey: TfheCompactPublicKey;
  encrypt8: (value: number) => ReturnType<typeof encrypt8>;
  encrypt16: (value: number) => ReturnType<typeof encrypt16>;
  encrypt32: (value: number) => ReturnType<typeof encrypt32>;
  generateToken: (value: Omit<GenerateTokenParams, 'chainId'>) => ReturnType<typeof generateToken>;
};

export type ZamaWeb3InstanceParams = { chainId: number; publicKey: TfheCompactPublicKey };

export const createInstance = (params: ZamaWeb3InstanceParams): ZamaWeb3Instance => {
  const { chainId, publicKey } = params;

  return {
    chainId,
    publicKey,
    encrypt8(value) {
      return encrypt8(value, publicKey);
    },
    encrypt16(value) {
      return encrypt16(value, publicKey);
    },

    encrypt32(value) {
      return encrypt32(value, publicKey);
    },

    async generateToken(options) {
      return generateToken({ ...options, chainId });
    },
  };
};
