import { InitInput as TFHEInput } from 'tfhe';
import { InitInput as KMSInput } from 'tkms';
export declare const initFhevm: ({ tfheParams, kmsParams, }?: {
    tfheParams?: TFHEInput;
    kmsParams?: KMSInput;
}) => Promise<boolean>;
