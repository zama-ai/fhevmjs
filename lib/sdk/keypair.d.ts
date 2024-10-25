export type EIP712Type = {
    name: string;
    type: string;
};
export type EIP712 = {
    domain: {
        chainId: number;
        name: string;
        verifyingContract: string;
        version: string;
    };
    message: {
        publicKey: string;
        delegatedAccount?: string;
    };
    primaryType: string;
    types: {
        [key: string]: EIP712Type[];
    };
};
export declare const createEIP712: (chainId: number) => (publicKey: string, verifyingContract: string, delegatedAccount?: string) => EIP712;
export declare const generateKeypair: () => {
    publicKey: string;
    privateKey: string;
};
