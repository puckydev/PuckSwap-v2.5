import { Blockfrost, Lucid } from "lucid-cardano";
import { BLOCKFROST_URL, BLOCKFROST_API_KEY } from "./constants";

export async function createLucidInstance(): Promise<Lucid> {
  const lucid = await Lucid.new(
    new Blockfrost(BLOCKFROST_URL, BLOCKFROST_API_KEY),
    "Preprod"
  );
  
  return lucid;
}

export async function connectWallet(lucid: Lucid, privateKey?: string): Promise<void> {
  if (privateKey) {
    // Use provided private key
    lucid.selectWalletFromPrivateKey(privateKey);
  } else if (typeof window !== 'undefined' && window.cardano) {
    // Browser environment - connect to wallet
    // Check for available wallets
    const hasNami = window.cardano.nami;
    const hasVespr = window.cardano.vespr;
    
    if (!hasNami && !hasVespr) {
      throw new Error("No supported wallet found. Please install Nami or VESPR wallet.");
    }
    
    // Try VESPR first, then Nami
    let api;
    if (hasVespr) {
      api = await window.cardano.vespr.enable();
    } else if (hasNami) {
      api = await window.cardano.nami.enable();
    }
    
    lucid.selectWallet(api);
  } else {
    throw new Error("No wallet connection method available");
  }
} 