import { reencryptRequest } from './reencrypt';
import fetchMock from 'fetch-mock';

global.fetch = require('fetch-mock-jest').sandbox();

describe('reencrypt', () => {
  it('get reencryption for handle', async () => {
    // const reencrypt = reencryptRequest('http://mock');
    // fetchMock.mock('http://mock/reencrypt', {
    //   status: 200,
    //   body: {
    //     response: {
    //       mock: 's',
    //     },
    //   },
    // });
    // const result = await reencrypt(
    //   BigInt(3333),
    //   '0xccc',
    //   '0xcccc',
    //   '0xccc',
    //   '0x8ba1f109551bd432803012645ac136ddd64dba72',
    //   '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    // );
    // expect(result.toString()).toBe('10');
  });

  it('throw if no reencryption URL is provided', async () => {
    const reencrypt = reencryptRequest();
    const result = reencrypt(
      BigInt(3333),
      '0xccc',
      '0xcccc',
      '0xccc',
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
      '0xa5e1defb98EFe38EBb2D958CEe052410247F4c80',
    );

    expect(result).rejects.toThrow('You must provide a reencryption URL.');
  });
});
