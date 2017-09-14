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

		getAccounts(function(accounts) {
			getConfig(function(contractAddress, abi) {
				getConfigCallBack(web3, accounts, contractAddress, abi);	
			});
		});

		//getting of config callback
		function getConfigCallBack(web3, accounts, contractAddress, abi) {
			//checks if chosen account is valid initial key
			if (accounts.length == 1) {
				var possibleInitialKey = accounts[0].substr(2);
				checkInitialKey(web3,
				"checkInitialKey(address)", 
				possibleInitialKey,
				contractAddress,
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

			$("#initialKeySource").change({contractAddress: contractAddress, abi:abi}, initialKeySourceOnChange);
		}

		function initialKeySourceOnChange(ev) {
			initialKeyChosen(this, ev.data.contractAddress, function(address) {
				generateAddresses(keys, function(_keys) {
					fillContractData(ev.data.contractAddress, ev.data.abi, _keys, address, function(err, address) {
						transferCoinsToPayoutKey(err, address, _keys);
					})
				});
			});
		};

		//triggers, if initial key is chosen
		function initialKeyChosen(el, contractAddress, cb) {
			var file = $(el).prop('files')[0];
			$(el).remove();
			var newEl = "<input type='file' id='initialKeySource' />";
	    	$(newEl).change({contractAddress: contractAddress}, initialKeySourceOnChange).appendTo($(".create-keys"));
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
					contractAddress,
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
		function fillContractData(contractAddress, abi, keys, address, cb) {
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
			addValidator(web3, 
				"addValidator(address,uint256,uint256,string,string,string,string)",
				validatorViewObj,
				address,
				contractAddress,
				abi,
				function(txHash, err) {
					if (err) {
						loadingFinished();
						if (err.type != "REQUEST_REJECTED") swal("Error", "Error in addresses addition to contract", "error");
						return;
					}

					$(".content").hide();
					$('.waiting-container').show();
					$('.waiting-container').empty();
					$('.waiting-container').append("<h2>Adding production keys to Oracles contract...</h2>");
					//activate generated production keys
					createKeys(web3, 
						"createKeys(address,address,address)", 
						keys,
						address,
						contractAddress,
						function(res, err) {
							if (err) {
								loadingFinished();
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
		function transferCoinsToPayoutKey(err, address, keys) {
			$(".content").hide();
			$('.waiting-container').show();
			$('.waiting-container').empty();
			$('.waiting-container').append("<h2>Transfering ether from initial key to payout key...</h2>");
			if (err) {
				loadingFinished();
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
							transferCoinsToPayoutKeyTx(estimatedGas, gasPrice, address, to, ammountToSend);
						});
					});
				});
	        });
		}

		function estimateGasForTx(address, to, balance, cb) {
    		estimateGas(web3, address, to, null, parseInt(balance/2), function(estimatedGas, err) {
    			if (err) {
		          console.log(err);
		          loadingFinished();
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

		function transferCoinsToPayoutKeyTx(estimatedGas, gasPrice, address, to, ammountToSend) {
			web3.eth.sendTransaction({
				"gas": estimatedGas, 
				"gasPrice": gasPrice,
				"from": address, 
				"to": to, 
				"value": ammountToSend}, function(err, txHash) {
        	    if (err) {
		          console.log(err);
		          loadingFinished();
		          return;
		        }
		        loadingFinished();
				swal("Success", "Keys are created", "success");
				$('.content').empty();
				loadKeysPage();
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
		  		toastr.success(msg);
		    });
		}
	});
}

window.addEventListener('load', function() {
	getWeb3(startDapp);
});
