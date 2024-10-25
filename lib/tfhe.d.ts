import { TfheCompactPublicKey, TfheClientKey, CompactPkeCrs } from 'node-tfhe';
export declare const createTfheKeypair: () => {
    clientKey: TfheClientKey;
    publicKey: TfheCompactPublicKey;
    crs: CompactPkeCrs;
};
export declare const createTfhePublicKey: () => string;
