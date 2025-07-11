# Secure Pool Setup Instructions

## ⚠️ CRITICAL SECURITY WARNING
**NEVER share your seed phrase with ANYONE - including AI assistants, support staff, or developers.**

## Setup Steps

### 1. Open Terminal
Navigate to the project directory:
```bash
cd /Users/holland/PuckSwap(v2.5)/PuckSwap-v2.5
```

### 2. Run Pool Setup
Choose one of these methods:

#### Method A: Interactive Setup (Recommended)
```bash
npm run setup-pool
```
- The script will prompt you for your seed phrase
- Enter it directly in your terminal (it won't be displayed)
- Follow the prompts to confirm pool parameters

#### Method B: Direct Command
```bash
npm run create-pool [your 12 words here separated by spaces]
```
- Replace `[your 12 words here separated by spaces]` with your actual seed phrase
- The pool will be created with default parameters:
  - 10,000 ADA
  - 10,000,000,000 tPucky
  - 0.3% trading fee

### 3. Expected Output
You should see:
```
PuckSwap Initial Pool Creation
==============================

Connecting to wallet...
Wallet address: addr_test1qq...

Checking balances...
ADA Balance: 15,000.00
tPucky Balance: 20,000,000,000

Creating pool with:
- 10,000 ADA
- 10,000,000,000 tPucky

Building transaction...
Submitting transaction...

Pool created successfully!
Transaction: https://preprod.cardanoscan.io/transaction/[tx_hash]
LP Tokens received: 316,227,766
```

### 4. Save the Transaction Hash
Once successful, save:
- Transaction hash
- Pool address (will be displayed)
- LP tokens received

### 5. Verify on Cardanoscan
Check your transaction at:
`https://preprod.cardanoscan.io/transaction/[your-tx-hash]`

## Troubleshooting

### If you get "Insufficient Balance"
- Ensure you have at least 10,015 ADA
- Ensure you have at least 10,000,000,000 tPucky

### If you get "No suitable factory UTxO found"
- The factory contracts may need initialization
- Try again in a few minutes

### If the transaction fails
- Check the error message
- Verify your wallet has no pending transactions
- Ensure all UTxOs are available

## Security Best Practices

1. **Run locally only** - Never enter your seed phrase on any website
2. **Clear terminal history** after running:
   ```bash
   history -c
   ```
3. **Use a dedicated wallet** for testing
4. **Never paste seed phrases** in chat, email, or any online form

## Need Help?

If you encounter issues:
1. Check your wallet balance
2. Verify you're on Preprod network
3. Ensure no pending transactions
4. Review error messages carefully

Remember: Your seed phrase is like your bank password - keep it secret! 