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
  let chainId;
  try {
    chainId = await fetchJSONRPC(url, options);
  } catch (e) {
    throw new Error('Impossible to fetch chain id (wrong networkUrl?)');
  }
  return Number(chainId);
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
  let publicKey;
  try {
    publicKey = await fetchJSONRPC(url, options);
  } catch (e) {
    throw new Error('Impossible to fetch public key from network (wrong url?)');
  }

  return publicKey;
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

  let publicKey;
  try {
    publicKey = await fetchJSONRPC(url, options);
  } catch (e) {
    throw new Error(
      'Impossible to fetch public key from coprocessor (wrong url?)',
    );
  }

  return publicKey;
};
