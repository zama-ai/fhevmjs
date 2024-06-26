import initTFHE, { InitInput as TFHEInput } from 'tfhe';
import wasmTFHE from 'tfhe/tfhe_bg.wasm';

import initKMS, { InitInput as KMSInput } from './kms/web/kms_lib.js';
import wasmKMS from './kms/web/kms_lib_bg.wasm';

let initialized = false;

export const initFhevm = async ({
  tfheParams,
  kmsParams,
}: {
  tfheParams?: TFHEInput;
  kmsParams?: KMSInput;
} = {}) => {
  if (!initialized) {
    await initTFHE(tfheParams || wasmTFHE());
    await initKMS(
      kmsParams ||
        (wasmKMS as unknown as () => Promise<WebAssembly.Instance>)(),
    );
    initialized = true;
  }
  return true;
};
