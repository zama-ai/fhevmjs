# Getting Started

Welcome to the documentation for fhevmjs, a JavaScript library that enables interaction with blockchain using Zama technology! This comprehensive guide provides developers with detailed information on encryption of data using the TFHE (Fully Homomorphic Encryption over the Torus) and generation of EIP-719 token for reencrypt data.

## Installation

To get started with fhevmjs, you need to install it as a dependency in your JavaScript project. You can do this using npm (Node Package Manager) or Yarn. Open your terminal and navigate to your project's directory, then run one of the following commands:

```bash
# Using npm
npm install fhevmjs

# Using Yarn
yarn add fhevmjs
```

This will download and install the fhevmjs library and its dependencies into your project.

## Usage

The package includes two different versions: node and browser.

### Node

```javascript
const fhevm = require('fhevmjs');
fhevm.createInstance({ chainId, publicKey }).then((instance) => {
  console.log(instance);
});
```

### Browser

To use the library in your project, you need to load WASM of TFHE first with `initFhevm`.

```javascript
import { initFhevm, createInstance } from 'fhevmjs';

const start = async () => {
  await initFhevm(); // load wasm needed
  const instance = await createInstance({ chainId, publicKey }).then((instance) => {
    console.log(instance);
  });
};
```

#### Loading the library

With bundler such as Webpack or Rollup, imports will be replaced with the version mentioned in the `"browser"` field of the `package.json`. If you encounter any issue, you can force import of the browser package.

```javascript
import { initFhevm, createInstance } from 'fhevmjs/web';
```

Note: You need to handle WASM in your bundler.

If you have issue with bundling the library (for example with SSR framework), you can use prebundled version available in `fhevmjs/bundle`

```javascript
const start = async () => {
  await window.fhevm.initFhevm(); // load wasm needed
  const instance = window.fhevm.createInstance({ chainId, publicKey }).then((instance) => {
    console.log(instance);
  });
};
```
