import createHash from 'keccak';

import { ENCRYPTION_TYPES } from './encryptionTypes';
import { bigIntToBytes256 } from '../utils';

type EncryptionBitwidths = keyof typeof ENCRYPTION_TYPES;

const compute_handles = (
  ciphertextWithZKProof: Uint8Array,
  bitwidths: EncryptionBitwidths[],
  aclContractAddress: string,
  chainId: number,
  ciphertextVersion: number,
) => {
  // Should be identical to:
  // https://github.com/zama-ai/fhevm-backend/blob/bae00d1b0feafb63286e94acdc58dc88d9c481bf/fhevm-engine/zkproof-worker/src/verifier.rs#L301
  const blob_hash = createHash('keccak256')
    .update(Buffer.from(ciphertextWithZKProof))
    .digest();
  const handles = bitwidths.map((bitwidth, encryption_index) => {
    const encryption_type = ENCRYPTION_TYPES[bitwidth];
    const handleHash = createHash('keccak256')
      .update(blob_hash)
      .update(Buffer.from([encryption_index]))
      .update(aclContractAddress)
      .update(Buffer.from(bigIntToBytes256(BigInt(chainId))))
      .digest();
    const dataInput = new Uint8Array(32);
    dataInput.set(handleHash, 0);
    dataInput.set([encryption_index, encryption_type, ciphertextVersion], 29);
    return dataInput;
  });
  return handles;
};

export { compute_handles };
