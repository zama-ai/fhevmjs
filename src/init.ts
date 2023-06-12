import initSDK from 'tfhe';

let initialized = false;

export const initZamaWeb3 = async () => {
  if (!initialized) {
    await initSDK();
    initialized = true;
  }
  return true;
};
