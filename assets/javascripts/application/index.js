//gets web3 object from MetaMask or Parity
function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
  	// no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Ethereum. Please, switch on Parity or MetaMask client and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
  	// window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider); 

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    checkNetworkVersion(myWeb3, function(isOraclesNetwork) {
    	callback(myWeb3, isOraclesNetwork);
    });
  }
}

//check current network page is connected to. Alerts, if not Oracles network
function checkNetworkVersion(web3, cb) {
	var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Parity or MetaMask client and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
	web3.version.getNetwork(function(err, netId) {
	  if (err)
	  	console.log(err);
	  console.log("netId: " + netId);
	  switch (netId) {
	    case "1": {
	      console.log('This is mainnet');
	      swal("Warning", msgNotOracles, "warning"); 
	      cb(false);
	    } break;
	    case "2": {
	      console.log('This is the deprecated Morden test network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	    } break;
	    case "3": {
	      console.log('This is the ropsten test network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	    }  break;
	     case "12648430": {
	       console.log('This is Oracles from Metamask');
	       cb(true);
	    }  break;
	    default: {
	      console.log('This is an unknown network.');
	      swal("Warning", msgNotOracles, "warning");
	      cb(false);
	  	} break;
	  }
	})
}

//launches main application
function startDapp(web3, isOraclesNetwork) {
	$(function() {
		$(".loading-container").hide();
		if (!isOraclesNetwork) return;
		var keys = {
			"miningKey": {},
			"payoutKey": {},
			"votingKey": {}
		};

		//get current account chosen in MetaMask or opened at Parity
		web3.eth.getAccounts(function(err, accounts) {
			if (err) {
				$(".loading-container").hide();
				swal("Error", err.message, "error");
				return;
			}

			getConfig(err, function(config) {
				getConfigCallBack(web3, accounts, config);	
			});
		});

		//gets config file with address of Oracles contract
		function getConfig(err, cb) {
			$.getJSON("./assets/javascripts/config.json", function(_config) {
				cb(_config);
			});
		}

		//getting of config callback
		function getConfigCallBack(web3, accounts, config) {
			//checks if chosen account is valid initial key
			if (accounts.length == 1) {
				var possibleInitialKey = accounts[0].substr(2);
				checkInitialKey(web3,
				"checkInitialKey(address)", 
				possibleInitialKey,
				config.Ethereum[config.environment].contractAddress,
				function(_isNew) {
					_isNew = !!+_isNew;
					if (!_isNew) swal("Warning", "Current key isn't valid initial key. Please, choose your initial key in MetaMask and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
				});
			} else if (accounts.length == 0) {
				swal("Warning", "You haven't chosen any account in MetaMask. Please, choose your initial key in MetaMask and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
			}

			$(".create-keys-button").click(function() {
			    $("#initialKeySource").click();
			})

			$("#initialKeySource").change(function() {
				initialKeyChosen(this, config, function(address) {
					checkInitialKeyCallBack(keys, function(_keys) {
						addressesGeneratedCallBack(config, _keys, address, function(err, address) {
							addressesAddedToContractCallBack(err, address, _keys);
						})
					});
				});
			});
		}

		//triggers, if initial key is chosen
		function initialKeyChosen(el, config, cb) {
			$(el).remove();
	    	$("<input type='file' id='initialKeySource' />").change(initialKeyChosen).appendTo($(".create-keys"));
			var file = $(el).prop('files')[0];
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

		        checkInitialKey(web3,
					"checkInitialKey(address)", 
					address,
					config.Ethereum[config.environment].contractAddress,
					function(_isNew) {
						_isNew = !!+_isNew;

						if (!_isNew) return swal("Error", "Initial key is already activated or isn't valid", "error");

						$(".loading-container").show();

						setTimeout(function() { 
							cb(address);
						}, 500)
					}
				);
		    }
		    reader.onerror = function (evt) {
		    	swal("Error", "Error in reading file", "error");
		    }
		}

		//validating of initial key callback: async generates 3 addresses: mining, payout, voting
		function checkInitialKeyCallBack(keys, cb) {
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
		function addressesGeneratedCallBack(config, keys, address, cb) {
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
			addValidator(web3, 
				"addValidator(address,uint256,uint256,uint256,string,string,string)",
				validatorViewObj,
				address,
				config.Ethereum[config.environment].contractAddress,
				function(txHash, err) {
					if (err) {
						$(".loading-container").hide();
						console.log(err.message);
						if (err.type != "REQUEST_REJECTED") swal("Error", "Error in addresses addition to contract", "error");
						return;
					}

					//activate generated production keys
					createKeys(web3, 
						"createKeys(address,address,address)", 
						keys,
						address,
						config.Ethereum[config.environment].contractAddress,
						function(res, err) {
							if (err) {
								$(".loading-container").hide();
								console.log(err.message);
								if (err.type != "REQUEST_REJECTED") swal("Error", "Error in addresses addition to contract", "error");
								return;
							}

							cb(err, address);
						}
					);
				}
			);
		}

		//Production keys addition to contract callback
		function addressesAddedToContractCallBack(err, address, keys) {
			if (err) {
				$(".loading-container").hide();
				swal("Error", err.message, "error");
				return;
			}

			//chain:sends ether to payoutKey
			var to = "0x" + keys.payoutKey.payoutKeyObject.address;
			//gets balance of initial key
			getBalance(address, function(balance) {
				//gets gas price
				getGasPrice(function(gasPrice) {
					//estimates gas
					estimateGasForTx(address, to, balance, function(estimatedGas) {
						//calculates how many coins we can send from initial key to payout key
						calculateAmmountToSend(estimatedGas, gasPrice, balance, function(ammountToSend) {
							transferCoinsToPayoutKey(estimatedGas, gasPrice, address, to, ammountToSend);
						});
					});
				});
	        });
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

		function getGasPrice(cb) {    
        	web3.eth.getGasPrice(function(err, gasPriceObj) {
        		if (err) {
		          console.log(err);
		          $(".loading-container").hide();
		          return;
		        }
		        var gasPrice = gasPriceObj.c[0];

        		cb(gasPrice);
        	});
		}

		function estimateGasForTx(address, to, balance, cb) {
    		estimateGas(web3, address, to, null, parseInt(balance/2), function(estimatedGas, err) {
    			if (err) {
		          console.log(err);
		          $(".loading-container").hide();
		          return;
		        }

			    cb(estimatedGas);
		  	});
		}

		function calculateAmmountToSend(estimatedGas, gasPrice, balance, cb) {
	      	var ammountToSend = balance - 20 * estimatedGas * gasPrice;
	    	console.log("ammountToSend: " + ammountToSend);
	    	cb(ammountToSend);
		}

		function transferCoinsToPayoutKey(estimatedGas, gasPrice, address, to, ammountToSend) {
			web3.eth.sendTransaction({
				"gas": estimatedGas, 
				"from": address, 
				"to": to, 
				"value": ammountToSend}, function(err, txHash) {
        	    if (err) {
		          console.log(err);
		          $(".loading-container").hide();
		          return;
		        }
		        $(".loading-container").hide();
				swal("Sucess", "Keys are created", "success");
				$('.content').empty();
				$('.content').load("./keys.html", function() {
					$("#miningKey").text("0x" + keys.miningKey.miningKeyObject.address);
					$("#payoutKey").text("0x" + keys.payoutKey.payoutKeyObject.address);
					$("#votingKey").text("0x" + keys.votingKey.votingKeyObject.address);

					$("#miningKeyPass").text(keys.miningKey.password);
					$("#payoutKeyPass").text(keys.payoutKey.password);
					$("#votingKeyPass").text(keys.votingKey.password);

					$("#miningKeyDownload").click(function() {
						download("key_" + keys.miningKey.miningKeyObject.address, JSON.stringify(keys.miningKey.miningKeyObject));
					});

					$("#payoutKeyDownload").click(function() {
						download("key_" + keys.payoutKey.payoutKeyObject.address, JSON.stringify(keys.payoutKey.payoutKeyObject));
					});

					$("#votingKeyDownload").click(function() {
						download("key_" + keys.votingKey.votingKeyObject.address, JSON.stringify(keys.votingKey.votingKeyObject));
					});
				});
		    });
		}
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});