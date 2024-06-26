/* tslint:disable */
/* eslint-disable */
/**
* @param {PublicSigKey} pk
* @returns {Uint8Array}
*/
export function public_sig_key_to_u8vec(pk: PublicSigKey): Uint8Array;
/**
* @param {Uint8Array} v
* @returns {PublicSigKey}
*/
export function u8vec_to_public_sig_key(v: Uint8Array): PublicSigKey;
/**
* @param {PrivateSigKey} sk
* @returns {Uint8Array}
*/
export function private_sig_key_to_u8vec(sk: PrivateSigKey): Uint8Array;
/**
* @param {Uint8Array} v
* @returns {PrivateSigKey}
*/
export function u8vec_to_private_sig_key(v: Uint8Array): PrivateSigKey;
/**
* Instantiate a new client for use with the centralized KMS.
* @returns {Client}
*/
export function default_client_for_centralized_kms(): Client;
/**
* Instantiate a new client.
*
* * `server_pks` - a list of KMS server signature public keys,
* which can parsed using [u8vec_to_public_sig_key].
*
* * `server_pks_ids` - a list of the IDs that are associated to the
* server public keys. If None is given, then the IDs default to
* 1..n, where n is the length of `server_pks`.
*
* * `client_pk` - the client (wallet) public key,
* which can parsed using [u8vec_to_public_sig_key] also.
*
* * `shares_needed` - number of shares needed for reconstruction.
* In the centralized setting this is 1.
*
* * `param_choice` - the parameter choice, which can be either `"test"` or `"default"`.
* The "default" parameter choice is selected if no matching string is found.
* @param {(PublicSigKey)[]} server_pks
* @param {Uint8Array | undefined} server_pks_ids
* @param {PublicSigKey} client_pk
* @param {number} shares_needed
* @param {string} param_choice
* @returns {Client}
*/
export function new_client(server_pks: (PublicSigKey)[], server_pks_ids: Uint8Array | undefined, client_pk: PublicSigKey, shares_needed: number, param_choice: string): Client;
/**
* @param {Client} client
* @returns {(PublicSigKey)[]}
*/
export function get_server_public_keys(client: Client): (PublicSigKey)[];
/**
* @param {Client} client
* @returns {PublicSigKey}
*/
export function get_client_public_key(client: Client): PublicSigKey;
/**
* @param {Client} client
* @returns {PrivateSigKey | undefined}
*/
export function get_client_secret_key(client: Client): PrivateSigKey | undefined;
/**
* @returns {PrivateEncKey}
*/
export function cryptobox_keygen(): PrivateEncKey;
/**
* @param {PrivateEncKey} sk
* @returns {PublicEncKey}
*/
export function cryptobox_get_pk(sk: PrivateEncKey): PublicEncKey;
/**
* @param {PublicEncKey} pk
* @returns {Uint8Array}
*/
export function cryptobox_pk_to_u8vec(pk: PublicEncKey): Uint8Array;
/**
* @param {PrivateEncKey} sk
* @returns {Uint8Array}
*/
export function cryptobox_sk_to_u8vec(sk: PrivateEncKey): Uint8Array;
/**
* @param {Uint8Array} v
* @returns {PublicEncKey}
*/
export function u8vec_to_cryptobox_pk(v: Uint8Array): PublicEncKey;
/**
* @param {Uint8Array} v
* @returns {PrivateEncKey}
*/
export function u8vec_to_cryptobox_sk(v: Uint8Array): PrivateEncKey;
/**
* @param {Uint8Array} msg
* @param {PublicEncKey} their_pk
* @param {PrivateEncKey} my_sk
* @returns {CryptoBoxCt}
*/
export function cryptobox_encrypt(msg: Uint8Array, their_pk: PublicEncKey, my_sk: PrivateEncKey): CryptoBoxCt;
/**
* @param {CryptoBoxCt} ct
* @param {PrivateEncKey} my_sk
* @param {PublicEncKey} their_pk
* @returns {Uint8Array}
*/
export function cryptobox_decrypt(ct: CryptoBoxCt, my_sk: PrivateEncKey, their_pk: PublicEncKey): Uint8Array;
/**
* @param {string} name
* @param {string} version
* @param {Uint8Array} chain_id
* @param {string} verifying_contract
* @param {Uint8Array} salt
* @returns {Eip712DomainMsg}
*/
export function new_eip712_domain(name: string, version: string, chain_id: Uint8Array, verifying_contract: string, salt: Uint8Array): Eip712DomainMsg;
/**
* @param {string} request_id
* @returns {RequestId}
*/
export function new_request_id(request_id: string): RequestId;
/**
* @param {string} type_str
* @returns {FheType}
*/
export function new_fhe_type(type_str: string): FheType;
/**
* This function assembles a reencryption request
* from a signature and other metadata.
* The signature is on the ephemeral public key
* signed by the client's private key
* following the EIP712 standard.
*
* The result value needs to convert to the following JSON
* for the gateway.
* ```
* { "signature": "010203",                  // HEX
*   "verification_key": "010203",           // HEX
*   "enc_key": "010203",                    // HEX
*   "ciphertext_digest": "010203",          // HEX
*   "eip712_verifying_contract": "0x1234",  // String
* }
* ```
* This can be done using [reencryption_request_to_flat_json_string].
* @param {Client} client
* @param {Uint8Array} signature
* @param {PublicEncKey} enc_pk
* @param {FheType} fhe_type
* @param {RequestId} key_id
* @param {Uint8Array | undefined} ciphertext
* @param {Uint8Array} ciphertext_digest
* @param {Eip712DomainMsg} domain
* @returns {ReencryptionRequest}
*/
export function make_reencryption_req(client: Client, signature: Uint8Array, enc_pk: PublicEncKey, fhe_type: FheType, key_id: RequestId, ciphertext: Uint8Array | undefined, ciphertext_digest: Uint8Array, domain: Eip712DomainMsg): ReencryptionRequest;
/**
* @param {ReencryptionRequest} req
* @returns {string}
*/
export function reencryption_request_to_flat_json_string(req: ReencryptionRequest): string;
/**
* Process the reencryption response from a JSON object.
* The result is a byte array representing a plaintext of any length.
*
* * `client` - client that wants to perform reencryption.
*
* * `request` - the initial reencryption request.
*
* * `agg_resp - the response JSON object from the gateway.
*
* * `agg_resp_ids - the KMS server identities that correspond to each request.
* If this is not given, the initial configuration is used
* from when the client is instantiated.
*
* * `enc_pk` - The ephemeral public key.
*
* * `enc_sk` - The ephemeral secret key.
*
* * `verify` - Whether to perform signature verification for the response.
* It is insecure if `verify = false`!
* @param {Client} client
* @param {ReencryptionRequest | undefined} request
* @param {any} agg_resp
* @param {Uint32Array | undefined} agg_resp_ids
* @param {PublicEncKey} enc_pk
* @param {PrivateEncKey} enc_sk
* @param {boolean} verify
* @returns {Uint8Array}
*/
export function process_reencryption_resp_from_json(client: Client, request: ReencryptionRequest | undefined, agg_resp: any, agg_resp_ids: Uint32Array | undefined, enc_pk: PublicEncKey, enc_sk: PrivateEncKey, verify: boolean): Uint8Array;
/**
* Process the reencryption response from a JSON object.
* The result is a byte array representing a plaintext of any length.
*
* * `client` - client that wants to perform reencryption.
*
* * `request` - the initial reencryption request.
*
* * `agg_resp - the vector of reencryption responses.
*
* * `agg_resp_ids - the KMS server identities that correspond to each request.
* If this is not given, the initial configuration is used
* from when the client is instantiated.
*
* * `enc_pk` - The ephemeral public key.
*
* * `enc_sk` - The ephemeral secret key.
*
* * `verify` - Whether to perform signature verification for the response.
* It is insecure if `verify = false`!
* @param {Client} client
* @param {ReencryptionRequest | undefined} request
* @param {(ReencryptionResponse)[]} agg_resp
* @param {Uint32Array | undefined} agg_resp_ids
* @param {PublicEncKey} enc_pk
* @param {PrivateEncKey} enc_sk
* @param {boolean} verify
* @returns {Uint8Array}
*/
export function process_reencryption_resp(client: Client, request: ReencryptionRequest | undefined, agg_resp: (ReencryptionResponse)[], agg_resp_ids: Uint32Array | undefined, enc_pk: PublicEncKey, enc_sk: PrivateEncKey, verify: boolean): Uint8Array;
/**
* The plaintext types that can be encrypted in a fhevm ciphertext.
*/
export enum FheType {
  Ebool = 0,
  Euint4 = 1,
  Euint8 = 2,
  Euint16 = 3,
  Euint32 = 4,
  Euint64 = 5,
  Euint128 = 6,
  Euint160 = 7,
  Euint256 = 8,
  Euint512 = 9,
  Euint1024 = 10,
  Euint2048 = 11,
}
/**
* Simple client to interact with the KMS servers. This can be seen as a proof-of-concept
* and reference code for validating the KMS. The logic supplied by the client will be
* distributed accross the aggregator/proxy and smart contracts.
* TODO should probably aggregate the KmsEndpointClient to void having two client code bases
* exposed in tests and MVP
*
* client_sk is optional because sometimes the private signing key is kept
* in a secure location, e.g., hardware wallet. Calling functions that requires
* client_sk when it is None will return an error.
*/
export class Client {
  free(): void;
}
/**
*/
export class CryptoBoxCt {
  free(): void;
}
/**
* <https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator>
* eventually chain_id, verifying_contract and salt will be parsed in to solidity types
*/
export class Eip712DomainMsg {
  free(): void;
/**
*/
  chain_id: Uint8Array;
/**
*/
  name: string;
/**
*/
  salt: Uint8Array;
/**
*/
  verifying_contract: string;
/**
*/
  version: string;
}
/**
*/
export class Plaintext {
  free(): void;
/**
*/
  bytes: Uint8Array;
}
/**
*/
export class PrivateEncKey {
  free(): void;
}
/**
*/
export class PrivateSigKey {
  free(): void;
}
/**
*/
export class PublicEncKey {
  free(): void;
}
/**
*/
export class PublicSigKey {
  free(): void;
}
/**
*/
export class ReencryptionRequest {
  free(): void;
/**
*/
  domain?: Eip712DomainMsg;
/**
*/
  payload?: ReencryptionRequestPayload;
/**
* The ID that identifies this request.
* Future queries for the result must use this request ID.
*/
  request_id?: RequestId;
/**
* Signature of the serialization of \[ReencryptionRequestPayload\].
*/
  signature: Uint8Array;
}
/**
*/
export class ReencryptionRequestPayload {
  free(): void;
/**
* The actual ciphertext to decrypt, taken directly from the fhevm.
* When creating the payload, this field may be empty,
* it is the responsibility of the gateway to fetch the
* ciphertext for the given digest below.
*/
  ciphertext?: Uint8Array;
/**
* The SHA3 digest of the ciphertext above.
*/
  ciphertext_digest: Uint8Array;
/**
* Encoding of the user's public encryption key for this request.
* Encoding using the default encoding of libsodium, i.e. the 32 bytes of a
* Montgomery point.
*/
  enc_key: Uint8Array;
/**
* The type of plaintext encrypted.
*/
  fhe_type: number;
/**
* The key id to use for decryption. Will be the request_id used during key generation
*/
  key_id?: RequestId;
/**
* Randomness specified in the request to ensure EU-CMA of the signed response.
* TODO check that we don't need two types of randomness. One for the reuqest and one for the response
* TODO also check potential risk with repeated calls
*/
  randomness: Uint8Array;
/**
* The amount of shares needed to recombine the result.
* This implies the threshold used.
* Needed to avoid a single malicious server taking over a request that should
* have been distributed.
*/
  servers_needed: number;
/**
* The server's signature verification key.
* Encoded using SEC1.
* TODO not needed in the request! Should be removed
*/
  verification_key: Uint8Array;
/**
* Version of the request format.
*/
  version: number;
}
/**
*/
export class ReencryptionResponse {
  free(): void;
/**
* Digest of the request validated.
* Needed to ensure that the response is for the expected request.
*/
  digest: Uint8Array;
/**
* The type of plaintext encrypted.
*/
  fhe_type: number;
/**
* Servers_needed are not really needed since there is a link to the
* digest, however, it seems better to be able to handle a response without
* getting data from the request as well. but this is also a security issue
* since it is possible to get meaning from the response without directly
* linking it to a request
*
* The amount of shares needed to recombine the result.
* This implies the threshold used.
*/
  servers_needed: number;
/**
* The signcrypted payload, using a hybrid encryption approach in
* sign-then-encrypt.
*/
  signcrypted_ciphertext: Uint8Array;
/**
* The server's signature verification key.
* Encoded using SEC1.
* Needed to validate the response, but MUST also be linked to a list of
* trusted keys.
*/
  verification_key: Uint8Array;
/**
* Version of the response format.
*/
  version: number;
}
/**
* Simple response to return an ID, to be used to retrieve the computed result later on.
*/
export class RequestId {
  free(): void;
/**
*/
  request_id: string;
}
