import { EIP712, generateToken } from './output';

describe('Output', () => {
  it('creates a valid EIP712 object', async () => {
    const response = await generateToken({
      verifyingContract: '0xccc',
      chainId: 1234,
      name: 'hello',
      version: '3',
    });
    const jsonToken: EIP712 = response.eip712;
    expect(jsonToken.domain.chainId).toBe(1234);
    expect(jsonToken.domain.name).toBe('hello');
    expect(jsonToken.domain.version).toBe('3');
    expect(jsonToken.message.publicKey).toBe(response.keypair.publicKey);

    expect(jsonToken.primaryType).toBe('Reencrypt');
    expect(jsonToken.types.Reencrypt.length).toBe(1);
    expect(jsonToken.types.Reencrypt[0].name).toBe('publicKey');
    expect(jsonToken.types.Reencrypt[0].type).toBe('bytes32');
  });

  it('creates a valid EIP712 object with default values', async () => {
    const response = await generateToken({
      verifyingContract: '0xccc',
    });
    const jsonToken: EIP712 = response.eip712;
    expect(jsonToken.domain.chainId).toBe(9000);
    expect(jsonToken.domain.name).toBe('Authorization token');
    expect(jsonToken.domain.version).toBe('1');
    expect(jsonToken.message.publicKey).toBe(response.keypair.publicKey);

    expect(jsonToken.primaryType).toBe('Reencrypt');
    expect(jsonToken.types.Reencrypt.length).toBe(1);
    expect(jsonToken.types.Reencrypt[0].name).toBe('publicKey');
    expect(jsonToken.types.Reencrypt[0].type).toBe('bytes32');
  });
});
