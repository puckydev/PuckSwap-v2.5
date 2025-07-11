# Using the ADA/tPucky Pool on PuckSwap

## Pool Details

The ADA/tPucky pool has been successfully created on AMM V2 (Preprod testnet).

- **Pool Address**: `addr_test1zrtt4xm4p84vse3g3l6swtf2rqs943t0w39ustwdszxt3l5rajt8r8wqtygrfduwgukk73m5gcnplmztc5tl5ngy0upqhns793`
- **Creation TX**: [View on Cardanoscan](https://preprod.cardanoscan.io/transaction/0c1aaa2151a9d344e0aa3540054021cb306e73ebb9249ed1cfdff56a61267b24)
- **Initial Liquidity**: 10,004.5 ADA / 10,000,000,000 tPucky

## How to Use the Pool

### 1. Start the UI
```bash
npm run serve
```
Then visit http://localhost:3001

### 2. Connect Your Wallet
- Click "Connect Wallet"
- Select your wallet (Nami, Eternl, etc.)
- Make sure you're on **Preprod network**

### 3. Check Pool Status
- Click "Refresh Pool Status" button
- The pool details should appear showing:
  - Total Value Locked (TVL)
  - ADA and tPucky reserves
  - Current exchange rate

### 4. Make a Swap
1. Select the token you want to swap FROM (ADA or tPucky)
2. Enter the amount
3. The UI will automatically calculate the output amount
4. Review the exchange rate and price impact
5. Click "Swap" to execute the transaction

## Troubleshooting

### Pool Not Detected?
1. **Check Network**: Ensure your wallet is on Preprod network
2. **Browser Console**: Open developer tools (F12) and check for errors
3. **Manual Refresh**: Try refreshing the page and clicking "Refresh Pool Status" again
4. **Blockfrost Sync**: The pool might need a few minutes to be fully indexed

### Manual Pool Check (Browser Console)
If the pool isn't detected automatically, paste this in your browser console:

```javascript
// Force refresh pool status
window.checkPoolStatus().then(() => {
    console.log('Pool check complete');
    if (window.poolUtxo) {
        console.log('Pool found!', window.poolUtxo);
    } else {
        console.log('Pool not found');
    }
});
```

## Technical Details

The UI has been configured to:
- Use the correct pool address where your liquidity was deposited
- Recognize the AMM V2 LP tokens (policy ID: `d6ba9b7509eac866288ff5072d2a18205ac56f744bc82dcd808cb8fe`)
- Calculate swaps using the constant product formula with 0.3% fee

## Important Notes

- This is a testnet deployment - only use test ADA and tPucky tokens
- Swaps are subject to the AMM's batcher system (may take a few minutes)
- Always check the price impact before confirming large swaps
