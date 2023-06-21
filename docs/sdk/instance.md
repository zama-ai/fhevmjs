# Instance

## createInstance

### Parameters

- `params` (required):

  - `chainId` (required): Id of the chain
  - `publicKey` (required): Public key of the blockchain
  - `keypairs` (optional): A list of keypairs associated with contract

### Returns

- `FhevmInstance`

### Example

```javascript
const keypairs = {
  '0x1c786b8ca49D932AFaDCEc00827352B503edf16c': {
    keyType: 'x25519',
    publicKey: '7b2352b10cb4e379fc89094c445acb8b2161ec23a3694c309e01e797ab2bae22',
    privateKey: '764d194c6c686164fa5eb3c53ef3f7f5b90985723f19e865baf0961dd28991eb',
  },
};
const instance = await createInstance({ chainId: 9000, publicKey, keypairs });
console.log(instance.chainId); // 9000
```
