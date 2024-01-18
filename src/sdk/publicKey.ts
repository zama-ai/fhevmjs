import sodium from 'libsodium-wrappers';
import { toHexString } from '../utils';
import { ContractKeypair } from './types';

export type EIP712Type = { name: string; type: string };

export type EIP712 = {
  domain: {
    chainId: number;
    name: string;
    verifyingContract: string;
    version: string;
  };
  message: {
    [key: string]: any;
  };
  primaryType: string;
  types: {
    [key: string]: EIP712Type[];
  };
};

export type GeneratePublicKeyParams = {
  name?: string;
  version?: string;
  chainId?: number;
  verifyingContract: string;
  keypair?: ContractKeypair;
};

export type FhevmToken = {
  keypair: ContractKeypair;
  eip712: EIP712;
};

export const generatePublicKey = (
  params: GeneratePublicKeyParams,
): FhevmToken => {
  const keypair = params.keypair || sodium.crypto_box_keypair();
  const msgParams: EIP712 = {
    types: {
      // This refers to the domain the contract is hosted on.
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      // Refer to primaryType.
      Reencrypt: [{ name: 'publicKey', type: 'bytes32' }],
    },
    // This defines the message you're proposing the user to sign, is dapp-specific, and contains
    // anything you want. There are no required fields. Be as explicit as possible when building out
    // the message schema.
    // This refers to the keys of the following types object.
    primaryType: 'Reencrypt',
    domain: {
      // Give a user-friendly name to the specific contract you're signing for.
      name: params.name || 'Authorization token',
      // This identifies the latest version.
      version: params.version || '1',
      // This defines the network, in this case, Mainnet.
      chainId: params.chainId || 9000,
      // // Add a verifying contract to make sure you're establishing contracts with the proper entity.
      verifyingContract: params.verifyingContract,
    },
    message: {
      publicKey: `0x${toHexString(keypair.publicKey)}`,
    },
  };
  return {
    keypair: {
      publicKey: keypair.publicKey,
      privateKey: keypair.privateKey,
    },
    eip712: msgParams,
  };
};
