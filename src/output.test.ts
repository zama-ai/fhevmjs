import { EIP712, generateToken } from './output';

describe('Output', () => {
  it('encrypt and decrypt one character', async () => {
    const response = await generateToken({
      verifyingContract: '0xccc',
    });
    console.log(response);
    const jsonToken: EIP712 = JSON.parse(response.message);
    expect(jsonToken.domain.chainId).toBe(9000);
    expect(jsonToken.domain.name).toBe('Authorization for 0xccc');
    expect(jsonToken.domain.version).toBe('1');
    expect(jsonToken.message.publicKey).toBe(response.keypair.publicKey);

    expect(jsonToken.primaryType).toBe('Reencrypt');
    expect(jsonToken.types.Reencrypt.length).toBe(1);
    expect(jsonToken.types.Reencrypt[0].name).toBe('publicKey');
    expect(jsonToken.types.Reencrypt[0].type).toBe('string');
  });
});
