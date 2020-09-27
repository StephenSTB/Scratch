const path = require("path");

const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic = "salute angle awesome tenant almost swap corn vague reject legend under lens";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!

  compilers:{
    solc: {
      version: "0.6.9",
      parser: "solcjs"
    }
  },
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    kovan: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://kovan.infura.io/v3/bf32e2587d834489b5b823d63d08efac");
      },
      network_id: 42
    }
  }

/*  
  networks: {
    develop: {
      port: 8545
    }
  }*/
};
