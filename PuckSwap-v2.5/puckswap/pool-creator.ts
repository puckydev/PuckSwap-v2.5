import { Lucid, Data, Constr, UTxO } from "lucid-cardano";
import { ADA, TPUCKY } from "./constants";
import { Asset } from "../src/types/asset";
import { PoolDatum } from "../src/types/pool";
import { computeLPAssetName } from "./pool-finder";
import { getContractScripts } from "../src/script";
import { NetworkId } from "../src/types/network";

export interface PoolCreationParams {
  initialAda: bigint; // Amount of ADA to provide
  initialTPucky: bigint; // Amount of tPucky to provide
  tradingFeePercent: number; // e.g., 0.3 for 0.3%
}

export async function createAdaTpuckyPool(
  lucid: Lucid,
  params: PoolCreationParams,
  userAddress: string
): Promise<string> {
  const scripts = getContractScripts(lucid, NetworkId.TESTNET);
  
  // Sort assets (ADA should come first)
  const [assetA, assetB, amountA, amountB] = sortAssets(
    ADA, 
    TPUCKY, 
    params.initialAda, 
    params.initialTPucky
  );
  
  // Calculate initial liquidity
  const initialLiquidity = sqrt(amountA * amountB);
  
  // Convert trading fee percentage to numerator (denominator is 10000)
  const tradingFeeNumerator = BigInt(Math.floor(params.tradingFeePercent * 100));
  
  // Find suitable factory UTxO
  const factoryUtxo = await findSuitableFactoryUtxo(lucid, scripts.factoryEnterpriseAddress, assetA, assetB);
  if (!factoryUtxo) {
    throw new Error("No suitable factory UTxO found for pool creation");
  }
  
  // Parse factory datum
  const factoryDatum = Data.from(factoryUtxo.datum!) as Constr;
  const head = factoryDatum.fields[0] as string;
  const tail = factoryDatum.fields[1] as string;
  
  // Compute LP asset name
  const lpAssetName = computeLPAssetName(assetA, assetB);
  
  // Build pool datum
  const poolDatum: PoolDatum = {
    poolBatchingStakeCredential: scripts.poolBatchingCredential,
    assetA: assetA,
    assetB: assetB,
    totalLiquidity: initialLiquidity,
    reserveA: amountA,
    reserveB: amountB,
    baseFee: {
      feeANumerator: tradingFeeNumerator,
      feeBNumerator: tradingFeeNumerator,
    },
    feeSharingNumerator: undefined,
    allowDynamicFee: false,
  };
  
  // Calculate pool value
  const poolValue: Record<string, bigint> = {
    lovelace: 4_500000n + amountA, // min ADA + reserve if asset A is ADA
    [scripts.poolAuthenAsset.policyId + scripts.poolAuthenAsset.tokenName]: 1n,
    [scripts.lpPolicyId + lpAssetName]: BigInt("9223372036854775807") - initialLiquidity, // MAX_INT64 - initial liquidity
  };
  
  if (assetB.policyId !== "") {
    poolValue[Asset.toString(assetB)] = amountB;
  }
  
  // Build transaction
  const tx = await lucid
    .newTx()
    .collectFrom([factoryUtxo], Data.to(new Constr(0, [Asset.toPlutus(assetA), Asset.toPlutus(assetB)])))
    .attachSpendingValidator(scripts.factoryScript)
    .mintAssets({
      [scripts.poolAuthenAsset.policyId + scripts.poolAuthenAsset.tokenName]: 1n,
      [scripts.factoryAsset.policyId + scripts.factoryAsset.tokenName]: 1n,
      [scripts.lpPolicyId + lpAssetName]: BigInt("9223372036854775807"), // MAX_INT64
    }, Data.to(new Constr(1, []))) // CreatePool redeemer
    .attachMintingPolicy(scripts.authenScript)
    .payToContract(
      scripts.poolEnterpriseAddress,
      {
        inline: Data.to(PoolDatum.toPlutus(poolDatum)),
      },
      poolValue
    )
    .payToContract(
      scripts.factoryEnterpriseAddress,
      {
        inline: Data.to(new Constr(0, [head, lpAssetName])),
      },
      {
        lovelace: 2_000000n,
        [scripts.factoryAsset.policyId + scripts.factoryAsset.tokenName]: 1n,
      }
    )
    .payToContract(
      scripts.factoryEnterpriseAddress,
      {
        inline: Data.to(new Constr(0, [lpAssetName, tail])),
      },
      {
        lovelace: 2_000000n,
        [scripts.factoryAsset.policyId + scripts.factoryAsset.tokenName]: 1n,
      }
    )
    .complete();
  
  const signedTx = await tx.sign().complete();
  return signedTx.submit();
}

async function findSuitableFactoryUtxo(
  lucid: Lucid,
  factoryAddress: string,
  assetA: Asset,
  assetB: Asset
): Promise<UTxO | null> {
  const factoryUtxos = await lucid.utxosAt(factoryAddress);
  const lpAssetName = computeLPAssetName(assetA, assetB);
  
  for (const utxo of factoryUtxos) {
    if (utxo.datum) {
      const datum = Data.from(utxo.datum) as Constr;
      const head = datum.fields[0] as string;
      const tail = datum.fields[1] as string;
      
      // Check if lpAssetName is between head and tail
      if (head < lpAssetName && lpAssetName < tail) {
        return utxo;
      }
    }
  }
  
  return null;
}

function sortAssets(
  asset1: Asset,
  asset2: Asset,
  amount1: bigint,
  amount2: bigint
): [Asset, Asset, bigint, bigint] {
  const key1 = asset1.policyId + asset1.tokenName;
  const key2 = asset2.policyId + asset2.tokenName;
  
  if (key1 < key2) {
    return [asset1, asset2, amount1, amount2];
  } else {
    return [asset2, asset1, amount2, amount1];
  }
}

function sqrt(n: bigint): bigint {
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