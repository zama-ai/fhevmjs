#!/usr/bin/env node
'use strict';

import { JsonRpcProvider, AbiCoder } from 'ethers';
import { program } from 'commander';
import { toHexString, prependHttps, throwError } from './utils.js';
import { createInstance } from '../lib/node.cjs';

const allowedBits = [8, 16, 32, 64];

const FHE_LIB_ADDRESS = '0x000000000000000000000000000000000000005d';

let _instance;
const getInstance = async (provider) => {
  if (_instance) return _instance;

  // 1. Get chain id
  let network;
  try {
    network = await provider.getNetwork();
  } catch (e) {
    throwError('Network is unreachable');
  }
  const chainId = +network.chainId.toString();
  try {
    const ret = await provider.call({
      to: FHE_LIB_ADDRESS,
      // first four bytes of keccak256('fhePubKey(bytes1)') + 1 byte for library
      data: '0xd9d47bb001',
    });
    const decoded = AbiCoder.defaultAbiCoder().decode(['bytes'], ret);
    const publicKey = decoded[0];
    _instance = await createInstance({ chainId, publicKey });
  } catch (e) {
    return throwError(
      "This network doesn't seem to use fhEVM or use an incompatible version.",
    );
  }
  return _instance;
};

program
  .command('encrypt')
  .argument('<bits>', 'number of bits (4, 8, 16, 32, 64)')
  .argument('<value>', 'integer to encrypt')
  .action(async (bits, value, options) => {
    if (!allowedBits.includes(+bits)) throwError('Invalid number of bits');
    const host = prependHttps(options.node);
    const provider = new JsonRpcProvider(host);
    const instance = await getInstance(provider);
    const result = instance[`encrypt${bits}`](parseInt(value, 10));
    console.log(`0x${toHexString(result)}`);
  })
  .requiredOption('-n, --node <url>', 'url of the blockchain');

program.parseAsync(process.argv);
