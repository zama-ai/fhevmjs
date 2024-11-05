import {
  BrowserProvider,
  Contract,
  Eip1193Provider,
  JsonRpcProvider,
  Provider,
} from 'ethers';
import { PublicParams } from './encrypt';
import { getKeysFromGateway } from './network';
import { fromHexString, cleanURL, SERIALIZED_SIZE_LIMIT_PK, SERIALIZED_SIZE_LIMIT_CRS } from '../utils';
import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import { abi } from '../abi/kmsVerifier.json';

export type FhevmInstanceConfig = {
  kmsContractAddress: string;
  aclContractAddress: string;
  chainId?: number;
  publicKey?: string;
  publicKeyId?: string;
  gatewayUrl?: string;
  network?: Eip1193Provider;
  networkUrl?: string;
  publicParams?: PublicParams<string>;
};

export const getProvider = (config: FhevmInstanceConfig) => {
  if (config.networkUrl) {
    return new JsonRpcProvider(config.networkUrl);
  } else if (config.network) {
    return new BrowserProvider(config.network);
  }
  throw new Error(
    'You must provide a network URL or a EIP1193 object (eg: window.ethereum)',
  );
};

export const getChainId = async (
  provider: Provider,
  config: FhevmInstanceConfig,
): Promise<number> => {
  if (config.chainId && typeof config.chainId === 'number') {
    return config.chainId;
  } else if (config.chainId && typeof config.chainId !== 'number') {
    throw new Error('chainId must be a number.');
  } else {
    const chainId = (await provider.getNetwork()).chainId;
    return Number(chainId);
  }
};

export const getTfheCompactPublicKey = async (config: FhevmInstanceConfig) => {
  if (config.gatewayUrl && !config.publicKey) {
    const inputs = await getKeysFromGateway(cleanURL(config.gatewayUrl));
    return { publicKey: inputs.publicKey, publicKeyId: inputs.publicKeyId };
  } else if (config.publicKey && config.publicKeyId) {
    const buff = fromHexString(config.publicKey);
    try {
      return { publicKey: TfheCompactPublicKey.safe_deserialize(buff, SERIALIZED_SIZE_LIMIT_PK), publicKeyId: config.publicKeyId };
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  } else {
    throw new Error('You must provide a public key with its public key ID.');
  }
};

export const getPublicParams = async (config: FhevmInstanceConfig) => {
  if (config.gatewayUrl && !config.publicParams) {
    const inputs = await getKeysFromGateway(cleanURL(config.gatewayUrl));
    return inputs.publicParams;
  } else if (config.publicParams && config.publicParams['2048']) {
    const buff = fromHexString(config.publicParams['2048'].publicParams);
    try {
      return {
        2048: { 
          publicParams: CompactPkePublicParams.safe_deserialize(buff, SERIALIZED_SIZE_LIMIT_CRS),
          publicParamsId: config.publicParams['2048'].publicParamsId
        },
      };
    } catch (e) {
      throw new Error('Invalid public key (deserialization failed)');
    }
  } else {
    throw new Error('You must provide a valid CRS with its CRS ID.');
  }
};

export const getKMSSigners = async (
  provider: Provider,
  config: FhevmInstanceConfig,
): Promise<string[]> => {
  const kmsContract = new Contract(config.kmsContractAddress, abi, provider);
  const signers: string[] = await kmsContract.getSigners();
  return signers;
};
