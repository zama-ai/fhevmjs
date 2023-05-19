import { Trivium, encrypt } from './trivium';

import fixtures from './tests/fixtures/trivium_light.json';

describe('Trivium', () => {
  const te = new TextEncoder();
  const td = new TextDecoder();
  it('encrypt and decrypt one character', () => {
    const key = '80000000000000000000';
    const iv = '00000000000000000000';
    const message = 'a';
    const uint8 = te.encode(message);
    const encrypted = encrypt(key, iv, uint8);
    expect(td.decode(encrypted)).toBe('Y');
    const decrypted = encrypt(key, iv, encrypted);
    expect(td.decode(decrypted)).toBe('a');
  });

  it('encrypt and decrypt multiple word', () => {
    const key = '80000000000000000000';
    const iv = '00000000000000000000';
    const message = 'Trivium is great';
    const uint8 = te.encode(message);
    const encrypted = encrypt(key, iv, uint8);
    const decrypted = encrypt(key, iv, encrypted);
    expect(td.decode(decrypted)).toBe('Trivium is great');
  });
  describe('Test against test-vectors', () => {
    // Vectors from https://github.com/cantora/avr-crypto-lib/blob/master/testvectors/trivium-80.80.test-vectors
    test.each(fixtures)('$name', ({ key, iv, outputs }) => {
      const message = new Uint8Array(new Array(512).fill(0));
      const encrypted = encrypt(key, iv, message);
      const stream = Buffer.from(encrypted).toString('hex').toUpperCase();
      outputs.forEach((output) => {
        expect(stream.substring(output.from * 2, (output.to + 1) * 2)).toBe(output.output);
      });
    });
    // it('Set 1, vector#  0', () => {
    //   const key = '80000000000000000000';
    //   const iv = '00000000000000000000';
    //   const T = new Trivium(key, iv);
    //   const message = new Uint8Array(new Array(512).fill(0));
    //   const encrypted = encrypt(key, iv, message);
    //   const stream = Buffer.from(encrypted).toString('hex').toUpperCase();
    //   expect(stream.substring(0, 64 * 2)).toBe(
    //     '38EB86FF730D7A9CAF8DF13A4420540DBB7B651464C87501552041C249F29A64D2FBF515610921EBE06C8F92CECF7F8098FF20CCCC6A62B97BE8EF7454FC80F9'
    //   );
    //   expect(stream.substring(192 * 2, 256 * 2)).toBe(
    //     'EAF2625D411F61E41F6BAEEDDD5FE202600BD472F6C9CD1E9134A745D900EF6C023E4486538F09930CFD37157C0EB57C3EF6C954C42E707D52B743AD83CFF297'
    //   );
    //   expect(stream.substring(256 * 2, 320 * 2)).toBe(
    //     '9A203CF7B2F3F09C43D188AA13A5A2021EE998C42F777E9B67C3FA221A0AA1B041AA9E86BC2F5C52AFF11F7D9EE480CB1187B20EB46D582743A52D7CD080A24A'
    //   );
    //   expect(stream.substring(448 * 2, 512 * 2)).toBe(
    //     'EBF14772061C210843C18CEA2D2A275AE02FCB18E5D7942455FF77524E8A4CA51E369A847D1AEEFB9002FCD02342983CEAFA9D487CC2032B10192CD416310FA4'
    //   );
    // });
  });
});

const toHex = (ab: Uint8Array): string =>
  [...ab]
    .map((v) => v.toString(16))
    .join('')
    .toUpperCase();
