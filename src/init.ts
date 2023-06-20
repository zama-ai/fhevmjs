import initSDK, { InitOutput } from 'tfhe';

let initialized: InitOutput;

type InitFhevm = typeof initSDK;

export const initFhevm: InitFhevm = async (params) => {
  if (!initialized) {
    initialized = await initSDK(params);
  }
  return initialized;
};
