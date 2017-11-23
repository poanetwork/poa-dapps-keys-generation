//gets config file with address of Oracles contract
async function getConfig(cb) {
  	let config = await $.getJSON("./assets/javascripts/config.json")
	return config;
}