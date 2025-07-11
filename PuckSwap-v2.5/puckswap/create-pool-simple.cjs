#!/usr/bin/env node

const { Lucid, Blockfrost } = require("lucid-cardano");
const { BLOCKFROST_URL, BLOCKFROST_API_KEY } = require("./constants.cjs");
const { createAdaTpuckyPool } = require("./pool-creator.cjs");

async function main() {
  console.log("PuckSwap Initial Pool Creation");
  console.log("==============================");
    
    // Initialize Lucid
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
      "Preprod"
    );
    
    // Get seed phrase from command line arguments
    const seedPhrase = process.argv.slice(2).join(" ");
    
    if (!seedPhrase || seedPhrase.split(" ").length !== 12) {
      console.error("❌ Error: Please provide a valid 12-word seed phrase as command line arguments");
      console.log("Usage: node puckswap/create-pool-simple.js word1 word2 word3 ... word12");
      process.exit(1);
    }
    
    // Select wallet from seed phrase
    lucid.selectWalletFromSeed(seedPhrase);
    
    const address = await lucid.wallet.address();
    console.log(`\n📍 Wallet Address: ${address}`);
    
    // Check wallet balance
    const utxos = await lucid.wallet.getUtxos();
    const adaBalance = utxos.reduce((sum, utxo) => sum + utxo.assets.lovelace, 0n);
    const tPuckyUnit = "c408426f2de9f774e5d59c8c4a93b8c1fb84528b21b444499e51ee1f745075636b79";
    const tPuckyBalance = utxos.reduce((sum, utxo) => sum + (utxo.assets[tPuckyUnit] || 0n), 0n);
    
    console.log(`\n💰 Wallet Balance:`);
    console.log(`   ADA: ${Number(adaBalance) / 1_000_000} ADA`);
    console.log(`   tPucky: ${Number(tPuckyBalance).toLocaleString()} tPucky`);
    
    // Pool creation parameters
    const poolParams = {
      initialAda: 10_000_000_000n, // 10,000 ADA in lovelace
      initialTPucky: 10_000_000_000n, // 10,000,000,000 tPucky
      tradingFeePercent: 0.3, // 0.3% trading fee
    };
    
    console.log(`\n🏊 Pool Creation Parameters:`);
    console.log(`   Initial ADA: ${Number(poolParams.initialAda) / 1_000_000} ADA`);
    console.log(`   Initial tPucky: ${Number(poolParams.initialTPucky).toLocaleString()} tPucky`);
    console.log(`   Trading Fee: ${poolParams.tradingFeePercent}%`);
    
    // Verify sufficient balance
    const requiredAda = poolParams.initialAda + 10_000_000n; // Extra for fees and min UTxO
    if (adaBalance < requiredAda) {
      console.error(`❌ Error: Insufficient ADA balance. Required: ${Number(requiredAda) / 1_000_000} ADA`);
      process.exit(1);
    }
    
    if (tPuckyBalance < poolParams.initialTPucky) {
      console.error(`❌ Error: Insufficient tPucky balance. Required: ${Number(poolParams.initialTPucky).toLocaleString()} tPucky`);
      process.exit(1);
    }
    
    console.log("\n🚀 Creating liquidity pool...");
    
    try {
      const txHash = await createAdaTpuckyPool(lucid, poolParams, address);
      
      console.log(`\n✅ Pool created successfully!`);
      console.log(`📝 Transaction Hash: ${txHash}`);
      console.log(`🔍 View on Cardanoscan: https://preprod.cardanoscan.io/transaction/${txHash}`);
      
      // Calculate and display LP tokens received
      const { sqrt } = require("./pool-creator.js");
      const initialLiquidity = sqrt(poolParams.initialAda * poolParams.initialTPucky);
      console.log(`\n💎 LP Tokens Received: ${Number(initialLiquidity).toLocaleString()}`);
      
    } catch (error) {
      console.error("❌ Error creating pool:", error);
      process.exit(1);
    }
    
  } catch (error) {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  }
}

// Run the script
main().catch(console.error); 