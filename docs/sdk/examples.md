# Examples

## Nodejs

### Transfer ERC-20 tokens

```javascript
import { createInstance } from 'fhevmjs';
import Web3 from 'web3';

import abi from './abi.json';

const web3 = new Web3(`https://devnet.zama.ai/`);
web3.eth.accounts.wallet.create(1);

let _instance;

const CONTRACT_ADDRESS = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';
const provider = new ethers.providers.Web3Provider(window.ethereum);

const getInstance = async () => {
  if (_instance) return _instance;
  // 1. Get chain id
  const chainId = await web3.eth.getChainId();

  // Get blockchain public key
  const publicKey = await web3.eth.call({ to: '0x0000000000000000000000000000000000000044' });

  // Create instance
  _instance = createInstance({ chainId, publicKey, keypairs });
  return _instance;
};

const transfer = async (to, amount) => {
  // Initialize contract with ethers
  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

  // Get instance to encrypt amount parameter
  const instance = await getInstance();
  const encryptedAmount = instance.encrypt32(amount);

  const transaction = await contract.methods.transfer(address, encryptedAmount);
  return transaction;
};
```

## Get balance

```javascript

import { createInstance } from 'fhevmjs';
import Web3 from 'web3';

import abi from './abi.json';

const web3 = new Web3(`https://devnet.zama.ai/`);
web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

let _instance;

const CONTRACT_ADDRESS = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';
const provider = new ethers.providers.Web3Provider(window.ethereum);

const getInstance = async () => {
  if (_instance) return _instance;
  // 1. Get chain id
  const chainId = await web3.eth.getChainId();

  // Get blockchain public key
  const publicKey = await web3.eth.call({ to: '0x0000000000000000000000000000000000000044' });

  // Create instance
  _instance = createInstance({ chainId, publicKey, keypairs });
  return _instance;
};

const balanceOf = async (to, amount) => {
  // Initialize contract with ethers
  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);

  // Get instance to encrypt amount parameter
  const instance = await getInstance();

  // Generate token to decrypt
  const generatedToken = instance.generateToken({
    name: 'Authentication',
    verifyingContract: CONTRACT_ADDRESS,
  });

  // Sign the public key
  const signature = web3.accounts.sign(JSON.stringify(generatedToken.token), PRIVATE_KEY);

  // Call the method
  const encryptedBalance = await contract.methods.balanceOf(publicKey, signature);

  // Decrypt the balance
  const balance = instance.decrypt(CONTRACT_ADDRESS, encryptedBalance);
  return balance;
  };
};
```
