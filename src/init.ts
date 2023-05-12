import initSDK from 'tfhe';
import wasm from 'tfhe/tfhe_bg.wasm';

let initialized = false;

export const withInitialization =
  <T extends Array<any>, U>(fn: (...args: T) => U) =>
  async (...args: T): Promise<U> => {
    if (!initialized) {
      await initSDK(wasm);
      initialized = true;
    }
    return fn(...args);
  };
