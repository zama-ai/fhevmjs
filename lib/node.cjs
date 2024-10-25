'use strict';

var ethers = require('ethers');
var nodeTfhe = require('node-tfhe');
var bigintBuffer = require('bigint-buffer');
var sha3 = require('sha3');
var web3Validator = require('web3-validator');
var nodeTkms = require('node-tkms');

const SERIALIZED_SIZE_LIMIT_CIPHERTEXT = BigInt(1024 * 1024 * 512);
BigInt(1024 * 1024 * 512);
BigInt(1024 * 1024 * 512);
const cleanURL = (url) => {
    if (!url)
        return '';
    return new URL(url).href;
};
const fromHexString = (hexString) => {
    const arr = hexString.replace(/^(0x)/, '').match(/.{1,2}/g);
    if (!arr)
        return new Uint8Array();
    return Uint8Array.from(arr.map((byte) => parseInt(byte, 16)));
};
const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
const bytesToBigInt = function (byteArray) {
    if (!byteArray || byteArray?.length === 0) {
        return BigInt(0);
    }
    const buffer = Buffer.from(byteArray);
    const result = bigintBuffer.toBigIntBE(buffer);
    return result;
};
const clientKeyDecryptor = (clientKeySer) => {
    const clientKey = nodeTfhe.TfheClientKey.deserialize(clientKeySer);
    return {
        decryptBool: (ciphertext) => nodeTfhe.FheBool.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decrypt4: (ciphertext) => nodeTfhe.FheUint4.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decrypt8: (ciphertext) => nodeTfhe.FheUint8.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decrypt16: (ciphertext) => nodeTfhe.FheUint16.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decrypt32: (ciphertext) => nodeTfhe.FheUint32.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decrypt64: (ciphertext) => nodeTfhe.FheUint64.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decrypt128: (ciphertext) => nodeTfhe.FheUint128.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decryptAddress: (ciphertext) => {
            let hex = nodeTfhe.FheUint160.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT)
                .decrypt(clientKey)
                .toString(16);
            while (hex.length < 40) {
                hex = '0' + hex;
            }
            return '0x' + hex;
        },
        decrypt256: (ciphertext) => nodeTfhe.FheUint256.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decryptEbytes64: (ciphertext) => nodeTfhe.FheUint512.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decryptEbytes128: (ciphertext) => nodeTfhe.FheUint1024.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
        decryptEbytes256: (ciphertext) => nodeTfhe.FheUint2048.safe_deserialize(fromHexString(ciphertext), SERIALIZED_SIZE_LIMIT_CIPHERTEXT).decrypt(clientKey),
    };
};
const getCiphertextCallParams = (handle) => {
    let hex = handle.toString(16);
    hex = hex.padStart(64, '0');
    return {
        to: '0x000000000000000000000000000000000000005d',
        data: '0xff627e77' + hex,
    };
};

const getKeysFromGateway = async (url) => {
    try {
        const response = await fetch(`${url}keyurl`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
            const pubKeyUrl = data.response.fhe_key_info[0].fhe_public_key.urls[0];
            const publicKey = await (await fetch(pubKeyUrl)).text();
            const crsUrl = data.response.crs['2048'].urls[0];
            const crs2048 = await (await fetch(crsUrl)).text();
            return {
                publicKey: nodeTfhe.TfheCompactPublicKey.deserialize(fromHexString(publicKey)),
                publicParams: {
                    2048: nodeTfhe.CompactPkePublicParams.deserialize(fromHexString(crs2048)),
                },
            };
        }
        else {
            throw new Error('No public key available');
        }
    }
    catch (error) {
        console.log('error', error);
        throw new Error('Impossible to fetch public key: wrong gateway url.');
    }
};

