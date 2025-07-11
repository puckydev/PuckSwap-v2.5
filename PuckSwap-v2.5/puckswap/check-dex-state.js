#!/usr/bin/env node

import { Lucid, Blockfrost } from "lucid-cardano";

// Configuration
const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";
const BLOCKFROST_API_KEY = "preprodd86p4euUeF6yIUbwl03sJJMD03aICMxL";

async function checkDexState() {
  try {
    console.log("🔍 Checking AMM DEX V2 State on Preprod");
    console.log("==========================================\n");
    
    // Initialize Lucid
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
      "Preprod"
    );
    
    // From the deployed/preprod/references.json
    const factoryAddress = "addr_test1wpe5kzzcvtpwmpqhvnvj3yv4pd6wk3xlvw76kpq9hyyp7gcn6lqtc";
    const poolAddress = "addr_test1wpe5kzzcvtpwmpqhvnvj3yv4pd6wk3xlvw76kpq9hyyp7gcn6lqtc";
    const authenPolicyId = "d6ba9b7509eac866288ff5072d2a18205ac56f744bc82dcd808cb8fe";
    
    console.log("📍 Contract Addresses:");
    console.log(`   Factory: ${factoryAddress}`);
    console.log(`   Pool: ${poolAddress}`);
    console.log(`   Authen Policy: ${authenPolicyId}`);
    
    // Check Factory UTxOs
    console.log("\n🏭 Checking Factory UTxOs...");
    const factoryUtxos = await lucid.utxosAt(factoryAddress);
    console.log(`   Found ${factoryUtxos.length} Factory UTxOs`);
    
    if (factoryUtxos.length > 0) {
      console.log("\n   Factory UTxO Details:");
      for (const utxo of factoryUtxos) {
        console.log(`   - TxHash: ${utxo.txHash}#${utxo.outputIndex}`);
        
        // Check for Factory NFT
        const factoryNFT = utxo.assets[authenPolicyId + "4d5346"]; // MSF
        if (factoryNFT) {
          console.log(`     ✅ Contains Factory NFT`);
        }
        
        // Try to parse datum
        if (utxo.datum) {
          console.log(`     📄 Has datum: ${utxo.datum.substring(0, 50)}...`);
        }
      }
    } else {
      console.log("   ⚠️  No Factory UTxOs found - DEX may not be initialized!");
    }
    
    // Check for existing pools
    console.log("\n🏊 Checking existing pools...");
    const poolUtxos = await lucid.utxosAt(poolAddress);
    console.log(`   Found ${poolUtxos.length} potential Pool UTxOs`);
    
    // Check for Global Setting
    console.log("\n⚙️  Checking Global Setting...");
    const globalSettingNFT = authenPolicyId + "4d534753"; // MSGS
    
    console.log("\n📊 Summary:");
    console.log("   - DEX appears to be deployed on preprod");
    console.log("   - You need to interact with the existing Factory UTxOs");
    console.log("   - Pool creation requires finding a suitable Factory UTxO");
    
    console.log("\n💡 Next Steps:");
    console.log("   1. Find a Factory UTxO with suitable head/tail for your pool");
    console.log("   2. Calculate the LP token name for ADA/tPucky");
    console.log("   3. Build a proper pool creation transaction");
    console.log("   4. Consider using the AMM SDK or UI instead");
    
    console.log("\n⚠️  Important Note:");
    console.log("   Creating pools on AMM V2 is complex and requires:");
    console.log("   - Understanding the Factory linked list structure");
    console.log("   - Proper calculation of LP token names");
    console.log("   - Correct interaction with multiple validators");
    console.log("   - Handling of NFTs and proper datum structures");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkDexState(); 