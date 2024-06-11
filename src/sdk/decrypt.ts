import sodium from 'libsodium-wrappers';
import { bytesToBigInt, fromHexString, bytesToHex } from '../utils';
import { ContractKeypair } from './types';
import { getAddress } from 'ethers';

export const decrypt = (
  keypair: ContractKeypair,
  ciphertext: string | Uint8Array,
): bigint => {
  const toDecrypt =
    typeof ciphertext === 'string' ? fromHexString(ciphertext) : ciphertext;
  const decrypted = sodium.crypto_box_seal_open(
    toDecrypt,
    keypair.publicKey,
    keypair.privateKey,
  );
  return bytesToBigInt(decrypted);
};

export const decryptAddress = (
  keypair: ContractKeypair,
  ciphertext: string | Uint8Array,
): string => {
  const toDecrypt =
    typeof ciphertext === 'string' ? fromHexString(ciphertext) : ciphertext;
  const decrypted = sodium.crypto_box_seal_open(
    toDecrypt,
    keypair.publicKey,
    keypair.privateKey,
  );

  let hexString = bytesToHex(decrypted);
  // Ensure hexString forms a valid 40-digit Ethereum address.
  // Truncate or pad with leading zeros as necessary to correct length issues.
  if (hexString.length > 40) {
    hexString = hexString.substring(hexString.length - 40);
  } else {
    hexString = hexString.slice(2).padStart(40, '0');
  }
  return getAddress(hexString);
};
