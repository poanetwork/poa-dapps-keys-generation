function generateAddress(cb) {
  var params = { keyBytes: 32, ivBytes: 16 };

  var dk = keythereum.create(params);

  keythereum.create(params, function (dk) {
    var options = {};
    var password = generatePassword();
    keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options, function (keyObject) {
      console.log(keyObject);
      console.log(JSON.stringify(keyObject));
      cb(keyObject, password);
    });
  });
}

function generatePassword() {
  return passwordGenerator(20, false);
}
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
function showAlert(err, msg) {
	if (!err) {
		swal({
		  title: "Error",
		  text: msg,
		  type: "error"
		});
	}
	else {
		if (err.type != "REQUEST_REJECTED") {
			swal({
			  title: "Error",
			  text: msg,
			  type: "error"
			});
		}
	}
}
function getBalance(address, cb) {
  web3.eth.getBalance(address, function(err, balance) {
    if (err) {
        console.log(err);
        $(".loading-container").hide();
        return;
      }

      cb(balance);
    });
}

function attachToContract(web3, abi, addr) {
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
  
  let contractInstance = new web3.eth.Contract(abi, addr);
  
  return contractInstance;
}
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
//check current network page is connected to. Alerts, if not Oracles network
async function checkNetworkVersion(web3, cb) {
  var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Oracles plugin and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
  let config = await getConfig()
  web3.eth.net.getId().then(function(connectedNetworkID) {
    console.log("connectedNetworkID: " + connectedNetworkID);
    connectedNetworkID = parseInt(connectedNetworkID);
    switch (connectedNetworkID) {
      case 1: {
        console.log('This is mainnet');
        swal("Warning", msgNotOracles, "warning"); 
        return false;
      } break;
      case 2: {
        console.log('This is the deprecated Morden test network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      } break;
      case 3: {
        console.log('This is the ropsten test network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      }  break;
       case config.networkID: {
         console.log('This is Oracles from Metamask');
         return true;
      }  break;
      default: {
        console.log('This is an unknown network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      } break;
    }
  })
}
function toUnifiedLengthLeft(strIn) {//for numbers
  var strOut = "";
  for (var i = 0; i < 64 - strIn.length; i++) {
    strOut += "0"
  }
  strOut += strIn;
  return strOut;
}

function countRows(strIn) {
  var rowsCount = 0;
  if (strIn.length%64 > 0)
    rowsCount = parseInt(strIn.length/64) + 1;
  else
    rowsCount = parseInt(strIn.length/64);
  return rowsCount;
}

function toUnifiedLengthRight(strIn) {//for strings
  var strOut = "";
  strOut += strIn;
  var rowsCount = countRows(strIn);
  for (var i = 0; i < rowsCount*64 - strIn.length; i++) {
    strOut += "0"
  }
  return strOut;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }

    return result
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function toHexString(byteArray) {
  return byteArray.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function bytesCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}
function createKeys(web3, keys, contractAddr, abi) {
  console.log("***Create keys function***");
  let KeysStorage = attachToContract(web3, abi, contractAddr)
  console.log("attach to oracles contract");
  if (!KeysStorage) {
    return cb();
  }

  var gasPrice = web3.utils.toWei(new web3.utils.BN(1), 'gwei')
  var opts = {from: web3.eth.defaultAccount, gasPrice: gasPrice}
  
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
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
//get current account chosen in MetaMask or opened at Parity
function getAccounts(cb) {
	web3.eth.getAccounts(function(err, accounts) {
		if (err) {
			$(".loading-container").hide();
			showAlert(err, err.message);
			return;
		}

		cb(accounts);
	});
}
//gets config file with address of Oracles contract
async function getConfig(cb) {
  	let config = await $.getJSON("./assets/javascripts/config.json")
	return config;
}
//gets web3 object from MetaMask or Parity
async function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Oracles Network. Please, switch on Oracles plugin and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
    var myWeb3 = new Web3(window.web3.currentProvider); 

    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;
    if (!myWeb3) {
      let accounts = await myWeb3.eth.getAccounts()
      myWeb3.eth.defaultAccount = accounts[0].toLowerCase()
    }
    console.log(myWeb3.eth.defaultAccount)

    let isOraclesNetwork = checkNetworkVersion(myWeb3)
    callback(myWeb3, isOraclesNetwork);
  }
}
//launches main application
window.onbeforeunload = function(){
  return 'Are you sure you want to leave?';
};
function startDapp(web3, isOraclesNetwork) {
	$(function() {

		$(".loading-container").hide();
		if (!isOraclesNetwork) return;
		var keys = {
			"miningKey": {},
			"payoutKey": {},
			"votingKey": {}
		};

		getAccounts(async function(accounts) {
			let config = await getConfig()
			getConfigCallBack(web3, accounts, config)
		});

		//getting of config callback
		function getConfigCallBack(web3, accounts, config) {
			//checks if chosen account is valid initial key
			if (accounts.length == 1) {
				checkInitialKey(
					web3,
					web3.eth.defaultAccount,
					config.Ethereum[config.environment].KeysStorage.addr,
					config.Ethereum[config.environment].KeysStorage.abi
				)
				.then(function(_isNew) {
					console.log(_isNew)
					if (!_isNew) swal("Warning", "Current key isn't valid initial key. Please, choose your initial key in MetaMask and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
				})
				.catch(function(err) {
					swal(err.title, err.message, "error")
				})
			} else if (accounts.length == 0) {
				swal("Warning", "You haven't chosen any account in MetaMask. Please, choose your initial key in MetaMask and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
			}

			$(".create-keys-button").click(function() {
			    $("#initialKeySource").click();
			})

			$("#initialKeySource").change({config: config}, initialKeySourceOnChange);
		}

		function initialKeySourceOnChange(ev) {
			initialKeyChosen(this, ev.data.config)
		};

		//triggers, if initial key is chosen
		function initialKeyChosen(el, config) {
			var file = $(el).prop('files')[0];
			$(el).remove();
			var newEl = "<input type='file' id='initialKeySource' />";
	    	$(newEl).change({config: config}, initialKeySourceOnChange).appendTo($(".create-keys"));
			var reader = new FileReader();
		    reader.readAsText(file, "UTF-8");
		    reader.onload = function (evt) {
		    	try {
			        a = JSON.parse(evt.target.result);
			    } catch(e) {
			        return swal("Error", "Invalid key file", "error");
			    }

		        var keyJSON = JSON.parse(evt.target.result); 
		        var address = keyJSON.address;
		        
		        if (!address) return swal("Error", "No address in key file", "error");
		        
		        let initialKey = "0x" + address
		        checkInitialKey(web3,
					initialKey,
					config.Ethereum[config.environment].KeysStorage.addr,
					config.Ethereum[config.environment].KeysStorage.abi
				)
				.then(function(_isNew) {
					if (!_isNew) return swal("Error", "Initial key is already activated or isn't valid", "error");

					$(".loading-container").show();

					setTimeout(function() {
						generateProductionsKeys(config, initialKey);
					}, 500)
				})
				.catch(function(err) {
					swal(err.title, err.message, "error")
				})
		    }
		    reader.onerror = function (evt) {
		    	swal("Error", "Error in reading file", "error");
		    }
		}

		function generateProductionsKeys(config, initialKey) { 
			console.log(config)
			generateAddresses(keys, function(_keys) {
				fillContractData(config, _keys)
				.then(function(reciept) {
					$(".content").hide();
					$('.waiting-container').show();
					$('.waiting-container').empty();
					$('.waiting-container').append("<h2>Adding production keys to Oracles contract...</h2>");
					//activate generated production keys
					createKeys(web3, 
						keys,
						config.Ethereum[config.environment].KeysStorage.addr,
						config.Ethereum[config.environment].KeysStorage.abi
					)
					.then(function(receipt) {
						transferCoinsToPayoutKey(initialKey, _keys);
					})
					.catch(function(err) {
						loadingFinished();
						console.log(err);
						if (err.type != "REQUEST_REJECTED") swal("Error", "Error in addresses addition to contract", "error");
						return;
					})
				})
				.catch(function(err) {
					loadingFinished();
					console.log(err.message);
					if (err.type != "REQUEST_REJECTED") swal("Error", "Error in addresses addition to contract", "error");
					return;
				})
			});
		}

		//validating of initial key callback: async generates 3 addresses: mining, payout, voting
		function generateAddresses(keys, cb) {
			var keysCount = 0;
			for (var i in keys) {
				keysCount++;
			}
			var keysIterator = 0;

			generateAddress(function(_miningKeyObject, password) {
				keysIterator++;
				keys.miningKey = {};
				_miningKeyObject.name = "miningKey";
				keys.miningKey.miningKeyObject = _miningKeyObject;
				keys.miningKey.password = password;

				if (keysIterator == keysCount) cb(keys);
			});
			generateAddress(function(_payoutKeyObject, password) {
				keysIterator++;
				keys.payoutKey = {};
				_payoutKeyObject.name = "payoutKey";
				keys.payoutKey.payoutKeyObject = _payoutKeyObject;
				keys.payoutKey.password = password;

				if (keysIterator == keysCount) cb(keys);
			});
			generateAddress(function(_votingKeyObject, password) {
				keysIterator++;
				keys.votingKey = {};
				_votingKeyObject.name = "votingKey";
				keys.votingKey.votingKeyObject = _votingKeyObject;
				keys.votingKey.password = password;

				if (keysIterator == keysCount) cb(keys);
			});
		}

		//Geeneration of all 3 addresses callback
		function fillContractData(config, keys) {
			$(".content").hide();
			$('.waiting-container').show();
			$('.waiting-container').empty();
			$('.waiting-container').append("<h2>Adding notary's data to Oracles contract...</h2>");
			var validatorViewObj = {
				miningKey: "0x" + keys.miningKey.miningKeyObject.address,
				fullName:  $("#full-name").val(),
				streetName: $("#address").val(),
				state: $("#state").val(),
				zip: $("#zip").val(),
				licenseID: $("#license-id").val(),
				licenseExpiredAt: new Date($("#license-expiration").val()).getTime() / 1000,
			};
			//adds notary personal data to contract
			return addValidator(
				web3, 
				validatorViewObj,
				config.Ethereum[config.environment].ValidatorsManager.addr,
				config.Ethereum[config.environment].ValidatorsManager.abi
			)
		}

		//Production keys addition to contract callback
		function transferCoinsToPayoutKey(initialKey, keys) {
			$(".content").hide();
			$('.waiting-container').show();
			$('.waiting-container').empty();
			$('.waiting-container').append("<h2>Transfering ether from initial key to payout key...</h2>");

			//chain:sends ether to payoutKey
			var to = "0x" + keys.payoutKey.payoutKeyObject.address;
			//gets balance of initial key
			getBalance(initialKey, function(balance) {
				//calculates how many coins we can send from initial key to payout key
				var estimatedGas = new web3.utils.BN(21000);
				var gasPrice = web3.utils.toWei(new web3.utils.BN(1), 'gwei')
				let amountToSend = calculateamountToSend(estimatedGas, gasPrice, balance)
				transferCoinsToPayoutKeyTx(estimatedGas, gasPrice, initialKey, to, amountToSend);
	        });
		}

		function calculateamountToSend(estimatedGas, gasPrice, balance, cb) {
	      	var amountToSend = balance.sub(new web3.utils.BN(20).mul(estimatedGas).mul(gasPrice));
	    	console.log("amountToSend: " + amountToSend);
	    	return amountToSend;
		}

		function transferCoinsToPayoutKeyTx(estimatedGas, gasPrice, initialKey, to, amountToSend) {
			let opts = {
				"gas": estimatedGas, 
				"gasPrice": gasPrice,
				"from": initialKey, 
				"to": to, 
				"value": amountToSend
			}
			console.log(opts)
			web3.eth.sendTransaction(opts)
		    .then(function(receipt){
			    loadingFinished();
				swal("Success", "Keys are created", "success");
				$('.content').empty();
				loadKeysPage();
			}).catch(function(err) {
			    console.log(err);
		        return loadingFinished();
			});
		}

		function loadKeysPage() {
			$('.content').load("./keys.html", function() {
				$("#miningKey").text("0x" + keys.miningKey.miningKeyObject.address);
				$("#payoutKey").text("0x" + keys.payoutKey.payoutKeyObject.address);
				$("#votingKey").text("0x" + keys.votingKey.votingKeyObject.address);

				$("#miningKeyPass").text(keys.miningKey.password);
				$("#payoutKeyPass").text(keys.payoutKey.password);
				$("#votingKeyPass").text(keys.votingKey.password);

				$("#copyMiningPass").attr("data-clipboard-text", keys.miningKey.password);
				$("#copyPayoutPass").attr("data-clipboard-text", keys.payoutKey.password);
				$("#copyVotingPass").attr("data-clipboard-text", keys.votingKey.password);

				buildCopyControl("copyMiningPass", "Mining key password copied");
				buildCopyControl("copyPayoutPass", "Payout key password copied");
				buildCopyControl("copyVotingPass", "Voting key password copied");

				$("#copyMiningKey").attr("data-clipboard-text", "0x" + keys.miningKey.miningKeyObject.address);
				$("#copyPayoutKey").attr("data-clipboard-text", "0x" + keys.payoutKey.payoutKeyObject.address);
				$("#copyVotingKey").attr("data-clipboard-text", "0x" + keys.votingKey.votingKeyObject.address);

				buildCopyControl("copyMiningKey", "Mining key copied");
				buildCopyControl("copyPayoutKey", "Payout key copied");
				buildCopyControl("copyVotingKey", "Voting key copied");

				$("#miningKeyDownload").click(function() {
					download("mining_key_" + keys.miningKey.miningKeyObject.address, JSON.stringify(keys.miningKey.miningKeyObject));
				});

				$("#payoutKeyDownload").click(function() {
					download("payout_key_" + keys.payoutKey.payoutKeyObject.address, JSON.stringify(keys.payoutKey.payoutKeyObject));
				});

				$("#votingKeyDownload").click(function() {
					download("voting_key_" + keys.votingKey.votingKeyObject.address, JSON.stringify(keys.votingKey.votingKeyObject));
				});
			});
		}

		function loadingFinished() {
			$(".loading-container").hide();
          	$(".waiting-container").hide();
	  		$(".content").show();
		}

		function buildCopyControl(id, msg) {
			var el = document.getElementById(id);
			var clipboard = new Clipboard( el );
		  	
		  	clipboard.on( "success", function( event ) {
		  		window.toastr.success(msg);
		    });
		}
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});
