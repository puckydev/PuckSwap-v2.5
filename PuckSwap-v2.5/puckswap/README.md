# PuckSwap (v2.5) - Experimental AMM DEX on Cardano

PuckSwap is an experimental Automated Market Maker (AMM) decentralized exchange (DEX) built on the Cardano blockchain, designed to enhance the image. Augmented with AI, this platform enables seamless token swaps between ADA and tPucky tokens on the Cardano preprod testnet.

## Overview

PuckSwap leverages battle-tested AMM V2 smart contracts to provide a secure and efficient trading experience. The platform features a retro-inspired terminal interface with Windows 98 aesthetics, combining nostalgic design with modern blockchain technology.

### Key Features

- **Token Swapping**: Seamless ADA ↔ tPucky trading pair
- **Automated Market Making**: Constant product formula (x*y=k) for price discovery
- **Low Fees**: 0.3% trading fee plus 2 ADA batcher fee
- **Multi-Wallet Support**: Compatible with major Cardano wallets
- **Image Enhancement Protocol**: Unique puck.fun feature for enhanced user experience
- **Calculator**: Built-in calculator for quick calculations
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

## Supported Wallets

PuckSwap supports the following Cardano wallets:

- **[Nami](https://namiwallet.io/)** - User-friendly browser extension wallet
- **[VESPR](https://github.com/vespr-wallet)** - Mobile-first Cardano wallet
- **[Eternl](https://eternl.io/)** - Feature-rich Cardano wallet (formerly CCVault)
- **[Lace](https://www.lace.io/)** - IOG's official light wallet
- **[Begin](https://begin.is/)** - Simple and secure mobile wallet
- **[Yoroi](https://yoroi-wallet.com/)** - EMURGO's official Cardano wallet
- **[Gero](https://www.gerowallet.io/)** - All-in-one Cardano wallet
- **[Typhon](https://typhonwallet.io/)** - Feature-complete Cardano wallet
- **[Flint](https://flint-wallet.com/)** - DApp connector wallet
- **[NuFi](https://nu.fi/)** - Non-custodial Web3 wallet

## Technical Architecture

### Smart Contracts

PuckSwap is built on top of audited AMM V2 smart contracts that implement:

- **Pool Validator**: Manages liquidity pools and ensures correct swap execution
- **Order Validator**: Handles user swap orders with slippage protection
- **Factory Validator**: Controls pool creation and configuration
- **LP Token Policy**: Mints/burns liquidity provider tokens

### Technology Stack

- **Blockchain**: Cardano (Preprod Testnet)
- **Smart Contract Language**: Aiken
- **Frontend Framework**: Vanilla JavaScript with ES6 modules
- **Transaction Building**: Lucid Evolution
- **Blockchain Provider**: Blockfrost API
- **Styling**: Custom CSS with Windows 98-inspired design

## Installation and Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- A Cardano wallet with preprod testnet ADA and tPucky tokens
- Modern web browser with wallet extension installed

### Installation Steps

```bash
# Clone the repository
git clone [repository-url]
cd PuckSwap-v2.5

# Install dependencies
npm install

# Build the project
npm run build
```

### Running the Application

```bash
# Start the web server
npm run serve

# Or use Python's built-in server
python3 -m http.server 8080

# Navigate to http://localhost:8080/PuckSwap-v2.5/puckswap/index.html
```

## Pool Creation and Management

### Initial Pool Setup

To create a liquidity pool, you'll need:
- Minimum 10,000 ADA (plus fees)
- Corresponding amount of tPucky tokens
- Access to pool creation tools (see POOL_SETUP_GUIDE.md)

### Pool Parameters

- **Trading Fee**: 0.3% (distributed to liquidity providers)
- **Batcher Fee**: 2 ADA (network operational cost)
- **Slippage Tolerance**: 0.5% (configurable)
- **Minimum Liquidity**: 1,000 ADA equivalent

## Security Considerations

- **Testnet Only**: This is experimental software designed for testnet use only
- **Audit Status**: Smart contracts have been audited by Anastasia Labs and CertiK
- **No Warranties**: Use at your own risk - no warranties expressed or implied
- **Private Keys**: Never share your seed phrase or private keys
- **Transaction Verification**: Always verify transaction details before signing

## Contributing

We welcome contributions to PuckSwap! Please see our contributing guidelines for:
- Code style and standards
- Testing requirements
- Pull request process
- Security disclosure policy

## Documentation

Additional documentation is available:
- `POOL_SETUP_GUIDE.md` - Detailed pool creation instructions
- `UI_USAGE_GUIDE.md` - User interface walkthrough
- `WALLET_SUPPORT.md` - Wallet-specific setup guides
- `SECURE_POOL_SETUP.md` - Security best practices
- `amm-v2-docs/` - Smart contract specifications

## Credits and Acknowledgments

### Smart Contract Development
- AMM V2 contracts based on proven DeFi protocols
- Audited by Anastasia Labs and CertiK

### Technology Partners
- **Cardano Foundation** - Blockchain infrastructure
- **Blockfrost** - API services
- **IOG** - Cardano development
- **EMURGO** - Ecosystem support

### Open Source Libraries
- **Lucid Evolution** - Transaction building
- **Aiken** - Smart contract language
- **DejaVu Fonts** - Typography

### Design Inspiration
- Windows 98 aesthetic for nostalgic user experience
- Terminal-style interface for crypto-native users

## License

This project is licensed under the MIT License - see LICENSE.md for details.

## Disclaimer

PuckSwap is experimental software intended for educational and testing purposes on the Cardano testnet. Do not use real funds. The developers assume no responsibility for any losses incurred through the use of this software.

## Contact and Support

- **GitHub Issues**: For bug reports and feature requests
- **Documentation**: Check our comprehensive guides
- **X (Twitter)**: [@puckydev](https://x.com/puckydev)
- **Website**: [PuckHub.io](https://PuckHub.io)

---

*PuckSwap - Enhancing the image, one swap at a time. Augmented with AI.* 