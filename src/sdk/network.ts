import { toHexString } from '../utils';

function decodeAbiBytes(hex: string): Uint8Array {
  if (hex.startsWith('0x')) {
    hex = hex.substring(2);
  }
  // The data offset is the first 32 bytes, which points to the start of the data (skip this part)
  const dataOffset = parseInt(hex.substring(0, 64), 16) * 2; // Convert offset from bytes to characters

  // The length of the data is the next 32 bytes, starting from the offset
  const dataLength =
    parseInt(hex.substring(dataOffset, dataOffset + 64), 16) * 2; // Convert length from bytes to characters

  // Extract the data
  const data = hex.substring(dataOffset + 64, dataOffset + 64 + dataLength);

  // Convert the extracted data from hex to Uint8Array
  const bytes = new Uint8Array(data.length / 2);
  for (let i = 0, j = 0; i < data.length; i += 2, j++) {
    bytes[j] = parseInt(data.substring(i, i + 2), 16);
  }

  return bytes;
}

const fetchJSONRPC = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.result) {
      // The result is usually prefixed with '0x' and is in hex format
      const hexResult = data.result;
      const decodedBytes = decodeAbiBytes(hexResult);
      return `0x${toHexString(decodedBytes)}`;
    } else {
      console.error('No result from blockchain call');
    }
  } catch (error) {
    console.error('Error performing eth_call:', error);
  }
};

export const getPublicKeyCallParams = () => ({
  to: '0x000000000000000000000000000000000000005d',
  data: '0xd9d47bb001',
});

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
  return fetchJSONRPC(url, options);
};

// Define the function to perform the eth_call
export const getPublicKeyFromNetwork = async (url: string) => {
  // Create the JSON-RPC request payload
  const payload = {
    jsonrpc: '2.0',
    method: 'eth_call',
    params: [getPublicKeyCallParams(), 'latest'],
    id: 1,
  };

  // Set up the fetch request options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  };

  return fetchJSONRPC(url, options);
};
