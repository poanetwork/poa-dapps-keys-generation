function checkInitialKey(web3, initialKey, contractAddr, abi, cb) {
  let KeysStorage = attachToContract(web3, abi, contractAddr)
  console.log("attach to oracles contract");
  if (!KeysStorage) {
    return cb();
  }

  KeysStorage.methods.checkInitialKey(initialKey).call(function(isNew) {
    cb(isNew);
  })
}