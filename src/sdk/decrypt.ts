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
  return getAddress(bytesToHex(decrypted));
};
