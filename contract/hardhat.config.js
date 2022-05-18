require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

const ALCHEMY_API_KEY = "adPYBBOeggH5WxfoGnMLGRwAVV2_0Kl9";

module.exports = {
  solidity: "0.8.9",
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
      accounts: [`0x${process.env.ACCOUNT_PRIVATE_KEY}`]
    }
  }
};
