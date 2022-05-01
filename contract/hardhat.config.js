require("@nomiclabs/hardhat-waffle");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "adPYBBOeggH5WxfoGnMLGRwAVV2_0Kl9";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const ACCOUNT_PRIVATE_KEY = "16590145ed5af596678f87d32471630b7384b493563fe5245851fb7457130911";

module.exports = {
  solidity: "0.8.0",
  networks: {
    development: {
      url: "https://localhost:7545",
      host: "127.0.0.1",
      port: 7545,
      network_id: '5777'
    },
    localhost: {
      host: "127.0.0.1",
      port: 8545
    },
    polygonMumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${ACCOUNT_PRIVATE_KEY}`]
    }
  }
};
