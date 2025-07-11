// Network Configuration
const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";
const BLOCKFROST_API_KEY = "preprodd86p4euUeF6yIUbwl03sJJMD03aICMxL";

// Token Definitions
const ADA = {
  policyId: "",
  tokenName: "",
};

const TPUCKY = {
  policyId: "c408426f2de9f774e5d59c8c4a93b8c1fb84528b21b444499e51ee1f",
  tokenName: "745075636b79", // "tPucky" in hex
};

// PuckSwap Configuration
const PUCKSWAP_CONFIG = {
  name: "PuckSwap",
  description: "Simple DEX for ADA <-> tPucky swaps",
  version: "1.0.0",
  supportedPairs: ["ADA/tPucky"],
  minPoolSwapAda: 5_000000n, // 5 ADA minimum swap amount
  batcherFee: 2_000000n, // 2 ADA batcher fee
};

// User wallet for testing
const TEST_WALLET_ADDRESS = "addr_test1qqq60q7g2sy072x8wwaa9yc3zmtjqzch7qdxnm8az55zk2yxezjfvsmmgxex52k4mj5nk2zzmtps6snh069v9wxlrtvqwke3k0";

// Contract deployment references (using existing AMM deployment)
const PREPROD_DEPLOYMENT = {
  orderAddress: "addr_test1wpe5kzzcvtpwmpqhvnvj3yv4pd6wk3xlvw76kpq9hyyp7gcn6lqtc",
  poolAddress: "addr_test1wpe5kzzcvtpwmpqhvnvj3yv4pd6wk3xlvw76kpq9hyyp7gcn6lqtc", // Will be determined after pool creation
  factoryAddress: "addr_test1wpe5kzzcvtpwmpqhvnvj3yv4pd6wk3xlvw76kpq9hyyp7gcn6lqtc",
  authenPolicyId: "d6ba9b7509eac866288ff5072d2a18205ac56f744bc82dcd808cb8fe",
};

module.exports = {
  BLOCKFROST_URL,
  BLOCKFROST_API_KEY,
  ADA,
  TPUCKY,
  PUCKSWAP_CONFIG,
  TEST_WALLET_ADDRESS,
  PREPROD_DEPLOYMENT
}; 