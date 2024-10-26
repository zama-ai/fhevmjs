import { computeHandle, computePrehandle } from './handle';

describe('handle', () => {
  it('computePrehandle', async () => {
    const prehandle = computePrehandle({
      ciphertextHash: Buffer.from('hello goodbye'),
      indexHandle: 2,
      handleType: 0,
      handleVersion: 0,
    });

    expect(prehandle.toString('hex')).toMatchSnapshot();
  });

  it('computeHandle', async () => {
    const prehandle = computePrehandle({
      ciphertextHash: Buffer.from('hello goodbye'),
      indexHandle: 2,
      handleType: 0,
      handleVersion: 0,
    });

    const handle = computeHandle({
      prehandle,
      inputCtx: {
        hostChainId: 1,
        keysetId: '0xdeadbeef',
        ownerAddress: '0xdeadbeef',
        contractAddress: '0xdeadbeef',
      },
    });

    expect(handle.toString('hex')).toMatchSnapshot();
    expect(handle.subarray(29, 32)).toEqual(prehandle.subarray(29, 32));
  });
});
