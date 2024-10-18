import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import { fromHexString } from '../utils';

export type GatewayKeysItem = {
  url: string;
  signatures: string[];
};

export type GatewayKey = {
  data_id: string;
  param_choices: number;
  signatures: string[];
  urls: string[];
};

export type GatewayKeys = {
  response: {
    fhe_key_info: {
      fhe_public_key: GatewayKey[];
      fhe_server_key: GatewayKey[];
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
    status: string;
  };
};

export const getKeysFromGateway = async (url: string) => {
  try {
    const response = await fetch(`${url}keyurl`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: GatewayKeys = await response.json();
    if (data) {
      const pubKeyUrl = data.response.fhe_key_info[0].fhe_public_key[0].urls[0];
      const publicKey = await (await fetch(pubKeyUrl)).text();
      const crsUrl = data.response.crs['2048'].url;
      const crs2048 = await (await fetch(crsUrl)).text();
      return {
        publicKey: TfheCompactPublicKey.deserialize(fromHexString(publicKey)),
        publicParams: {
          2048: CompactPkePublicParams.deserialize(fromHexString(crs2048)),
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
