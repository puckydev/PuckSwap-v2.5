# PuckSwap Pool Setup Guide

This guide will walk you through setting up the initial liquidity pool for PuckSwap on Cardano Preprod testnet.

## Prerequisites

1. **Node.js and npm** installed
2. **A Cardano wallet** with:
   - At least 10,015 ADA (10,000 for pool + 15 for fees)
   - At least 10,000,000,000 tPucky tokens
3. **Your wallet's seed phrase or private key**

## Step 1: Install Dependencies

First, make sure all dependencies are installed:

```bash
npm install
```

## Step 2: Run the Pool Setup Script

Execute the pool setup script:

```bash
npm run setup-pool
```

## Step 3: Follow the Interactive Setup

The script will guide you through:

1. **Wallet Connection**
   - Choose between seed phrase (recommended) or private key
   - Enter your credentials when prompted
   - The script will verify your wallet address

2. **Balance Check**
   - The script will display your current ADA and tPucky balances
   - Ensure you have sufficient funds

3. **Pool Parameters**
   - Initial ADA amount (default: 10,000 ADA)
   - Initial tPucky amount (default: 10,000,000,000 tPucky)
   - Trading fee percentage (default: 0.3%)

4. **Confirmation**
   - Review all parameters
   - Type "yes" to proceed with pool creation

## Step 4: Wait for Transaction

The pool creation transaction will be submitted to the blockchain. This typically takes 1-2 minutes.

## Step 5: Save Pool Information

Once successful, the script will display:
- Transaction hash
- Cardanoscan link
- LP tokens received
- Pool details

**Important**: Save this information for your records!

## Example Output

```
PuckSwap Pool Setup
======================

Connecting to Cardano Preprod network...
Connected successfully!

Wallet Address: addr_test1qq...

Checking wallet balance...
   ADA: 15,000 ADA
   tPucky: 20,000,000,000 tPucky

Pool Creation Parameters
   Initial ADA: 10,000 ADA
   Initial tPucky: 10,000,000,000 tPucky
   Trading Fee: 0.3%
   Expected LP Tokens: 100,000,000

Pool created successfully!

Transaction Hash: abc123...
View on Cardanoscan: https://preprod.cardanoscan.io/transaction/abc123...
LP Tokens Received: 100,000,000
```

## Alternative: Manual Pool Creation

If you prefer to use the command-line approach with your seed phrase:

```bash
npm run create-pool word1 word2 word3 ... word12
```

Replace `word1 word2 ... word12` with your actual 12-word seed phrase.

## Troubleshooting

### "UTxO Balance Insufficient" Error
- Ensure you have at least 15 ADA extra for transaction fees
- Check that your UTxOs aren't locked in pending transactions

### "No suitable factory UTxO found" Error
- This means the factory contract doesn't have the right UTxO for your pool
- Contact the team or wait for factory initialization

### Connection Issues
- Verify your internet connection
- Check if Blockfrost API is operational
- Try again in a few minutes

## Security Notes

**NEVER share your seed phrase or private key with anyone!**
- The script runs locally and doesn't transmit your credentials
- Your seed phrase is only used to sign the transaction
- Consider using a hardware wallet for production deployments

## Next Steps

After creating the pool:
1. Test swapping on the web interface
2. Add more liquidity if needed
3. Monitor pool performance
4. Share the pool address with users

## Support

If you encounter any issues:
1. Check the transaction on Cardanoscan
2. Verify your wallet has sufficient funds
3. Review the error messages carefully
4. Contact support with your transaction hash 