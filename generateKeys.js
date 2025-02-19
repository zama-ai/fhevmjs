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

// copied from src/utils.ts
export const SERIALIZED_SIZE_LIMIT_PK = BigInt(1024 * 1024 * 512);
export const SERIALIZED_SIZE_LIMIT_CRS = BigInt(1024 * 1024 * 512);

const createTfheKeypair = () => {
  const block_params = new ShortintParameters(
    ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M128,
  );
  const casting_params = new ShortintCompactPublicKeyEncryptionParameters(
    ShortintCompactPublicKeyEncryptionParametersName.V1_0_PARAM_PKE_MESSAGE_2_CARRY_2_KS_PBS_TUNIFORM_2M128,
  );
  const config = TfheConfigBuilder.default()
    .use_custom_parameters(block_params)
    .use_dedicated_compact_public_key_parameters(casting_params)
    .build();
  let clientKey = TfheClientKey.generate(config);
  let publicKey = TfheCompactPublicKey.new(clientKey);
  fs.writeFileSync(
    'src/test/keys/publicKey.bin',
    publicKey.safe_serialize(SERIALIZED_SIZE_LIMIT_PK),
  );
  fs.writeFileSync(
    'src/test/keys/privateKey.bin',
    clientKey.safe_serialize(SERIALIZED_SIZE_LIMIT_PK),
  );
  const crs0 = CompactPkeCrs.from_config(config, 4 * 32);
  fs.writeFileSync(
    'src/test/keys/crs128.bin',
    crs0.safe_serialize(SERIALIZED_SIZE_LIMIT_CRS),
  );
  const crs1 = CompactPkeCrs.from_config(config, 4 * 64);
  fs.writeFileSync(
    'src/test/keys/crs256.bin',
    crs1.safe_serialize(SERIALIZED_SIZE_LIMIT_CRS),
  );
  const crs2 = CompactPkeCrs.from_config(config, 4 * 128);
  fs.writeFileSync(
    'src/test/keys/crs512.bin',
    crs2.safe_serialize(SERIALIZED_SIZE_LIMIT_CRS),
  );
  const crs3 = CompactPkeCrs.from_config(config, 4 * 256);
  fs.writeFileSync(
    'src/test/keys/crs1024.bin',
    crs3.safe_serialize(SERIALIZED_SIZE_LIMIT_CRS),
  );
  const crs4 = CompactPkeCrs.from_config(config, 4 * 512);
  fs.writeFileSync(
    'src/test/keys/crs2048.bin',
    crs4.safe_serialize(SERIALIZED_SIZE_LIMIT_CRS),
  );
};

createTfheKeypair();
