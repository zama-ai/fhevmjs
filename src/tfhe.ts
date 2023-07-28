import {
  TfheCompactPublicKey,
  TfheConfigBuilder,
  TfheClientKey,
  ShortintParameters,
  ShortintParametersName,
} from 'node-tfhe';
import { toHexString } from './utils';

export const createTfheKeypair = () => {
  const block_params = new ShortintParameters(
    ShortintParametersName.PARAM_SMALL_MESSAGE_2_CARRY_2_COMPACT_PK,
  );
  let config = TfheConfigBuilder.all_disabled()
    .enable_custom_integers(block_params)
    .build();
  let clientKey = TfheClientKey.generate(config);
  let publicKey = TfheCompactPublicKey.new(clientKey);
  publicKey = TfheCompactPublicKey.deserialize(publicKey.serialize());
  return { clientKey, publicKey };
};

export const createTfhePublicKey = (): string => {
  const { publicKey } = createTfheKeypair();
  return toHexString(publicKey.serialize());
};
