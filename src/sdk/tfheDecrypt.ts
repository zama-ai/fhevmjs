import {
  TfheClientKey,
  FheBool,
  FheUint4,
  FheUint8,
  FheUint16,
  FheUint32,
  FheUint64,
  FheUint160,
} from 'node-tfhe';
import { fromHexString } from '../utils';

export const decryptBool = (
  ciphertext: string,
  clientKey: TfheClientKey,
): boolean => {
  const c = FheBool.deserialize(fromHexString(ciphertext));
  return c.decrypt(clientKey);
};

export const decrypt4 = (
  ciphertext: string,
  clientKey: TfheClientKey,
): number => {
  const c = FheUint4.deserialize(fromHexString(ciphertext));
  return c.decrypt(clientKey);
};

export const decrypt8 = (
  ciphertext: string,
  clientKey: TfheClientKey,
): number => {
  const c = FheUint8.deserialize(fromHexString(ciphertext));
  return c.decrypt(clientKey);
};

export const decrypt16 = (
  ciphertext: string,
  clientKey: TfheClientKey,
): number => {
  const c = FheUint16.deserialize(fromHexString(ciphertext));
  return c.decrypt(clientKey);
};

export const decrypt32 = (
  ciphertext: string,
  clientKey: TfheClientKey,
): number => {
  const c = FheUint32.deserialize(fromHexString(ciphertext));
  return c.decrypt(clientKey);
};

export const decrypt64 = (
  ciphertext: string,
  clientKey: TfheClientKey,
): bigint => {
  const c = FheUint64.deserialize(fromHexString(ciphertext));
  return c.decrypt(clientKey);
};

export const decryptAddress = (
  ciphertext: string,
  clientKey: TfheClientKey,
): string => {
  const c = FheUint160.deserialize(fromHexString(ciphertext));
  let hex = c.decrypt(clientKey).toString(16);
  while (hex.length < 40) {
    hex = '0' + hex;
  }
  return '0x' + hex;
};
