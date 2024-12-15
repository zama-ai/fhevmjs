export const changeLoadingWorker = (basePath) => ({
  name: 'regex-replace', // name of the plugin
  enforce: 'pre', // run before other plugins
  transform(code, id) {
    // Only apply transformations to .js files (or other specific conditions)
    if (id.endsWith('.js')) {
      // const worker = new Worker(
      //   new URL('workerHelpers.worker.js', import.meta.url),
      //   {
      //     type: 'module',
      //   },
      // );
      const searchValue =
        /const worker = new Worker\(\s*new URL\(['"]\.?\/?workerHelpers\.worker\.js['"],\s*import\.meta\.url\),\s*\{\s*type:\s*'module',?\s*\},?\s*\);/;

      const replacement = `let worker;
        try {
          worker = new Worker(
            new URL('./workerHelpers.worker.js', import.meta.url),
            {
              type: 'module'
            }
          );
        } catch (e) {
          const r = await fetch('${basePath}workerHelpers.worker.js');
          const blob = await r.blob();
          const blobUrl = URL.createObjectURL(blob);
          worker = new Worker(blobUrl);
        }`;

      // Replace occurrences according to the regex pattern
      const newCode = code.replace(searchValue, replacement);

      return {
        code: newCode,
        map: null, // provide source map if available or required
      };
    }
    // Return null to signify no transformation for non-JS files or uninterested files
    return null;
  },
});

const wasmPattern = /'([a-zA-Z0-9_]+)\.wasm'/g;

export const ignoreURL = (basePath) => ({
  name: 'regex-replace', // name of the plugin
  enforce: 'pre', // run before other plugins
  transform(code, id) {
    // Only apply transformations to .js files (or other specific conditions)
    if (id.endsWith('.js')) {
      const pattern = wasmPattern; // Your regex pattern here
      const replacement = `/* @vite-ignore */ '${basePath}$1.wasm'`; // Your replacement string here

      // Replace occurrences according to the regex pattern
      // const newCode = code.replace(pattern, replacement);
      const newCode = code.replace(wasmPattern, replacement);

      return {
        code: newCode,
        map: null, // provide source map if available or required
      };
    }
    // Return null to signify no transformation for non-JS files or uninterested files
    return null;
  },
});