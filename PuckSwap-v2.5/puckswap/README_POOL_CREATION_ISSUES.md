# PuckSwap Pool Creation Issues & Solutions

## The Problem

Your friend is absolutely correct. The pool creation is failing because:

1. **Complex Contract Architecture**: AMM V2 uses multiple interacting contracts (Factory, Pool, Authen Minting Policy, Global Setting)
2. **Factory Linked List**: Pools must be created through the Factory contract's linked list structure
3. **Missing DexInitialization**: The system may not be properly initialized on preprod
4. **NFT Requirements**: Pool creation requires minting specific NFTs with exact parameters
5. **Testnet Instability**: Preprod can have concurrency issues and unstable states

## Why Our Simple Approach Failed

Our `pool-creator.js` was too simplistic. It tried to:
- Create a pool directly without going through the Factory
- Didn't handle the Factory linked list structure
- Didn't mint the required NFTs (Factory NFT, Pool NFT, LP tokens)
- Didn't interact with the Global Setting for authorization

## The Real Solution

### Option 1: Use the Official AMM UI (Recommended)
The easiest way is to use the official AMM testnet UI if available. They handle all the complexity.

### Option 2: Use the AMM SDK Properly
If you need programmatic access, you should:
1. Use the official AMM SDK (not our simplified version)
2. Ensure you're interacting with the deployed contracts correctly
3. Handle all the required validations and NFT minting

### Option 3: Manual Pool Creation (Advanced)
This requires:
1. Finding a suitable Factory UTxO with the right head/tail
2. Calculating the LP token name correctly
3. Building a complex transaction that:
   - Spends the Factory UTxO
   - Creates two new Factory UTxOs (linked list split)
   - Mints Factory NFT, Pool NFT, and LP tokens
   - Creates the Pool UTxO with correct datum
   - Handles all the validation rules

## Current State on Preprod

Based on the deployed contracts:
- The contracts ARE deployed on preprod
- The factory and pool validators exist
- But the initialization state is unclear
- The factory address in references.json looks incorrect

## What You Should Do

1. **Check if the AMM has a testnet UI**: This would be the easiest approach
2. **Contact the AMM team**: They may have restricted pool creation or have specific requirements
3. **Use existing pools**: If pools already exist for ADA/tPucky, you can swap without creating new ones
4. **Wait for documentation**: The AMM team may release better documentation or tools

## Technical Details Your Friend Mentioned

### DexInitialization
- Must be run once to create the initial Factory linked list
- Creates Factory UTxO with head="00" and tail="ff...ff"
- Mints the Global Setting NFT

### Factory Linked List
- Each Factory UTxO contains a (head, tail) pair
- New pools must have LP token name between head and tail
- Creating a pool splits one Factory UTxO into two

### NFT Requirements
- Factory NFT: Ensures Factory UTxO authenticity
- Pool NFT: Ensures Pool UTxO authenticity  
- LP tokens: Represent liquidity provider shares
- All must be minted by Authen Minting Policy

### Global Setting
- Contains authorized batchers, fee updaters, etc.
- Must be referenced in pool creation transactions
- Controls who can perform various operations

## Conclusion

Creating pools on AMM V2 is intentionally complex to ensure security and proper functioning. Without proper understanding of the entire system and access to the correct deployment state, it's very difficult to create pools manually.

Your best bet is to either:
1. Use the official AMM tools/UI
2. Find existing ADA/tPucky pools to swap with
3. Work with the AMM team for proper access

The simple approach we tried was never going to work because it didn't account for the sophisticated architecture of AMM V2. 