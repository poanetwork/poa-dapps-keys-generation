function checkInitialKey(web3, initialKey, contractAddr, abi, cb) {
  let oraclesContract = attachToContract(web3, abi, contractAddr)
  console.log("attach to oracles contract");
  if (!oraclesContract) {
    return cb();
  }

  oraclesContract.methods.checkInitialKey(initialKey).call(function(isNew) {
    cb(isNew);
  })
}