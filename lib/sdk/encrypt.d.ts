import { TfheCompactPublicKey, CompactPkePublicParams } from 'node-tfhe';
import { ENCRYPTION_TYPES } from './encryptionTypes';
type EncryptionTypes = keyof typeof ENCRYPTION_TYPES;
export type GatewayEncryptResponse = {
    response: {
        coprocessor: boolean;
        handles: string[];
        kms_signatures: string[];
        coproc_signature: string;
    };
};
export type ZKInput = {
    addBool: (value: boolean) => ZKInput;
    add4: (value: number | bigint) => ZKInput;
    add8: (value: number | bigint) => ZKInput;
    add16: (value: number | bigint) => ZKInput;
    add32: (value: number | bigint) => ZKInput;
    add64: (value: number | bigint) => ZKInput;
    add128: (value: number | bigint) => ZKInput;
    add256: (value: number | bigint) => ZKInput;
    addBytes64: (value: Uint8Array) => ZKInput;
    addBytes128: (value: Uint8Array) => ZKInput;
    addBytes256: (value: Uint8Array) => ZKInput;
    addAddress: (value: string) => ZKInput;
    getBits: () => number[];
    encrypt: () => Promise<{
        prehandle: Uint8Array;
        ciphertext: Uint8Array;
    }>;
};
export type PublicParams<T = CompactPkePublicParams> = {
    [key in EncryptionTypes]?: T;
};
export declare const createEncryptedInput: (aclContractAddress: string, chainId: number, gateway: string, tfheCompactPublicKey: TfheCompactPublicKey, publicParams: PublicParams) => (contractAddress: string, callerAddress: string) => ZKInput;
export {};
