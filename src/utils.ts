import sha3 from 'sha3';

export const fromHexString = (hexString: string): Uint8Array => {
  const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
  if (!arr) return new Uint8Array();
  return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};

export const toHexString = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const numberToBytes = (uint32Value: number) => {
  const byteArrayLength = Math.ceil(Math.log2(uint32Value + 1) / 8);
  const byteArray = new Uint8Array(byteArrayLength);

  for (let i = byteArrayLength - 1; i >= 0; i--) {
    byteArray[i] = uint32Value & 0xff;
    uint32Value >>= 8;
  }

  return byteArray;
};

export const bytesToNumber = (byteArray: Uint8Array): number => {
  let uint32Value = 0;

  for (let i = 0; i < byteArray.length; i++) {
    uint32Value |= byteArray[i] << (8 * (byteArray.length - 1 - i));
  }

  return uint32Value;
};

export const isAddress = function (address: string) {
  if (/^(0x)?[0-9a-f]{40}$/i.test(address.toLowerCase())) {
    // check if it has the basic requirements of an address
    return true;
  }
  return false;
};
