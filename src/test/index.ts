import {
  CompactPkePublicParams,
  TfheClientKey,
  TfheCompactPublicKey,
} from 'node-tfhe';
import fs from 'fs';

const privKey = fs.readFileSync(`${__dirname}/keys/privateKey.bin`);
const pubKey = fs.readFileSync(`${__dirname}/keys/publicKey.bin`);
const params128 = fs.readFileSync(`${__dirname}/keys/crs128.bin`);
const params256 = fs.readFileSync(`${__dirname}/keys/crs256.bin`);
const params512 = fs.readFileSync(`${__dirname}/keys/crs512.bin`);
const params1024 = fs.readFileSync(`${__dirname}/keys/crs1024.bin`);
const params2048 = fs.readFileSync(`${__dirname}/keys/crs2048.bin`);

export const privateKey = TfheClientKey.deserialize(privKey);
export const publicKey = TfheCompactPublicKey.deserialize(pubKey);
export const publicParams = {
  128: CompactPkePublicParams.deserialize(params128),
  256: CompactPkePublicParams.deserialize(params256),
  512: CompactPkePublicParams.deserialize(params512),
  1024: CompactPkePublicParams.deserialize(params1024),
  2048: CompactPkePublicParams.deserialize(params2048),
};
