function addValidator(web3, validatorViewObj, contractAddr, abi) {
  console.log("***Add validator function***");
  let ValidatorsManager = attachToContract(web3, abi, contractAddr)
  console.log("attach to oracles contract");
  if (!ValidatorsManager) {
    return cb();
  }

  console.log(validatorViewObj);
  
  var gasPrice = web3.utils.toWei(new web3.utils.BN(1), 'gwei')
  var opts = {from: web3.eth.defaultAccount, gasPrice: gasPrice}
  
  return ValidatorsManager.methods.insertValidatorFromCeremony(
      validatorViewObj.miningKey, 
      validatorViewObj.zip, 
      validatorViewObj.licenseExpiredAt,
      validatorViewObj.licenseID,
      validatorViewObj.fullName,
      validatorViewObj.streetName,
      validatorViewObj.state
    )
  .send(opts)
  /*.on('transactionHash', _txHash => {
    console.log("contract method transaction: " + _txHash);
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log(confirmation)
  })
  .on('receipt', receipt => {
    console.log(receipt)
    cb(receipt.transactionHash)
  })
  .on('error', error => {
    cb(txHash, error);
  });*/
}