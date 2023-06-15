# Getting Started

Zama Web3 is a JavaScript library that enables interaction with blockchain using Zama technology. The library allows encryption of data using the TFHE (Fully Homomorphic Encryption over the Torus) and generation of EIP-719 token for reencrypt data.

## Installation

To get started with Zama web3, you need to install it as a dependency in your JavaScript project. You can do this using npm (Node Package Manager) or Yarn. Open your terminal and navigate to your project's directory, then run one of the following commands:

```bash
# Using npm
npm install zama-web3

# Using Yarn
yarn add zama-web3
```

This will download and install the Zama Web3 library and its dependencies into your project.

## Usage

The package includes two different versions: node and browser.

### Node

```javascript
const zamaWeb3 = require('zama-web3');
zamaWeb3.createInstance({ chainId, publicKey }).then((instance) => {
  console.log(instance);
});
```

### Browser

To use the library in your project, you need to load WASM of TFHE first with `initZamaWeb3`.

```javascript
import { initSDK, createInstance } from 'zama-web3';

const start = async () => {
  await initZamaWeb3(); // load wasm needed
  const instance = createInstance({ chainId, publicKey }).then((instance) => {
    console.log(instance);
  });
};
```

#### Loading the library

With bundler such as Webpack or Rollup, imports will be replaced with the version mentioned in the `"browser"` field of the `package.json`. If you encounter any issue, you can force import of the browser package.

```javascript
import { initSDK, createInstance } from 'zama-web3/web';
```

Note: You need to handle WASM in your bundler.

If you have issue with bundling the library (for example with SSR framework), you can use prebundled version available in `zama-web3/bundle`

```javascript
const start = async () => {
  await window.zamaWeb3.initZamaWeb3(); // load wasm needed
  const instance = window.zamaWeb3.createInstance({ chainId, publicKey }).then((instance) => {
    console.log(instance);
  });
};
```