var abi = [
	{
		inputs: [
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "target",
				type: "address"
			}
		],
		name: "AddressEmptyCode",
		type: "error"
	},
	{
		inputs: [
		],
		name: "ECDSAInvalidSignature",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "length",
				type: "uint256"
			}
		],
		name: "ECDSAInvalidSignatureLength",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "s",
				type: "bytes32"
			}
		],
		name: "ECDSAInvalidSignatureS",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "implementation",
				type: "address"
			}
		],
		name: "ERC1967InvalidImplementation",
		type: "error"
	},
	{
		inputs: [
		],
		name: "ERC1967NonPayable",
		type: "error"
	},
	{
		inputs: [
		],
		name: "FailedInnerCall",
		type: "error"
	},
	{
		inputs: [
		],
		name: "InvalidInitialization",
		type: "error"
	},
	{
		inputs: [
		],
		name: "NotInitializing",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "OwnableInvalidOwner",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "OwnableUnauthorizedAccount",
		type: "error"
	},
	{
		inputs: [
		],
		name: "UUPSUnauthorizedCallContext",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "slot",
				type: "bytes32"
			}
		],
		name: "UUPSUnsupportedProxiableUUID",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
		],
		name: "EIP712DomainChanged",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "uint64",
				name: "version",
				type: "uint64"
			}
		],
		name: "Initialized",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferStarted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "signer",
				type: "address"
			}
		],
		name: "SignerAdded",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "signer",
				type: "address"
			}
		],
		name: "SignerRemoved",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "implementation",
				type: "address"
			}
		],
		name: "Upgraded",
		type: "event"
	},
	{
		inputs: [
		],
		name: "UPGRADE_INTERFACE_VERSION",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "acceptOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "signer",
				type: "address"
			}
		],
		name: "addSigner",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "eip712Domain",
		outputs: [
			{
				internalType: "bytes1",
				name: "fields",
				type: "bytes1"
			},
			{
				internalType: "string",
				name: "name",
				type: "string"
			},
			{
				internalType: "string",
				name: "version",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "chainId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "verifyingContract",
				type: "address"
			},
			{
				internalType: "bytes32",
				name: "salt",
				type: "bytes32"
			},
			{
				internalType: "uint256[]",
				name: "extensions",
				type: "uint256[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getSigners",
		outputs: [
			{
				internalType: "address[]",
				name: "",
				type: "address[]"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getThreshold",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "getVersion",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "pure",
		type: "function"
	},
	{
		inputs: [
		],
		name: "get_DECRYPTIONRESULT_TYPE",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "initialOwner",
				type: "address"
			}
		],
		name: "initialize",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "isSigner",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pendingOwner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "proxiableUUID",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "signer",
				type: "address"
			}
		],
		name: "removeSigner",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newImplementation",
				type: "address"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "upgradeToAndCall",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "aclAddress",
				type: "address"
			},
			{
				internalType: "uint256[]",
				name: "handlesList",
				type: "uint256[]"
			},
			{
				internalType: "bytes",
				name: "decryptedResult",
				type: "bytes"
			},
			{
				internalType: "bytes[]",
				name: "signatures",
				type: "bytes[]"
			}
		],
		name: "verifySignatures",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "nonpayable",
		type: "function"
	}
];

const getProvider = (config) => {
    if (config.networkUrl) {
        return new ethers.JsonRpcProvider(config.networkUrl);
    }
    else if (config.network) {
        return new ethers.BrowserProvider(config.network);
    }
    throw new Error('You must provide a network URL or a EIP1193 object (eg: window.ethereum)');
};
const getChainId = async (provider, config) => {
    if (config.chainId && typeof config.chainId === 'number') {
        return config.chainId;
    }
    else if (config.chainId && typeof config.chainId !== 'number') {
        throw new Error('chainId must be a number.');
    }
    else {
        const chainId = (await provider.getNetwork()).chainId;
        return Number(chainId);
    }
};
const getTfheCompactPublicKey = async (config) => {
    if (config.gatewayUrl && !config.publicKey) {
        const inputs = await getKeysFromGateway(cleanURL(config.gatewayUrl));
        return inputs.publicKey;
    }
    else if (config.publicKey) {
        const buff = fromHexString(config.publicKey);
        try {
            return nodeTfhe.TfheCompactPublicKey.deserialize(buff);
        }
        catch (e) {
            throw new Error('Invalid public key (deserialization failed)');
        }
    }
    else {
        throw new Error('You must provide a public key.');
    }
};
const getPublicParams = async (config) => {
    if (config.gatewayUrl && !config.publicParams) {
        const inputs = await getKeysFromGateway(cleanURL(config.gatewayUrl));
        return inputs.publicParams;
    }
    else if (config.publicParams && config.publicParams['2048']) {
        const buff = fromHexString(config.publicParams['2048']);
        try {
            return {
                '2048': nodeTfhe.CompactPkePublicParams.deserialize(buff),
            };
        }
        catch (e) {
            throw new Error('Invalid public key (deserialization failed)');
        }
    }
    else {
        throw new Error('You must provide a valid CRS.');
    }
};
const getKMSSignatures = async (provider, config) => {
    const kmsContract = new ethers.Contract(config.kmsContractAddress, abi, provider);
    const signatures = await kmsContract.getSigners();
    return signatures;
};

