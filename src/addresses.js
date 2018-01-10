const CORE_ADDRESSES = {
  KEYS_MANAGER_ADDRESS: "0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8",
}

const SOKOL_ADDRESSES = {
  KEYS_MANAGER_ADDRESS: "0xD480319659AFe5044FB09e2B92d10c987044DE4B",
}

module.exports = (netId) => {
  switch (netId){
    case '77':
      return SOKOL_ADDRESSES
    case '99':
      return CORE_ADDRESSES
    default:
      return CORE_ADDRESSES
  }
}