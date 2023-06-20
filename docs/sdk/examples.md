# Examples

## Transfer ERC-20 tokens

```javascript
import ethers from 'ethers';
import { initFhevm, createInstance, decrypt } from 'fhevmjs';
import { getPublicKey } from './publicKey';
import abi from './abi.json';

const CONTRACT_ADDRESS = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';
const provider = new ethers.providers.Web3Provider(window.ethereum);

const getInstance = async () => {
  await initFhevm();
  // Get blockchain public key
  const publicKey = await getPublicKey();
  const chainId = 9000;

  // Create instance with the library
  return createInstance({ chainId, publicKey });
};

const transfer = async (to, amount) => {
  // Initialize contract with ethers
  new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());

  // Get instance to encrypt amount parameter
  const instance = await getInstance();
  const encryptedAmount = instance.encrypt32(amount);

  const transaction = contract.transfer(address, encryptedAmount);
  return transaction.hash;
};
```

## Get balance

```javascript
import ethers from 'ethers';
import { initFhevm, createInstance } from 'fhevmjs';
import { getPublicKey } from './publicKey';
import abi from './abi.json';

const CONTRACT_ADDRESS = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';
const provider = new ethers.providers.Web3Provider(window.ethereum);

const getInstance = () => {
  await initFhevm();
  // Get blockchain public key
  const publicKey = await getPublicKey();
  const chainId = 9000;

  // Create instance with the library
  return createInstance({ chainId, publicKey });
}

const getBalance = async (to, amount) => {
  const userAddress = await provider.getSigner().getAddress();
  // Initialize contract with ethers
  new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());

  // Get instance to encrypt amount parameter
  const instance = getInstance();

  // Generate EIP-712 token
  const token = await instance.generateToken({
    name: 'Authentication',
    verifyingContract: CONTRACT_ADDRESS,
  });

  // Ask the user to sign the token
  const params = [userAddress, JSON.stringify(token.eip712)];
  const signature = await window.ethereum.request({ method: 'eth_signTypedData_v4', params });

  // Get balance, passing publicKey and signature
  const response = await contract.balanceOf(token.keypair.publicKey, signature);

  if (response) {
    decrypt
    setPrivateKey(token.keypair.privateKey);
  }

  return transaction.hash;
};
```
