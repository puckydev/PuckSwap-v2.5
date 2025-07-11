# PuckSwap (v2.5) - Experimental AMM DEX on Cardano

PuckSwap is an experimental Automated Market Maker (AMM) decentralized exchange (DEX) built on the Cardano blockchain, designed to enhance the image. Augmented with AI, this platform enables seamless token swaps on the Cardano preprod testnet.

## Project Overview

PuckSwap leverages audited AMM V2 smart contracts to provide a secure and efficient trading experience. The platform features a unique retro-inspired terminal interface with Windows 98 aesthetics, combining nostalgic design with modern blockchain technology.

### Key Features

- **Automated Market Making**: Constant product formula (x*y=k) for price discovery
- **Low Fees**: 0.3% trading fee plus 2 ADA batcher fee
- **Multi-Wallet Support**: Compatible with 10+ major Cardano wallets
- **Image Enhancement Protocol**: Unique puck.fun feature
- **AI Augmentation**: Enhanced user experience through AI integration
- **Audited Contracts**: Smart contracts audited by CertiK and Anastasia Labs

## Repository Structure

```
PuckSwap-v2.5/
├── validators/           # Aiken smart contracts
├── lib/amm_dex_v2/      # AMM library modules
├── puckswap/            # Frontend application
├── deployed/            # Deployment information
├── audit-report/        # Security audit reports
└── amm-v2-docs/         # Technical documentation
```

## Smart Contracts

### Main Contracts
- [Authen Minting Policy](/validators/authen_minting_policy.ak)
- [Pool Factory Validator](/validators/factory_validator.ak)
- [Liquidity Pool Validator](/validators/pool_validator.ak)
- [Order Validator](/validators/order_validator.ak)

### Library
AMM DEX V2 library modules are located under [/lib/amm_dex_v2](/lib/amm_dex_v2):
- `math.ak` - Mathematical operations for AMM calculations
- `order_validation.ak` - Order validation logic
- `pool_validation.ak` - Pool state validation
- `types.ak` - Type definitions
- `utils.ak` - Utility functions

## Building the Project

### Prerequisites
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Install [Aiken v1.0.24-alpha](https://aiken-lang.org/installation-instructions)

### Build Steps
```bash
# Build smart contracts
aiken build

# Install dependencies
npm install

# Build deployment scripts
npm run exec src/build-plutus.ts
```

## Testing

Run all unit tests:
```bash
aiken check
```

## Deployment Status

### Testnet (Preprod)
The smart contracts are deployed on Cardano Preprod testnet.
- Deployment details: [/deployed/preprod/references.json](/deployed/preprod/references.json)
- Parameters: [/deployed/preprod/params.json](/deployed/preprod/params.json)

### Mainnet
The smart contracts are deployed on Cardano Mainnet.
- Deployment details: [/deployed/mainnet/references.json](/deployed/mainnet/references.json)
- Parameters: [/deployed/mainnet/params.json](/deployed/mainnet/params.json)

#### Key Addresses and Tokens
- **LP Token Policy ID**: `f5808c2c990d86da54bfc97d89cee6efa20cd8461616359478d96b4c`
- **Pool Script Hash**: `ea07b733d932129c378af627436e7cbc2ef0bf96e0036bb51b3bde6b`
- **Order Script Hash**: `c3e28c36c3447315ba5a56f33da6a6ddc1770a876a8d9f0cb3a97c4c`
- **Factory Script Hash**: `7bc5fbd41a95f561be84369631e0e35895efb0b73e0a7480bb9ed730`

## Frontend Application

The PuckSwap frontend is located in the `/puckswap` directory. It features:
- Terminal-style interface with Windows 98 aesthetics
- Support for 10+ Cardano wallets
- Real-time price calculations
- Slippage protection
- Dark/light mode toggle

### Running the Frontend
```bash
# Navigate to puckswap directory
cd puckswap

# Start local server
python3 -m http.server 8080

# Open in browser
# http://localhost:8080/index.html
```

## Security Audits

The smart contracts have been audited by:
- **CertiK**: [Audit Report](/audit-report/certik/audit-report.pdf)
- **Anastasia Labs**: [Audit Report](/audit-report/anastasia-labs/audit-report.pdf)

## Documentation

Comprehensive documentation is available:
- [AMM V2 Specification](/amm-v2-docs/amm-v2-specs.md)
- [Mathematical Formulas](/amm-v2-docs/formula.md)
- [Pool Setup Guide](/puckswap/POOL_SETUP_GUIDE.md)
- [UI Usage Guide](/puckswap/UI_USAGE_GUIDE.md)
- [Wallet Support](/puckswap/WALLET_SUPPORT.md)

## Example Transactions

### Mainnet Examples
- [DEX Initialization](https://cardanoscan.io/transaction/22a2ae40124855a98b262e32b69218c51c6a159cd4fa99f1c34a798d3a0ff8a9)
- [Liquidity Pool Creation](https://cardanoscan.io/transaction/3167ca40518b1b77b331aeda378e36997a566ec7b557d70eb026aa952e2ecf6d)
- [Token Swap](https://cardanoscan.io/transaction/a0fc29c9191762ab3485bc431616d306de0ff414d8f785ffa59d40a8fc7dc0df)
- [Liquidity Deposit](https://cardanoscan.io/transaction/8354d700e233878cf460c7821b8b49e8158c96aaa462f8e6d43aa66994a93837)

## Contributing

We welcome contributions! Please ensure:
- Code follows project standards
- All tests pass
- Documentation is updated
- Security best practices are followed

## License

This project is licensed under the 
 License - see LICENSE.md for details.

## Disclaimer

PuckSwap is experimental software intended for educational and testing purposes. Use at your own risk. No warranties expressed or implied.

## Contact

- **GitHub**: [Repository Issues](https://github.com/puckydev/PuckSwap-v2.5/issues)
- **X (Twitter)**: [@puckydev](https://x.com/puckydev)
- **Website**: [PuckHub.io](https://PuckHub.io)

---

*PuckSwap - Enhancing the image, one swap at a time. Augmented with AI.*