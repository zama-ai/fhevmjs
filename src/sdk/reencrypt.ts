import { bytesToBigInt, fromHexString, toHexString } from '../utils';
import {
  u8vec_to_public_sig_key,
  u8vec_to_cryptobox_pk,
  default_client_for_centralized_kms,
  process_reencryption_resp_from_json,
  u8vec_to_cryptobox_sk,
} from '../kms/node';

export const reencryptRequest =
  (gatewayUrl?: string) =>
  async (
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string,
  ) => {
    if (!gatewayUrl) throw new Error('You must provide a reencryption URL.');

    const payload = {
      signature,
      verification_key: userAddress,
      enc_key: publicKey,
      ciphertext_handle: handle.toString(),
      eip712_verifying_contract: contractAddress,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${gatewayUrl}/reencrypt`, options);
    const json = await response.json();
    const sigKey = u8vec_to_public_sig_key(fromHexString(userAddress));
    const client = default_client_for_centralized_kms(sigKey, 'default');
    const pubKey = u8vec_to_cryptobox_pk(fromHexString(publicKey));
    const privKey = u8vec_to_cryptobox_sk(fromHexString(privateKey));
    const decryption = process_reencryption_resp_from_json(
      client,
      undefined,
      json.response,
      undefined,
      pubKey,
      privKey,
      false,
    );
    return bytesToBigInt(decryption);
  };
