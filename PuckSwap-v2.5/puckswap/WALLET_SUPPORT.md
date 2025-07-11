# Wallet Support for PuckSwap

## Overview

PuckSwap supports a wide range of Cardano wallets for connecting and interacting with the DEX. This guide covers all supported wallets, their features, and how to use them with PuckSwap.

## Supported Wallets

### 1. Nami Wallet
- **Status**: Fully Supported
- **Type**: Browser Extension
- **Network**: Preprod Testnet
- **Website**: https://namiwallet.io/
- **Platforms**: Chrome, Firefox, Edge, Brave
- **Features**: Simple interface, collateral support, hardware wallet integration

### 2. VESPR Wallet
- **Status**: Fully Supported
- **Type**: Mobile & Browser Extension
- **Network**: Preprod Testnet
- **Website**: https://github.com/vespr-wallet
- **Platforms**: iOS, Android, Chrome, Firefox
- **Features**: Mobile-first design, advanced DApp compatibility, hardware wallet support

### 3. Eternl Wallet (formerly CCVault)
- **Status**: Fully Supported
- **Type**: Browser Extension & Web App
- **Network**: Preprod Testnet
- **Website**: https://eternl.io/
- **Platforms**: Chrome, Firefox, Edge, Web App
- **Features**: Advanced features, multi-account support, stake pool management

### 4. Lace Wallet
- **Status**: Fully Supported
- **Type**: Browser Extension
- **Network**: Preprod Testnet
- **Website**: https://www.lace.io/
- **Platforms**: Chrome, Firefox, Edge
- **Features**: IOG's official wallet, NFT gallery, simple staking

### 5. Begin Wallet
- **Status**: Fully Supported
- **Type**: Mobile Wallet
- **Network**: Preprod Testnet
- **Website**: https://begin.is/
- **Platforms**: iOS, Android
- **Features**: Beginner-friendly, social features, NFT support

### 6. Yoroi Wallet
- **Status**: Fully Supported
- **Type**: Browser Extension & Mobile
- **Network**: Preprod Testnet
- **Website**: https://yoroi-wallet.com/
- **Platforms**: Chrome, Firefox, Edge, iOS, Android
- **Features**: EMURGO's official wallet, light client, hardware wallet support

### 7. Gero Wallet
- **Status**: Fully Supported
- **Type**: Browser Extension & Mobile
- **Network**: Preprod Testnet
- **Website**: https://www.gerowallet.io/
- **Platforms**: Chrome, Firefox, iOS, Android
- **Features**: All-in-one wallet, DeFi focused, portfolio tracking

### 8. Typhon Wallet
- **Status**: Fully Supported
- **Type**: Browser Extension
- **Network**: Preprod Testnet
- **Website**: https://typhonwallet.io/
- **Platforms**: Chrome, Firefox, Edge
- **Features**: Feature-complete, multi-sig support, advanced transaction builder

### 9. Flint Wallet
- **Status**: Supported (Check availability)
- **Type**: Browser Extension
- **Network**: Preprod Testnet
- **Website**: https://flint-wallet.com/
- **Platforms**: Chrome, Firefox
- **Features**: DApp connector, lightweight, developer-friendly

### 10. NuFi Wallet
- **Status**: Supported (Check availability)
- **Type**: Browser Extension
- **Network**: Preprod Testnet
- **Website**: https://nu.fi/
- **Platforms**: Chrome, Firefox, Edge
- **Features**: Multi-chain support, DeFi aggregator, portfolio management

## Wallet Features Comparison

| Wallet | Mobile | Extension | Hardware Support | Multi-Account | NFT Support |
|--------|--------|-----------|------------------|---------------|-------------|
| Nami | ❌ | ✅ | ✅ | ❌ | ✅ |
| VESPR | ✅ | ✅ | ✅ | ✅ | ✅ |
| Eternl | ❌ | ✅ | ✅ | ✅ | ✅ |
| Lace | ❌ | ✅ | ❌ | ❌ | ✅ |
| Begin | ✅ | ❌ | ❌ | ❌ | ✅ |
| Yoroi | ✅ | ✅ | ✅ | ❌ | ✅ |
| Gero | ✅ | ✅ | ❌ | ✅ | ✅ |
| Typhon | ❌ | ✅ | ✅ | ✅ | ✅ |
| Flint | ❌ | ✅ | ❌ | ❌ | ✅ |
| NuFi | ❌ | ✅ | ✅ | ✅ | ✅ |

## Connecting Your Wallet

1. **Install the Wallet**: Download and install your preferred wallet from the official website
2. **Switch to Preprod**: Ensure your wallet is set to the Cardano Preprod testnet
3. **Get Test ADA**: Obtain test ADA from the Cardano testnet faucet
4. **Connect to PuckSwap**: Click "Connect Wallet" and select your wallet from the list
5. **Approve Connection**: Authorize the connection in your wallet popup

## Troubleshooting

### "No Cardano wallet detected"
- Ensure at least one supported wallet extension is installed
- Check that the wallet extension is enabled in your browser
- Try refreshing the page after installation

### Connection Failed
- Verify your wallet is unlocked
- Confirm you're on the Cardano Preprod testnet
- Check browser permissions for the wallet extension
- Clear browser cache and cookies if issues persist

### Transaction Failures
- Ensure sufficient ADA balance for fees (minimum 5 ADA recommended)
- Check collateral is set (if required by your wallet)
- Verify token balances before swapping
- Review transaction details carefully before signing

## Security Best Practices

1. **Never share your seed phrase or private keys**
2. **Always verify the website URL**: Ensure you're on the official PuckSwap site
3. **Check transaction details**: Review all transaction parameters before signing
4. **Use hardware wallets**: For significant amounts, use hardware wallet integration
5. **Keep wallets updated**: Regularly update your wallet software
6. **Enable 2FA**: Where available, enable two-factor authentication

## Wallet-Specific Notes

### VESPR
- Features "advanced compatibility mode" for maximum DApp support
- Excellent mobile experience with QR code scanning
- Supports Ledger, Trezor, and Keystone hardware wallets

### Eternl
- Most feature-rich wallet with advanced transaction building
- Excellent for power users and developers
- Comprehensive stake pool analytics

### Lace
- Official IOG wallet with focus on simplicity
- Great for beginners
- Integrated NFT gallery and marketplace features

### Yoroi
- EMURGO's official wallet
- Lightweight and fast
- Good balance of features and simplicity

## Getting Test Tokens

To use PuckSwap on testnet, you'll need:

1. **Test ADA**: Get from the [Cardano Testnet Faucet](https://docs.cardano.org/cardano-testnet/tools/faucet)
2. **Test tPucky**: Available through testnet token distributions or minting

## Support

If you encounter issues with wallet connectivity:

1. Check our troubleshooting guide above
2. Consult the wallet's official documentation
3. Join the wallet's community support channels
4. Report persistent issues on our GitHub repository

## Future Development

We continuously work to improve wallet compatibility and add support for new wallets as they become available. Stay tuned for updates!

---

*Last updated: January 2025* 