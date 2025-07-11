const { Lucid, Blockfrost } = require("lucid-cardano");
const readline = require('readline');
const { promisify } = require('util');

// Import local modules
const { BLOCKFROST_URL, BLOCKFROST_API_KEY, TPUCKY, TEST_WALLET_ADDRESS } = require("./constants");

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = promisify(rl.question).bind(rl);

async function setupPool() {
  console.log("PuckSwap Pool Setup");
  console.log("===================\n");
  console.log("\nThis script will help you create the initial ADA-tPucky liquidity pool.\n");

  try {
    // Initialize Lucid
    console.log("🔌 Connecting to Cardano Preprod network...");
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
      "Preprod"
    );
    console.log("✅ Connected successfully!\n");

    // Get wallet setup method
    console.log("How would you like to connect your wallet?");
    console.log("1. Use seed phrase (recommended for initial setup)");
    console.log("2. Use private key");
    
    const choice = await question("\nEnter your choice (1 or 2): ");
    
    let address;
    
    if (choice === "1") {
      // Seed phrase method
      console.log("\n⚠️  SECURITY WARNING: Never share your seed phrase with anyone!");
      console.log("Enter your 12-word seed phrase (separated by spaces):");
      
      const seedPhrase = await question("> ");
      const words = seedPhrase.trim().split(/\s+/);
      
      if (words.length !== 12) {
        throw new Error("Invalid seed phrase. Please provide exactly 12 words.");
      }
      
      lucid.selectWalletFromSeed(seedPhrase.trim());
      address = await lucid.wallet.address();
      
    } else if (choice === "2") {
      // Private key method
      console.log("\nEnter your private key:");
      const privateKey = await question("> ");
      
      lucid.selectWalletFromPrivateKey(privateKey.trim());
      address = await lucid.wallet.address();
      
    } else {
      throw new Error("Invalid choice. Please run the script again.");
    }
    
    console.log(`\n📍 Wallet Address: ${address}`);
    
    // Verify expected address if using test wallet
    if (address === TEST_WALLET_ADDRESS) {
      console.log("✅ Using PuckSwap test wallet");
    }
    
    // Check wallet balance
    console.log("\n💰 Checking wallet balance...");
    const utxos = await lucid.wallet.getUtxos();
    const adaBalance = utxos.reduce((sum, utxo) => sum + utxo.assets.lovelace, 0n);
    const tPuckyUnit = TPUCKY.policyId + TPUCKY.tokenName;
    const tPuckyBalance = utxos.reduce((sum, utxo) => sum + (utxo.assets[tPuckyUnit] || 0n), 0n);
    
    console.log(`   ADA: ${Number(adaBalance) / 1_000_000} ADA`);
    console.log(`   tPucky: ${Number(tPuckyBalance).toLocaleString()} tPucky`);
    
    // Get pool parameters
    console.log("\n🏊 Pool Creation Parameters");
    console.log("Enter the initial liquidity amounts:");
    
    const defaultAda = "10000";
    const defaultTPucky = "10000000000";
    
    const adaInput = await question(`ADA amount (default: ${defaultAda}): `) || defaultAda;
    const tPuckyInput = await question(`tPucky amount (default: ${defaultTPucky}): `) || defaultTPucky;
    const feeInput = await question(`Trading fee % (default: 0.3): `) || "0.3";
    
    const poolParams = {
      initialAda: BigInt(Math.floor(parseFloat(adaInput) * 1_000_000)),
      initialTPucky: BigInt(tPuckyInput),
      tradingFeePercent: parseFloat(feeInput),
    };
    
    // Verify parameters
    console.log("\n📋 Confirm Pool Parameters:");
    console.log(`   Initial ADA: ${Number(poolParams.initialAda) / 1_000_000} ADA`);
    console.log(`   Initial tPucky: ${Number(poolParams.initialTPucky).toLocaleString()} tPucky`);
    console.log(`   Trading Fee: ${poolParams.tradingFeePercent}%`);
    
    // Calculate expected LP tokens
    const expectedLPTokens = sqrt(poolParams.initialAda * poolParams.initialTPucky);
    console.log(`   Expected LP Tokens: ${Number(expectedLPTokens).toLocaleString()}`);
    
    // Verify sufficient balance
    const requiredAda = poolParams.initialAda + 15_000_000n; // Extra for fees and min UTxOs
    if (adaBalance < requiredAda) {
      throw new Error(`Insufficient ADA balance. Required: ${Number(requiredAda) / 1_000_000} ADA`);
    }
    
    if (tPuckyBalance < poolParams.initialTPucky) {
      throw new Error(`Insufficient tPucky balance. Required: ${Number(poolParams.initialTPucky).toLocaleString()} tPucky`);
    }
    
    // Confirm creation
    const confirm = await question("\nProceed with pool creation? (yes/no): ");
    
    if (confirm.toLowerCase() !== "yes" && confirm.toLowerCase() !== "y") {
      console.log("\n❌ Pool creation cancelled.");
      process.exit(0);
    }
    
    // Import pool creator module dynamically
    console.log("\n🚀 Preparing pool creation...");
    const { createAdaTpuckyPool } = await import("./pool-creator.js");
    
    console.log("Creating liquidity pool...");
    console.log("This may take a few moments...\n");
    
    try {
      const txHash = await createAdaTpuckyPool(lucid, poolParams, address);
      
      console.log("✅ Pool created successfully!");
      console.log(`\n📝 Transaction Hash: ${txHash}`);
      console.log(`🔍 View on Cardanoscan: https://preprod.cardanoscan.io/transaction/${txHash}`);
      console.log(`\n💎 LP Tokens Received: ${Number(expectedLPTokens).toLocaleString()}`);
      
      // Save pool information
      console.log("\n📄 Pool Information:");
      console.log("Please save this information for your records:");
      console.log(JSON.stringify({
        poolType: "ADA-tPucky",
        createdAt: new Date().toISOString(),
        transactionHash: txHash,
        initialAda: `${Number(poolParams.initialAda) / 1_000_000} ADA`,
        initialTPucky: `${Number(poolParams.initialTPucky).toLocaleString()} tPucky`,
        lpTokensReceived: Number(expectedLPTokens).toLocaleString(),
        tradingFee: `${poolParams.tradingFeePercent}%`,
      }, null, 2));
      
    } catch (error) {
      console.error("\n❌ Error creating pool:", error.message || error);
      
      if (error.message?.includes("UTxO Balance Insufficient")) {
        console.log("\n💡 Tip: Make sure you have enough ADA for transaction fees (usually 2-5 ADA)");
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.error("\n❌ Fatal error:", error.message || error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Helper function for square root calculation
function sqrt(n) {
  if (n < 0n) {
    throw new Error("Square root of negative number");
  }
  if (n < 2n) {
    return n;
  }
  
  let x = n;
  let y = (x + 1n) / 2n;
  
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  
  return x;
}

// Run the setup
console.clear();
setupPool().catch(console.error); 