import { toBigIntLE, toBufferLE } from 'bigint-buffer';
import {
  FheBool,
  FheUint4,
  FheUint8,
  FheUint16,
  FheUint32,
  FheUint64,
  FheUint160,
  TfheClientKey,
} from 'node-tfhe';

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const bigIntToBytes = (value: bigint) => {
  const byteArrayLength = Math.ceil(value.toString(2).length / 8);
  return new Uint8Array(toBufferLE(value, byteArrayLength));
};

export const bytesToHex = function (byteArray: Uint8Array): string {
  if (!byteArray || byteArray?.length === 0) {
    return '0x0';
  }
  const buffer = Buffer.from(byteArray);
  return `0x${buffer.toString('hex')}`;
};

export const bytesToBigInt = function (byteArray: Uint8Array): bigint {
  if (!byteArray || byteArray?.length === 0) {
    return BigInt(0);
  }

  const buffer = Buffer.from(byteArray);
  const result = toBigIntLE(buffer);
  return result;
};

export const clientKeyDecryptor = (clientKeySer: Uint8Array) => {
  const clientKey = TfheClientKey.deserialize(clientKeySer);
  return {
    decryptBool: (ciphertext: string) =>
      FheBool.deserialize(fromHexString(ciphertext)).decrypt(clientKey),
    decrypt4: (ciphertext: string) =>
      FheUint4.deserialize(fromHexString(ciphertext)).decrypt(clientKey),
    decrypt8: (ciphertext: string) =>
      FheUint8.deserialize(fromHexString(ciphertext)).decrypt(clientKey),
    decrypt16: (ciphertext: string) =>
      FheUint16.deserialize(fromHexString(ciphertext)).decrypt(clientKey),
    decrypt32: (ciphertext: string) =>
      FheUint32.deserialize(fromHexString(ciphertext)).decrypt(clientKey),
    decrypt64: (ciphertext: string) =>
      FheUint64.deserialize(fromHexString(ciphertext)).decrypt(clientKey),
    decryptAddress: (ciphertext: string) => {
      let hex = FheUint160.deserialize(fromHexString(ciphertext))
        .decrypt(clientKey)
        .toString(16);
      while (hex.length < 40) {
        hex = '0' + hex;
      }
      return '0x' + hex;
    },
  };
};

export const getCiphertextCallParams = (handle: bigint) => {
  let hex = handle.toString(16);
  hex = hex.padStart(64, '0');
  return {
    to: '0x000000000000000000000000000000000000005d',
    data: '0xff627e77' + hex,
  };
};
