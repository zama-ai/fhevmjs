# Functions

The functions exposed by the `TFHE` Solidity library come in various shapes and sizes in order to facilitate developer experience. 
For example, most binary operators (e.g., `add`) can take as input any combination of the following types: 

- `euint8`
- `euint16`
- `euint32`

Note that in the backend, FHE operations are only defined on same-type operands.
Therefore, the `TFHE` Solidity library will do implicit upcasting if necessary.

Most binary operators are also defined with a mix of ciphertext and plaintext inputs. 
In this case, operators can take as input operands of the following types 

- `euint8`
- `euint16`
- `euint32`
- `uint8`
- `uint16`
- `uint32`

under the condition that the size of the `uint` operand is at most the size of the `euint` operand. 
For example, `add(uint8 a, euint8 b)` is defined but `add(uint16 a, euint16 b)` is not.
Note that these ciphertext-plaintext operations may take less time to compute than ciphertext-ciphertext operations.

Note that in the backend, FHE operations are only defined on same-type operands.
Therefore, the `TFHE` Solidity library will do implicit upcasting if necessary.

## `asEuint`
The `asEuint` serves three purposes:

1. verify ciphertext bytes and return a valid handle to the calling smart contract; 
2. cast a `euintX` typed ciphertext to a `euintY` typed ciphertext, where `X != Y`;
3. trivially encrypt a plaintext value. 

The first case is used to process encrypted inputs, e.g. user-provided ciphertexts. Those generally comes from a wallet. 

The second case is self-explanatory. When `X > Y`, the most significant bits are dropped. When `X < Y`, the ciphertext is padded to the left with trivial encryptions of `0`.

The third case is used to "encrypt" a public value so that it can be used as a ciphertext. 
Note that what we call a trivial encryption is **not** secure in any sense. 
When trivially encrypting a plaintext value, this value is still visible in the ciphertext bytes. 
More information about trivial encryption can be found [here](https://www.zama.ai/post/tfhe-deep-dive-part-1).

### Examples
```solidity
// first case
function asEuint8(bytes memory ciphertext) internal view returns (euint8) 
// second case
function asEuint16(euint8 ciphertext) internal view returns (euint16) 
// third case
function asEuint16(uint16 value) internal view returns (euint16) 
```

## Reencrypt
The reencrypt functions takes as inputs a ciphertext and a public encryption key (namely, a [NaCl box](https://nacl.cr.yp.to/index.html)). 

During reencryption, the ciphertext is decrypted using the network private key (threshold decryption protocol in the works). 
Then, the decrypted result is encrypted under the user-provided public encryption key.
The result of this encryption is sent back to the caller as `bytes memory`.

It is also possible to provide a default value to the `reencrypt` function. 
In this case, if the provided ciphertext is not initialized (i.e., if the ciphertext handle is `0`), the function will return an encryption of the provided default value.

### Examples
```solidity
// returns the decryption of `ciphertext`, encrypted under `publicKey`.
function reencrypt(euint32 ciphertext, bytes32 publicKey) internal view returns (bytes memory reencrypted) 

// if the handle of `ciphertext` is equal to `0`, returns `defaultValue` encrypted under `publicKey`.
// otherwise, returns as above
function reencrypt(euint32 ciphertext, bytes32 publicKey, uint32 defaultValue) internal view returns (bytes memory reencrypted) 
```

> **_NOTE:_**  If one of the following operations is called with an uninitialized ciphertext handle as an operand, this handle will be made to point to a trivial encryption of `0` before the operation is executed. 

## Arithmetic operations (`add`, `sub`, `mul`)
Performs the operation homomorphically.

Note that division is not currently supported.

### Examples 
```solidity
// a + b
function add(euint8 a, euint8 b) internal view returns (euint8) 
function add(euint8 a, euint16 b) internal view returns (euint16)
function add(uint32 a, euint32 b) internal view returns (euint32)
```

## Bitwise operations (`AND`, `OR`, `XOR`)
Unlike other binary operations, bitwise operations do not natively accept a mix of ciphertext and plaintext inputs. 
To ease developer experience, the `TFHE` library adds function overloads for these operations.
Such overloads implicitely do a trivial encryption before actually calling the operation function, as shown in the examples below.

### Examples
```solidity
// a & b
function and(euint8 a, euint8 b) internal view returns (euint8) 

// implicit trivial encryption of `b` before calling the operator
function and(euint8 a, uint16 b) internal view returns (euint16) 
```

## Bit shift operations (`<<`, `>>`)
Shifts the bits of the base two representation of `a` by `b` positions.

### Examples
```solidity
// a << b
function shl(euint16 a, euint8 b) internal view returns (euint16)
// a >> b
function shr(euint32 a, euint16 b) internal view returns (euint32)
```

## Comparison operation (`eq`, `ne`, `ge`, `gt`, `le`, `lt`)
Note that in the case of ciphertext-plaintext operations, since our backend only accepts plaintext right operands, calling the operation with a plaintext left operand will actually invert the operand order and call the _opposite_ comparison.

The result of comparison operations is always an encryption of `0` (false) or `1` (true), and this no matter what the return type is.


### Examples
```solidity
// a == b
function eq(euint32 a, euint16 b) internal view returns (euint32) 

// actually returns `lt(b, a)`
function gt(uint32 a, euint16 b) internal view returns (euint32) 

// actually returns `gt(a, b)`
function gt(euint16 a, uint32 b) internal view returns (euint32) 
```
## `Min`, `Max`
Minimum (resp. maximum) of the two given values.

### Examples
```solidity
// min(a, b)
function min(euint32 a, euint16 b) internal view returns (euint32) 

// max(a, b)
function max(uint32 a, euint8 b) internal view returns (euint32) 
```

> **_NOTE:_**  More information about the behavior of these operators can be found at the [TFHE-rs docs](https://docs.zama.ai/tfhe-rs/high-level-api/operations#integer). 