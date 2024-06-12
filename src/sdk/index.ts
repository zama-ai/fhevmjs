import sodium from 'libsodium-wrappers';
import { TfheCompactPublicKey } from 'node-tfhe';

import { fromHexString } from '../utils';
import { ZKInput } from './encrypt';
import { getPublicKeyFromNetwork, getChainIdFromNetwork } from './network';
import { createEncryptedInput } from './encrypt';
import { generateKeypair, createEIP712, EIP712 } from './keypair';
import { reencryptRequest } from './reencrypt';

export { getPublicKeyCallParams } from './network';

type FhevmInstanceConfig = {
  chainId: number;
  publicKey?: string;
  reencryptionUrl?: string;
  networkUrl?: string;
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
};

export const createInstance = async (
  config: FhevmInstanceConfig,
): Promise<FhevmInstance> => {
  await sodium.ready;

  const { chainId, networkUrl, reencryptionUrl } = config;

  let publicKey: string | undefined = config.publicKey;
  let tfheCompactPublicKey: TfheCompactPublicKey | undefined;

  if (typeof chainId !== 'number') throw new Error('chainId must be a number');

  if (networkUrl && !publicKey) {
    publicKey = await getPublicKeyFromNetwork(networkUrl);
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  if (publicKey) {
    const buff = fromHexString(publicKey);
    try {
      tfheCompactPublicKey = TfheCompactPublicKey.deserialize(buff);
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  }

  return {
    createEncryptedInput: createEncryptedInput(tfheCompactPublicKey),
    generateKeypair,
    createEIP712: createEIP712(chainId),
    reencrypt: reencryptRequest(reencryptionUrl),
  };
};
