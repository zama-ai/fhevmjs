#!/usr/bin/env node
'use strict';

import { JsonRpcProvider } from 'ethers';
import { program } from 'commander';
import { toHexString, prependHttps, throwError } from './utils.js';
import { createInstance } from '../lib/node.cjs';

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

  // Get blockchain public key
  const publicKey = await provider.call({
    to: '0x0000000000000000000000000000000000000044',
  });

  // Create instance
  _instance = createInstance({ chainId, publicKey });
  return _instance;
};

program
  .command('encrypt')
  .argument('<bits>', 'number of bits (8, 16, 32)')
  .argument('<value>', 'integer to encrypt')
  .action(async (bits, value, options) => {
    const host = prependHttps(options.node);
    const provider = new JsonRpcProvider(host);
    const instance = await getInstance(provider);
    const result = instance[`encrypt${bits}`](parseInt(value, 10));
    console.log(`0x${toHexString(result)}`);
  })
  .requiredOption('-n, --node <url>', 'url of the blockchain');

program.parseAsync(process.argv);
