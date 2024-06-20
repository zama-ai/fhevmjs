/* istanbul ignore file */
import { toHexString } from './utils';

export function decodeAbiBytes(hex: string): Uint8Array {
  if (hex.startsWith('0x')) {
    hex = hex.substring(2);
  }
  // The data offset is the first 32 bytes, which points to the start of the data (skip this part)
  const dataOffset = parseInt(hex.substring(0, 64), 16) * 2; // Convert offset from bytes to characters

  // The length of the data is the next 32 bytes, starting from the offset
  const dataLength =
    parseInt(hex.substring(dataOffset, dataOffset + 64), 16) * 2; // Convert length from bytes to characters

  // Extract the data
  const data = hex.substring(dataOffset + 64, dataOffset + 64 + dataLength);

  // Convert the extracted data from hex to Uint8Array
  const bytes = new Uint8Array(data.length / 2);
  for (let i = 0, j = 0; i < data.length; i += 2, j++) {
    bytes[j] = parseInt(data.substring(i, i + 2), 16);
  }

  return bytes;
}

export const fetchJSONRPC = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.result) {
      // The result is usually prefixed with '0x' and is in hex format
      const hexResult = data.result;
      if (typeof hexResult == 'object') {
        return hexResult;
      }
      const decodedBytes = decodeAbiBytes(hexResult);
      return `0x${toHexString(decodedBytes)}`;
    } else {
      console.error('No result from blockchain call');
    }
  } catch (error) {
    console.error('Error performing eth_call:', error);
  }
};
