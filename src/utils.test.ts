import { numberToBytes, bytesToBigInt } from './utils';

describe('decrypt', () => {
  it('converts a number to bytes', async () => {
    const value = 28482;
    const bytes = numberToBytes(value);
    expect(bytes).toEqual(new Uint8Array([111, 66]));

    const value2 = 255;
    const bytes2 = numberToBytes(value2);
    expect(bytes2).toEqual(new Uint8Array([255]));
  });

  it('converts bytes to number', async () => {
    const value = new Uint8Array([23, 200, 15]);
    const bytes = bytesToBigInt(value);
    expect(bytes.toString()).toBe('1558543');

    const value2 = new Uint8Array();
    const bytes2 = bytesToBigInt(value2);
    expect(bytes2.toString()).toBe('0');
  });
});
