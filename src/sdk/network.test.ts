import { getInputsFromGateway } from './network';
import { publicKey, publicParams } from '../test';
import fetchMock from '@fetch-mock/core';
import { bytesToHex } from '../utils';

fetchMock.mockGlobal();

fetchMock.get('https://test-gateway.net/inputs', {
  body: {
    publicKey: bytesToHex(publicKey.serialize()),
    publicParams: { 2048: bytesToHex(publicParams[2048].serialize(false)) },
  },
});

describe('network', () => {
  it('getInputsFromGateway', async () => {
    const material = await getInputsFromGateway('https://test-gateway.net');
    expect(material.publicKey.serialize()).toStrictEqual(publicKey.serialize());
  });
});
