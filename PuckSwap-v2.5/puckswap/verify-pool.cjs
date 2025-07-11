const { Blockfrost, Lucid } = require("lucid-cardano");
const { BLOCKFROST_URL, BLOCKFROST_API_KEY, PREPROD_DEPLOYMENT } = require("./constants.cjs");

async function verifyPool() {
    console.log("🔍 Verifying ADA/tPucky Pool on Preprod");
    console.log("=====================================\n");

    try {
        // Initialize Lucid
        const blockfrost = new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY);
        const lucid = await Lucid.new(blockfrost, "Preprod");

        const poolAddress = "addr_test1zrtt4xm4p84vse3g3l6swtf2rqs943t0w39ustwdszxt3l5rajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqhns793";
        console.log(`📍 Pool Address: ${poolAddress}`);

        // Get UTxOs at pool address
        const poolUtxos = await lucid.utxosAt(poolAddress);
        console.log(`\n📊 Found ${poolUtxos.length} UTxOs at pool address`);

        // Define tokens
        const tPuckyUnit = "c408426f2de9f774e5d59c8c4a93b8c1fb84528b21b444499e51ee1f745075636b79";
        const lpPolicyId = "d6ba9b7509eac866288ff5072d2a18205ac56f744bc82dcd808cb8fe";

        // Find the pool UTxO
        for (const utxo of poolUtxos) {
            console.log(`\n🔎 Checking UTxO: ${utxo.txHash}#${utxo.outputIndex}`);
            
            // Check for tPucky
            if (utxo.assets[tPuckyUnit]) {
                console.log("✅ Found tPucky in this UTxO!");
                
                // Check for LP tokens
                const lpTokens = Object.keys(utxo.assets).filter(unit => 
                    unit.startsWith(lpPolicyId) && unit !== tPuckyUnit
                );
                
                if (lpTokens.length > 0) {
                    console.log("✅ Found LP Token!");
                    console.log("\n🏊 Pool Details:");
                    console.log(`   Transaction: ${utxo.txHash}`);
                    console.log(`   ADA Reserve: ${(Number(utxo.assets.lovelace) / 1_000_000).toLocaleString()} ADA`);
                    console.log(`   tPucky Reserve: ${Number(utxo.assets[tPuckyUnit]).toLocaleString()} tPucky`);
                    console.log(`   LP Token: ${lpTokens[0]}`);
                    
                    const rate = Number(utxo.assets[tPuckyUnit]) / (Number(utxo.assets.lovelace) / 1_000_000);
                    console.log(`   Exchange Rate: 1 ADA = ${rate.toFixed(2)} tPucky`);
                    
                    console.log("\n✅ Pool is active and ready for trading!");
                    return;
                }
            }
        }

        console.log("\n❌ No valid pool found at this address");
        console.log("   Make sure the pool creation transaction was successful");

    } catch (error) {
        console.error("\n❌ Error verifying pool:", error.message);
        if (error.message.includes("404")) {
            console.error("   The address might not exist or have no UTxOs");
        }
    }
}

// Run verification
verifyPool().catch(console.error);
