import {
  FhevmInstanceConfig,
  getChainId,
  getProvider,
  getPublicParams,
  getTfheCompactPublicKey,
} from './config';
import { cleanURL } from '../utils';
import { PublicParams, ZKInput } from './encrypt';
import { createEncryptedInput } from './encrypt';
import { generateKeypair, createEIP712, EIP712 } from './keypair';
import { reencryptRequest } from './reencrypt';
import { isAddress } from 'ethers';

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

export { generateKeypair, createEIP712 } from './keypair';

export * from './config';
export * from './encrypt';

export const createInstance = async (
  config: FhevmInstanceConfig,
): Promise<FhevmInstance> => {
  const { publicKey, kmsContractAddress, aclContractAddress } = config;

  if (!kmsContractAddress || !isAddress(kmsContractAddress)) {
    throw new Error('KMS contract address is not valid or empty');
  }

  if (!aclContractAddress || !isAddress(aclContractAddress)) {
    throw new Error('ACL contract address is not valid or empty');
  }

  if (publicKey && typeof publicKey !== 'string')
    throw new Error('publicKey must be a string');

  const provider = getProvider(config);

  if (!provider) {
    throw new Error('No network has been provided!');
  }

  const chainId = await getChainId(provider, config);

  const tfheCompactPublicKey = await getTfheCompactPublicKey(config);

  const pkePublicParams: PublicParams = await getPublicParams(config);

  return {
    createEncryptedInput: createEncryptedInput(
      aclContractAddress,
      chainId,
      cleanURL(config.gatewayUrl),
      tfheCompactPublicKey,
      pkePublicParams,
    ),
    generateKeypair,
    createEIP712: createEIP712(chainId),
    reencrypt: reencryptRequest(
      [],
      chainId,
      kmsContractAddress,
      cleanURL(config.gatewayUrl),
    ),
    getPublicKey: () => publicKey || null,
    getPublicParams: () => pkePublicParams || null,
  };
};
