import { Provider } from 'ethers';
import {
  bytesToBigInt,
  bigIntToBytes256,
  toHexString,
  fromHexString,
} from '../utils';
import {
  u8vec_to_cryptobox_pk,
  new_client,
  process_reencryption_resp_from_js,
  u8vec_to_cryptobox_sk,
} from 'node-tkms';

export const reencryptRequest =
  (kmsSignatures: string[], gatewayUrl: string) =>
  async (
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string,
  ) => {
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

    const client = new_client(kmsSignatures, userAddress, 'default');

    try {
      const eip712Domain = {
        name: 'Authorization token',
        version: '1',
        chain_id: [
          70, 31, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0, 0, 0, 0, 0, 0, 0, 0,
        ],
        verifying_contract: '0x66f9664f97F2b50F62D13eA064982f936dE76657',
        salt: [],
      };
      const decryption = process_reencryption_resp_from_js(
        client,
        payload,
        eip712Domain,
        json.response,
        pubKey,
        privKey,
        true,
      );

      return bytesToBigInt(decryption);
    } catch (e) {
      throw new Error('An error occured during decryption');
    }
  };
