import {
  bigIntToBytes256,
  bytesToBigInt,
  bytesToHex,
  fromHexString,
  getCiphertextCallParams,
} from './utils';

describe('decrypt', () => {
  it('converts a hex to bytes', async () => {
    const value = '0xff';
    const bytes = fromHexString(value);
    expect(bytes).toEqual(new Uint8Array([255]));

    const bytes2 = fromHexString('0x');
    expect(bytes2).toEqual(new Uint8Array([]));
  });

  it('converts a bytes to hex', async () => {
    const bytes = bytesToHex(new Uint8Array([255]));
    expect(bytes).toEqual('0xff');

    const bytes2 = bytesToHex(new Uint8Array());
    expect(bytes2).toEqual('0x0');
  });

  it('converts a number to bytes', async () => {
    const value = BigInt(28482);
    const bytes = bigIntToBytes256(value);
    const arr = new Uint8Array(256);
    arr[254] = 111;
    arr[255] = 66;
    expect(bytes).toEqual(arr);

    const value2 = BigInt(255);
    const bytes2 = bigIntToBytes256(value2);
    const arr2 = new Uint8Array(256);
    arr2[255] = 255;
    expect(bytes2).toEqual(arr2);
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

  // it('decryptor bool', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheBool.encrypt_with_compact_public_key(
  //     true,
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decryptBool(toHexString(c));
  //   expect(v).toBe(true);
  // });

  // it('decryptor 4', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheUint4.encrypt_with_compact_public_key(
  //     4,
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decrypt4(toHexString(c));
  //   expect(v).toBe(4);
  // });

  // it('decryptor 8', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheUint8.encrypt_with_compact_public_key(
  //     67,
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decrypt8(toHexString(c));
  //   expect(v).toBe(67);
  // });

  // it('decryptor 16', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheUint16.encrypt_with_compact_public_key(
  //     1700,
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decrypt16(toHexString(c));
  //   expect(v).toBe(1700);
  // });

  // it('decryptor 32', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheUint32.encrypt_with_compact_public_key(
  //     77662,
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decrypt32(toHexString(c));
  //   expect(v).toBe(77662);
  // });

  // it('decryptor 64', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheUint64.encrypt_with_compact_public_key(
  //     BigInt(11200),
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decrypt64(toHexString(c));
  //   expect(v).toBe(BigInt(11200));
  // });

  // it('decryptor address', async () => {
  //   const d = clientKeyDecryptor(clientKeySer);
  //   const c = FheUint160.encrypt_with_compact_public_key(
  //     BigInt('0x8ba1f109551bd432803012645ac136ddd64dba72'),
  //     compactPublicKey,
  //   ).serialize();
  //   const v = await d.decryptAddress(toHexString(c));
  //   expect(v).toBe('0x8ba1f109551bd432803012645ac136ddd64dba72');
  // });

  it('returns ciphertext call params', async () => {
    const params = getCiphertextCallParams(BigInt(23));
    expect(params.data).toBe(
      '0xff627e770000000000000000000000000000000000000000000000000000000000000017',
    );
    expect(params.to).toBe('0x000000000000000000000000000000000000005d');
  });
});
