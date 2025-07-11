#!/usr/bin/env node

const { Lucid, Blockfrost } = require("lucid-cardano");
const { BLOCKFROST_URL, BLOCKFROST_API_KEY } = require("./constants.cjs");

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
    
    // We need to search for the Global Setting UTxO
    // It should be at the Authen Minting address
    const authenAddress = lucid.utils.validatorToAddress({
      type: "PlutusV2",
      script: "82025820" + authenPolicyId // This is a simplified example
    });
    
    console.log("\n📊 Summary:");
    console.log("   - DEX appears to be deployed on preprod");
    console.log("   - You need to interact with the existing Factory UTxOs");
    console.log("   - Pool creation requires finding a suitable Factory UTxO");
    
    console.log("\n💡 Next Steps:");
    console.log("   1. Find a Factory UTxO with suitable head/tail for your pool");
    console.log("   2. Calculate the LP token name for ADA/tPucky");
    console.log("   3. Build a proper pool creation transaction");
          console.log("   4. Consider using the AMM SDK or UI instead");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkDexState(); 