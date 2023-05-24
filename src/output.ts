import sodium from 'libsodium-wrappers';

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

type GenerateTokenParams = {
  verifyingContract: string;
};

export const generateToken = async (params: GenerateTokenParams) => {
  await sodium.ready;
  const keypair = sodium.crypto_box_keypair('hex');
  const msgParams: EIP712 = {
    domain: {
      // This defines the network, in this case, Mainnet.
      chainId: 9000,
      // Give a user-friendly name to the specific contract you're signing for.
      name: `Authorization for ${params.verifyingContract}`,
      // // Add a verifying contract to make sure you're establishing contracts with the proper entity.
      verifyingContract: params.verifyingContract,
      // This identifies the latest version.
      version: '1',
    },

    // This defines the message you're proposing the user to sign, is dapp-specific, and contains
    // anything you want. There are no required fields. Be as explicit as possible when building out
    // the message schema.
    message: {
      publicKey: `0x${keypair.publicKey}`,
    },
    // This refers to the keys of the following types object.
    primaryType: 'Reencrypt',
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
  };
  console.log(msgParams);
  return {
    keypair: {
      publicKey: `0x${keypair.publicKey}`,
      privateKey: `0x${keypair.privateKey}`,
    },
    message: JSON.stringify(msgParams),
  };
};
