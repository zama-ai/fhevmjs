import { toBigIntBE, toBufferBE } from 'bigint-buffer';

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const bigIntToBytes = (value: bigint) => {
  const byteArrayLength = Math.ceil(value.toString(2).length / 8);
  return new Uint8Array(toBufferBE(value, byteArrayLength));
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
  const result = toBigIntBE(buffer);
  return result;
};

export const isAddress = function (address: string) {
  if (address.match(/^0x[0-9a-fA-F]{40}$/)) {
    // check if it has the basic requirements of an address
    return true;
  }
  return false;
};
