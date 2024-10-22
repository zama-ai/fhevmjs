import { GatewayKeys, getKeysFromGateway } from './network';
import { publicKey, publicParams } from '../test';
import { bytesToHex } from '../utils';
import fetchMock from '@fetch-mock/core';

const payload: GatewayKeys = {
  response: {
    crs: {
      '2048': {
        data_id: 'd8d94eb3a23d22d3eb6b5e7b694e8afcd571d906',
        param_choice: 1,
        signatures: ['0d13...', '4250...', 'a42c...', 'fhb5...'],
        urls: [
          'https://s3.amazonaws.com/bucket-name-1/PUB-p1/CRS/d8d94eb3a23d22d3eb6b5e7b694e8afcd571d906',
          'https://s3.amazonaws.com/bucket-name-4/PUB-p4/CRS/d8d94eb3a23d22d3eb6b5e7b694e8afcd571d906',
          'https://s3.amazonaws.com/bucket-name-2/PUB-p2/CRS/d8d94eb3a23d22d3eb6b5e7b694e8afcd571d906',
          'https://s3.amazonaws.com/bucket-name-3/PUB-p3/CRS/d8d94eb3a23d22d3eb6b5e7b694e8afcd571d906',
        ],
      },
    },
    fhe_key_info: [
      {
        fhe_public_key: {
          data_id: '408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
          param_choice: 1,
          signatures: ['cdff...', '123c...', '00ff...', 'a367...'],
          urls: [
            'https://s3.amazonaws.com/bucket-name-1/PUB-p1/PublicKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
            'https://s3.amazonaws.com/bucket-name-4/PUB-p4/PublicKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
            'https://s3.amazonaws.com/bucket-name-2/PUB-p2/PublicKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
            'https://s3.amazonaws.com/bucket-name-3/PUB-p3/PublicKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
          ],
        },
        fhe_server_key: {
          data_id: '408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
          param_choice: 1,
          signatures: ['839b...', 'baef...', '55cc...', '81a4...'],
          urls: [
            'https://s3.amazonaws.com/bucket-name-1/PUB-p1/ServerKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
            'https://s3.amazonaws.com/bucket-name-4/PUB-p4/ServerKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
            'https://s3.amazonaws.com/bucket-name-2/PUB-p2/ServerKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
            'https://s3.amazonaws.com/bucket-name-3/PUB-p3/ServerKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
          ],
        },
      },
    ],
    verf_public_key: [
      {
        key_id: '408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        server_id: 1,
        verf_public_key_address:
          'https://s3.amazonaws.com/bucket-name-1/PUB-p1/VerfAddress/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        verf_public_key_url:
          'https://s3.amazonaws.com/bucket-name-1/PUB-p1/VerfKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
      },
      {
        key_id: '408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        server_id: 4,
        verf_public_key_address:
          'https://s3.amazonaws.com/bucket-name-4/PUB-p4/VerfAddress/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        verf_public_key_url:
          'https://s3.amazonaws.com/bucket-name-4//PUB-p4/VerfKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
      },
      {
        key_id: '408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        server_id: 2,
        verf_public_key_address:
          'https://s3.amazonaws.com/bucket-name-2/PUB-p2/VerfAddress/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        verf_public_key_url:
          'https://s3.amazonaws.com/bucket-name-2/PUB-p2/VerfKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
      },
      {
        key_id: '408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        server_id: 3,
        verf_public_key_address:
          'https://s3.amazonaws.com/bucket-name-3/PUB-p3/VerfAddress/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
        verf_public_key_url:
          'https://s3.amazonaws.com/bucket-name-3/PUB-p3/VerfKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
      },
    ],
  },
  status: 'success',
};

fetchMock.get('https://test-gateway.net/keyurl', payload);

fetchMock.get(
  'https://s3.amazonaws.com/bucket-name-1/PUB-p1/PublicKey/408d8cbaa51dece7f782fe04ba0b1c1d017b1088',
  bytesToHex(publicKey.serialize()),
);
fetchMock.get(
  'https://s3.amazonaws.com/bucket-name-1/PUB-p1/CRS/d8d94eb3a23d22d3eb6b5e7b694e8afcd571d906',
  bytesToHex(publicParams[2048].serialize(false)),
);

describe('network', () => {
  // TODO: fix this test by returning valid safe serialized keys
  it.skip('getInputsFromGateway', async () => {
    const material = await getKeysFromGateway('https://test-gateway.net/');

    expect(material.publicKey.serialize()).toStrictEqual(publicKey.serialize());
  });
});
