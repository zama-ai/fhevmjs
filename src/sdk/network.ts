import { fetchJSONRPC } from '../ethCall';

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
  return Number(fetchJSONRPC(url, options));
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

// Define the function to perform the eth_call
export const getPublicKeyFromCoprocessor = async (url: string) => {
  // Create the JSON-RPC request payload
  const payload = {
    jsonrpc: '2.0',
    method: 'eth_getPublicFhevmKey',
    params: [],
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
