//@ts-check
import fetch, { Headers, Request, Response } from 'node-fetch';

if (!global.fetch) {
  global.fetch = fetch as any;
  globalThis.Headers = Headers as any;
  globalThis.Request = Request as any;
  globalThis.Response = Response as any;
}

export * from './sdk';
export * from './tfhe';
export { clientKeyDecryptor } from './utils';
