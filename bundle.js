const waitForFunction =
  (functionName) =>
  async (...params) => {
    if (window && window.fhevmjs) {
      return window.fhevmjs[functionName](...params);
    }
  };

const initFhevm = waitForFunction('initFhevm');
const createInstance = waitForFunction('createInstance');

export { initFhevm, createInstance };
