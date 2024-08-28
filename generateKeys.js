#!/usr/bin/env node

import {
  TfheCompactPublicKey,
  TfheConfigBuilder,
  TfheClientKey,
  ShortintParameters,
  ShortintParametersName,
  CompactPkeCrs,
  ShortintCompactPublicKeyEncryptionParameters,
  ShortintCompactPublicKeyEncryptionParametersName,
} from 'node-tfhe';

import fs from 'fs';

const createTfheKeypair = () => {
  const block_params = new ShortintParameters(
    ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS,
  );
  const casting_params = new ShortintCompactPublicKeyEncryptionParameters(
    ShortintCompactPublicKeyEncryptionParametersName.SHORTINT_PARAM_PKE_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M64,
  );
  const config = TfheConfigBuilder.default()
    .use_custom_parameters(block_params)
    .use_dedicated_compact_public_key_parameters(casting_params)
    .build();
  let clientKey = TfheClientKey.generate(config);
  let publicKey = TfheCompactPublicKey.new(clientKey);
  fs.writeFileSync('src/test/keys/publicKey.bin', publicKey.serialize());
  fs.writeFileSync('src/test/keys/privateKey.bin', clientKey.serialize());
  const crs0 = CompactPkeCrs.from_config(config, 4 * 32);
  fs.writeFileSync(
    'src/test/keys/crs128.bin',
    crs0.public_params().serialize(),
  );
  const crs1 = CompactPkeCrs.from_config(config, 4 * 64);
  fs.writeFileSync(
    'src/test/keys/crs256.bin',
    crs1.public_params().serialize(),
  );
  const crs2 = CompactPkeCrs.from_config(config, 4 * 128);
  fs.writeFileSync(
    'src/test/keys/crs512.bin',
    crs2.public_params().serialize(),
  );
  const crs3 = CompactPkeCrs.from_config(config, 4 * 256);
  fs.writeFileSync(
    'src/test/keys/crs1024.bin',
    crs3.public_params().serialize(),
  );
  const crs4 = CompactPkeCrs.from_config(config, 4 * 512);
  fs.writeFileSync(
    'src/test/keys/crs2048.bin',
    crs4.public_params().serialize(),
  );
};

createTfheKeypair();
