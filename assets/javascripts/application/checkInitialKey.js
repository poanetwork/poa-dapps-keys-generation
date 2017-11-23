function checkInitialKey(web3, func, initialKey, contractAddr, abi, cb) {
  attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
    console.log("attach to oracles contract");
    if (err) {
      console.log(err)
      return cb();
    }

    oraclesContract.methods.checkInitialKey(initialKey).call(function(err, isNew) {
      if (err) {
        console.log(err)
      }
      cb(isNew);
    })
  })
}