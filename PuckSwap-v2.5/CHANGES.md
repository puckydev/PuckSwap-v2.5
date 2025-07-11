# Changes from Minswap DEX v2

This document outlines the modifications made to the original Minswap DEX v2 codebase for PuckSwap.

## Major Changes

### 1. Token Support
- **Original**: Supports any Cardano native token pairs
- **PuckSwap**: Limited to ADA/tPucky swaps only
- Modified pool validation logic to restrict token pairs

### 2. Network Configuration
- **Original**: Supports both Mainnet and Preprod
- **PuckSwap**: Configured exclusively for Cardano Preprod testnet
- Removed mainnet deployment configurations
- Updated all network references to preprod endpoints

### 3. UI/UX Modifications
- Complete rebrand from Minswap to PuckSwap
- Retro Windows 98-inspired terminal interface
- Custom color scheme and styling
- Added sound effects for user interactions
- Modified wallet connection flow
- Custom loading animations and transitions

### 4. Batcher System
- **Original**: Uses centralized batcher system
- **PuckSwap**: Exploring direct swap execution without batchers
- Modified order validation logic
- Simplified transaction building process

### 5. Fee Structure
- Maintained 0.3% trading fee
- Added 2 ADA batcher fee (for compatibility)
- Modified fee distribution logic

### 6. Smart Contract Parameters
- Updated protocol parameters for preprod deployment
- Modified pool creation parameters
- Adjusted minimum liquidity requirements

### 7. Frontend Features
- Added pool status checking
- Real-time balance updates
- Simplified swap interface
- Added pool creation wizard
- Enhanced error handling and user feedback

### 8. Documentation
- Updated all documentation for PuckSwap branding
- Added specific guides for preprod usage
- Created wallet support documentation
- Added pool setup and usage guides

## Technical Implementation Details

### Smart Contracts
- Base contracts remain largely unchanged from Minswap v2
- Modified deployment scripts for preprod-only operation
- Updated reference scripts and parameters

### Frontend Application
- Built with vanilla JavaScript (no framework dependencies)
- Uses Lucid library for Cardano interactions
- Blockfrost API for blockchain queries
- Custom CSS for retro UI theme

### Testing
- All unit tests updated for tPucky token
- Integration tests configured for preprod
- Added specific test cases for limited token pair support

## Security Considerations
- Inherited security audits from Minswap (CertiK and Anastasia Labs)
- Additional review for fork-specific changes
- Maintained core AMM logic integrity

## Future Improvements
- Complete removal of batcher dependency
- Enhanced direct swap execution
- Additional UI/UX improvements
- Performance optimizations

---

Last updated: January 2025 