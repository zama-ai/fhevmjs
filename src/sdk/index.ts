import sodium from 'libsodium-wrappers';
import { TfheCompactPublicKey } from 'node-tfhe';

import { fromHexString } from '../utils';
import { ZKInput } from './encrypt';
import { getPublicKeyFromNetwork, getChainIdFromNetwork } from './network';
import { createEncryptedInput } from './encrypt';
import { generateKeypair, createEIP712, EIP712 } from './keypair';
import { reencryptRequest } from './reencrypt';

export type FhevmInstanceParams = {
  chainId?: number;
  publicKey?: string;
  networkUrl?: string;
  reencryptionUrl?: string;
};

export type FhevmInstance = {
  createEncryptedInput: (
    contractAddress: string,
    userAddress: string,
  ) => ZKInput;
  reencrypt: {
    generateKeypair: () => { publicKey: string; privateKey: string };
    createEIP712: (publicKey: string, contractAddress: string) => EIP712;
    request: (
      handle: bigint,
      privateKey: string,
      publicKey: string,
      signature: string,
      contractAddress: string,
      userAddress: string,
    ) => Promise<bigint>;
  };
};

export const getCiphertextCallParams = (handle: bigint) => {
  let hex = handle.toString(16);
  hex = hex.padStart(64, '0');
  return {
    to: '0x000000000000000000000000000000000000005d',
    data: '0xff627e77' + hex,
  };
};

export const createInstance = async (
  params: FhevmInstanceParams,
): Promise<FhevmInstance> => {
  await sodium.ready;

  const { chainId, networkUrl } = params;

  let publicKey: string | undefined = params.publicKey;
  let tfheCompactPublicKey: TfheCompactPublicKey | undefined;

  if (networkUrl && !chainId) {
    publicKey = await getChainIdFromNetwork(networkUrl);
  }

  if (typeof chainId !== 'number') throw new Error('chainId must be a number');

  if (networkUrl && !publicKey) {
    publicKey = await getPublicKeyFromNetwork(networkUrl);
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  if (publicKey) {
    const buff = fromHexString(publicKey);
    tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
  }

  return {
    createEncryptedInput: createEncryptedInput(tfheCompactPublicKey),
    reencrypt: {
      generateKeypair,
      createEIP712: createEIP712(chainId),
      request: reencryptRequest(networkUrl),
    },
  };
};
