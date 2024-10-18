import { getKeysFromGateway } from './network';
import { publicKey, publicParams } from '../test';
import { bytesToHex } from '../utils';
import fetchMock from '@fetch-mock/core';

fetchMock.get('https://test-gateway.net/keyurl', {
  publicKey: { url: 'https://dummy-pk' },
  crs: { 2048: { url: 'https://dummy-2048' } },
});

fetchMock.get('https://dummy-pk', bytesToHex(publicKey.serialize()));
fetchMock.get(
  'https://dummy-2048',
  bytesToHex(publicParams[2048].serialize(false)),
);

describe('network', () => {
  it('getInputsFromGateway', async () => {
    const material = await getKeysFromGateway('https://test-gateway.net/');

    expect(material.publicKey.serialize()).toStrictEqual(publicKey.serialize());
  });
});
