# Examples

## Transfer ERC-20 tokens

```javascript
import ethers from 'ethers';
import { initZamaWeb3, createInstance } from 'zama-web3';
import { getPublicKey } from './publicKey';
import abi from './abi.json';

const CONTRACT_ADDRESS = '0x1c786b8ca49D932AFaDCEc00827352B503edf16c';
const provider = new ethers.providers.Web3Provider(window.ethereum);

const getInstance = () => {
  await initZamaWeb3();
  // Get blockchain public key
  const publicKey = await getPublicKey();
  const chainId = 9000;

  // Create instance with the library
  return createInstance({ chainId, publicKey });
}

const transfer = async (to, amount) => {
  // Initialize contract with ethers
  new ethers.Contract(CONTRACT_ADDRESS, abi, provider.getSigner());

  // Get instance to encrypt amount parameter
  const instance = getInstance();
  const encryptedAmount = instance.encrypt32(amount);

  const transaction = contract.transfer(address, encryptedAmount);
  return transaction.hash;
};
```
