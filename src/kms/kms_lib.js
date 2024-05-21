let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextDecoder, TextEncoder } = require(`util`);

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let cachedUint32Memory0 = null;

function getUint32Memory0() {
    if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getUint32Memory0();
    for (let i = 0; i < array.length; i++) {
        mem[ptr / 4 + i] = addHeapObject(array[i]);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}
/**
* @param {(PublicSigKey)[]} server_pks
* @param {PublicSigKey} client_pk
* @param {number} shares_needed
* @param {string} params_json
* @returns {Client}
*/
module.exports.new_client = function(server_pks, client_pk, shares_needed, params_json) {
    const ptr0 = passArrayJsValueToWasm0(server_pks, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(client_pk, PublicSigKey);
    var ptr1 = client_pk.__destroy_into_raw();
    const ptr2 = passStringToWasm0(params_json, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.new_client(ptr0, len0, ptr1, shares_needed, ptr2, len2);
    return Client.__wrap(ret);
};

/**
* @returns {PrivateEncKey}
*/
module.exports.cryptobox_keygen = function() {
    const ret = wasm.cryptobox_keygen();
    return PrivateEncKey.__wrap(ret);
};

/**
* @param {PrivateEncKey} sk
* @returns {PublicEncKey}
*/
module.exports.cryptobox_get_pk = function(sk) {
    _assertClass(sk, PrivateEncKey);
    const ret = wasm.cryptobox_get_pk(sk.__wbg_ptr);
    return PublicEncKey.__wrap(ret);
};

/**
* @param {PublicEncKey} pk
* @returns {Uint8Array}
*/
module.exports.cryptobox_pk_to_u8vec = function(pk) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(pk, PublicEncKey);
        wasm.cryptobox_pk_to_u8vec(retptr, pk.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
* @param {PrivateEncKey} sk
* @returns {Uint8Array}
*/
module.exports.cryptobox_sk_to_u8vec = function(sk) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(sk, PrivateEncKey);
        wasm.cryptobox_sk_to_u8vec(retptr, sk.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
* @param {Uint8Array} v
* @returns {PublicEncKey}
*/
module.exports.u8vec_to_cryptobox_pk = function(v) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.u8vec_to_cryptobox_pk(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return PublicEncKey.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
* @param {Uint8Array} v
* @returns {PrivateEncKey}
*/
module.exports.u8vec_to_cryptobox_sk = function(v) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(v, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.u8vec_to_cryptobox_sk(retptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return PrivateEncKey.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

/**
* @param {Uint8Array} msg
* @param {PublicEncKey} their_pk
* @param {PrivateEncKey} my_sk
* @returns {CryptoBoxCt}
*/
module.exports.cryptobox_encrypt = function(msg, their_pk, my_sk) {
    const ptr0 = passArray8ToWasm0(msg, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    _assertClass(their_pk, PublicEncKey);
    _assertClass(my_sk, PrivateEncKey);
    const ret = wasm.cryptobox_encrypt(ptr0, len0, their_pk.__wbg_ptr, my_sk.__wbg_ptr);
    return CryptoBoxCt.__wrap(ret);
};

/**
* @param {CryptoBoxCt} ct
* @param {PrivateEncKey} my_sk
* @param {PublicEncKey} their_pk
* @returns {Uint8Array}
*/
module.exports.cryptobox_decrypt = function(ct, my_sk, their_pk) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(ct, CryptoBoxCt);
        _assertClass(my_sk, PrivateEncKey);
        _assertClass(their_pk, PublicEncKey);
        wasm.cryptobox_decrypt(retptr, ct.__wbg_ptr, my_sk.__wbg_ptr, their_pk.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1, 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

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
module.exports.make_reencryption_req = function(client, signature, enc_pk, fhe_type, key_id, ciphertext_digest, domain) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(client, Client);
        const ptr0 = passArray8ToWasm0(signature, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(enc_pk, PublicEncKey);
        var ptr1 = enc_pk.__destroy_into_raw();
        _assertClass(key_id, RequestId);
        var ptr2 = key_id.__destroy_into_raw();
        const ptr3 = passArray8ToWasm0(ciphertext_digest, wasm.__wbindgen_malloc);
        const len3 = WASM_VECTOR_LEN;
        _assertClass(domain, Eip712DomainMsg);
        var ptr4 = domain.__destroy_into_raw();
        wasm.make_reencryption_req(retptr, client.__wbg_ptr, ptr0, len0, ptr1, fhe_type, ptr2, ptr3, len3, ptr4);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return ReencryptionRequest.__wrap(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4, 4) >>> 0;
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
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
module.exports.process_reencryption_resp = function(client, request, agg_resp, agg_resp_ids, enc_pk, enc_sk) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(client, Client);
        let ptr0 = 0;
        if (!isLikeNone(request)) {
            _assertClass(request, ReencryptionRequest);
            ptr0 = request.__destroy_into_raw();
        }
        const ptr1 = passArrayJsValueToWasm0(agg_resp, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray32ToWasm0(agg_resp_ids, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        _assertClass(enc_pk, PublicEncKey);
        _assertClass(enc_sk, PrivateEncKey);
        wasm.process_reencryption_resp(retptr, client.__wbg_ptr, ptr0, ptr1, len1, ptr2, len2, enc_pk.__wbg_ptr, enc_sk.__wbg_ptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return r0;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
};

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
* The plaintext types that can be encrypted in a fhevm ciphertext.
*/
module.exports.FheType = Object.freeze({ Bool:0,"0":"Bool",Euint4:1,"1":"Euint4",Euint8:2,"2":"Euint8",Euint16:3,"3":"Euint16",Euint32:4,"4":"Euint32",Euint64:5,"5":"Euint64",Euint128:6,"6":"Euint128",Euint160:7,"7":"Euint160", });

const ClientFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_client_free(ptr >>> 0));
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
class Client {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Client.prototype);
        obj.__wbg_ptr = ptr;
        ClientFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ClientFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_client_free(ptr);
    }
}
module.exports.Client = Client;

const CryptoBoxCtFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cryptoboxct_free(ptr >>> 0));
/**
*/
class CryptoBoxCt {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CryptoBoxCt.prototype);
        obj.__wbg_ptr = ptr;
        CryptoBoxCtFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CryptoBoxCtFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cryptoboxct_free(ptr);
    }
}
module.exports.CryptoBoxCt = CryptoBoxCt;

const Eip712DomainMsgFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eip712domainmsg_free(ptr >>> 0));
/**
* <https://eips.ethereum.org/EIPS/eip-712#definition-of-domainseparator>
* eventually chain_id, verifying_contract and salt will be parsed in to solidity types
*/
class Eip712DomainMsg {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Eip712DomainMsg.prototype);
        obj.__wbg_ptr = ptr;
        Eip712DomainMsgFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Eip712DomainMsgFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eip712domainmsg_free(ptr);
    }
    /**
    * @returns {string}
    */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_name(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} arg0
    */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_version(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} arg0
    */
    set version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Uint8Array}
    */
    get chain_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_chain_id(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} arg0
    */
    set chain_id(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_chain_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {string}
    */
    get verifying_contract() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_verifying_contract(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} arg0
    */
    set verifying_contract(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_verifying_contract(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {Uint8Array}
    */
    get salt() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_salt(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} arg0
    */
    set salt(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_salt(this.__wbg_ptr, ptr0, len0);
    }
}
module.exports.Eip712DomainMsg = Eip712DomainMsg;

const PlaintextFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_plaintext_free(ptr >>> 0));
/**
*/
class Plaintext {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PlaintextFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_plaintext_free(ptr);
    }
    /**
    * @returns {bigint}
    */
    get lowest_bits() {
        const ret = wasm.__wbg_get_plaintext_lowest_bits(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set lowest_bits(arg0) {
        wasm.__wbg_set_plaintext_lowest_bits(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {bigint}
    */
    get middle_bits() {
        const ret = wasm.__wbg_get_plaintext_middle_bits(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
    * @param {bigint} arg0
    */
    set middle_bits(arg0) {
        wasm.__wbg_set_plaintext_middle_bits(this.__wbg_ptr, arg0);
    }
    /**
    * @returns {number}
    */
    get higest_bits() {
        const ret = wasm.__wbg_get_plaintext_higest_bits(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * @param {number} arg0
    */
    set higest_bits(arg0) {
        wasm.__wbg_set_plaintext_higest_bits(this.__wbg_ptr, arg0);
    }
}
module.exports.Plaintext = Plaintext;

const PrivateEncKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_privateenckey_free(ptr >>> 0));
/**
*/
class PrivateEncKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PrivateEncKey.prototype);
        obj.__wbg_ptr = ptr;
        PrivateEncKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrivateEncKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_privateenckey_free(ptr);
    }
}
module.exports.PrivateEncKey = PrivateEncKey;

const PrivateSigKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_privatesigkey_free(ptr >>> 0));
/**
*/
class PrivateSigKey {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PrivateSigKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_privatesigkey_free(ptr);
    }
}
module.exports.PrivateSigKey = PrivateSigKey;

const PublicEncKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publicenckey_free(ptr >>> 0));
/**
*/
class PublicEncKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PublicEncKey.prototype);
        obj.__wbg_ptr = ptr;
        PublicEncKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicEncKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publicenckey_free(ptr);
    }
}
module.exports.PublicEncKey = PublicEncKey;

const PublicSigKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_publicsigkey_free(ptr >>> 0));
/**
*/
class PublicSigKey {

    static __unwrap(jsValue) {
        if (!(jsValue instanceof PublicSigKey)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PublicSigKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publicsigkey_free(ptr);
    }
}
module.exports.PublicSigKey = PublicSigKey;

const ReencryptionRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_reencryptionrequest_free(ptr >>> 0));
/**
*/
class ReencryptionRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReencryptionRequest.prototype);
        obj.__wbg_ptr = ptr;
        ReencryptionRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReencryptionRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionrequest_free(ptr);
    }
    /**
    * Signature of the ASN1 DER serialization of \[ReencryptionRequestPayload\].
    * @returns {Uint8Array}
    */
    get signature() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequest_signature(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Signature of the ASN1 DER serialization of \[ReencryptionRequestPayload\].
    * @param {Uint8Array} arg0
    */
    set signature(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * @returns {ReencryptionRequestPayload | undefined}
    */
    get payload() {
        const ret = wasm.__wbg_get_reencryptionrequest_payload(this.__wbg_ptr);
        return ret === 0 ? undefined : ReencryptionRequestPayload.__wrap(ret);
    }
    /**
    * @param {ReencryptionRequestPayload | undefined} [arg0]
    */
    set payload(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, ReencryptionRequestPayload);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_reencryptionrequest_payload(this.__wbg_ptr, ptr0);
    }
    /**
    * @returns {Eip712DomainMsg | undefined}
    */
    get domain() {
        const ret = wasm.__wbg_get_reencryptionrequest_domain(this.__wbg_ptr);
        return ret === 0 ? undefined : Eip712DomainMsg.__wrap(ret);
    }
    /**
    * @param {Eip712DomainMsg | undefined} [arg0]
    */
    set domain(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, Eip712DomainMsg);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_reencryptionrequest_domain(this.__wbg_ptr, ptr0);
    }
    /**
    * The ID that identifies this request.
    * Future queries for the result must use this request ID.
    * @returns {RequestId | undefined}
    */
    get request_id() {
        const ret = wasm.__wbg_get_reencryptionrequest_request_id(this.__wbg_ptr);
        return ret === 0 ? undefined : RequestId.__wrap(ret);
    }
    /**
    * The ID that identifies this request.
    * Future queries for the result must use this request ID.
    * @param {RequestId | undefined} [arg0]
    */
    set request_id(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, RequestId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_reencryptionrequest_request_id(this.__wbg_ptr, ptr0);
    }
}
module.exports.ReencryptionRequest = ReencryptionRequest;

const ReencryptionRequestPayloadFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_reencryptionrequestpayload_free(ptr >>> 0));
/**
*/
class ReencryptionRequestPayload {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ReencryptionRequestPayload.prototype);
        obj.__wbg_ptr = ptr;
        ReencryptionRequestPayloadFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReencryptionRequestPayloadFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionrequestpayload_free(ptr);
    }
    /**
    * Version of the request format.
    * @returns {number}
    */
    get version() {
        const ret = wasm.__wbg_get_reencryptionrequestpayload_version(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Version of the request format.
    * @param {number} arg0
    */
    set version(arg0) {
        wasm.__wbg_set_reencryptionrequestpayload_version(this.__wbg_ptr, arg0);
    }
    /**
    * The amount of shares needed to recombine the result.
    * This implies the threshold used.
    * Needed to avoid a single malicious server taking over a request that should
    * have been distributed.
    * @returns {number}
    */
    get servers_needed() {
        const ret = wasm.__wbg_get_reencryptionrequestpayload_servers_needed(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * The amount of shares needed to recombine the result.
    * This implies the threshold used.
    * Needed to avoid a single malicious server taking over a request that should
    * have been distributed.
    * @param {number} arg0
    */
    set servers_needed(arg0) {
        wasm.__wbg_set_reencryptionrequestpayload_servers_needed(this.__wbg_ptr, arg0);
    }
    /**
    * The server's signature verification key.
    * Encoded using SEC1.
    * TODO not needed in the request! Should be removed
    * @returns {Uint8Array}
    */
    get verification_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequest_signature(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The server's signature verification key.
    * Encoded using SEC1.
    * TODO not needed in the request! Should be removed
    * @param {Uint8Array} arg0
    */
    set verification_key(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Randomness specified in the request to ensure EU-CMA of the signed response.
    * TODO check that we don't need two types of randomness. One for the reuqest and one for the response
    * TODO also check potential risk with repeated calls
    * @returns {Uint8Array}
    */
    get randomness() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequestpayload_randomness(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Randomness specified in the request to ensure EU-CMA of the signed response.
    * TODO check that we don't need two types of randomness. One for the reuqest and one for the response
    * TODO also check potential risk with repeated calls
    * @param {Uint8Array} arg0
    */
    set randomness(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Encoding of the user's public encryption key for this request.
    * Encoding using the default encoding of libsodium, i.e. the 32 bytes of a
    * Montgomery point.
    * @returns {Uint8Array}
    */
    get enc_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_chain_id(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Encoding of the user's public encryption key for this request.
    * Encoding using the default encoding of libsodium, i.e. the 32 bytes of a
    * Montgomery point.
    * @param {Uint8Array} arg0
    */
    set enc_key(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_chain_id(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * The type of plaintext encrypted.
    * @returns {number}
    */
    get fhe_type() {
        const ret = wasm.__wbg_get_reencryptionrequestpayload_fhe_type(this.__wbg_ptr);
        return ret;
    }
    /**
    * The type of plaintext encrypted.
    * @param {number} arg0
    */
    set fhe_type(arg0) {
        wasm.__wbg_set_reencryptionrequestpayload_fhe_type(this.__wbg_ptr, arg0);
    }
    /**
    * The key id to use for decryption. Will be the request_id used during key generation
    * @returns {RequestId | undefined}
    */
    get key_id() {
        const ret = wasm.__wbg_get_reencryptionrequestpayload_key_id(this.__wbg_ptr);
        return ret === 0 ? undefined : RequestId.__wrap(ret);
    }
    /**
    * The key id to use for decryption. Will be the request_id used during key generation
    * @param {RequestId | undefined} [arg0]
    */
    set key_id(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, RequestId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_reencryptionrequestpayload_key_id(this.__wbg_ptr, ptr0);
    }
    /**
    * The actual ciphertext to decrypt, taken directly from the fhevm.
    * When creating the payload, this field may be empty,
    * it is the responsibility of the gateway to fetch the
    * ciphertext for the given digest below.
    * @returns {Uint8Array | undefined}
    */
    get ciphertext() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequestpayload_ciphertext(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            let v1;
            if (r0 !== 0) {
                v1 = getArrayU8FromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1, 1);
            }
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The actual ciphertext to decrypt, taken directly from the fhevm.
    * When creating the payload, this field may be empty,
    * it is the responsibility of the gateway to fetch the
    * ciphertext for the given digest below.
    * @param {Uint8Array | undefined} [arg0]
    */
    set ciphertext(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_reencryptionrequestpayload_ciphertext(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * The SHA3 digest of the ciphertext above.
    * @returns {Uint8Array}
    */
    get ciphertext_digest() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequestpayload_ciphertext_digest(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The SHA3 digest of the ciphertext above.
    * @param {Uint8Array} arg0
    */
    set ciphertext_digest(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_verifying_contract(this.__wbg_ptr, ptr0, len0);
    }
}
module.exports.ReencryptionRequestPayload = ReencryptionRequestPayload;

const ReencryptionResponseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_reencryptionresponse_free(ptr >>> 0));
/**
*/
class ReencryptionResponse {

    static __unwrap(jsValue) {
        if (!(jsValue instanceof ReencryptionResponse)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReencryptionResponseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionresponse_free(ptr);
    }
    /**
    * Version of the response format.
    * @returns {number}
    */
    get version() {
        const ret = wasm.__wbg_get_reencryptionresponse_version(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Version of the response format.
    * @param {number} arg0
    */
    set version(arg0) {
        wasm.__wbg_set_reencryptionresponse_version(this.__wbg_ptr, arg0);
    }
    /**
    * Servers_needed are not really needed since there is a link to the
    * digest, however, it seems better to be able to handle a response without
    * getting data from the request as well. but this is also a security issue
    * since it is possible to get meaning from the response without directly
    * linking it to a request
    *
    * The amount of shares needed to recombine the result.
    * This implies the threshold used.
    * @returns {number}
    */
    get servers_needed() {
        const ret = wasm.__wbg_get_reencryptionresponse_servers_needed(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
    * Servers_needed are not really needed since there is a link to the
    * digest, however, it seems better to be able to handle a response without
    * getting data from the request as well. but this is also a security issue
    * since it is possible to get meaning from the response without directly
    * linking it to a request
    *
    * The amount of shares needed to recombine the result.
    * This implies the threshold used.
    * @param {number} arg0
    */
    set servers_needed(arg0) {
        wasm.__wbg_set_reencryptionresponse_servers_needed(this.__wbg_ptr, arg0);
    }
    /**
    * The server's signature verification key.
    * Encoded using SEC1.
    * Needed to validate the response, but MUST also be linked to a list of
    * trusted keys.
    * @returns {Uint8Array}
    */
    get verification_key() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequest_signature(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The server's signature verification key.
    * Encoded using SEC1.
    * Needed to validate the response, but MUST also be linked to a list of
    * trusted keys.
    * @param {Uint8Array} arg0
    */
    set verification_key(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_name(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * Digest of the request validated.
    * Needed to ensure that the response is for the expected request.
    * @returns {Uint8Array}
    */
    get digest() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_reencryptionrequestpayload_randomness(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Digest of the request validated.
    * Needed to ensure that the response is for the expected request.
    * @param {Uint8Array} arg0
    */
    set digest(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
    * The type of plaintext encrypted.
    * @returns {number}
    */
    get fhe_type() {
        const ret = wasm.__wbg_get_reencryptionresponse_fhe_type(this.__wbg_ptr);
        return ret;
    }
    /**
    * The type of plaintext encrypted.
    * @param {number} arg0
    */
    set fhe_type(arg0) {
        wasm.__wbg_set_reencryptionresponse_fhe_type(this.__wbg_ptr, arg0);
    }
    /**
    * The signcrypted payload, using a hybrid encryption approach in
    * sign-then-encrypt.
    * @returns {Uint8Array}
    */
    get signcrypted_ciphertext() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_chain_id(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * The signcrypted payload, using a hybrid encryption approach in
    * sign-then-encrypt.
    * @param {Uint8Array} arg0
    */
    set signcrypted_ciphertext(arg0) {
        const ptr0 = passArray8ToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_chain_id(this.__wbg_ptr, ptr0, len0);
    }
}
module.exports.ReencryptionResponse = ReencryptionResponse;

const RequestIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_requestid_free(ptr >>> 0));
/**
* Simple response to return an ID, to be used to retrieve the computed result later on.
*/
class RequestId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RequestId.prototype);
        obj.__wbg_ptr = ptr;
        RequestIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RequestIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_requestid_free(ptr);
    }
    /**
    * @returns {string}
    */
    get request_id() {
        let deferred1_0;
        let deferred1_1;
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.__wbg_get_eip712domainmsg_name(retptr, this.__wbg_ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            deferred1_0 = r0;
            deferred1_1 = r1;
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
    * @param {string} arg0
    */
    set request_id(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_eip712domainmsg_name(this.__wbg_ptr, ptr0, len0);
    }
}
module.exports.RequestId = RequestId;

module.exports.__wbg_reencryptionresponse_unwrap = function(arg0) {
    const ret = ReencryptionResponse.__unwrap(takeObject(arg0));
    return ret;
};

module.exports.__wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_publicsigkey_unwrap = function(arg0) {
    const ret = PublicSigKey.__unwrap(takeObject(arg0));
    return ret;
};

module.exports.__wbg_new_abda76e883ba8a5f = function() {
    const ret = new Error();
    return addHeapObject(ret);
};

module.exports.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
    const ret = getObject(arg1).stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len1;
    getInt32Memory0()[arg0 / 4 + 0] = ptr1;
};

module.exports.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_crypto_1d1f22824a6a080c = function(arg0) {
    const ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbg_process_4a72847cc503995b = function(arg0) {
    const ret = getObject(arg0).process;
    return addHeapObject(ret);
};

module.exports.__wbg_versions_f686565e586dd935 = function(arg0) {
    const ret = getObject(arg0).versions;
    return addHeapObject(ret);
};

module.exports.__wbg_node_104a2ff8d6ea03a2 = function(arg0) {
    const ret = getObject(arg0).node;
    return addHeapObject(ret);
};

module.exports.__wbindgen_is_string = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'string';
    return ret;
};

module.exports.__wbg_msCrypto_eb05e62b530a1508 = function(arg0) {
    const ret = getObject(arg0).msCrypto;
    return addHeapObject(ret);
};

module.exports.__wbg_require_cca90b1a94a0255b = function() { return handleError(function () {
    const ret = module.require;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

module.exports.__wbg_randomFillSync_5c9c955aa56b6049 = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).randomFillSync(takeObject(arg1));
}, arguments) };

module.exports.__wbg_getRandomValues_3aa56aa6edec874c = function() { return handleError(function (arg0, arg1) {
    getObject(arg0).getRandomValues(getObject(arg1));
}, arguments) };

module.exports.__wbg_newnoargs_e258087cd0daa0ea = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

module.exports.__wbg_call_27c0f87801dedf93 = function() { return handleError(function (arg0, arg1) {
    const ret = getObject(arg0).call(getObject(arg1));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_object_clone_ref = function(arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
};

module.exports.__wbg_self_ce0dbfc45cf2f5be = function() { return handleError(function () {
    const ret = self.self;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_window_c6fb939a7f436783 = function() { return handleError(function () {
    const ret = window.window;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_globalThis_d1e6af4856ba331b = function() { return handleError(function () {
    const ret = globalThis.globalThis;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_global_207b558942527489 = function() { return handleError(function () {
    const ret = global.global;
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = getObject(arg0) === undefined;
    return ret;
};

module.exports.__wbg_call_b3ca7c6051f9bec1 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
}, arguments) };

module.exports.__wbg_buffer_12d079cc21e14bdb = function(arg0) {
    const ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

module.exports.__wbg_newwithbyteoffsetandlength_aa4a17c33a06e5cb = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_new_63b92bc8671ed464 = function(arg0) {
    const ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

module.exports.__wbg_set_a47bac70306a19a7 = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

module.exports.__wbg_newwithlength_e9b4878cebadb3d3 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbg_subarray_a1f73cd4b5b42fe1 = function(arg0, arg1, arg2) {
    const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return addHeapObject(ret);
};

const path = require('path').join(__dirname, 'kms_lib_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

