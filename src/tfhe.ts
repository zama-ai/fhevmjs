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
    ShortintParametersName.PARAM_MESSAGE_2_CARRY_2_COMPACT_PK_PBS_KS,
  );
  // const configBuilder = new TfheConfigBuilder();
  // const config = configBuilder.use_custom_parameters(block_params).build();
  const config = TfheConfigBuilder.default()
    .use_custom_parameters(block_params)
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
