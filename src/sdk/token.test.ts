import { toHexString } from '../utils';
import { generateToken } from './token';

describe('token', () => {
  it('creates a valid EIP712 object', async () => {
    const { token, keypair } = await generateToken({
      verifyingContract: '0xccc',
      chainId: 1234,
      name: 'hello',
      version: '3',
    });
    expect(token.domain.chainId).toBe(1234);
    expect(token.domain.name).toBe('hello');
    expect(token.domain.version).toBe('3');
    expect(token.message.publicKey).toBe(`0x${toHexString(keypair.publicKey)}`);

    expect(token.primaryType).toBe('Reencrypt');
    expect(token.types.Reencrypt.length).toBe(1);
    expect(token.types.Reencrypt[0].name).toBe('publicKey');
    expect(token.types.Reencrypt[0].type).toBe('bytes32');
  });

  it('creates a valid EIP712 object with default values', async () => {
    const { token, keypair } = await generateToken({
      verifyingContract: '0xccc',
    });
    expect(token.domain.chainId).toBe(9000);
    expect(token.domain.name).toBe('Authorization token');
    expect(token.domain.version).toBe('1');
    expect(token.message.publicKey).toBe(`0x${toHexString(keypair.publicKey)}`);

    expect(token.primaryType).toBe('Reencrypt');
    expect(token.types.Reencrypt.length).toBe(1);
    expect(token.types.Reencrypt[0].name).toBe('publicKey');
    expect(token.types.Reencrypt[0].type).toBe('bytes32');
  });
});