const checkEncryptedValue = (value, bits) => {
    if (value == null)
        throw new Error('Missing value');
    let limit;
    if (bits >= 8) {
        limit = BigInt(`0x${new Array(bits / 8).fill(null).reduce((v) => `${v}ff`, '')}`);
    }
    else {
        limit = BigInt(2 ** bits - 1);
    }
    if (typeof value !== 'number' && typeof value !== 'bigint')
        throw new Error('Value must be a number or a bigint.');
    if (value > limit) {
        throw new Error(`The value exceeds the limit for ${bits}bits integer (${limit.toString()}).`);
    }
};
const createEncryptedInput = (aclContractAddress, chainId, gateway, tfheCompactPublicKey, publicParams) => (contractAddress, callerAddress) => {
    if (!ethers.isAddress(contractAddress)) {
        throw new Error('Contract address is not a valid address.');
    }
    if (!ethers.isAddress(callerAddress)) {
        throw new Error('User address is not a valid address.');
    }
    const publicKey = tfheCompactPublicKey;
    const bits = [];
    const builder = nodeTfhe.CompactCiphertextList.builder(publicKey);
    const checkLimit = (added) => {
        if (bits.reduce((acc, val) => acc + Math.max(2, val), 0) + added > 2048) {
            throw Error('Packing more than 2048 bits in a single input ciphertext is unsupported');
        }
        if (bits.length + 1 > 256)
            throw Error('Packing more than 256 variables in a single input ciphertext is unsupported');
    };
    return {
        addBool(value) {
            if (value == null)
                throw new Error('Missing value');
            if (typeof value !== 'boolean' &&
                typeof value !== 'number' &&
                typeof value !== 'bigint')
                throw new Error('The value must be a boolean, a number or a bigint.');
            if ((typeof value !== 'bigint' || typeof value !== 'number') &&
                Number(value) > 1)
                throw new Error('The value must be 1 or 0.');
            checkEncryptedValue(Number(value), 1);
            checkLimit(2);
            builder.push_boolean(!!value);
            bits.push(1); // ebool takes 2 encrypted bits
            return this;
        },
        add4(value) {
            checkEncryptedValue(value, 4);
            checkLimit(4);
            builder.push_u4(Number(value));
            bits.push(4);
            return this;
        },
        add8(value) {
            checkEncryptedValue(value, 8);
            checkLimit(8);
            builder.push_u8(Number(value));
            bits.push(8);
            return this;
        },
        add16(value) {
            checkEncryptedValue(value, 16);
            checkLimit(16);
            builder.push_u16(Number(value));
            bits.push(16);
            return this;
        },
        add32(value) {
            checkEncryptedValue(value, 32);
            checkLimit(32);
            builder.push_u32(Number(value));
            bits.push(32);
            return this;
        },
        add64(value) {
            checkEncryptedValue(value, 64);
            checkLimit(64);
            builder.push_u64(BigInt(value));
            bits.push(64);
            return this;
        },
        add128(value) {
            checkEncryptedValue(value, 128);
            checkLimit(128);
            builder.push_u128(BigInt(value));
            bits.push(128);
            return this;
        },
        addAddress(value) {
            if (!ethers.isAddress(value)) {
                throw new Error('The value must be a valid address.');
            }
            checkLimit(160);
            builder.push_u160(BigInt(value));
            bits.push(160);
            return this;
        },
        add256(value) {
            checkEncryptedValue(value, 256);
            checkLimit(256);
            builder.push_u256(BigInt(value));
            bits.push(256);
            return this;
        },
        addBytes64(value) {
            if (value.length !== 64)
                throw Error('Uncorrect length of input Uint8Array, should be 64 for an ebytes64');
            const bigIntValue = bytesToBigInt(value);
            checkEncryptedValue(bigIntValue, 512);
            checkLimit(512);
            builder.push_u512(bigIntValue);
            bits.push(512);
            return this;
        },
        addBytes128(value) {
            if (value.length !== 128)
                throw Error('Uncorrect length of input Uint8Array, should be 128 for an ebytes128');
            const bigIntValue = bytesToBigInt(value);
            checkEncryptedValue(bigIntValue, 1024);
            checkLimit(1024);
            builder.push_u1024(bigIntValue);
            bits.push(1024);
            return this;
        },
        addBytes256(value) {
            if (value.length !== 256)
                throw Error('Uncorrect length of input Uint8Array, should be 256 for an ebytes256');
            const bigIntValue = bytesToBigInt(value);
            checkEncryptedValue(bigIntValue, 2048);
            checkLimit(2048);
            builder.push_u2048(bigIntValue);
            bits.push(2048);
            return this;
        },
        getBits() {
            return bits;
        },
        async encrypt() {
            const getKeys = (obj) => Object.keys(obj);
            const totalBits = bits.reduce((total, v) => total + v, 0);
            // const ppTypes = getKeys(publicParams);
            const ppTypes = getKeys(publicParams);
            const closestPP = ppTypes.find((k) => Number(k) >= totalBits);
            if (!closestPP) {
                throw new Error(`Too many bits in provided values. Maximum is ${ppTypes[ppTypes.length - 1]}.`);
            }
            const pp = publicParams[closestPP];
            const buffContract = fromHexString(contractAddress);
            const buffUser = fromHexString(callerAddress);
            const buffAcl = fromHexString(aclContractAddress);
            const buffChainId = fromHexString(chainId.toString(16));
            const auxData = new Uint8Array(buffContract.length +
                buffUser.length +
                buffAcl.length +
                buffChainId.length);
            auxData.set(buffContract, 0);
            auxData.set(buffUser, 20);
            auxData.set(buffAcl, 40);
            auxData.set(buffChainId, 60);
            const encrypted = builder.build_with_proof_packed(pp, auxData, nodeTfhe.ZkComputeLoad.Verify);
            const ciphertext = encrypted.safe_serialize(SERIALIZED_SIZE_LIMIT_CIPHERTEXT);
            const prehandle = new sha3.Keccak(256)
                .update(Buffer.from(ciphertext))
                .digest();
            return {
                // This fork of fhevmjs only supports one prehandle and ciphertext at a time.
                prehandle,
                ciphertext,
            };
        },
    };
};

