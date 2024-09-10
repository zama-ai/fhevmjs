import { CompactPkePublicParams, TfheCompactPublicKey } from 'node-tfhe';
import { fromHexString } from '../utils';

export const getInputsFromGateway = async (url: string) => {
  try {
    const response = await fetch(`${url}/inputs`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return {
        publicKey: TfheCompactPublicKey.deserialize(
          fromHexString(data.publicKey),
        ),
        publicParams: {
          2048: CompactPkePublicParams.deserialize(
            fromHexString(data.publicParams[2048]),
            false,
            false,
          ),
        },
      };
    } else {
      throw new Error('No public key available');
    }
  } catch (error) {
    throw new Error('Impossible to fetch public key: wrong gateway url.');
  }
};
