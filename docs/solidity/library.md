# Library

The library exposes utility functions for TFHE operations. 
The goal of the library is to provide a seamless developer experience for writing smart contracts that can operate on confidential data.


## Types 
The library provides a type system that is checked both at compile time and at run time. 
The structure and operations related to these types are described in this sections.

We currently support encrypted integers of bit length up to 32 bits. 
<!-- Support for up to 256 bits is on our roadmap.  -->

Our library provides the following types :
- `euint8`
- `euint16`
- `euint32`

These encrypted integers behave as much as possible as Solidity's integer types. However, behaviour such as "revert on overflow" is not supported as this would leak some information of the encrypted integers. Therefore, arithmetic on `euint` types is [unchecked](https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic), i.e. there is wrap-around on overlow.

In the back-end, encrypted integers are TFHE ciphertexts. 
The library abstracts away the ciphertexts and presents pointers to ciphertexts, or ciphertext handles, to the smart contract developer. 
The `euint` types are _wrappers_ over these handles.

## Operations
The library exposes utility functions for operations on TFHE ciphertexts. 
The list of supported operations is presented below. 

| name                  | type   |
| --------------------- | ------ |
| Add                   | Binary |
| Sub                   | Binary |
| Mul                   | Binary |
| BitAnd                | Binary |
| BitOr                 | Binary |
| BitXor                | Binary |
| Shift Right           | Binary |
| Equal                 | Binary |
| Not equal             | Binary |
| Greater than or equal | Binary | 
| Greater than          | Binary |
| Less than or equal    | Binary |
| Less than             | Binary |
| Min                   | Binary | 
| Max                   | Binary |
| Neg                   | Unary  |
| Not                   | Unary  |

More information about the supported operations can be found at the [TFHE-rs docs](https://docs.zama.ai/tfhe-rs/high-level-api/operations#integer). 

