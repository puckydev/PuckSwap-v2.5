import { createLucidInstance, connectWallet } from "./blockfrost-provider";
import { findAdaTpuckyPool, computeLPAssetName } from "./pool-finder";
import { createAdaTpuckyPool } from "./pool-creator";
import { buildSwapTransaction, SwapParams, checkUserBalance } from "./swap-builder";
import { ADA, TPUCKY, TEST_WALLET_ADDRESS } from "./constants";
import { getContractScripts } from "../src/script";
import { NetworkId } from "../src/types/network";
import inquirer from 'inquirer';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

async function main() {
  console.log(chalk.blue.bold("\nPuckSwap CLI - Testnet Setup Tool\n"));

  const command = process.argv[2];
  
  if (!command) {
    showHelp();
    return;
  }

  try {
    const lucid = await createLucidInstance();
    console.log("✅ Connected to Cardano Preprod testnet");

    switch (command) {
      case "check-pool":
        await checkPool(lucid);
        break;
      
      case "create-pool":
        await createPool(lucid);
        break;
      
      case "test-swap":
        await testSwap(lucid);
        break;
      
      case "check-balance":
        await checkBalance(lucid);
        break;
      
      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
Usage: npm run puckswap [command]

Commands:
  check-pool     Check if ADA-tPucky pool exists
  create-pool    Create ADA-tPucky liquidity pool
  test-swap      Test a swap transaction
  check-balance  Check wallet balances

Example:
  npm run puckswap check-pool
  `);
}

async function checkPool(lucid: any) {
  console.log("\n🔍 Checking for ADA-tPucky pool...");
  
  const scripts = getContractScripts(lucid, NetworkId.TESTNET);
  const poolUtxo = await findAdaTpuckyPool(
    lucid,
    scripts.poolAddress,
    scripts.authenPolicyId
  );
  
  if (poolUtxo) {
    console.log("✅ Pool found!");
    console.log(`   Transaction: ${poolUtxo.txHash}#${poolUtxo.outputIndex}`);
    console.log(`   Address: ${poolUtxo.address}`);
    
    // Show pool details
    const lpTokenName = computeLPAssetName(ADA, TPUCKY);
    const lpToken = `${scripts.authenPolicyId}${lpTokenName}`;
    console.log(`   LP Token: ${lpToken}`);
  } else {
    console.log("❌ No ADA-tPucky pool found");
    console.log("   Run 'npm run puckswap create-pool' to create one");
  }
}

async function createPool(lucid: any) {
  console.log("\n🏊 Creating ADA-tPucky liquidity pool...");
  
  // Get private key from environment or prompt
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ Please set WALLET_PRIVATE_KEY environment variable");
    console.log("   Export your wallet's private key (bech32 format starting with 'ed25519_sk1...')");
    return;
  }
  
  await connectWallet(lucid, privateKey);
  const address = await lucid.wallet.address();
  console.log(`✅ Connected wallet: ${address}`);
  
  // Check if pool already exists
  const scripts = getContractScripts(lucid, NetworkId.TESTNET);
  const existingPool = await findAdaTpuckyPool(
    lucid,
    scripts.poolAddress,
    scripts.authenPolicyId
  );
  
  if (existingPool) {
    console.log("⚠️  Pool already exists!");
    return;
  }
  
  // Get pool creation parameters
  const initialAda = BigInt(process.argv[3] || "1000") * 1_000_000n; // Default 1000 ADA
  const initialTPucky = BigInt(process.argv[4] || "1000000"); // Default 1M tPucky
  const tradingFee = parseFloat(process.argv[5] || "0.3"); // Default 0.3%
  
  console.log("\nPool parameters:");
  console.log(`  Initial ADA: ${Number(initialAda) / 1_000_000}`);
  console.log(`  Initial tPucky: ${Number(initialTPucky).toLocaleString()}`);
  console.log(`  Trading fee: ${tradingFee}%`);
  
  try {
    const txHash = await createAdaTpuckyPool(lucid, {
      initialAda,
      initialTPucky,
      tradingFeePercent: tradingFee,
    }, address);
    
    console.log("\n✅ Pool creation transaction submitted!");
    console.log(`   Transaction hash: ${txHash}`);
    console.log("   Waiting for confirmation...");
    
    await lucid.awaitTx(txHash);
    console.log("✅ Pool created successfully!");
  } catch (error) {
    console.error("❌ Failed to create pool:", error.message);
  }
}

