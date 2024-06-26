import { TfheCompactPublicKey } from 'node-tfhe';
import { URL } from 'url';
import { fromHexString } from '../utils';
import { ZKInput } from './encrypt';
import {
  getPublicKeyFromNetwork,
  getPublicKeyFromCoprocessor,
  getChainIdFromNetwork,
} from './network';
import { createEncryptedInput } from './encrypt';
import { generateKeypair, createEIP712, EIP712 } from './keypair';
import { reencryptRequest } from './reencrypt';

export {
  getPublicKeyCallParams,
  getPublicKeyFromCoprocessor,
  getPublicKeyFromNetwork,
  getChainIdFromNetwork,
} from './network';

type FhevmInstanceConfig = {
  chainId?: number;
  publicKey?: string;
  gatewayUrl?: string;
  networkUrl?: string;
  coprocessorUrl?: string;
};

export type FhevmInstance = {
  createEncryptedInput: (
    contractAddress: string,
    userAddress: string,
  ) => ZKInput;
  generateKeypair: () => { publicKey: string; privateKey: string };
  createEIP712: (
    publicKey: string,
    contractAddress: string,
    userAddress?: string,
  ) => EIP712;
  reencrypt: (
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string,
  ) => Promise<bigint>;
  getPublicKey: () => string | null;
};

export const createInstance = async (
  config: FhevmInstanceConfig,
): Promise<FhevmInstance> => {
  let { publicKey, networkUrl, gatewayUrl, coprocessorUrl } = config;

  if (gatewayUrl) {
    gatewayUrl = new URL(gatewayUrl).href;
  }

  if (networkUrl) {
    networkUrl = new URL(networkUrl).href;
  }

  if (coprocessorUrl) {
    coprocessorUrl = new URL(coprocessorUrl).href;
  }

  let chainId: number;
  if (config.chainId && typeof config.chainId === 'number') {
    chainId = config.chainId;
  } else if (config.chainId && typeof config.chainId !== 'number') {
    throw new Error('chainId must be a number.');
  } else if (networkUrl) {
    chainId = await getChainIdFromNetwork(networkUrl);
  } else {
    throw new Error(
      "You didn't provide the chainId nor the network url to get it.",
    );
  }

  if (coprocessorUrl && !publicKey) {
    const data = await getPublicKeyFromCoprocessor(coprocessorUrl);
    publicKey = data.publicKey;
  } else if (networkUrl && !publicKey) {
    publicKey = await getPublicKeyFromNetwork(networkUrl);
  }

  if (networkUrl && !chainId) {
    chainId = await getChainIdFromNetwork(networkUrl);
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  let tfheCompactPublicKey: TfheCompactPublicKey | undefined;

  if (publicKey) {
    const buff = fromHexString(publicKey);
    try {
      tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  return {
    createEncryptedInput: createEncryptedInput(
      tfheCompactPublicKey,
      coprocessorUrl,
    ),
    generateKeypair,
    createEIP712: createEIP712(chainId),
    reencrypt: reencryptRequest(gatewayUrl),
    getPublicKey: () => publicKey || null,
  };
};
