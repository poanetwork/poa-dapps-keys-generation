function createKeys(web3, keys, contractAddr, abi) {
  console.log("***Create keys function***");
  let KeysStorage = attachToContract(web3, abi, contractAddr)
  console.log("attach to oracles contract");
  if (!KeysStorage) {
    return console.log("KeysStorage contract is undefined");
  }

  var gasPrice = web3.utils.toWei(new web3.utils.BN(1), 'gwei')
  var opts = {from: web3.eth.defaultAccount, gasPrice: gasPrice}

  console.log(opts);
  console.log("0x" + keys.miningKey.miningKeyObject.address, 
    "0x" + keys.payoutKey.payoutKeyObject.address, 
    "0x" + keys.votingKey.votingKeyObject.address)
  
  return KeysStorage.methods.createKeys("0x" + keys.miningKey.miningKeyObject.address, 
    "0x" + keys.payoutKey.payoutKeyObject.address, 
    "0x" + keys.votingKey.votingKeyObject.address
  ).send(opts)
  /*.on('error', error => {
    return cb(txHash, error);
  })
  .on('transactionHash', _txHash => {
    console.log("contract method transaction: " + _txHash);
    txHash = _txHash;
  })
  .on('receipt', receipt => {
    return cb(txHash)
  });*/
}