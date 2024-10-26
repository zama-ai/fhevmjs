import { FhevmInstanceConfig } from './config';
import { PublicParams, ZKInput } from './encrypt';
import { EIP712 } from './keypair';
export type FhevmInstance = {
    createEncryptedInput: (contractAddress: string, userAddress: string) => ZKInput;
    generateKeypair: () => {
        publicKey: string;
        privateKey: string;
    };
    createEIP712: (publicKey: string, contractAddress: string, userAddress?: string) => EIP712;
    reencrypt: (handle: bigint, privateKey: string, publicKey: string, signature: string, contractAddress: string, userAddress: string) => Promise<bigint>;
    getPublicKey: () => string | null;
    getPublicParams: () => PublicParams;
};
export { generateKeypair, createEIP712 } from './keypair';
export * from './config';
export * from './encrypt';
export * from './handle';
export declare const createInstance: (config: FhevmInstanceConfig) => Promise<FhevmInstance>;
