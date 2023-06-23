import sha3 from 'sha3';

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const numberToBytes = (number: number) => {
  // you can use constant number of bytes by using 8 or 4
  const len = Math.ceil(Math.log2(number) / 8);
  const byteArray = new Uint8Array(len);

  for (let index = 0; index < byteArray.length; index++) {
    const byte = number & 0xff;
    byteArray[index] = byte;
    number = (number - byte) / 256;
  }

  return byteArray;
};

export const bytesToNumber = (byteArray: Uint8Array) => {
  let result = 0;
  for (let i = byteArray.length - 1; i >= 0; i--) {
    result = result * 256 + byteArray[i];
  }

  return result;
};

export const isAddress = function (address: string) {
  if (/^(0x)?[0-9a-f]{40}$/i.test(address.toLowerCase())) {
    // check if it has the basic requirements of an address
    return true;
  }
  return false;
};
