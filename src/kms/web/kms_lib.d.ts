/* tslint:disable */
/* eslint-disable */
/**
* @param {(PublicSigKey)[]} server_pks
* @param {PublicSigKey} client_pk
* @param {number} shares_needed
* @param {string} params_json
* @returns {Client}
*/
export function new_client(server_pks: (PublicSigKey)[], client_pk: PublicSigKey, shares_needed: number, params_json: string): Client;
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
* This function assembles [ReencryptionRequest]
* from a signature and other metadata.
* The signature is on the ephemeral public key
* signed by the client's private key
* following the EIP712 standard.
* @param {Client} client
* @param {Uint8Array} signature
* @param {PublicEncKey} enc_pk
* @param {FheType} fhe_type
* @param {RequestId} key_id
* @param {Uint8Array} ciphertext_digest
* @param {Eip712DomainMsg} domain
* @returns {ReencryptionRequest}
*/
export function make_reencryption_req(client: Client, signature: Uint8Array, enc_pk: PublicEncKey, fhe_type: FheType, key_id: RequestId, ciphertext_digest: Uint8Array, domain: Eip712DomainMsg): ReencryptionRequest;
/**
* This function takes [AggregatedReencryptionResponse] normally
* but wasm does not support HashMap so we need to take two parameters:
* `agg_resp` and `agg_resp_id`.
* @param {Client} client
* @param {ReencryptionRequest | undefined} request
* @param {(ReencryptionResponse)[]} agg_resp
* @param {Uint32Array} agg_resp_ids
* @param {PublicEncKey} enc_pk
* @param {PrivateEncKey} enc_sk
* @returns {number}
*/
export function process_reencryption_resp(client: Client, request: ReencryptionRequest | undefined, agg_resp: (ReencryptionResponse)[], agg_resp_ids: Uint32Array, enc_pk: PublicEncKey, enc_sk: PrivateEncKey): number;
/**
* The plaintext types that can be encrypted in a fhevm ciphertext.
*/
export enum FheType {
  Bool = 0,
  Euint4 = 1,
  Euint8 = 2,
  Euint16 = 3,
  Euint32 = 4,
  Euint64 = 5,
  Euint128 = 6,
  Euint160 = 7,
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
  higest_bits: number;
/**
*/
  lowest_bits: bigint;
/**
*/
  middle_bits: bigint;
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
* Signature of the ASN1 DER serialization of \[ReencryptionRequestPayload\].
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

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_client_free: (a: number) => void;
  readonly __wbg_requestid_free: (a: number) => void;
  readonly __wbg_reencryptionrequestpayload_free: (a: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_version: (a: number) => number;
  readonly __wbg_set_reencryptionrequestpayload_version: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_servers_needed: (a: number) => number;
  readonly __wbg_set_reencryptionrequestpayload_servers_needed: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_randomness: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_fhe_type: (a: number) => number;
  readonly __wbg_set_reencryptionrequestpayload_fhe_type: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_key_id: (a: number) => number;
  readonly __wbg_set_reencryptionrequestpayload_key_id: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_ciphertext: (a: number, b: number) => void;
  readonly __wbg_set_reencryptionrequestpayload_ciphertext: (a: number, b: number, c: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_ciphertext_digest: (a: number, b: number) => void;
  readonly __wbg_eip712domainmsg_free: (a: number) => void;
  readonly __wbg_get_eip712domainmsg_name: (a: number, b: number) => void;
  readonly __wbg_set_eip712domainmsg_name: (a: number, b: number, c: number) => void;
  readonly __wbg_get_eip712domainmsg_version: (a: number, b: number) => void;
  readonly __wbg_set_eip712domainmsg_version: (a: number, b: number, c: number) => void;
  readonly __wbg_get_eip712domainmsg_chain_id: (a: number, b: number) => void;
  readonly __wbg_set_eip712domainmsg_chain_id: (a: number, b: number, c: number) => void;
  readonly __wbg_get_eip712domainmsg_verifying_contract: (a: number, b: number) => void;
  readonly __wbg_set_eip712domainmsg_verifying_contract: (a: number, b: number, c: number) => void;
  readonly __wbg_get_eip712domainmsg_salt: (a: number, b: number) => void;
  readonly __wbg_set_eip712domainmsg_salt: (a: number, b: number, c: number) => void;
  readonly __wbg_reencryptionrequest_free: (a: number) => void;
  readonly __wbg_get_reencryptionrequest_signature: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequest_payload: (a: number) => number;
  readonly __wbg_set_reencryptionrequest_payload: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequest_domain: (a: number) => number;
  readonly __wbg_set_reencryptionrequest_domain: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequest_request_id: (a: number) => number;
  readonly __wbg_set_reencryptionrequest_request_id: (a: number, b: number) => void;
  readonly __wbg_reencryptionresponse_free: (a: number) => void;
  readonly __wbg_get_reencryptionresponse_version: (a: number) => number;
  readonly __wbg_set_reencryptionresponse_version: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionresponse_servers_needed: (a: number) => number;
  readonly __wbg_set_reencryptionresponse_servers_needed: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionresponse_fhe_type: (a: number) => number;
  readonly __wbg_set_reencryptionresponse_fhe_type: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_enc_key: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionrequestpayload_verification_key: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionresponse_verification_key: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionresponse_digest: (a: number, b: number) => void;
  readonly __wbg_get_reencryptionresponse_signcrypted_ciphertext: (a: number, b: number) => void;
  readonly __wbg_get_requestid_request_id: (a: number, b: number) => void;
  readonly __wbg_set_requestid_request_id: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionrequestpayload_verification_key: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionrequestpayload_randomness: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionrequestpayload_enc_key: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionrequestpayload_ciphertext_digest: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionrequest_signature: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionresponse_verification_key: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionresponse_digest: (a: number, b: number, c: number) => void;
  readonly __wbg_set_reencryptionresponse_signcrypted_ciphertext: (a: number, b: number, c: number) => void;
  readonly __wbg_plaintext_free: (a: number) => void;
  readonly __wbg_get_plaintext_lowest_bits: (a: number) => number;
  readonly __wbg_set_plaintext_lowest_bits: (a: number, b: number) => void;
  readonly __wbg_get_plaintext_middle_bits: (a: number) => number;
  readonly __wbg_set_plaintext_middle_bits: (a: number, b: number) => void;
  readonly __wbg_get_plaintext_higest_bits: (a: number) => number;
  readonly __wbg_set_plaintext_higest_bits: (a: number, b: number) => void;
  readonly new_client: (a: number, b: number, c: number, d: number, e: number, f: number) => number;
  readonly __wbg_cryptoboxct_free: (a: number) => void;
  readonly cryptobox_keygen: () => number;
  readonly cryptobox_get_pk: (a: number) => number;
  readonly cryptobox_pk_to_u8vec: (a: number, b: number) => void;
  readonly cryptobox_sk_to_u8vec: (a: number, b: number) => void;
  readonly u8vec_to_cryptobox_pk: (a: number, b: number, c: number) => void;
  readonly u8vec_to_cryptobox_sk: (a: number, b: number, c: number) => void;
  readonly cryptobox_encrypt: (a: number, b: number, c: number, d: number) => number;
  readonly cryptobox_decrypt: (a: number, b: number, c: number, d: number) => void;
  readonly make_reencryption_req: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => void;
  readonly process_reencryption_resp: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => void;
  readonly __wbg_publicenckey_free: (a: number) => void;
  readonly __wbg_privateenckey_free: (a: number) => void;
  readonly __wbg_publicsigkey_free: (a: number) => void;
  readonly __wbg_privatesigkey_free: (a: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
