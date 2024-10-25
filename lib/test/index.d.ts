import { CompactPkePublicParams, TfheClientKey, TfheCompactPublicKey } from 'node-tfhe';
export declare const privateKey: TfheClientKey;
export declare const publicKey: TfheCompactPublicKey;
export declare const publicParams: {
    128: CompactPkePublicParams;
    256: CompactPkePublicParams;
    512: CompactPkePublicParams;
    1024: CompactPkePublicParams;
    2048: CompactPkePublicParams;
};
