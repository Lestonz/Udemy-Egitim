import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const DEFAULT_GAS_MULTIPLIER:number = 1; 
const API:any = "ETHERSCAN_API";

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.7',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    local: {
      url:  "http://127.0.0.1:8545",
    },
    truffle: {
      url: 'http://localhost:24012/rpc',
      timeout: 60000,
      gasMultiplier: DEFAULT_GAS_MULTIPLIER,
    },
  },
  etherscan: {
    apiKey: {
      //ethereum
      goerli: API,
      sepolia: API,
      mainnet: API
    }
  }
};

export default config;
