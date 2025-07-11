import { Lucid, Blockfrost } from "lucid-cardano";
import { BLOCKFROST_URL, BLOCKFROST_API_KEY } from "./constants";

async function testConnection() {
  try {
    console.log("🧪 Testing connection and wallet...");
    
    // Initialize Lucid
    const lucid = await Lucid.new(
      new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
      "Preprod"
    );
    
    // Test seed phrase
    const seedPhrase = process.argv.slice(2).join(" ");
    
    if (!seedPhrase || seedPhrase.split(" ").length !== 12) {
      console.error("❌ Error: Please provide a valid 12-word seed phrase");
      process.exit(1);
    }
    
    // Select wallet
    lucid.selectWalletFromSeed(seedPhrase);
    
    const address = await lucid.wallet.address();
    console.log(`\n✅ Wallet Address: ${address}`);
    
    // Get balance
    const utxos = await lucid.wallet.getUtxos();
    const adaBalance = utxos.reduce((sum, utxo) => sum + utxo.assets.lovelace, 0n);
    const tPuckyUnit = "c408426f2de9f774e5d59c8c4a93b8c1fb84528b21b444499e51ee1f745075636b79";
    const tPuckyBalance = utxos.reduce((sum, utxo) => sum + (utxo.assets[tPuckyUnit] || 0n), 0n);
    
    console.log(`\n💰 Balance:`);
    console.log(`   ADA: ${Number(adaBalance) / 1_000_000}`);
    console.log(`   tPucky: ${Number(tPuckyBalance).toLocaleString()}`);
    
    console.log(`\n✅ Connection test successful!`);
    
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

testConnection(); 