import { encryptInteger, createTFHEKey } from './encrypt';
import { generateToken } from './token';

export const createInstance = (port: number) => {
  return {
    encryptInteger,
    generateToken,
    createTFHEKey,
  };
};
