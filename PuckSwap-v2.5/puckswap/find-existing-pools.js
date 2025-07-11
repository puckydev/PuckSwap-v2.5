#!/usr/bin/env node

import { Lucid, Blockfrost, Data } from "lucid-cardano";
import crypto from "crypto";

// Configuration
const BLOCKFROST_URL = "https://cardano-preprod.blockfrost.io/api/v0";
const BLOCKFROST_API_KEY = "preprodd86p4euUeF6yIUbwl03sJJMD03aICMxL";

// AMM constants from deployment
const POOL_SCRIPT_HASH = "ea07b733d932129c378af627436e7cbc2ef0bf96e0036bb51b3bde6b";
const LP_TOKEN_POLICY_ID = "f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c";

// Token definitions
const ADA = { policyId: "", tokenName: "" };
const TPUCKY = {
  policyId: "c408426f2de9f774e5d59c8c4a93b8c1fb84528b21b444499e51ee1f",
  tokenName: "745075636b79"
};

function computeLPTokenName(assetA, assetB) {
  // Sort assets
  const [sortedA, sortedB] = sortAssets(assetA, assetB);
  
  // Compute SHA256 of each asset
  const hashA = crypto.createHash('sha256')
    .update(Buffer.from(sortedA.policyId + sortedA.tokenName, 'hex'))
    .digest();
  
  const hashB = crypto.createHash('sha256')
    .update(Buffer.from(sortedB.policyId + sortedB.tokenName, 'hex'))
    .digest();
  
  // Compute final hash
  const finalHash = crypto.createHash('sha256')
    .update(Buffer.concat([hashA, hashB]))
    .digest('hex');
  
  return finalHash;
}

function sortAssets(asset1, asset2) {
  const key1 = asset1.policyId + asset1.tokenName;
  const key2 = asset2.policyId + asset2.tokenName;
  
  if (key1 < key2) {
    return [asset1, asset2];
  } else {
    return [asset2, asset1];
  }
}

async function findExistingPools() {
  try {
    console.log("🔍 Searching for existing ADA/tPucky pools on Preprod");
    console.log("===================================================\n");
    
    // Initialize Lucid
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
      "Preprod"
    );
    
    // Compute expected LP token name for ADA/tPucky
    const expectedLPTokenName = computeLPTokenName(ADA, TPUCKY);
    console.log(`📊 Expected LP Token Name: ${expectedLPTokenName}`);
    console.log(`   LP Token Unit: ${LP_TOKEN_POLICY_ID}${expectedLPTokenName}\n`);
    
    // Get pool address
    const poolAddress = lucid.utils.validatorToAddress({
      type: "PlutusV2",
      script: POOL_SCRIPT_HASH
    });
    
    console.log(`🏊 Pool Address: ${poolAddress}`);
    console.log("\n🔎 Searching for pools...");
    
    try {
      // Get all UTxOs at pool address
      const poolUtxos = await lucid.utxosAt(poolAddress);
      console.log(`   Found ${poolUtxos.length} UTxOs at pool address`);
      
      // Look for ADA/tPucky pools
      let foundPool = false;
      for (const utxo of poolUtxos) {
        // Check if this UTxO contains our LP token
        const lpTokenUnit = LP_TOKEN_POLICY_ID + expectedLPTokenName;
        if (utxo.assets[lpTokenUnit]) {
          foundPool = true;
          console.log(`\n✅ Found potential ADA/tPucky pool!`);
          console.log(`   TxHash: ${utxo.txHash}#${utxo.outputIndex}`);
          console.log(`   LP Tokens: ${utxo.assets[lpTokenUnit]}`);
          
          // Check for ADA
          console.log(`   ADA: ${Number(utxo.assets.lovelace) / 1_000_000}`);
          
          // Check for tPucky
          const tPuckyUnit = TPUCKY.policyId + TPUCKY.tokenName;
          const tPuckyAmount = utxo.assets[tPuckyUnit] || 0n;
          console.log(`   tPucky: ${Number(tPuckyAmount).toLocaleString()}`);
          
          if (utxo.datum) {
            console.log(`   Has datum: Yes`);
            // You could parse the datum here to get more pool info
          }
        }
      }
      
      if (!foundPool) {
        console.log("\n❌ No ADA/tPucky pools found");
        console.log("   This means you'll need to create one");
      }
      
    } catch (error) {
      console.error("❌ Error fetching pool UTxOs:", error.message);
      console.log("\n💡 This might mean:");
      console.log("   - The pool address is incorrect");
      console.log("   - Network connectivity issues");
      console.log("   - Blockfrost API limits");
    }
    
    console.log("\n📝 Summary:");
    console.log("   - Pool creation on AMM V2 is complex");
    console.log("   - You need to go through the Factory contract");
    console.log("   - Consider using the official AMM tools");
    console.log("   - Or check if they have a testnet UI available");
    
  } catch (error) {
    console.error("❌ Fatal error:", error.message);
  }
}

findExistingPools(); 