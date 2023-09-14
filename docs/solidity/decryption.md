# Decryption and control structures

## Decryptions

We allow explicit decryption requests for any encrypted type.
The values are decrypted through the distributed decryption protocol and are stored on-chain.

### Example

```solidity
function decryptAmount(euint8 amount) public view returns (uint8) {
    return TFHE.decrypt(amount);
}
```

## Booleans

The result of [comparison operations](functions.md#comparison-operation-eq-ne-ge-gt-le-lt) is of type `ebool`. Typical boolean operations are not currently supported for this type.

The purpose of the `ebool` type is two-fold:

1. control bit for the [`cmux`](functions.md#multiplexer-operator-cmux) operator;
2. input for optimistic encrypted require (`optReq`) statements.

## Optimistic encrypted require statements

The decryption statements described above may lead to important delays during the transaction execution as several of them may need to be processed in a single transaction.
Given that those decryptions might be used for control flow by using the Solidity `require` function, we introduce optimistic require statements (`optReq`).
These require statements take as input a value to type `ebool` and are accumulated throughout the execution of the transaction and are only decrypted at the end of execution.
Optimistic requires may be more efficient, but this efficiency comes at the price of paying more gas if it so happens that one of the predicates is false.


