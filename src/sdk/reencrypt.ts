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
import { ethers } from 'ethers';

import aclArtifact from './ACL.json';

export const reencryptRequest =
  (gatewayUrl?: string, networkUrl?: string, aclAddress?: string) =>
  async (
    handle: bigint,
    privateKey: string,
    publicKey: string,
    signature: string,
    contractAddress: string,
    userAddress: string,
  ) => {
    if (!gatewayUrl) throw new Error('You must provide a reencryption URL.');
    if (!aclAddress) throw new Error('You must provide the ACL address.');
    const provider = new ethers.JsonRpcProvider(networkUrl);
    const acl = new ethers.Contract(contractAddress, aclArtifact.abi, provider);
    const userAllowed = await acl.persistAllowed(handle, userAddress);
    const contractAllowed = await acl.persistAllowed(handle, contractAddress);
    const isAllowed = userAllowed && contractAllowed;
    if (!isAllowed) {
      throw new Error('User is not authorized to reencrypt this handle!');
    }
    if (userAddress === contractAddress) {
      throw new Error(
        'userAddress should not be equal to contractAddress when requesting reencryption!',
      );
    }

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
