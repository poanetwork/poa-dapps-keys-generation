function checkInitialKey(web3, initialKey, contractAddr, abi, cb) {
  let KeysStorage = attachToContract(web3, abi, contractAddr)
  console.log("attach to oracles contract");
  if (!KeysStorage) {
    let err = {"code": 500, "title": "Error", "message": "Can't attach to contract"}
    return cb(err);
  }

  console.log(initialKey.toLowerCase())
  return KeysStorage.methods.checkInitialKey(initialKey.toLowerCase()).call({from: web3.eth.defaultAccount});
}