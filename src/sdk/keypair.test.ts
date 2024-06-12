import sodium from 'libsodium-wrappers';
import { fromHexString } from '../utils';
import { generateKeypair, createEIP712 } from './keypair';
import {
  cryptobox_pk_to_u8vec,
  cryptobox_sk_to_u8vec,
  u8vec_to_cryptobox_pk,
  u8vec_to_cryptobox_sk,
} from '../kms/node/kms_lib';

describe('token', () => {
  beforeAll(async () => {
    await sodium.ready;
  });

  it('generate a valid keypair', async () => {
    const keypair = generateKeypair();

    expect(keypair.publicKey.length).toBe(68);
    expect(keypair.privateKey.length).toBe(68);

    let pkBuf = cryptobox_pk_to_u8vec(
      u8vec_to_cryptobox_pk(fromHexString(keypair.publicKey)),
    );
    expect(34).toBe(pkBuf.length);

    let skBuf = cryptobox_sk_to_u8vec(
      u8vec_to_cryptobox_sk(fromHexString(keypair.privateKey)),
    );
    expect(34).toBe(skBuf.length);
  });

  it('create a valid EIP712', async () => {
    const keypair = generateKeypair();

    const eip712 = createEIP712(1234)(
      keypair.publicKey,
      '0x8ba1f109551bd432803012645ac136ddd64dba72',
    );

    expect(eip712.domain.chainId).toBe(1234);
    expect(eip712.domain.name).toBe('Authorization token');
    expect(eip712.domain.version).toBe('1');
    expect(eip712.message.publicKey).toBe(`0x${keypair.publicKey}`);
    expect(eip712.primaryType).toBe('Reencrypt');
    expect(eip712.types.Reencrypt.length).toBe(1);
    expect(eip712.types.Reencrypt[0].name).toBe('publicKey');
    expect(eip712.types.Reencrypt[0].type).toBe('bytes32');
  });
});