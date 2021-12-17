require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const address = require("./address.json");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


task("deploy-contract", "Deploys the example Fx portal contract")
//.addParam("chain", "Ethereum/Polygon network", "goerli")
.addParam("roottoken", "address of root token", "0x655f2166b0709cd575202630952d71e2bb0d61af")
.setAction(async(args, hre) => {
  let fxERC20RootTunnel, fxERC20ChildTunnel, rootChainId, childChainId;
  const accounts = await hre.ethers.getSigners();
  const network = await hre.ethers.provider.getNetwork();
  const rootToken = args.roottoken;

  if (network.chainId === address.mainnet.rootChainId || network.chainId === address.mainnet.childChainId) {
    rootChainId = address.mainnet.rootChainId;
    childChainId = address.mainnet.childChainId;
    fxERC20RootTunnel = address.mainnet.fxERC20RootTunnel;
    fxERC20ChildTunnel = address.mainnet.fxERC20ChildTunnel;
    
  } else if(network.chainId === address.testnet.rootChainId || network.chainId === address.testnet.childChainId){
    rootChainId = address.testnet.rootChainId;
    childChainId = address.testnet.childChainId;
    fxERC20RootTunnel = address.testnet.fxERC20RootTunnel;
    fxERC20ChildTunnel = address.testnet.fxERC20ChildTunnel;
  }
    console.log("Deploying with account: ", await accounts[1].address);
    const FxCrossChainTransfer = await hre.ethers.getContractFactory("FxCrossChainTransfer", accounts[1]);
    const fxCrossChainTransfer = await FxCrossChainTransfer.deploy(rootToken, fxERC20RootTunnel, fxERC20ChildTunnel, rootChainId, childChainId);

    await fxCrossChainTransfer.deployed();
  
    console.log("Contract deployed to: ", fxCrossChainTransfer.address, "on network: ", network.chainId);
  
})

task("verify-contract", "Verify the contracts")
.addParam("address", "Contract Address", "0xb529DE4B07D2dcb9DBB69207eFCf107860b505f5")
.addParam("roottoken", "address of root token", "0x655f2166b0709cd575202630952d71e2bb0d61af")
.addParam("roottunnel", "address of FxERC20RootTunnel", "0x79B77456684AEB0bf7c8Ec50FB9c714d52BdA46c")
.addParam("childtunnel", "address of FxERC20ChildTunnel", "0x9dee38B0D819c78cEBAbc86707019dA18f25E6Cc")
.setAction(async(args, hre) => {
    let rootChainId, childChainId, constructorArgs = [], contractObj = {};
    const network = await hre.ethers.provider.getNetwork();
    if (network.chainId === address.mainnet.rootChainId || network.chainId === address.mainnet.childChainId) {
        rootChainId = address.mainnet.rootChainId;
        childChainId = address.mainnet.childChainId;
    } else if(network.chainId === address.testnet.rootChainId || network.chainId === address.testnet.childChainId) {
      rootChainId = address.testnet.rootChainId;
      childChainId = address.testnet.childChainId;
    }
    constructorArgs.push(args.roottoken, args.roottunnel, args.childtunnel, rootChainId, childChainId);
    contractObj.address = args.address;
    contractObj.constructorArguments = constructorArgs;
    try {
      await hre.run("verify:verify", contractObj);
    } catch (error) {
      console.log("Error occured while verifying: ", error);
    }
    
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 9999,
      },
    },
  },
  networks: {
    mainnet: {
      url: process.env.MAINNET || "https://main-light.eth.linkpool.io",
      accounts: { mnemonic: process.env.MNEMONIC }

    },
    goerli: {
      url: process.env.GOERLI || "https://rpc.goerli.mudit.blog/",
      accounts: { mnemonic: process.env.MNEMONIC }

    },
    mumbai: {
      url: process.env.MUMBAI || "https://rpc-mumbai.maticvigil.com",
      accounts: { mnemonic: process.env.MNEMONIC }

    },
    polygon: {
      url: process.env.POLYGON || "https://polygon-rpc.com",
      accounts: { mnemonic: process.env.MNEMONIC }

    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
