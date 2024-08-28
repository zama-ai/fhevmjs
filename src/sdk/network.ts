import { CompactPkePublicParams, TfhePublicKey } from 'node-tfhe';

export const getPublicKeyFromGateway = async (url: string) => {
  try {
    const response = await fetch(`${url}/inputs/publickey`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.arrayBuffer();
    if (data) {
      return TfhePublicKey.deserialize(new Uint8Array(data));
    } else {
      throw new Error('No public key available');
    }
  } catch (error) {
    throw new Error('Impossible to fetch public key: wrong gateway url.');
  }
};

// Define the function to perform the eth_call
export const getPublicParamsFromGateway = async (url: string) => {
  try {
    const response = await fetch(`${url}/inputs/crs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.arrayBuffer();
    if (data) {
      return CompactPkePublicParams.deserialize(
        new Uint8Array(data),
        false,
        false,
      );
    } else {
      throw new Error('No public params available');
    }
  } catch (error) {
    throw new Error('Impossible to fetch public params: wrong gateway url.');
  }
};
