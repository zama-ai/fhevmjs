import createHash = require('keccak');

import { ENCRYPTION_TYPES } from './encryptionTypes';

type EncryptionBitwidths = keyof typeof ENCRYPTION_TYPES;

const compute_handles = (
  ciphertextWithZKProof: Uint8Array,
  bitwidths: EncryptionBitwidths[],
) => {
  // Should be identical to:
  // https://github.com/zama-ai/fhevm-backend/blob/cbcd3315b52a3fa21454fad42e907c3fd27365ec/contracts/contracts/InputVerifier.coprocessor.sol#L159
  const hash = createHash('keccak256')
    .update(Buffer.from(ciphertextWithZKProof))
    .digest();
  const handles = bitwidths.map((bitwidth, encryption_index) => {
    const encryption_type = ENCRYPTION_TYPES[bitwidth];
    const dataWithIndex = new Uint8Array(hash.length + 1);
    dataWithIndex.set(hash, 0);
    dataWithIndex.set([encryption_index], hash.length);
    const finalHash = createHash('keccak256')
      .update(Buffer.from(dataWithIndex))
      .digest();
    const dataInput = new Uint8Array(32);
    dataInput.set(finalHash, 0);
    dataInput.set([encryption_index, encryption_type, 0], 29);
    return dataInput;
  });
  return handles;
};

export { compute_handles };