const createEIP712 = (chainId) => (publicKey, verifyingContract, delegatedAccount) => {
    if (!web3Validator.isAddress(verifyingContract))
        throw new Error('Invalid contract address.');
    if (delegatedAccount && !web3Validator.isAddress(delegatedAccount))
        throw new Error('Invalid delegated account.');
    const msgParams = {
        types: {
            // This refers to the domain the contract is hosted on.
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
            ],
            // Refer to primaryType.
            Reencrypt: [{ name: 'publicKey', type: 'bytes' }],
        },
        // This defines the message you're proposing the user to sign, is dapp-specific, and contains
        // anything you want. There are no required fields. Be as explicit as possible when building out
        // the message schema.
        // This refers to the keys of the following types object.
        primaryType: 'Reencrypt',
        domain: {
            // Give a user-friendly name to the specific contract you're signing for.
            name: 'Authorization token',
            // This identifies the latest version.
            version: '1',
            // This defines the network, in this case, Mainnet.
            chainId,
            // // Add a verifying contract to make sure you're establishing contracts with the proper entity.
            verifyingContract,
        },
        message: {
            publicKey: `0x${publicKey}`,
        },
    };
    if (delegatedAccount) {
        msgParams.message.delegatedAccount = delegatedAccount;
        msgParams.types.Reencrypt.push({
            name: 'delegatedAccount',
            type: 'address',
        });
    }
    return msgParams;
};
const generateKeypair = () => {
    const keypair = nodeTkms.cryptobox_keygen();
    return {
        publicKey: toHexString(nodeTkms.cryptobox_pk_to_u8vec(nodeTkms.cryptobox_get_pk(keypair))),
        privateKey: toHexString(nodeTkms.cryptobox_sk_to_u8vec(keypair)),
    };
};

