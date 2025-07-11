import { 
  Lucid, 
  Data, 
  Constr, 
  UTxO,
  toHex,
  fromText
} from "lucid-cardano";
import { 
  ADA, 
  TPUCKY, 
  PUCKSWAP_CONFIG,
  TEST_WALLET_ADDRESS 
} from "./constants";
import { Asset } from "../src/types/asset";
import { 
  OrderDatum,
  OrderDirection,
  OrderKillable,
  OrderAuthorizationMethodType,
  OrderExtraDatumType
} from "../src/types/order";
import { LucidCredential } from "../src/types/address";
import { parsePoolDatum } from "./pool-finder";

const DEFAULT_FEE_DENOMINATOR = 10000n;

export interface SwapParams {
  fromAsset: "ADA" | "tPucky";
  toAsset: "ADA" | "tPucky";
  amountIn: bigint;
  slippageTolerance: number; // percentage, e.g., 0.5 for 0.5%
  userAddress: string;
}

export interface SwapQuote {
  amountIn: bigint;
  estimatedAmountOut: bigint;
  minimumAmountOut: bigint;
  priceImpact: number;
  fee: bigint;
  exchangeRate: string;
}

export function calculateAmountOut(
  reserveIn: bigint,
  reserveOut: bigint,
  amountIn: bigint,
  tradingFee: bigint
): bigint {
  const diff = DEFAULT_FEE_DENOMINATOR - tradingFee;
  const inWithFee = diff * amountIn;
  const numerator = inWithFee * reserveOut;
  const denominator = DEFAULT_FEE_DENOMINATOR * reserveIn + inWithFee;
  return numerator / denominator;
}

export function getSwapQuote(
  params: SwapParams,
  poolDatum: ReturnType<typeof parsePoolDatum>
): SwapQuote {
  const isAToB = params.fromAsset === "ADA";
  const [reserveIn, reserveOut, tradingFee] = isAToB
    ? [poolDatum.reserveA, poolDatum.reserveB, poolDatum.baseFeeA]
    : [poolDatum.reserveB, poolDatum.reserveA, poolDatum.baseFeeB];

  const estimatedAmountOut = calculateAmountOut(
    reserveIn,
    reserveOut,
    params.amountIn,
    tradingFee
  );

  // Calculate minimum amount out with slippage
  const slippageMultiplier = 1 - params.slippageTolerance / 100;
  const minimumAmountOut = BigInt(
    Math.floor(Number(estimatedAmountOut) * slippageMultiplier)
  );

  // Calculate price impact
  const priceImpact = calculatePriceImpact(
    reserveIn,
    reserveOut,
    params.amountIn,
    estimatedAmountOut
  );

  // Calculate exchange rate
  const rate = isAToB
    ? Number(estimatedAmountOut) / Number(params.amountIn)
    : Number(params.amountIn) / Number(estimatedAmountOut);
  
  const exchangeRate = isAToB
    ? `1 ADA = ${rate.toFixed(6)} tPucky`
    : `1 tPucky = ${rate.toFixed(6)} ADA`;

  return {
    amountIn: params.amountIn,
    estimatedAmountOut,
    minimumAmountOut,
    priceImpact,
    fee: PUCKSWAP_CONFIG.batcherFee,
    exchangeRate,
  };
}

function calculatePriceImpact(
  reserveIn: bigint,
  reserveOut: bigint,
  amountIn: bigint,
  amountOut: bigint
): number {
  const oldPrice = Number(reserveOut) / Number(reserveIn);
  const newReserveIn = Number(reserveIn) + Number(amountIn);
  const newReserveOut = Number(reserveOut) - Number(amountOut);
  const newPrice = newReserveOut / newReserveIn;
  
  return ((oldPrice - newPrice) / oldPrice) * 100;
}

export async function buildSwapTransaction(
  lucid: Lucid,
  params: SwapParams,
  poolUtxo: UTxO,
  orderAddress: string,
  lpAsset: Asset
): Promise<string> {
  const poolDatum = parsePoolDatum(poolUtxo.datum!);
  const quote = getSwapQuote(params, poolDatum);
  
  // Determine swap direction
  const direction = params.fromAsset === "ADA" 
    ? OrderDirection.A_TO_B 
    : OrderDirection.B_TO_A;
  
  // Get user's payment credential
  const userCredential = lucid.utils.paymentCredentialOf(params.userAddress);
  
  // Build order datum
  const orderDatum: OrderDatum = {
    canceller: {
      type: OrderAuthorizationMethodType.SIGNATURE,
      hash: userCredential.hash,
    },
    refundReceiver: params.userAddress,
    refundReceiverDatum: {
      type: OrderExtraDatumType.NO_DATUM,
    },
    successReceiver: params.userAddress,
    successReceiverDatum: {
      type: OrderExtraDatumType.NO_DATUM,
    },
    lpAsset: lpAsset,
    batcherFee: PUCKSWAP_CONFIG.batcherFee,
    expiredOptions: undefined,
    step: {
      type: "SwapExactIn",
      direction: direction,
      swapAmount: {
        type: "SpecificAmount",
        amount: params.amountIn,
      },
      minimumReceive: quote.minimumAmountOut,
      killable: OrderKillable.KILL_ON_FAILED,
    },
  };

  // Build the order value
  const orderValue: Record<string, bigint> = {
    lovelace: PUCKSWAP_CONFIG.batcherFee + 2_000000n, // batcher fee + min ADA
  };

  if (params.fromAsset === "tPucky") {
    const tPuckyUnit = Asset.toString(TPUCKY);
    orderValue[tPuckyUnit] = params.amountIn;
  } else {
    orderValue.lovelace += params.amountIn;
  }

  // Build transaction
  const tx = await lucid
    .newTx()
    .payToContract(
      orderAddress,
      {
        inline: Data.to(OrderDatum.toPlutus(orderDatum)),
      },
      orderValue
    )
    .complete();

  const signedTx = await tx.sign().complete();
  return signedTx.submit();
}

// Helper function to check if user has sufficient balance
export async function checkUserBalance(
  lucid: Lucid,
  userAddress: string,
  asset: "ADA" | "tPucky",
  amount: bigint
): Promise<boolean> {
  const utxos = await lucid.utxosAt(userAddress);
  
  if (asset === "ADA") {
    const totalAda = utxos.reduce(
      (sum, utxo) => sum + (utxo.assets.lovelace || 0n),
      0n
    );
    return totalAda >= amount + PUCKSWAP_CONFIG.batcherFee + 5_000000n; // Include fees and min UTxO
  } else {
    const tPuckyUnit = Asset.toString(TPUCKY);
    const totalTPucky = utxos.reduce(
      (sum, utxo) => sum + (utxo.assets[tPuckyUnit] || 0n),
      0n
    );
    return totalTPucky >= amount;
  }
} 