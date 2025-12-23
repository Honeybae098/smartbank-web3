const hre = require("hardhat");

async function main() {
  console.log("Deploying SmartBank contract...");

  // Get the contract factory
  const SmartBank = await hre.ethers.getContractFactory("SmartBank");
  
  // Deploy the contract
  const smartBank = await SmartBank.deploy();
  
  // Wait for deployment to be mined
  await smartBank.waitForDeployment();
  
  // Get the deployed contract address
  const contractAddress = await smartBank.getAddress();
  
  console.log("SmartBank deployed to:", contractAddress);
  console.log("Contract deployed by:", await smartBank.owner());
  
  // Wait for a few blocks to ensure deployment is confirmed
  console.log("Waiting for deployment confirmation...");
  await smartBank.deploymentTransaction().wait(5);
  
  console.log("Deployment confirmed!");
  console.log("Next steps:");
  console.log("1. Update contract address in Web3Context.jsx:");
  console.log(`   sepolia: '${contractAddress}',`);
  console.log("2. Verify contract on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${contractAddress}`);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
