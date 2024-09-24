import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import type { Eip1193Provider } from 'ethers';
import { fromHexString } from '../utils';
import { fetchJSONRPC } from '../ethCall';

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
    throw new Error('Impossible to fetch public key: wrong gateway url.');
  }
};

export const getChainIdFromEip1193 = async (ethereum: Eip1193Provider) => {
  const payload = {
    method: 'eth_chainId',
    params: [],
  };

  let chainId;
  try {
    chainId = await ethereum.request(payload);
  } catch (e) {
    throw new Error('Impossible to fetch chain id (wrong network?)');
  }
  return Number(chainId);
};

export const getChainIdFromNetwork = async (url: string) => {
  const payload = {
    jsonrpc: '2.0',
    method: 'eth_chainId',
    params: [],
    id: 1,
  };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };
  let chainId;
  try {
    chainId = await fetchJSONRPC(url, options);
  } catch (e) {
    throw new Error('Impossible to fetch chain id (wrong url?)');
  }
  return Number(chainId);
};
