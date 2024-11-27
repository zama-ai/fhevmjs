import initTFHE, {
  init_panic_hook,
  initThreadPool,
  InitInput as TFHEInput,
} from 'tfhe';

import initKMS, { InitInput as KMSInput } from 'tkms';
import wasmKMS from 'tkms/kms_lib_bg.wasm';

let initialized = false;

export const initFhevm = async ({
  tfheParams,
  kmsParams,
  thread,
}: {
  tfheParams?: TFHEInput;
  kmsParams?: KMSInput;
  thread?: number;
} = {}) => {
  if (!initialized) {
    await initTFHE();
    await initKMS({
      module_or_path:
        kmsParams ||
        (wasmKMS as unknown as () => Promise<WebAssembly.Instance>)(),
    });
    if (thread) {
      console.log('init thread');
      init_panic_hook();
      await initThreadPool(thread);
      console.log('done thread');
    }
    initialized = true;
  }
  console.log('return thread');
  return true;
};
