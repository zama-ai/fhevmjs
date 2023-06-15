import initSDK, { InitOutput } from 'tfhe';

let initialized: InitOutput;

type InitZamaWeb3 = typeof initSDK;

export const initZamaWeb3: InitZamaWeb3 = async (params) => {
  if (!initialized) {
    initialized = await initSDK(params);
  }
  return initialized;
};
