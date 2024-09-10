import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import { URL } from 'url';
import { fromHexString } from '../utils';
import { ZKInput } from './encrypt';
import { getInputsFromGateway } from './network';
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

  if (!chainId || typeof chainId !== 'number' || Number.isNaN(chainId)) {
    throw new Error('chainId must be a number');
  }

  let gateway: string | undefined;
  if (gatewayUrl) {
    gateway = new URL(gatewayUrl).href;
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  let tfheCompactPublicKey: TfheCompactPublicKey | undefined;

  if (gateway && !publicKey) {
    const inputs = await getInputsFromGateway(gateway);
    tfheCompactPublicKey = inputs.publicKey;
  } else if (publicKey) {
    const buff = fromHexString(publicKey);
    try {
      tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  let pkePublicParams: CompactPkePublicParams;

  if (gateway && !publicParams) {
    const inputs = await getInputsFromGateway(gateway);
    pkePublicParams = inputs.publicParams[2048];
  } else if (publicParams) {
    const buff = fromHexString(publicParams);
    try {
      pkePublicParams = CompactPkePublicParams.deserialize(buff, false, false);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  return {
    createEncryptedInput: createEncryptedInput(tfheCompactPublicKey, {
      2048: pkePublicParams!,
    }),
    generateKeypair,
    createEIP712: createEIP712(chainId),
    reencrypt: reencryptRequest(gateway),
    getPublicKey: () => publicKey || null,
  };
};