const reencryptRequest = (kmsSignatures, chainId, kmsContractAddress, gatewayUrl) => async (handle, privateKey, publicKey, signature, contractAddress, userAddress) => {
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
        pubKey = nodeTkms.u8vec_to_cryptobox_pk(fromHexString(publicKey));
        privKey = nodeTkms.u8vec_to_cryptobox_sk(fromHexString(privateKey));
    }
    catch (e) {
        throw new Error('Invalid public or private key');
    }
    let json;
    try {
        const response = await fetch(`${gatewayUrl}reencrypt`, options);
        json = await response.json();
    }
    catch (e) {
        throw new Error("Gateway didn't response correctly");
    }
    const client = nodeTkms.new_client(kmsSignatures, userAddress, 'default');
    try {
        const eip712Domain = {
            name: 'Authorization token',
            version: '1',
            chain_id: chainId,
            verifying_contract: kmsContractAddress,
            salt: [],
        };
        const decryption = nodeTkms.process_reencryption_resp_from_js(client, payload, eip712Domain, json.response, pubKey, privKey, true);
        return bytesToBigInt(decryption);
    }
    catch (e) {
        throw new Error('An error occured during decryption');
    }
};

const createInstance = async (config) => {
    const { publicKey, kmsContractAddress, aclContractAddress } = config;
    if (!kmsContractAddress || !ethers.isAddress(kmsContractAddress)) {
        throw new Error('KMS contract address is not valid or empty');
    }
    if (!aclContractAddress || !ethers.isAddress(aclContractAddress)) {
        throw new Error('ACL contract address is not valid or empty');
    }
    if (publicKey && typeof publicKey !== 'string')
        throw new Error('publicKey must be a string');
    const provider = getProvider(config);
    if (!provider) {
        throw new Error('No network has been provided!');
    }
    const chainId = await getChainId(provider, config);
    const tfheCompactPublicKey = await getTfheCompactPublicKey(config);
    const pkePublicParams = await getPublicParams(config);
    return {
        createEncryptedInput: createEncryptedInput(aclContractAddress, chainId, cleanURL(config.gatewayUrl), tfheCompactPublicKey, pkePublicParams),
        generateKeypair,
        createEIP712: createEIP712(chainId),
        reencrypt: reencryptRequest([], chainId, kmsContractAddress, cleanURL(config.gatewayUrl)),
        getPublicKey: () => publicKey || null,
        getPublicParams: () => pkePublicParams || null,
    };
};

const createTfheKeypair = () => {
    const block_params = new nodeTfhe.ShortintParameters(nodeTfhe.ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS);
    const casting_params = new nodeTfhe.ShortintCompactPublicKeyEncryptionParameters(nodeTfhe.ShortintCompactPublicKeyEncryptionParametersName.SHORTINT_PARAM_PKE_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M64);
    const config = nodeTfhe.TfheConfigBuilder.default()
        .use_custom_parameters(block_params)
        .use_dedicated_compact_public_key_parameters(casting_params)
        .build();
    let clientKey = nodeTfhe.TfheClientKey.generate(config);
    let publicKey = nodeTfhe.TfheCompactPublicKey.new(clientKey);
    const crs = nodeTfhe.CompactPkeCrs.from_config(config, 4 * 512);
    return { clientKey, publicKey, crs };
};
const createTfhePublicKey = () => {
    const { publicKey } = createTfheKeypair();
    return toHexString(publicKey.serialize());
};

exports.clientKeyDecryptor = clientKeyDecryptor;
exports.createEIP712 = createEIP712;
exports.createEncryptedInput = createEncryptedInput;
exports.createInstance = createInstance;
exports.createTfheKeypair = createTfheKeypair;
exports.createTfhePublicKey = createTfhePublicKey;
exports.generateKeypair = generateKeypair;
exports.getChainId = getChainId;
exports.getCiphertextCallParams = getCiphertextCallParams;
exports.getKMSSignatures = getKMSSignatures;
exports.getProvider = getProvider;
exports.getPublicParams = getPublicParams;
exports.getTfheCompactPublicKey = getTfheCompactPublicKey;
