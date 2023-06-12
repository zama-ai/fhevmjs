import {
  TfheCompactPublicKey,
  TfheConfigBuilder,
  TfheClientKey,
  FheUint32,
  ShortintParameters,
  ShortintParametersName,
} from 'node-tfhe';

export const encryptInteger = (value: number, publicKey: TfheCompactPublicKey) => {
  let encrypted = FheUint32.encrypt_with_compact_public_key(value, publicKey);
  return encrypted;
};

export const createTFHEKey = () => {
  const block_params = new ShortintParameters(ShortintParametersName.PARAM_SMALL_MESSAGE_2_CARRY_2_COMPACT_PK);
  let config = TfheConfigBuilder.all_disabled().enable_custom_integers(block_params).build();
  let clientKey = TfheClientKey.generate(config);
  let publicKey = TfheCompactPublicKey.new(clientKey);
  return { publicKey, clientKey };
};
