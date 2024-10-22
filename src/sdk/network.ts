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

export const getKeysFromGateway = async (url: string) => {
  try {
    const response = await fetch(`${url}keyurl`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: GatewayKeys = await response.json();
    if (data) {
      const pubKeyUrl = data.response.fhe_key_info[0].fhe_public_key.urls[0];
      console.log('pubKeyUrl', pubKeyUrl);
      const publicKeyResponse = await fetch(pubKeyUrl);
      const publicKey = await publicKeyResponse.arrayBuffer();
      const crsUrl = data.response.crs['2048'].urls[0];
      const crs2048 = await (await fetch(crsUrl)).arrayBuffer();
      return {
        publicKey: TfheCompactPublicKey.safe_deserialize(
          new Uint8Array(publicKey),
          BigInt(1024) * BigInt(1024) * BigInt(16),
        ),
        publicParams: {
          2048: CompactPkePublicParams.safe_deserialize(
            new Uint8Array(crs2048),
            BigInt(1024) * BigInt(1024) * BigInt(512),
          ),
        },
      };
    } else {
      throw new Error('No public key available');
    }
  } catch (error) {
    console.log('error', error);
    throw new Error('Impossible to fetch public key: wrong gateway url.');
  }
};
