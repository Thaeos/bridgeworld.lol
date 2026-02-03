# Coinweb — What I Looked Up

Searched so we're not flying blind. No wiring done; this is **what is** from docs and site.

---

## What Coinweb Is

- **Chain-abstraction / L2 protocol.** Lets you deploy dApps on multiple blockchains as if one. Consensus-free, decentralised.
- **Not “a wallet for Arbitrum.”** It’s a layer that *combines* chains; dApps run on Coinweb’s execution environment and use L1/L2 for data and settlement.
- **Reactive smart contracts** — can self-activate from L1/L2 events; **gas fee abstraction**; **blockchain-agnostic** platform token (CWEB).

---

## Official Sources

- **Site:** https://www.coinweb.io  
- **Docs:** https://docs.coinweb.io  
- **Get started:** https://docs.coinweb.io/gettingstarted  
- **Build / SDK:** https://docs.coinweb.io/develop/getstarted/  
- **Wallet SDK:** https://docs.coinweb.io/develop/SDK/wallet-lib/  
- **Litepaper:** http://litepaper.coinweb.io  
- **Whitepaper:** https://coinweb.io (PDF)  
- **Devnet explorer:** https://explorer-devnet.coinweb.io  
- **Explorer (prod):** http://explorer.coinweb.io  

---

## SDK / Tech (from docs)

- **Create app:** `npm create coinweb-dapp` (or `yarn create coinweb-dapp`) — Hello World, Yarn monorepo, contract module + UI.
- **Production SDK (wallet):**  
  - `@coinweb/wallet-lib` — Rust → WASM + TypeScript  
  - `@coinweb/cweb-wallet-library` — TypeScript wrapper  
  - `@coinweb/cweb-wallet-library-rn` — React Native (WASM-free)  
  - `@coinweb/cweb-vm-lib` — VM bindings  
  - `@coinweb/cweb-tool` — CLI for contracts  
- **Install wallet lib:** From **GitLab npm registry** (not public npm):
  - `.npmrc`: `@coinweb:registry=https://gitlab.com/api/v4/projects/29112346/packages/npm/` + auth token.
  - `npm install @coinweb/cweb-wallet-library` (or yarn/pnpm).
- **Concepts:** L2 transactions composed and “embedded” in L1; `create_wallet`, `compose_send`, `embed`, `embed_status`; transaction monitor for pending/final/failed.

---

## Connected Chains (from site)

- **L1:** BTC  
- **L2:** Polygon  
- **Ecosystem:** DeFi, PACT SWAP, LinkMint, Coinweb Wallet, OnRamp, etc.  
- **Our take:** We don't rely on their list. We understand the concept; we fit it into our framework and we are the ones listing (Arbitrum, peaq, Fuse, Katana, Moonriver, etc.). The framework grows, the list grows with it.

---

## What This Means for Bridgeworld (CoinWeb + Arbitrum + Godot)

- **Coinweb** = abstraction layer and SDK (wallet, compose, embed, monitor).  
- **Arbitrum** = where Bridgeworld and Treasure live today (chainId 42161).  
- **Godot** = client; tdk-godot is the Treasure SDK.

We fit the concept into our framework: we list the chains; we evolve with it as we put the pieces together. Options:

1. **Coinweb as bridge/abstraction:** If/when Coinweb supports Arbitrum as a connected chain, Bridgeworld could sit on Coinweb’s layer and use Arbitrum for data/settlement; or  
2. **Coinweb patterns only:** Use Coinweb’s wallet/SDK patterns (e.g. compose + embed) in a separate path, while Bridgeworld stays natively on Arbitrum with MetaMask/ethers.

No Godot-specific Coinweb SDK found; Godot would go through their TS/JS or native bindings if we integrate.

---

## Next Steps (when we integrate)

1. Get **auth token** for GitLab npm registry and add `@coinweb/cweb-wallet-library` to a test app.  
2. Decide: full Coinweb stack (deploy on Coinweb, use their L2) vs. “wallet lib only” alongside existing Arbitrum RPC.  
3. If Godot: either call TS/JS wallet lib from Godot, or wait for an official Godot/Coinweb SDK if it appears.  
4. Keep evolving: as the framework grows (Diamond, bridgeworld.lol, our chain list), the integration docs grow with it.

---

## What I Searched Up (follow-up)

**Connected chains:** Docs describe the *model* (Coinweb on top of each connected blockchain; full L1/L2 data availability). No public list is required for us: we are the ones listing. Arbitrum, peaq, Fuse, Katana, Moonriver, and others live in our framework; we integrate the concept and evolve with it.

**Auth token for `@coinweb/cweb-wallet-library`:**  
- Registry: `https://gitlab.com/api/v4/projects/29112346/packages/npm/`  
- Create a **GitLab Personal Access Token**: GitLab → Settings → Access Tokens (or https://gitlab.com/-/user_settings/personal_access_tokens).  
- Scopes: enable **read_api** and/or **read_registry** so the token can pull from the project’s package registry.  
- In project root add `.npmrc`:  
  `@coinweb:registry=https://gitlab.com/api/v4/projects/29112346/packages/npm/`  
  `//gitlab.com/api/v4/projects/29112346/packages/npm/:_authToken=YOUR_TOKEN`  
- Then: `npm install @coinweb/cweb-wallet-library` (or yarn/pnpm).

**Wallet SDK (from docs):**  
- `create_wallet`, `compose_send`, `embed`, `embed_status`; `TransactionMonitor`, `create_tx_monitor`, `add_txs`, `get_pending_txs`, `get_final_txs`, `get_failed_txs`.  
- L2 tx is composed then embedded into L1; fees: `wallet_fees` (L1 broadcast) and `network_fees` (Coinweb protocol).  
- React Native: use `@coinweb/cweb-wallet-library-rn` (no WASM) if Godot or mobile needs it.

**Godot:** Still no Coinweb-specific Godot SDK in docs. Options: call the TS/JS wallet lib from Godot (e.g. via GDExtension/JS bridge or a small Node/Web layer), or wait for an official Godot/Coinweb SDK.

---

*Searched and written so we’re not flying blind. Follow the atlas.*  
