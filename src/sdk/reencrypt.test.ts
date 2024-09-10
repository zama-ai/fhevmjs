import { reencryptRequest } from './reencrypt';
import fetchMock from '@fetch-mock/core';

fetchMock.mockGlobal();

fetchMock.get('https://test-gateway.net/reencrypt', {
  body: {},
});

const userKeypair = {
  publicKey:
    '0x2000000000000000f3efe739bc5c1f3ecc75ef238bb281358b6ad60a77a68b67888d8802c53e1c59',
  privateKey:
    '0x20000000000000001c0922c8007e42e2c5f1e6d3221c03703c868cf17636724fe43fb49383a4dfe4',
};

describe('reencrypt', () => {
  it('get reencryption for handle', async () => {
    const reencrypt = reencryptRequest('https://test-gateway.net');
    const result = await reencrypt(
      BigInt(3333),
      userKeypair.privateKey,
      userKeypair.publicKey,
      '0xccc',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );
    expect(result.toString()).toBe('10');
  });

  it('throw if no reencryption URL is provided', async () => {
    const reencrypt = reencryptRequest();
    const result = reencrypt(
      BigInt(3333),
      userKeypair.privateKey,
      userKeypair.publicKey,
      '0xccc',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );

    expect(result).rejects.toThrow('You must provide a reencryption URL.');
  });
});
