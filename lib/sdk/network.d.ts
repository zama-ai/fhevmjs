import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
export type GatewayKeysItem = {
    data_id: string;
    param_choice: number;
    urls: string[];
    signatures: string[];
};
export type GatewayKey = {
    data_id: string;
    param_choice: number;
    signatures: string[];
    urls: string[];
};
export type GatewayKeys = {
    response: {
        fhe_key_info: {
            fhe_public_key: GatewayKey;
            fhe_server_key: GatewayKey;
        }[];
        verf_public_key: {
            key_id: string;
            server_id: number;
            verf_public_key_address: string;
            verf_public_key_url: string;
        }[];
        crs: {
            [key: string]: GatewayKeysItem;
        };
    };
    status: string;
};
export declare const getKeysFromGateway: (url: string) => Promise<{
    publicKey: TfheCompactPublicKey;
    publicParams: {
        2048: CompactPkePublicParams;
    };
}>;
