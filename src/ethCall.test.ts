import { decodeAbiBytes } from './ethCall';

describe('decrypt', () => {
  let clientKeySer: Uint8Array;

  it('converts a hex to bytes', async () => {
    const value = '0xff';
    const bytes = decodeAbiBytes(value);
    expect(bytes).toEqual(new Uint8Array([255]));

    const value2 = '0x00';
    const bytes2 = decodeAbiBytes(value2);
    expect(bytes2).toEqual(new Uint8Array([]));

    const value3 = '0xf0f0';
    const bytes3 = decodeAbiBytes(value3);
    expect(bytes3).toEqual(new Uint8Array([240, 240]));
  });
});
