import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import type { Eip1193Provider } from 'ethers';
import { fromHexString } from '../utils';

export type GatewayKeysItem = {
  url: string;
  signatures: string[];
};
export type GatewayKeys = {
  keyId: string;
  crsId: string;
  publicKey: GatewayKeysItem;
  bootstrapKey: GatewayKeysItem;
  crs: {
    [key: string]: GatewayKeysItem;
  };
};

export const getKeysFromGateway = async (url: string) => {
  try {
    const response = await fetch(`${url}/keys`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: GatewayKeys = await response.json();
    if (data) {
      const publicKey = await (await fetch(data.publicKey.url)).text();
      const crs2048 = await (await fetch(data.crs['2048'].url)).text();
      return {
        publicKey: TfheCompactPublicKey.deserialize(fromHexString(publicKey)),
        publicParams: {
          2048: CompactPkePublicParams.deserialize(
            fromHexString(crs2048),
            false,
            false,
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
