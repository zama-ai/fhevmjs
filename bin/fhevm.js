#!/usr/bin/env node
'use strict';

import { program } from 'commander';
import { toHexString, prependHttps, throwError } from './utils.js';
import { createInstance, getChainIdFromNetwork } from '../lib/node.cjs';

const allowedBits = [8, 16, 32, 64];

const FHE_LIB_ADDRESS = '0x000000000000000000000000000000000000005d';

let _instance;

const getInstance = async (networkUrl) => {
  if (_instance) return _instance;

  try {
    _instance = await createInstance({ networkUrl });
  } catch (e) {
    return throwError(
      "This network doesn't seem to use fhEVM or use an incompatible version.",
    );
  }
  return _instance;
};

program
  .command('encrypt')
  .argument('[bits]', 'numbers of bits for values eg: [1,64]')
  .argument('[values]', 'integers to encrypt eg: [1,39320]')
  .action(async (bitsArr, valuesArr, options) => {
    const host = prependHttps(options.node);
    const instance = await getInstance(host);
    const encryptedInput = instance.createEncryptedInput();
    bitsArr.forEach((bits, i) => {
      if (!allowedBits.includes(+bits)) throwError('Invalid number of bits');
      const suffix = bits === 1 ? 'Bool' : bits === '160' ? 'Address' : bits;
      encryptedInput[`add${suffix}`](parseInt(values[i], 10));
    });
    const result = await encryptedInput.encrypt();

    console.log('Input proof:');
    console.log(`0x${toHexString(result.inputProof)}`);
    console.log('Handles:');
    result.handles.forEach((handle, i) => {
      console.log(`Handle ${i}`);
      console.log(`0x${toHexString(handle)}`);
    });
  })
  .requiredOption('-n, --node <url>', 'url of the blockchain');

program.parseAsync(process.argv);
