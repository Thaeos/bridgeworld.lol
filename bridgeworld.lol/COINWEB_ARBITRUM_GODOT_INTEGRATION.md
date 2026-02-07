# CoinWeb + Arbitrum + Godot — Integration Path

**Goal:** Bridgeworld runs on **Arbitrum**, and the **Godot** client needs a clean, game‑native Web3 surface.  
This integration defines **CoinWeb** as the wallet/identity + transaction layer, **Arbitrum** as the chain, and **Godot** as the engine.

---

## 0) Framework Stance

**We are the ones listing.** We don’t wait for external “supported chain” lists. We understand the concept (chain abstraction, L2 interoperability, wallet compose/embed, reactive contracts, gas abstraction) and fit it into *our* framework. Our connected chains, our integration surface, our evolution. As the framework grows—Diamond, bridgeworld.lol, Treasure, Godot, CoinWeb-style abstraction—the pieces are put together here, and the docs evolve with it.

---

## 1) Target Outcome

- Godot client can:
  - connect wallet (CoinWeb)
  - read state from Arbitrum
  - sign/submit transactions (MAGIC / Bridgeworld contracts)
  - verify network alignment (chainId 42161)

---

## 2) Components (What We Already Have)

- **Arbitrum One**
  - Chain ID: `42161`
  - RPC: `https://arb1.arbitrum.io/rpc`
- **Godot SDK**
  - `tdk-godot` (Treasure Dev Kit)
- **Bridgeworld.lol**
  - `connect.html` (wallet entry)
  - `bridge.html` (Arbitrum switching + MAGIC link)
  - `ecosystem.html` (SDK listings)

---

## 3) Integration Shape (CoinWeb as the spine)

**CoinWeb** is the wallet/provider layer used by Godot.  
Arbitrum is the network target.  
Godot uses `tdk-godot` for game‑native calls.

```
Godot (tdk-godot)
   ↓
CoinWeb (wallet + tx)
   ↓
Arbitrum (Bridgeworld contracts)
```

---

## 4) Required Capabilities

- **Wallet session**
  - Connect / disconnect
  - Account address display
  - Chain ID detection
- **Chain gating**
  - Enforce Arbitrum One (42161)
- **Contract IO**
  - Read Bridgeworld state
  - Send transactions (MAGIC / game actions)

---

## 5) Next Build Steps (Concrete)

1) **Expose integration in ecosystem page**  
   Add a card under Core Infrastructure:  
   “CoinWeb + Arbitrum + Godot — game‑native Web3 stack.”

2) **Connect page hook**  
   Add a CoinWeb entry in `connect.html` (initially “coming soon” until SDK wiring is done).

3) **Godot wiring**  
   Reference CoinWeb in Godot client (via `tdk-godot`), with:
   - `chainId = 42161`
   - RPC endpoint(s)

---

## 6) Open Items (Need Final Inputs)

- CoinWeb SDK initialization details
- CoinWeb provider interface (sign + send)
- Contract ABIs (Bridgeworld core)
- Godot scene integration points

---

## 7) Why This Matters

This gives Bridgeworld a **single engine spine**:

**CoinWeb (wallet)** → **Arbitrum (chain)** → **Godot (client)**  
So the end‑game path is **bridgeworld.lol → bridgeworld.treasure.lol** with the same integration.
