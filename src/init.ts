import initSDK from 'tfhe';

let initialized = false;

export const initZamaWeb3 = async () => {
  if (!initialized) {
    await initSDK();
    initialized = true;
  }
  return true;
};

// export const withInitialization =
//   <T extends Array<any>, U>(fn: (...args: T) => U) =>
//   async (...args: T): Promise<U> => {
//     if (!initialized) {
//       await initSDK(wasm);
//       initialized = true;
//     }
//     return fn(...args);
//   };
