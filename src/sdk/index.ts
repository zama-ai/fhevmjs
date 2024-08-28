import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import { URL } from 'url';
import { fromHexString } from '../utils';
import { ZKInput } from './encrypt';
import { getPublicKeyFromGateway, getPublicParamsFromGateway } from './network';
import { createEncryptedInput } from './encrypt';
import { generateKeypair, createEIP712, EIP712 } from './keypair';
import { reencryptRequest } from './reencrypt';

type FhevmInstanceConfig = {
  chainId: number;
  publicKey?: string;
  publicParams?: string;
  gatewayUrl?: string;
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
  const { publicKey, chainId, gatewayUrl, publicParams } = config;

  let gateway: string | undefined;
  if (gatewayUrl) {
    gateway = new URL(gatewayUrl).href;
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  let tfheCompactPublicKey: TfheCompactPublicKey | undefined;

  if (gateway && !publicKey) {
    tfheCompactPublicKey = await getPublicKeyFromGateway(gateway);
  } else if (publicKey) {
    const buff = fromHexString(publicKey);
    try {
      tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  let pkePublicParams: CompactPkePublicParams | undefined;

  if (gateway && !publicParams) {
    pkePublicParams = await getPublicParamsFromGateway(gateway);
  } else if (publicParams) {
    const buff = fromHexString(publicParams);
    try {
      pkePublicParams = CompactPkePublicParams.deserialize(buff, false, false);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  return {
    createEncryptedInput: createEncryptedInput(
      tfheCompactPublicKey,
      pkePublicParams,
    ),
    generateKeypair,
    createEIP712: createEIP712(chainId),
    reencrypt: reencryptRequest(gateway),
    getPublicKey: () => publicKey || null,
  };
};
