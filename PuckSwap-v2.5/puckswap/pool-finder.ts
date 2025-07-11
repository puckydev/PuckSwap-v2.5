import { Lucid, UTxO, Data, Constr } from "lucid-cardano";
import { ADA, TPUCKY } from "./constants";
import { Asset } from "../src/types/asset";
import { PoolDatum } from "../src/types/pool";
import { sha3 } from "../src/hash";

export function computeLPAssetName(assetA: Asset, assetB: Asset): string {
  const k1 = sha3(assetA.policyId + assetA.tokenName);
  const k2 = sha3(assetB.policyId + assetB.tokenName);
  return sha3(k1 + k2);
}

export async function findAdaTpuckyPool(
  lucid: Lucid,
  poolAddress: string,
  authenPolicyId: string
): Promise<UTxO | null> {
  try {
    // Get all UTxOs at the pool address
    const poolUtxos = await lucid.utxosAt(poolAddress);
    
    // Calculate the LP token for ADA-tPucky pool
    const lpTokenName = computeLPAssetName(ADA, TPUCKY);
    const lpToken = `${authenPolicyId}${lpTokenName}`;
    
    // Find the pool UTxO that contains the LP token
    for (const utxo of poolUtxos) {
      if (utxo.assets[lpToken] && utxo.datum) {
        try {
          // Try to decode the datum as PoolDatum
          const datum = Data.from(utxo.datum) as Constr;
          
          // Basic validation - check if it has the expected structure
          if (datum.fields && datum.fields.length >= 9) {
            const assetA = datum.fields[1] as Constr;
            const assetB = datum.fields[2] as Constr;
            
            // Check if this is our ADA-tPucky pool
            if (isAdaTpuckyPool(assetA, assetB)) {
              console.log("Found ADA-tPucky pool:", utxo.txHash);
              return utxo;
            }
          }
        } catch (e) {
          // Not a valid pool datum, continue
          continue;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error finding pool:", error);
    return null;
  }
}

function isAdaTpuckyPool(assetA: Constr, assetB: Constr): boolean {
  // Check if one asset is ADA and the other is tPucky
  const isFirstAda = assetA.fields[0] === "" && assetA.fields[1] === "";
  const isSecondAda = assetB.fields[0] === "" && assetB.fields[1] === "";
  
  const isFirstTpucky = assetA.fields[0] === TPUCKY.policyId && 
                        assetA.fields[1] === TPUCKY.tokenName;
  const isSecondTpucky = assetB.fields[0] === TPUCKY.policyId && 
                         assetB.fields[1] === TPUCKY.tokenName;
  
  return (isFirstAda && isSecondTpucky) || (isFirstTpucky && isSecondAda);
}

export function parsePoolDatum(datum: string): {
  assetA: Asset;
  assetB: Asset;
  reserveA: bigint;
  reserveB: bigint;
  totalLiquidity: bigint;
  baseFeeA: bigint;
  baseFeeB: bigint;
} {
  const poolDatum = Data.from(datum) as Constr;
  
  const assetA = poolDatum.fields[1] as Constr;
  const assetB = poolDatum.fields[2] as Constr;
  
  return {
    assetA: {
      policyId: assetA.fields[0] as string,
      tokenName: assetA.fields[1] as string,
    },
    assetB: {
      policyId: assetB.fields[0] as string,
      tokenName: assetB.fields[1] as string,
    },
    totalLiquidity: poolDatum.fields[3] as bigint,
    reserveA: poolDatum.fields[4] as bigint,
    reserveB: poolDatum.fields[5] as bigint,
    baseFeeA: poolDatum.fields[6] as bigint,
    baseFeeB: poolDatum.fields[7] as bigint,
  };
} 