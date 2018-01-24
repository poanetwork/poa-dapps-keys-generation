const CORE_ADDRESSES = {
  KEYS_MANAGER_ADDRESS: "0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8",
}

const SOKOL_ADDRESSES = {
  KEYS_MANAGER_ADDRESS: "0x1aa02bd52fe418ac70263351282f66f1dacf898c",
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