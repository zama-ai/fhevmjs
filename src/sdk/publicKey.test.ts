import sodium from 'libsodium-wrappers';
import { toHexString } from '../utils';
import { generatePublicKey } from './publicKey';

describe('token', () => {
  beforeAll(async () => {
    await sodium.ready;
  });
  it('creates a valid EIP712 object', async () => {
    const { eip712, keypair } = generatePublicKey({
      verifyingContract: '0xccc',
      chainId: 1234,
      name: 'hello',
      version: '3',
    });
    expect(eip712.domain.chainId).toBe(1234);
    expect(eip712.domain.name).toBe('hello');
    expect(eip712.domain.version).toBe('3');
    expect(eip712.message.publicKey).toBe(
      `0x${toHexString(keypair.publicKey)}`,
    );

    expect(eip712.primaryType).toBe('Reencrypt');
    expect(eip712.types.Reencrypt.length).toBe(1);
    expect(eip712.types.Reencrypt[0].name).toBe('publicKey');
    expect(eip712.types.Reencrypt[0].type).toBe('bytes32');
  });

  it('creates a valid EIP712 object with default values', async () => {
    const { eip712, keypair } = generatePublicKey({
      verifyingContract: '0xccc',
    });
    expect(eip712.domain.chainId).toBe(9000);
    expect(eip712.domain.name).toBe('Authorization token');
    expect(eip712.domain.version).toBe('1');
    expect(eip712.message.publicKey).toBe(
      `0x${toHexString(keypair.publicKey)}`,
    );

    expect(eip712.primaryType).toBe('Reencrypt');
    expect(eip712.types.Reencrypt.length).toBe(1);
    expect(eip712.types.Reencrypt[0].name).toBe('publicKey');
    expect(eip712.types.Reencrypt[0].type).toBe('bytes32');
  });
});
