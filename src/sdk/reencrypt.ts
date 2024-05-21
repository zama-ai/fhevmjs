import { toHexString } from 'src/utils';
import {
  u8vec_to_cryptobox_pk,
  cryptobox_encrypt,
  cryptobox_decrypt,
  cryptobox_pk_to_u8vec,
} from '../kms';

export const reencryptRequest =
  (reencryptUrl?: string) =>
  async (
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string,
  ) => {
    if (!reencryptUrl) throw new Error('You must provide a reencrypt URL');
    const data = {
      publicKey,
      handle,
      signature,
      contractAddress,
      userAddress,
    };
    // const response = await fetch(`${reencryptUrl}`);
    return BigInt(10);
  };
