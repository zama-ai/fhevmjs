import {
  bytesToBigInt,
  bigIntToBytes,
  toHexString,
  fromHexString,
} from '../utils';
import {
  u8vec_to_cryptobox_pk,
  default_client_for_centralized_kms,
  process_reencryption_resp_from_json,
  u8vec_to_cryptobox_sk,
} from '../kms/node/kms_lib.js';

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
      signature: signature.replace(/^(0x)/, ''),
      user_address: userAddress.replace(/^(0x)/, ''),
      enc_key: publicKey.replace(/^(0x)/, ''),
      ciphertext_handle: handle.toString(16),
      eip712_verifying_contract: contractAddress,
    };
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    let pubKey;
    let privKey;
    try {
      pubKey = u8vec_to_cryptobox_pk(fromHexString(publicKey));
      privKey = u8vec_to_cryptobox_sk(fromHexString(privateKey));
    } catch (e) {
      throw new Error('Invalid public or private key');
    }

    let json;
    try {
      const response = await fetch(`${gatewayUrl}reencrypt`, options);
      json = await response.json();
    } catch (e) {
      throw new Error("Gateway didn't response correctly");
    }

    const client = default_client_for_centralized_kms();

    try {
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
    } catch (e) {
      throw new Error('An error occured during decryption');
    }
  };
