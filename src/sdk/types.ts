export type ContractKeypairs = {
  [key: string]: ContractKeypair;
};

export type ContractKeypair = {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
  signature?: string | null;
};
