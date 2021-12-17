const { ethers } = require("hardhat");
const address = require("../address.json");

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Deploying contract with account: ", await accounts[1].address);

  let rootToken, fxERC20RootTunnel, fxERC20ChildTunnel, rootChainId, childChainId;
  const network = await ethers.provider.getNetwork();
  const FxCrossChainTransfer = await ethers.getContractFactory("FxCrossChainTransfer", await deployer.address);
  
  if (network.chainId === address.mainnet.rootChainId || network.chainId === address.mainnet.childChainId) {
    rootChainId = address.mainnet.rootChainId;
    childChainId = address.mainnet.childChainId;
    rootToken = address.mainnet.rootToken;
    fxERC20RootTunnel = address.mainnet.fxERC20RootTunnel;
    fxERC20ChildTunnel = address.mainnet.fxERC20ChildTunnel;

  } else if(network.chainId === address.testnet.rootChainId || network.chainId === address.testnet.childChainId){
    rootChainId = address.testnet.rootChainId;
    childChainId = address.testnet.childChainId;
    rootToken = address.testnet.rootToken;
    fxERC20RootTunnel = address.testnet.fxERC20RootTunnel;
    fxERC20ChildTunnel = address.testnet.fxERC20ChildTunnel;
  }

  const fxCrossChainTransfer = await FxCrossChainTransfer.deploy(rootToken, fxERC20RootTunnel, fxERC20ChildTunnel, rootChainId, childChainId);

  await fxCrossChainTransfer.deployed();

  console.log("Contract deployed to: ", fxCrossChainTransfer.address, "on network: ", network.chainId);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
