# Booleans and control structures

## Booleans 
The result of [comparison operations](functions.md#comparison-operation-eq-ne-ge-gt-le-lt) is of type `ebool`. Typical boolean operations are not currently supported for this type.

The purpose of the `ebool` type is three-fold:

1. control bit for the `cmux` operator;
2. input for encrypted require (`req`) statements;
3. input for optimistic encrypted require (`optReq`) statements.

## Encrypted require statements
Encrypted require statements (`req`) are analogous the usual Solidity `require` statements: given an encrypted boolean predicate `b`, the statement will force the transaction execution to halt if `b` evaluates to false. 
Evaluating the encrypted boolean predicate implies a (threshold) decryption.

### Examples
```solidity
// A transcation calling this function will revert.
function failingRequire(euint8 a) public {
    euint8 val = TFHE.asEuint8(4);
    TFHE.req(TFHE.eq(val, TFHE.not(val)));
} 
```

## Optimistic encrypted require statements
The require statements described above may lead to important delays during the transaction execution as several of them may need to be processed in a single transaction.
This is why we introduce optimistic encrypted statements (`optReq`). 
These require statements are accumulated throughout the execution of the transaction and are only decrypted at the end of execution. 
Optimistic requires may be more efficient, but this efficiency comes at the price of paying more gas if it so happens that one of the predicates is false. 