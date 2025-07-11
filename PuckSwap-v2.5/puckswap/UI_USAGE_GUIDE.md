# PuckSwap UI Usage Guide

## Overview

PuckSwap is a simple DEX interface for swapping between ADA and tPucky tokens on Cardano's preprod testnet. The UI integrates with AMM V2 smart contracts for secure and efficient token swaps.

## Getting Started

### 1. Start the UI Server

```bash
npm run serve
```

The UI will be available at: http://localhost:3001

### 2. Connect Your Wallet

1. Click the "Connect Wallet" button
2. Choose between Nami or VESPR wallet (if both are installed)
3. Approve the connection request in your wallet

**Supported Wallets:**
- Nami Wallet
- VESPR Wallet

### 3. Check Pool Status

The UI automatically checks for existing ADA/tPucky liquidity pools:

- **If No Pool Exists**: You'll see a warning message with a "Create Pool" button
- **If Pool Exists**: The swap interface will be enabled

## Creating a Liquidity Pool

If no pool exists, you need to create one before trading:

### Via UI (Guided Process)

1. Click "Create Pool" button
2. Review the pool parameters:
   - Initial ADA: 10,000 ADA
   - Initial tPucky: 10,000,000,000 tPucky
   - Trading Fee: 0.3%
   - Expected LP Tokens: ~316,227,766 LP

3. Ensure you have sufficient balances (shown in the requirements section)
4. Follow the guided process

### Via CLI (Recommended for now)

For security and reliability, use the command line tool:

```bash
cd /Users/holland/PuckSwap(v2.5)/PuckSwap-v2.5
npm run setup-pool
```

After creating the pool, click the "Refresh" button to update the UI.

## Swapping Tokens

Once a pool exists:

1. **Select Tokens**: Choose which token to swap from/to
2. **Enter Amount**: Type the amount you want to swap
3. **Review Details**:
   - Exchange rate
   - Price impact
   - Fees (2 ADA batcher fee + 0.3% trading fee)
   - Slippage tolerance (0.5%)

4. **Execute Swap**: Click "Swap" button and approve in your wallet

## Pool Information

When a pool exists, you'll see:
- **Total Value Locked (TVL)**: Combined value of both tokens
- **ADA Reserve**: Current ADA in the pool
- **tPucky Reserve**: Current tPucky in the pool
- **Exchange Rate**: Current price ratio

## Features

### Real-time Calculations
- Automatic output calculation using constant product formula
- Price impact warnings for large trades
- Live exchange rate updates

### Safety Features
- Slippage protection (0.5% default)
- Price impact warnings (>5% trades)
- Balance checking before swaps

### User Experience
- Clean, modern interface
- Mobile-responsive design
- Loading states and error messages
- Transaction status updates

## Troubleshooting

### "No pool found"
- Create a pool using the instructions above
- Click "🔄 Refresh" to check again

### "Insufficient balance"
- Ensure you have enough tokens for the swap
- Remember to account for fees (2 ADA batcher fee)

### Wallet Connection Issues
- Make sure you're on the Cardano **Preprod** network
- Try refreshing the page
- Check that your wallet extension is unlocked

### Pool Not Showing
- Click "Refresh" to check again
- Wait a few minutes for blockchain sync
- Check the browser console for errors

### Transaction Failures
- Check your wallet balance
- Ensure the pool has sufficient liquidity
- Try a smaller amount

## Technical Details

### Pool Detection
The UI queries the blockchain for pools at the AMM V2 validator address, looking for UTxOs containing the specific LP token for ADA/tPucky pairs.

### Swap Calculation
Uses the constant product formula (x * y = k) with a 0.3% fee:
- Input with fee = input * 0.997
- Output = (reserve_out * input_with_fee) / (reserve_in + input_with_fee)

### Integration Points
- Blockfrost API for blockchain queries
- Lucid library for transaction building
- AMM V2 smart contracts for pool operations

## Next Steps

1. **Create Pool**: If none exists, create the initial liquidity pool
2. **Add Liquidity**: Provide additional liquidity to earn fees
3. **Start Trading**: Swap between ADA and tPucky
4. **Monitor Pool**: Watch TVL and exchange rates

## Support

For issues or questions:
- Check the browser console for detailed error messages
- Review the transaction details in your wallet
- Ensure you're using the preprod testnet

Happy swapping! 