import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import { SERIALIZED_SIZE_LIMIT_PK, SERIALIZED_SIZE_LIMIT_CRS } from '../utils';

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

const keyurlCache: { [key: string]: any } = {};
export const getKeysFromGateway = async (url: string) => {
  if (keyurlCache[url]) {
    return keyurlCache[url];
  }
  try {
    const response = await fetch(`${url}keyurl`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: GatewayKeys = await response.json();
    if (data) {
      const pubKeyUrl = data.response.fhe_key_info[0].fhe_public_key.urls[0];
      const publicKeyId = data.response.fhe_key_info[0].fhe_public_key.data_id;
      const publicKeyResponse = await fetch(pubKeyUrl);
      const publicKey = await publicKeyResponse.arrayBuffer();
      const publicParamsUrl = data.response.crs['2048'].urls[0];
      const publicParamsId = data.response.crs['2048'].data_id;
      const publicParams2048 = await (await fetch(publicParamsUrl)).arrayBuffer();

      const result = {
        publicKey: TfheCompactPublicKey.safe_deserialize(
          new Uint8Array(publicKey),
          SERIALIZED_SIZE_LIMIT_PK,
        ),
        publicKeyId,
        publicParams: {
          2048: {
            publicParams: CompactPkePublicParams.safe_deserialize(
              new Uint8Array(publicParams2048),
              SERIALIZED_SIZE_LIMIT_CRS,
            ),
            publicParamsId,
          }
        }
      };
      keyurlCache[url] = result;
      return result;
    } else {
      throw new Error('No public key available');
    }
  } catch (error) {
    console.log('error', error);
    throw new Error('Impossible to fetch public key: wrong gateway url.');
  }
};
