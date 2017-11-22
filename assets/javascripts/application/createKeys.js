function createKeys(web3, keys, contractAddr, abi, cb) {
  console.log("***Create keys function***");
  attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
    console.log("attach to oracles contract");
    if (err) {
      console.log(err)
      return cb();
    }

    console.log(keys);
    var txHash;
    var gasPrice = web3.utils.toWei(new web3.utils.BN(1), 'gwei')
    var opts = {from: web3.eth.defaultAccount, gasPrice: gasPrice}
    
    oraclesContract.methods.createKeys("0x" + keys.miningKey.miningKeyObject.address, 
      "0x" + keys.payoutKey.payoutKeyObject.address, 
      "0x" + keys.votingKey.votingKeyObject.address
    ).send(opts).on('error', error => {
      return cb(txHash, error);
    })
    .on('transactionHash', _txHash => {
      console.log("contract method transaction: " + _txHash);
      txHash = _txHash;
    })
    .on('receipt', receipt => {
      return cb(txHash)
    });
  });
}