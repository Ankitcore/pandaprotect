import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  paths: {
    artifacts: "./app/contracts/artifacts",
    cache: "./app/contracts/cache",
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    // Add testnet configs here using env vars
  }
};

export default config;
