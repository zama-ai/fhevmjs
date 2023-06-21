# Parameters

The library provides a set of functions to encrypt integers of various sizes (8, 16, and 32 bits) using the blockchain's public key. These encrypted integers can then be securely used as parameters for smart contract methods within the blockchain ecosystem.

## FhevmInstance.encrypt8

### Parameters

- `value` (required): A number between 0 and 255.

### Returns

- `Uint8Array`

### Example

```javascript
const instance = await createInstance({ chainId: 9000, publicKey });
const encryptedParam = instance.encrypt8(14);
```

## FhevmInstance.encrypt16

### Parameters

- `value` (required): A number between 0 and 65535.

### Returns

- `Uint8Array`

### Example

```javascript
const instance = await createInstance({ chainId: 9000, publicKey });
const encryptedParam = instance.encrypt16(1234);
```

## FhevmInstance.encrypt32

### Parameters

- `value` (required): A number between 0 and 4294967295.

### Returns

- `Uint8Array`

### Example

```javascript
const instance = await createInstance({ chainId: 9000, publicKey });
const encryptedParam = instance.encrypt32(94839304);
```

## Reencryption

The library provides a convenient function that generates a JSON object based on the EIP-712 standard. This JSON object includes a public key and is specifically designed to facilitate data reencryption in a smart contract environment.

By utilizing this JSON object and having it signed by the user, a secure process of reencrypting data becomes possible within a smart contract. The signed JSON includes the necessary information, including the public key, which allows for seamless reencryption of the data.

## FhevmInstance.generateToken

### Parameters

- `options` (required):
  - `verifyingContract` (required): The address of the contract
  - `name` (optional): The name used in the EIP712
  - `version` (optional): The version used in the EIP712

### Returns

- `EIP712`

### Example

```javascript
const instance = await createInstance({ chainId: 9000, publicKey });
const encryptedParam = instance.generateToken({
  name: 'Authentication',
  verifyingContract: '0x1c786b8ca49D932AFaDCEc00827352B503edf16c',
});
```

## FhevmInstance.decrypt

### Parameters

- `contractAddress` (required): address of the contract
- `ciphertext` (required): ciphertext to decrypt

### Returns

- `string`

### Example

```javascript
const instance = await createInstance({ chainId: 9000, publicKey });
const token = await instance.generateToken({
  name: 'Authentication',
  verifyingContract: '0x1c786b8ca49D932AFaDCEc00827352B503edf16c',
});
...
const response = await contract.balanceOf(token.publicKey, sign);
instance.decrypt('0x1c786b8ca49D932AFaDCEc00827352B503edf16c', response)

```

## FhevmInstance.getContractKeypairs

### Parameters

### Returns

- `ExportedContractKeypairs`:

```javascript
{
  '0x1c786b8ca49D932AFaDCEc00827352B503edf16c': {
    keyType: 'x25519',
    publicKey: '7b2352b10cb4e379fc89094c445acb8b2161ec23a3694c309e01e797ab2bae22',
    privateKey: '764d194c6c686164fa5eb3c53ef3f7f5b90985723f19e865baf0961dd28991eb',
  }
}
```

### Example

```javascript
const instance = await createInstance({ chainId: 9000, publicKey });
const token = await instance.generateToken({
  name: 'Authentication',
  verifyingContract: '0x1c786b8ca49D932AFaDCEc00827352B503edf16c',
});
const keypairs = instance.getContractKeypairs();
console.log(getContractKeypairs);
// {
//    '0x1c786b8ca49D932AFaDCEc00827352B503edf16c': {
//      keyType: 'x25519',
//      publicKey: '7b2352b10cb4e379fc89094c445acb8b2161ec23a3694c309e01e797ab2bae22',
//      privateKey: '764d194c6c686164fa5eb3c53ef3f7f5b90985723f19e865baf0961dd28991eb',
//    }
// }
...
const response = await contract.balanceOf(token.publicKey, sign);
instance.decrypt('0x1c786b8ca49D932AFaDCEc00827352B503edf16c', response)

```
