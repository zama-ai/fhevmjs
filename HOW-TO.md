# Dependency update

## Updating TFHE-RS

Steps:

1. Modify `package.json`.
2. Optional update `tkms` packages
3. Regen lock file `package-lock.json`, by running `npm install`
4. Update the code if needed
5. Update the keys if needed (e.g. for crypto-parameters changes, serialization changes), by running `./generateKeys.js`
6. Either push a PR to verify everything is green or test locally
   a. npm test
   b. npm run build
