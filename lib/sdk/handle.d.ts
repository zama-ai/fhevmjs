export declare const HANDLE_VERSION = 0;
export declare const handleTypes: Readonly<{
    ebool: 0;
    euint4: 1;
    euint8: 2;
    euint16: 3;
    euint32: 4;
    euint64: 5;
    euint128: 6;
    euint160: 7;
    euint256: 8;
    ebytes64: 9;
    ebytes128: 10;
    ebytes256: 11;
}>;
export type InputContext = {
    hostChainId: number;
    keysetId: string;
    ownerAddress: string;
    contractAddress: string;
};
export type HandleType = (typeof handleTypes)[keyof typeof handleTypes];
export declare function isHandleType(value: number): value is HandleType;
export declare function mustGetHandleType(value: number | undefined): HandleType;
export declare function computePrehandle({ ciphertextHash, indexHandle, handleType, handleVersion, }: {
    ciphertextHash: Uint8Array;
    indexHandle: number;
    handleType: HandleType;
    handleVersion: number;
}): Buffer;
export declare function computeHandle({ prehandle, inputCtx, }: {
    prehandle: Uint8Array;
    inputCtx: InputContext;
}): Buffer;
