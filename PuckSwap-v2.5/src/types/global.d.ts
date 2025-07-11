interface CardanoWalletApi {
  enable(): Promise<any>;
  isEnabled(): Promise<boolean>;
  getNetworkId(): Promise<number>;
  getUtxos(): Promise<any[]>;
  getBalance(): Promise<string>;
  getUsedAddresses(): Promise<string[]>;
  getUnusedAddresses(): Promise<string[]>;
  getChangeAddress(): Promise<string>;
  getRewardAddresses(): Promise<string[]>;
  signTx(tx: string, partialSign: boolean): Promise<string>;
  signData(address: string, payload: string): Promise<any>;
  submitTx(tx: string): Promise<string>;
}

interface CardanoWallet {
  name: string;
  icon: string;
  apiVersion: string;
  enable(): Promise<CardanoWalletApi>;
  isEnabled(): Promise<boolean>;
}

declare global {
  interface Window {
    cardano?: {
      nami?: CardanoWallet;
      vespr?: CardanoWallet;
      [key: string]: CardanoWallet | undefined;
    };
  }
}

export {}; 