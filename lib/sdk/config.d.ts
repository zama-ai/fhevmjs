import { BrowserProvider, Eip1193Provider, JsonRpcProvider, Provider } from 'ethers';
import { PublicParams } from './encrypt';
import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
export type FhevmInstanceConfig = {
    kmsContractAddress: string;
    aclContractAddress: string;
    chainId?: number;
    publicKey?: string;
    gatewayUrl?: string;
    network?: Eip1193Provider;
    networkUrl?: string;
    publicParams?: PublicParams<string>;
};
export declare const getProvider: (config: FhevmInstanceConfig) => JsonRpcProvider | BrowserProvider;
export declare const getChainId: (provider: Provider, config: FhevmInstanceConfig) => Promise<number>;
export declare const getTfheCompactPublicKey: (config: FhevmInstanceConfig) => Promise<TfheCompactPublicKey>;
export declare const getPublicParams: (config: FhevmInstanceConfig) => Promise<{
    2048: CompactPkePublicParams;
}>;
export declare const getKMSSignatures: (provider: Provider, config: FhevmInstanceConfig) => Promise<string[]>;
