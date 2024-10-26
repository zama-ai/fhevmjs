// See solidity https://github.com/zama-ai/fhevm/blob/429d127709b56c5b8ec564a2f2cc329aa7f6722f/lib/TFHEExecutor.sol#L15
import { Keccak } from 'sha3';

export const HANDLE_VERSION = 0;

export const handleTypes = Object.freeze({
  ebool: 0,
  euint4: 1,
  euint8: 2,
  euint16: 3,
  euint32: 4,
  euint64: 5,
  euint128: 6,
  euint160: 7,
  euint256: 8,
  ebytes64: 9,
  ebytes128: 10,
  ebytes256: 11,
});

export type InputContext = {
  hostChainId: number;
  keysetId: string;
  ownerAddress: string;
  contractAddress: string;
};

export type HandleType = (typeof handleTypes)[keyof typeof handleTypes];

export function isHandleType(value: number): value is HandleType {
  return Object.values(handleTypes).includes(value as HandleType);
}

export function mustGetHandleType(value: number | undefined): HandleType {
  if (!value || !isHandleType(value)) {
    throw new Error(`Invalid handle type: ${value}`);
  }
  return value;
}

// A note from Solidity at https://github.com/Inco-fhevm/fhevm/blob/7952950243b144b1bbdfc30318412a2dc6b575fd/lib/TFHEExecutor.sol#L87-L89:
/// @dev handle format for user inputs is: keccak256(keccak256(CiphertextFHEList)||index_handle)[0:29] || index_handle || handle_type || handle_version
/// @dev other handles format (fhe ops results) is: keccak256(keccak256(rawCiphertextFHEList)||index_handle)[0:30] || handle_type || handle_version
/// @dev the CiphertextFHEList actually contains: 1 byte (= N) for size of handles_list, N bytes for the handles_types : 1 per handle, then the original fhe160list raw ciphertext

export function computePrehandle({
  ciphertextHash,
  indexHandle,
  handleType,
  handleVersion,
}: {
  ciphertextHash: Uint8Array;
  indexHandle: number;
  handleType: HandleType;
  handleVersion: number;
}): Buffer {
  assertUint8(indexHandle);
  assertUint8(handleType);
  assertUint8(handleVersion);
  const ciphertextIndexHash = new Keccak(256)
    .update(Buffer.from(ciphertextHash))
    .update(Buffer.from([indexHandle]))
    .digest();
  const handle = Buffer.alloc(32);
  ciphertextIndexHash.copy(handle, 0, 0, 29);
  handle.writeUInt8(indexHandle, 29);
  handle.writeUInt8(handleType, 30);
  handle.writeUInt8(handleVersion, 31);
  return handle;
}

export function computeHandle({
  prehandle,
  inputCtx,
}: {
  prehandle: Uint8Array;
  inputCtx: InputContext;
}): Buffer {
  if (prehandle.length !== 32) {
    throw new Error(`prehandle should be 32 bytes but is: ${prehandle.length}`);
  }
  return Buffer.concat([
    new Keccak(256)
      .update(Buffer.from(prehandle))
      // Note: The x/hostchain spec requires the chain ID to be prefixed with 'evm/' for EVM chains
      .update(Buffer.from('evm/'))
      .update(Buffer.from(String(inputCtx.hostChainId)))
      .update(Buffer.from(inputCtx.keysetId, 'hex'))
      .update(Buffer.from(inputCtx.ownerAddress, 'hex'))
      .update(Buffer.from(inputCtx.contractAddress, 'hex'))
      .digest()
      .subarray(0, 29),
    // Preserve the final three bytes of handle metadata
    prehandle.slice(29, 32),
  ]);
}

function assertUint8(value: number): void {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new Error(`Invalid uint8 value: ${value}`);
  }
}
