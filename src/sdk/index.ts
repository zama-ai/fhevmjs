import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import type { Eip1193Provider } from 'ethers';
import { URL } from 'url';
import { fromHexString } from '../utils';
import { PublicParams, ZKInput } from './encrypt';
import {
  getChainIdFromNetwork,
  getChainIdFromEip1193,
  getKeysFromGateway,
} from './network';
import { createEncryptedInput } from './encrypt';
import { generateKeypair, createEIP712, EIP712 } from './keypair';
import { reencryptRequest } from './reencrypt';

type FhevmInstanceConfig = {
  chainId?: number;
  publicKey?: string;
  gatewayUrl?: string;
  network?: Eip1193Provider;
  networkUrl?: string;
  publicParams?: PublicParams<string>;
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
  getPublicParams: () => PublicParams;
};

export const createInstance = async (
  config: FhevmInstanceConfig,
): Promise<FhevmInstance> => {
  const { publicKey, network, publicParams } = config;

  let gatewayUrl: string | undefined;
  if (config.gatewayUrl) {
    gatewayUrl = new URL(config.gatewayUrl).href;
  }

  let networkUrl: string | undefined;
  if (config.networkUrl) {
    networkUrl = new URL(config.networkUrl).href;
  }

  let chainId: number;
  if (config.chainId && typeof config.chainId === 'number') {
    chainId = config.chainId;
  } else if (config.chainId && typeof config.chainId !== 'number') {
    throw new Error('chainId must be a number.');
  } else if (networkUrl) {
    chainId = await getChainIdFromNetwork(networkUrl);
  } else if (network) {
    chainId = await getChainIdFromEip1193(network);
  } else {
    throw new Error(
      "You didn't provide the chainId nor the network url to get it.",
    );
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  let tfheCompactPublicKey: TfheCompactPublicKey | undefined;

  if (gatewayUrl && !publicKey) {
    const inputs = await getKeysFromGateway(gatewayUrl);
    tfheCompactPublicKey = inputs.publicKey;
  } else if (publicKey) {
    const buff = fromHexString(publicKey);
    try {
      tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  let pkePublicParams: PublicParams = {};

  if (gatewayUrl && !publicParams) {
    const inputs = await getKeysFromGateway(gatewayUrl);
    pkePublicParams = inputs.publicParams;
  } else if (publicParams && publicParams['2048']) {
    const buff = fromHexString(publicParams['2048']);
    try {
      pkePublicParams = {
        '2048': CompactPkePublicParams.deserialize(buff, false, false),
      };
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  return {
    createEncryptedInput: createEncryptedInput(
      gatewayUrl,
      tfheCompactPublicKey,
      pkePublicParams,
    ),
    generateKeypair,
    createEIP712: createEIP712(chainId),
    reencrypt: reencryptRequest(gatewayUrl),
    getPublicKey: () => publicKey || null,
    getPublicParams: () => pkePublicParams || null,
  };
};
