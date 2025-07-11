#!/usr/bin/env node

import { spawn } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.clear();
console.log("PuckSwap Interactive Pool Setup");
console.log("===============================\n");
console.log("\nThis will help you create an ADA-tPucky liquidity pool on Cardano Preprod.\n");

console.log("⚠️  SECURITY WARNING: Never share your seed phrase with anyone!");
console.log("\nPlease enter your 12-word seed phrase (separated by spaces):");

rl.question("> ", (seedPhrase) => {
  const words = seedPhrase.trim().split(/\s+/);
  
  if (words.length !== 12) {
    console.error("\n❌ Error: Invalid seed phrase. Please provide exactly 12 words.");
    rl.close();
    process.exit(1);
  }
  
  console.log("\n🚀 Starting pool creation...");
  console.log("This will create a pool with:");
  console.log("   - 10,000 ADA");
  console.log("   - 10,000,000,000 tPucky");
  console.log("   - 0.3% trading fee\n");
  
  // Run the create-pool-js script with the seed phrase
  const createPool = spawn('npm', ['run', 'create-pool-js', ...words], {
    stdio: 'inherit',
    shell: true
  });
  
  createPool.on('close', (code) => {
    if (code === 0) {
      console.log("\n✅ Pool setup completed successfully!");
    } else {
      console.log("\n❌ Pool setup failed. Please check the error messages above.");
    }
    rl.close();
  });
  
  createPool.on('error', (err) => {
    console.error("\n❌ Failed to start pool creation:", err);
    rl.close();
  });
}); 