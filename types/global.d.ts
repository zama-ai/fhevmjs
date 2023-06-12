/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */
declare module 'libsodium' {
  const ref: any;
  export const crypto_box_keypair: any;
  export default ref;
}