async function testSwap(lucid: any) {
  console.log("\n💱 Testing swap transaction...");
  
  // Get private key from environment
  const privateKey = process.env.WALLET_PRIVATE_KEY;
  if (!privateKey) {
    console.error("❌ Please set WALLET_PRIVATE_KEY environment variable");
    return;
  }
  
  await connectWallet(lucid, privateKey);
  const address = await lucid.wallet.address();
  console.log(`✅ Connected wallet: ${address}`);
  
  // Find pool
  const scripts = getContractScripts(lucid, NetworkId.TESTNET);
  const poolUtxo = await findAdaTpuckyPool(
    lucid,
    scripts.poolAddress,
    scripts.authenPolicyId
  );
  
  if (!poolUtxo) {
    console.error("❌ No pool found. Create one first with 'create-pool' command");
    return;
  }
  
  // Get swap parameters
  const fromAsset = (process.argv[3] || "ADA") as "ADA" | "tPucky";
  const amount = BigInt(process.argv[4] || "10");
  const amountIn = fromAsset === "ADA" ? amount * 1_000_000n : amount;
  
  const swapParams: SwapParams = {
    fromAsset,
    toAsset: fromAsset === "ADA" ? "tPucky" : "ADA",
    amountIn,
    slippageTolerance: 0.5,
    userAddress: address,
  };
  
  console.log("\nSwap parameters:");
  console.log(`  From: ${fromAsset === "ADA" ? Number(amountIn) / 1_000_000 : Number(amountIn)} ${fromAsset}`);
  console.log(`  To: ${swapParams.toAsset}`);
  console.log(`  Slippage: ${swapParams.slippageTolerance}%`);
  
  // Check balance
  const hasBalance = await checkUserBalance(lucid, address, fromAsset, amountIn);
  if (!hasBalance) {
    console.error("❌ Insufficient balance for swap");
    return;
  }
  
  try {
    const lpAsset = {
      policyId: scripts.authenPolicyId,
      tokenName: computeLPAssetName(ADA, TPUCKY),
    };
    
    const txHash = await buildSwapTransaction(
      lucid,
      swapParams,
      poolUtxo,
      scripts.orderAddress,
      lpAsset
    );
    
    console.log("\n✅ Swap order submitted!");
    console.log(`   Transaction hash: ${txHash}`);
    console.log("   Order will be processed by the next batcher run");
  } catch (error) {
    console.error("❌ Failed to submit swap:", error.message);
  }
}

async function checkBalance(lucid: any) {
  console.log("\n💰 Checking wallet balance...");
  
  const address = process.argv[3] || TEST_WALLET_ADDRESS;
  console.log(`Address: ${address}`);
  
  try {
    const utxos = await lucid.utxosAt(address);
    
    // Calculate balances
    const adaBalance = utxos.reduce(
      (sum, utxo) => sum + (utxo.assets.lovelace || 0n),
      0n
    );
    
    const tPuckyUnit = `${TPUCKY.policyId}${TPUCKY.tokenName}`;
    const tPuckyBalance = utxos.reduce(
      (sum, utxo) => sum + (utxo.assets[tPuckyUnit] || 0n),
      0n
    );
    
    console.log("\nBalances:");
    console.log(`  ADA: ${(Number(adaBalance) / 1_000_000).toFixed(6)}`);
    console.log(`  tPucky: ${Number(tPuckyBalance).toLocaleString()}`);
    console.log(`\nTotal UTxOs: ${utxos.length}`);
  } catch (error) {
    console.error("❌ Failed to check balance:", error.message);
  }
}

// Run the CLI
main().catch(console.error); 