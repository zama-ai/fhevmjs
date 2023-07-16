/* Use this file to declare any custom file extensions for importing */
/* Use this folder to also add/extend a package d.ts file, if needed. */
declare module '*.wasm' {
  const ref: () => Promise<WebAssembly.Instance>;
  export default ref;
}
