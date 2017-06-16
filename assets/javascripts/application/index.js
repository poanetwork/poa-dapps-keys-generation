$(function() {
	$(".loading-container").hide();
	var keys = {
		"miningKey": {},
		"payoutKey": {},
		"votingKey": {}
	};
	var api = window.parity.api;
	var config;
  	$.getJSON("./assets/javascripts/config.json", function(_config) {
		config = _config;
	});

	$(".create-keys-button").click(function() {
	    $("#initialKeySource").click();
	})

	$("#initialKeySource").change(initialKeyChosen);

	function initialKeyChosen() {
		$(this).remove();
    	$("<input type='file' id='initialKeySource' />").change(initialKeyChosen).appendTo($(".create-keys"));
		var file = $(this).prop('files')[0];
		var reader = new FileReader();
	    reader.readAsText(file, "UTF-8");
	    reader.onload = function (evt) {
	    	try {
		        a = JSON.parse(evt.target.result);
		    } catch(e) {
		        swal("Error", "Invalid key file", "error");
		        return;
		    }

	        var keyJSON = JSON.parse(evt.target.result); 
	        var address = keyJSON.address;
	        
	        if (!address) {
	        	swal("Error", "No address in key file", "error");
		        return;
	        }

	        checkInitialKey(api,
				"checkInitialKey(address)", 
				address,
				config.Ethereum[config.environment].contractAddress,
				function(_isNew) {
					_isNew = !!+_isNew;

					if (!_isNew) {
						swal("Error", "Initial key is already activated or isn't valid", "error");
						return;
					}

					$(".loading-container").show();

					setTimeout(function() { 
						if (!config) {
							$.getJSON("./assets/javascripts/config.json", function(_config) {
								config = _config;
								configLoadedCallBack(api, config, address);
							});
						} else {
							configLoadedCallBack(api, config, address);
						}
					}, 500)
				}
			);
	    }
	    reader.onerror = function (evt) {
	    	swal("Error", "Error in reading file", "error");
	    }
	}

	function configLoadedCallBack(api, config, address) {

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

			if (keysIterator == keysCount) {
				addressesGeneratedCallBack(keys, address);
			}
		});
		generateAddress(function(_payoutKeyObject, password) {
			keysIterator++;
			keys.payoutKey = {};
			_payoutKeyObject.name = "payoutKey";
			keys.payoutKey.payoutKeyObject = _payoutKeyObject;
			keys.payoutKey.password = password;

			if (keysIterator == keysCount) {
				addressesGeneratedCallBack(keys, address);
			}
		});
		generateAddress(function(_votingKeyObject, password) {
			keysIterator++;
			keys.votingKey = {};
			_votingKeyObject.name = "votingKey";
			keys.votingKey.votingKeyObject = _votingKeyObject;
			keys.votingKey.password = password;

			if (keysIterator == keysCount) {
				addressesGeneratedCallBack(keys, address);
			}
		});
	}

	function addressesGeneratedCallBack(keys, address) {
		var validatorViewObj = {
			miningKey: "0x" + keys.miningKey.miningKeyObject.address,
			fullName:  $("#full-name").val(),
			streetName: $("#address").val(),
			state: $("#state").val(),
			zip: $("#zip").val(),
			licenseID: $("#license-id").val(),
			licenseExpiredAt: new Date($("#license-expiration").val()).getTime() / 1000,
		};
		addValidator(api, 
			"addValidator(address,uint256,uint256,uint256,string,string,string)",
			validatorViewObj,
			address,
			config.Ethereum[config.environment].contractAddress,
			function(txHash, err) {
				if (err) {
					$(".loading-container").hide();
					console.log(err.message);
					if (err.type != "REQUEST_REJECTED")
						swal("Error", "Error in addresses addition to contract", "error");
					return;
				}

				createKeys(api, 
					"createKeys(address,address,address)", 
					keys,
					address,
					config.Ethereum[config.environment].contractAddress,
					function(res, err) {
						if (err) {
							$(".loading-container").hide();
							console.log(err.message);
							if (err.type != "REQUEST_REJECTED")
								swal("Error", "Error in addresses addition to contract", "error");
							return;
						}

						addressesAddedToContractCallBack(address, err);
					}
				);
			}
		);
	}

	function addressesAddedToContractCallBack(address, error) {
		if (error) {
			$(".loading-container").hide();
			swal("Error", error.message, "error");
			return;
		}

		//send ether to payoutKey
		api._eth.getBalance(address).then(function(balanceObj){
        	var balance = balanceObj.toNumber();
        	var to = "0x" + keys.payoutKey.payoutKeyObject.address;
        	api._eth.gasPrice().then(function(gasPrice) {
	    		var estimatedGas = web3.eth.estimateGas({from: address, value: parseInt(balance/2), data: null, to: to});
		    	var ammountToSend = balance - 10 * estimatedGas * gasPrice;
		    	console.log("ammountToSend: " + ammountToSend);
		    	web3.eth.sendTransaction({gas: estimatedGas, from: address, to: to, value: ammountToSend}, function(err, txHash) {
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
	    	});
        });
	}
});