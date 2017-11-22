function addValidator(web3, validatorViewObj, contractAddr, abi, cb) {
  console.log("***Add validator function***");
  attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
    console.log("attach to oracles contract");
    if (err) {
      console.log(err)
      return cb();
    }

    console.log(validatorViewObj);
    console.log(oraclesContract);
    
    oraclesContract.addValidator.sendTransaction(
      validatorViewObj.miningKey, 
      validatorViewObj.zip, 
      validatorViewObj.licenseID,
      validatorViewObj.licenseExpiredAt,
      validatorViewObj.fullName,
      validatorViewObj.streetName,
      validatorViewObj.state,
      function(err, txHash) {
        if (err) {
          cb(txHash, err);
          return;
        }
        cb(txHash);
    });
  });
}