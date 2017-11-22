function createKeys(web3, keys, contractAddr, abi, cb) {
  console.log("***Create keys function***");
  attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
    console.log("attach to oracles contract");
    if (err) {
      console.log(err)
      return cb();
    }

    console.log(keys);
    
    oraclesContract.createKeys.sendTransaction(
      "0x" + keys.miningKey.miningKeyObject.address, 
      "0x" + keys.payoutKey.payoutKeyObject.address, 
      "0x" + keys.votingKey.votingKeyObject.address,
      function(err, txHash) {
        if (err) {
          cb(txHash, err);
          return;
        }
        cb(txHash);
    });
  });
}