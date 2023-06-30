# Functions

The functions exposed by the `TFHE` Solidity library come in various shapes and sizes in order to facilitate developer experience. 
For example, most binary operators (eg., `add`) can take as input any combination of the following types: 

- `euint8`
- `euint16`
- `euint32`
- `uint8`
- `uint16`
- `uint32`

Note that ciphertext-plaintext operations may take less time to compute than ciphertext-ciphertext operations.

Some binary operations do not have the capability of mixing ciphertext and plaintext operands. 
In this case, they only accept as input any combination of the `euintX` types.

Note that in the backend, FHE operations are only defined on same-type operands.
Therefore, the `TFHE` Solidity library will do implicit upcasting if necessary.


## Arithmetic operations (`add`, `sub`, `mul`)
Performs the operation homomorphically.

Note that division is not currently supported.

### Examples 
```solidity
function add(euint8 a, euint8 b) internal view returns (euint8) // a + b
function add(euint8 a, euint16 b) internal view returns (euint16)
function add(uint32 a, euint16 b) internal view returns (euint32)
```

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
function asEuint8(bytes memory ciphertext) internal view returns (euint8) // first case
function asEuint16(euint8 ciphertext) internal view returns (euint16) // second case
function asEuint16(uint16 value) internal view returns (euint16) // third case
```

## Bitwise operations (`AND`, `OR`, `XOR`)
Unlike other binary operations, bitwise operations do not natively accept a mix of ciphertext and plaintext inputs. 
To ease developer experience, the `TFHE` library adds function overloads for these operations.
Such overloads implicitely do a trivial encryption before actually calling the operation function, as shown in the examples below.

### Examples
```solidity
function and(euint8 a, euint8 b) internal view returns (euint8) // a & b
function and(euint8 a, uint16 b) internal view returns (euint16) // implicit trivial encryption of `b` before calling the operator
```

## Bit shift operations (`<<`, `>>`)
Self explanatory

### Examples
```solidity
function shl(euint16 a, euint8 b) internal view returns (euint16)
function shr(euint32 a, euint16 b) internal view returns (euint32)
```

## Comparison operation (`eq`, `ne`, `ge`, `gt`, `le`, `lt`)
Note that in the case of ciphertext-plaintext operations, since our backend only accepts plaintext right operands, calling the operation with a plaintext left operand will actually invert the operand order and call the _opposite_ comparison.

The result of comparison operations is always an encryption of `0` (false) or `1` (true), and this no matter what the return type is.


### Examples
```solidity
function eq(euint32 a, euint16 b) internal view returns (euint32) // a == b
function gt(uint32 a, euint16 b) internal view returns (euint32) // actually returns `lt(b, a)`
function gt(euint16 a, uint32 b) internal view returns (euint32) // actually returns `gt(a, b)`
```
## `Min`, `Max`
Self explanatory

### Examples
```solidity
function min(euint32 a, euint16 b) internal view returns (euint32)
function max(uint32 a, euint8 b) internal view returns (euint32)
```
