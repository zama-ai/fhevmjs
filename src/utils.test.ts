import { bigIntToBytes, bytesToBigInt } from './utils';

describe('decrypt', () => {
  it('converts a number to bytes', async () => {
    const value = BigInt(28482);
    const bytes = bigIntToBytes(value);
    expect(bytes).toEqual(new Uint8Array([111, 66]));

    const value2 = BigInt(255);
    const bytes2 = bigIntToBytes(value2);
    expect(bytes2).toEqual(new Uint8Array([255]));
  });

  it('converts bytes to number', async () => {
    const value = new Uint8Array([23, 200, 15]);
    const bigint1 = bytesToBigInt(value);
    expect(bigint1.toString()).toBe('1558543');

    const value2 = new Uint8Array([37, 6, 210, 166, 239]);
    const bigint2 = bytesToBigInt(value2);
    expect(bigint2.toString()).toBe('159028258543');

    const value0 = new Uint8Array();
    const bigint0 = bytesToBigInt(value0);
    expect(bigint0.toString()).toBe('0');
  });
});
