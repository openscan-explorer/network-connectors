# @openscan/network-connectors

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/openscan-explorer/network-connectors/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/openscan-explorer/network-connectors/actions/workflows/npm-publish.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-24-green)](https://nodejs.org/)

TypeScript library providing unified, type-safe RPC client interfaces for multiple blockchain networks with configurable request execution strategies.

## Features

- **Multi-Network Support**: Unified API for 10+ blockchain networks including EVM chains (Ethereum, Optimism, Arbitrum, Polygon, BNB, Base, Avalanche, Aztec), Bitcoin, Zcash and Solana
- **Bitcoin Support**: Full Bitcoin Core v28+ RPC support with ~115 methods using CAIP-2/BIP122 chain identifiers
- **Zcash Support**: Full Zebra (`zebrad`) RPC support with ~40 methods, including the shielded pool and address-index RPCs
- **Strategy Pattern**: Pluggable request execution strategies (Fallback for reliability, Parallel for consistency detection, Race for minimum latency)
- **Type Safety**: Strong TypeScript typing with network-specific type definitions
- **Dual Transport**: HTTP and WebSocket support with automatic transport detection from URL scheme
- **WebSocket Features**: Persistent connections, request multiplexing, auto-reconnect with exponential backoff
- **Zero Dependencies**: Pure Node.js implementation with no external runtime dependencies
- **ES Modules**: Native ESM support for modern JavaScript environments
- **Factory Pattern**: Type-safe client instantiation based on chain IDs (numeric for EVM, CAIP-2 for Bitcoin)
- **Inconsistency Detection**: Parallel strategy can detect RPC provider data divergence
- **Resource Lifecycle**: `close()` method for clean shutdown of WebSocket connections

## Installation

```bash
npm install @openscan/network-connectors
```

## Supported Networks

### EVM Networks

| Network | Chain ID | Client Class | Special Features |
|---------|----------|--------------|------------------|
| Ethereum | 1 | `EthereumClient` | Full eth_*, web3_*, net_*, debug_*, trace_*, txpool_* |
| Optimism | 10 | `OptimismClient` | Ethereum + optimism_*, opp2p_*, admin_* methods |
| BNB Smart Chain | 56 | `BNBClient` | Extended Ethereum methods + BSC-specific features |
| BNB Testnet | 97 | `BNBClient` | Factory maps to `BNBClient`; `BNBTestnetClient` also exported for direct use |
| Polygon | 137 | `PolygonClient` | Ethereum + Polygon Bor validator methods |
| Base | 8453 | `BaseClient` | Optimism-compatible (reuses Optimism types) |
| Arbitrum One | 42161 | `ArbitrumClient` | Ethereum + arbtrace_* (Arbitrum traces) |
| Avalanche C-Chain | 43114 | `AvalancheClient` | Ethereum + avax cross-chain, admin, extended debug |
| Aztec | 677868 | `AztecClient` | Custom node_*/nodeAdmin_* methods (non-EVM) |
| Hardhat | 31337 | `HardhatClient` | Ethereum + hardhat_*/evm_* state manipulation methods |
| Sepolia Testnet | 11155111 | `SepoliaClient` | Ethereum-compatible testnet |

### Bitcoin Networks

Bitcoin uses [CAIP-2](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-2.md)/[BIP122](https://github.com/bitcoin/bips/blob/master/bip-0122.mediawiki) chain identifiers instead of numeric chain IDs.

| Network | Chain ID (CAIP-2) | Client Class | Special Features |
|---------|-------------------|--------------|------------------|
| Bitcoin Mainnet | `bip122:000000000019d6689c085ae165831e93` | `BitcoinClient` | Full Bitcoin Core v28+ RPC (~115 methods) |
| Bitcoin Testnet3 | `bip122:000000000933ea01ad0ee984209779ba` | `BitcoinClient` | Bitcoin testnet3 network |
| Bitcoin Testnet4 | `bip122:00000000da84f2bafbbc53dee25a72ae` | `BitcoinClient` | Bitcoin testnet4 (BIP94) |
| Bitcoin Signet | `bip122:00000008819873e925422c1ff0f99f7c` | `BitcoinClient` | Bitcoin signet (BIP325) |

#### Bitcoin Chain ID Constants

For convenience, use the exported constants instead of raw chain ID strings:

```typescript
import {
  BITCOIN_MAINNET,
  BITCOIN_TESTNET3,
  BITCOIN_TESTNET4,
  BITCOIN_SIGNET
} from "@openscan/network-connectors";

// BITCOIN_MAINNET = "bip122:000000000019d6689c085ae165831e93"
```

#### Bitcoin Method Categories (~115 methods)

| Category | Methods | Description |
|----------|---------|-------------|
| Blockchain | ~15 | `getBlockchainInfo`, `getBlock`, `getBlockHash`, `getBlockHeader`, `getBlockStats`, `getChainTips`, `getDifficulty`, etc. |
| Mempool | ~10 | `getMempoolInfo`, `getRawMempool`, `getMempoolEntry`, `testMempoolAccept`, `submitPackage`, etc. |
| Raw Transactions | ~7 | `getRawTransaction`, `decodeRawTransaction`, `decodeScript`, `sendRawTransaction`, `createRawTransaction`, etc. |
| PSBT | ~8 | `createPsbt`, `decodePsbt`, `analyzePsbt`, `combinePsbt`, `finalizePsbt`, `joinPsbts`, etc. |
| Network | ~13 | `getNetworkInfo`, `getPeerInfo`, `getConnectionCount`, `getNetTotals`, `ping`, `addNode`, etc. |
| Fee Estimation | ~1 | `estimateSmartFee` with economical/conservative modes |
| Utility | ~7 | `validateAddress`, `getDescriptorInfo`, `deriveAddresses`, `createMultisig`, `verifyMessage`, etc. |
| Mining | ~9 | `getMiningInfo`, `getNetworkHashPs`, `getBlockTemplate`, `submitBlock`, `generateToAddress`, etc. |
| Wallet | ~35 | `getWalletInfo`, `getBalances`, `listWallets`, `sendToAddress`, `listUnspent`, `importDescriptors`, etc. |
| Control | ~6 | `getMemoryInfo`, `getRpcInfo`, `help`, `uptime`, `logging`, `stop` |

### Zcash Networks

Zcash is a Bitcoin fork, so it shares the `bip122:` CAIP-2 namespace with Bitcoin. Chain IDs are still unique — the reference is the first 32 hex characters of each chain's genesis block hash — and the factory routes on registry membership rather than the namespace prefix.

| Network | Chain ID (CAIP-2) | Client Class | Special Features |
|---------|-------------------|--------------|------------------|
| Zcash Mainnet | `bip122:00040fe8ec8471911baa1db1266ea15d` | `ZcashClient` | Full Zebra RPC (~40 methods) incl. shielded pools |
| Zcash Testnet | `bip122:05a60a92d99d85997cce3b87616c089f` | `ZcashClient` | Zcash testnet |

> **Node implementation**: `zcashd` reached its automatic end-of-support halt on 2026-07-18 and no longer runs. `ZcashClient` therefore models the RPC surface of [Zebra](https://zebra.zfnd.org/) (`zebrad`), the current Zcash node. Wallet RPCs (`z_sendmany`, `z_getbalance`, …) live in the separate Zallet daemon and are not covered here.
>
> **Transport**: Zebra's RPC server is HTTP-only, so Zcash has no WebSocket transport or subscription support.

#### Zcash Chain ID Constants

```typescript
import { ZCASH_MAINNET, ZCASH_TESTNET } from "@openscan/network-connectors";

// ZCASH_MAINNET = "bip122:00040fe8ec8471911baa1db1266ea15d"
```

#### Zcash Method Categories (~40 methods)

| Category | Methods | Description |
|----------|---------|-------------|
| Chain & Blocks | 8 | `getBlockchainInfo`, `getBlockCount`, `getBestBlockHash`, `getBestBlockHeightAndHash`, `getBlockHash`, `getBlock`, `getBlockHeader`, `getDifficulty` |
| Transactions | 3 | `getRawTransaction`, `sendRawTransaction`, `getTxOut` |
| Mempool | 2 | `getMempoolInfo`, `getRawMempool` |
| Address Index | 3 | `getAddressBalance`, `getAddressTxIds`, `getAddressUtxos` |
| Shielded | 4 | `zGetTreestate`, `zGetSubtreesByIndex`, `zValidateAddress`, `zListUnifiedReceivers` |
| Mining | 9 | `getBlockTemplate`, `submitBlock`, `getMiningInfo`, `getNetworkSolPs`, `getBlockSubsidy`, `getStandardFee`, `generate`, `generateToAddress`, `getNetworkHashPs` |
| Node & Network | 8 | `getInfo`, `getDeprecationInfo`, `getNetworkInfo`, `getPeerInfo`, `ping`, `addNode`, `stop`, `validateAddress` |
| Chain Manipulation | 2 | `invalidateBlock`, `reconsiderBlock` |

Note some parameter conventions differ from Bitcoin: `getBlock`, `getBlockHeader` and `zGetTreestate` take a block hash **or a height as a decimal string** (`getBlock("3444000", 1)`); `getRawTransaction` takes a numeric verbosity (`0` or `1`) rather than a boolean; and the address-index methods take a single object argument (`getAddressBalance({ addresses: ["t1..."] })`).

## Authenticated RPC Endpoints

Endpoints that require an API key header can be configured as objects instead of plain URL strings. Headers are scoped per endpoint, so a credential is never sent to the other providers in the same list:

```typescript
const client = ClientFactory.createClient(ZCASH_MAINNET, {
  type: "fallback",
  rpcUrls: [
    { url: "https://zcash-mainnet.gateway.tatum.io", headers: { "x-api-key": process.env.TATUM_API_KEY! } },
    "https://zcash-mainnet-zebrad.gateway.tatum.io", // plain strings still work
  ],
});
```

Headers apply to HTTP transports only — the WebSocket handshake does not support custom headers.

## Project Structure

```
@openscan/network-connectors/
├── src/
│   ├── strategies/              # Request execution strategies (Fallback, Parallel, Race)
│   ├── networks/                # Network-specific clients organized by chain ID
│   ├── factory/                 # Client instantiation and chain ID mapping
│   ├── NetworkClient.ts         # Base network client (concrete class)
│   ├── JsonRpcTransport.ts      # Transport interface and auto-detect factory
│   ├── RpcClient.ts             # HTTP JSON-RPC transport
│   ├── WebSocketRpcClient.ts    # WebSocket JSON-RPC transport
│   ├── RpcClientTypes.ts        # JSON-RPC request/response type definitions
│   └── index.ts                 # Main export file
├── tests/                       # Comprehensive test suite
│   ├── http/                    # HTTP transport tests (strategies, networks, factory)
│   ├── ws/                      # WebSocket transport tests (strategies, networks)
│   ├── transport/               # Transport layer tests (auto-detection)
│   └── helpers/                 # Test utilities (validators, env config)
├── scripts/
│   └── publish-and-tag.sh       # Automated release workflow
├── .github/workflows/
│   └── npm-publish.yml          # CI/CD automation
├── dist/                        # Compiled JavaScript output (gitignored)
├── biome.json                   # Linting and formatting configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project metadata and dependencies
```

### Directory Purposes

- **src/strategies/**: Implements the Strategy pattern for RPC request execution
  - `FallbackStrategy`: Sequential execution with early exit on success
  - `ParallelStrategy`: Concurrent execution with inconsistency detection
  - `RaceStrategy`: Concurrent execution returning first successful response
  - `StrategyFactory`: Creates appropriate strategy based on configuration

- **src/networks/**: Network-specific client implementations (one directory per chain ID)
  - Each client extends `NetworkClient` base class
  - Provides network-specific RPC methods and type definitions
  - Organized by chain ID for clarity

- **src/factory/**: Client instantiation logic
  - `ClientRegistry`: Maps chain IDs to client classes with type safety
  - Factory methods for creating clients

- **tests/**: Comprehensive test coverage
  - Uses Node.js native test framework with tsx
  - Split by transport: `http/` for HTTP tests, `ws/` for WebSocket tests
  - `transport/` for transport layer auto-detection tests
  - `helpers/` for shared validators and env config

- **scripts/**: Automation scripts
  - Release workflow (build, publish, tag)

## Architecture Overview

### Strategy Pattern

The library uses the **Strategy Pattern** to provide flexible RPC request execution:

- **FallbackStrategy**: Tries RPC providers sequentially until one succeeds
  - Minimal overhead (stops at first success)
  - Returns metadata tracking all attempted providers and response times
  - Best for reliability when providers are generally consistent

- **ParallelStrategy**: Executes all RPC providers concurrently
  - Tracks response times and errors for all providers
  - Detects data inconsistencies using response hashing
  - Returns comprehensive metadata for debugging
  - Best for detecting provider divergence

- **RaceStrategy**: Executes all RPC providers concurrently, returns first success
  - Uses `Promise.any` to return as soon as any provider succeeds
  - Minimizes latency by using the fastest responding provider
  - Only fails if ALL providers fail
  - Includes metadata with winning response and errors
  - Best for latency-sensitive operations

Strategies can be configured at client creation or switched dynamically using `updateStrategy()`. All three strategies support both HTTP and WebSocket transports interchangeably.

### Transport Layer

The library supports both HTTP and WebSocket transports through a unified `JsonRpcTransport` interface:

- **RpcClient** (HTTP): Stateless, one request per fetch call
- **WebSocketRpcClient**: Persistent connection with request multiplexing, auto-reconnect with exponential backoff, configurable timeouts
- **createTransport()**: Factory function that auto-detects transport from URL scheme (`http://`/`https://` → HTTP, `ws://`/`wss://` → WebSocket)

HTTP and WebSocket endpoints can be mixed in the same strategy configuration. Call `close()` on the client when done to clean up WebSocket connections.

### Factory Pattern

The **ClientFactory** provides type-safe client instantiation based on chain IDs:

```typescript
import { ClientFactory, BITCOIN_MAINNET } from "@openscan/network-connectors";

const config = {
  type: "fallback" as const,
  rpcUrls: ["https://rpc.example.com"]
};

// EVM client (numeric chain ID)
const ethClient = ClientFactory.createClient(1, config);
// ethClient is typed as EthereumClient

// Bitcoin client (CAIP-2 chain ID)
const btcClient = ClientFactory.createClient(BITCOIN_MAINNET, config);
// btcClient is typed as BitcoinClient

// Type-safe client with network-specific methods
const arbClient = ClientFactory.createTypedClient(42161, config);
// arbClient has Arbitrum-specific methods like arbtraceBlock()
```

### Type-Safe Network Clients

Each network has a dedicated client class extending `NetworkClient`:

- Fully typed with network-specific type definitions
- Network-specific RPC methods (e.g., Arbitrum traces, Optimism rollup methods)
- Inherits base Ethereum methods for compatible networks
- Strong TypeScript inference for return types

## Available Commands

### Development Workflow

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run build` | Compile TypeScript to JavaScript (output: `dist/`) |
| `npm run typecheck` | Type check without code emission |
| `npm run test` | Run full test suite (HTTP + WebSocket) |
| `npm run test:http` | Run HTTP transport tests only |
| `npm run test:wss` | Run WebSocket transport tests only |
| `npm run format` | Check code formatting (Biome) |
| `npm run format:fix` | Auto-fix formatting issues |
| `npm run lint` | Check linting rules (Biome) |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run check` | Combined format + lint check |

### CI/CD Automation

The project includes a GitHub Actions workflow ([.github/workflows/npm-publish.yml](.github/workflows/npm-publish.yml)) that automatically publishes to npm on every push to the `main` branch:

- **Trigger**: Push to `main` branch
- **Environment**: ubuntu-latest, Node.js 24
- **Steps**: Checkout → Setup Node.js → Install dependencies → Build → Publish
- **Authentication**: Uses OIDC authentication for npm publishing

## Development Setup

### Prerequisites

- **Node.js**: Version 24 or higher
- **npm**: Comes with Node.js

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/openscan-explorer/network-connectors.git
   cd network-connectors
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Run tests to verify setup:

   ```bash
   npm run test
   ```

### Code Quality Checks

Before committing, ensure your code passes all quality checks:

```bash
npm run check      # Check formatting and linting
npm run typecheck  # Check TypeScript types
npm run test       # Run test suite
```

Or auto-fix issues:

```bash
npm run format:fix  # Auto-fix formatting
npm run lint:fix    # Auto-fix linting
```

## Testing

### Running Tests

```bash
npm run test       # Run all tests (HTTP + WebSocket)
npm run test:http  # Run HTTP transport tests only
npm run test:wss   # Run WebSocket transport tests only
```

The project uses **Node.js native test framework** with **tsx** for TypeScript execution. No external test frameworks like Jest or Mocha are required.

### Test Structure

Tests are split by transport type to validate both HTTP and WebSocket:

- **tests/http/strategies/**: Strategy tests over HTTP transport
- **tests/http/networks/**: Network client tests over HTTP transport
- **tests/http/factory/**: ClientFactory tests
- **tests/ws/strategies/**: Strategy tests over WebSocket transport
- **tests/ws/networks/**: Network client tests over WebSocket (organized by chain ID subdirectories)
- **tests/transport/**: Transport layer tests (auto-detection, interface compliance)
- **tests/helpers/**: Shared test utilities
  - `validators.ts`: Validators for hex strings, addresses, blocks, transactions, receipts, logs, strategy metadata
  - `env.ts`: Test URL configuration with optional Alchemy API key support

### Testing Rules

- **Real RPC calls only**: All network client tests must call live RPC endpoints. Never mock RPC calls.
- **Type validation**: Tests must validate that response data matches the expected TypeScript type definitions. Each test is tagged:
  - `[strong]`: Validates response shape, field types, and format (e.g., hex strings, required fields)
  - `[weak]`: Cannot fully validate response types (e.g., admin/debug methods unsupported on public nodes). Only checks that a result is returned.

## Contributing

### Adding a New Network

To add support for a new blockchain network:

1. **Create network directory**:

   ```bash
   mkdir -p src/networks/<CHAIN_ID>   # EVM chains use the numeric chain ID
   mkdir -p src/networks/<name>       # non-EVM chains use a lowercase name (bitcoin, zcash, solana)
   ```

2. **Define network-specific types** (if needed):
   - Create types file for network-specific data structures
   - Extend base Ethereum types if applicable
   - For non-EVM chains, declare the CAIP-2 chain ID constants and the `<Name>ChainId`
     union here — the registry imports them from the types file

3. **Create client class**:
   - Extend `NetworkClient` base class
   - Implement network-specific RPC methods
   - Use `this.execute<T>(method, params)` for all RPC calls
   - Add JSDoc comments for all public methods

4. **Update factory** in [src/factory/ClientRegistry.ts](src/factory/ClientRegistry.ts):
   - **EVM chains**: add the chain ID to `SupportedChainId`, update the `ChainIdToClient`
     mapping, add an entry to `CHAIN_REGISTRY`, and add a `createClient()` overload
   - **CAIP-2 chains** (Bitcoin, Zcash, Solana): add a `Supported<Name>ChainId` alias,
     extend `SupportedNetwork`, add a branch to **`NetworkToClient`** (not `ChainIdToClient`),
     add a `<NAME>_REGISTRY`, add an `is<Name>Network()` guard that tests **registry
     membership** (never a namespace prefix — Bitcoin and Zcash share `bip122:`), then add
     the `createClient()` overload and a dispatch branch
   - `createTypedClient()` needs no change; it delegates and casts through `NetworkToClient`

5. **Export from index**:
   - Add exports to [src/index.ts](src/index.ts): a banner comment, a value export for the
     client, a value export for the chain ID constants, then one `export type {}` block

6. **Add tests**:
   - Create HTTP test file in `tests/http/networks/`
   - Create a WebSocket test directory and file in `tests/ws/networks/<CHAIN_ID>/`, **if the
     network has a WebSocket RPC** — Bitcoin and Zcash do not, so they have HTTP tests only
   - Add factory cases to `tests/http/factory/ClientFactory.test.ts`
   - Test client instantiation, methods, and type safety

7. **Update documentation**:
   - Add network to supported networks table in README.md and CLAUDE.md
   - Document any special features or methods

### Adding New RPC Methods

To add new RPC methods to an existing network:

1. **Add method to client class**:

   ```typescript
   async methodName(param1: Type1, param2?: Type2): Promise<StrategyResult<ReturnType>> {
     const params: any[] = [param1];
     if (param2 !== undefined) params.push(param2);
     return this.execute<ReturnType>("rpc_methodName", params);
   }
   ```

2. **Define return type** (if needed):
   - Add type definition to appropriate types file
   - Use existing types where possible

3. **Add JSDoc comment**:

   ```typescript
   /**
    * Brief description of what this method does
    * @param param1 Description of parameter
    * @param param2 Optional parameter description
    * @returns Promise with strategy result containing return type
    */
   ```

4. **Add test coverage**:
   - Test success case
   - Test error handling
   - Test parameter validation

### Code Style Guidelines

This project uses **Biome** for linting and formatting:

- **Line Width**: 100 characters
- **Indentation**: 2 spaces
- **Quotes**: Double quotes
- **Semicolons**: Required
- **Trailing Commas**: ES5 (no trailing commas in function parameters)

Run formatters before committing:

```bash
npm run format:fix  # Auto-fix formatting
npm run lint:fix    # Auto-fix linting issues
```

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**:
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation if needed
4. **Run quality checks**:

   ```bash
   npm run check
   npm run typecheck
   npm run test
   ```

5. **Commit your changes**:

   ```bash
   git commit -m "feat: description of your changes"
   ```

6. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Open a pull request** against the `main` branch

## Release Process

### Manual Release

1. Ensure you're on the `main` branch with a clean working directory
2. Update version in `package.json` if needed
3. Run the release script:

   ```bash
   npm run release
   ```

4. The script will automatically:
   - Validate environment
   - Run all quality checks
   - Build the project
   - Publish to npm
   - Create and push git tag

### Automated Release

Every push to the `main` branch triggers automatic npm publication via GitHub Actions:

1. Merge your PR to `main`
2. GitHub Actions automatically builds and publishes
3. Check Actions tab for workflow status

### Version Management

- Version is managed in `package.json`
- Follow [Semantic Versioning](https://semver.org/):
  - MAJOR: Breaking changes
  - MINOR: New features (backwards compatible)
  - PATCH: Bug fixes (backwards compatible)

## Configuration Files

### TypeScript Configuration ([tsconfig.json](tsconfig.json))

- **Target**: ES5 (broad compatibility)
- **Module**: ESNext (native ES modules)
- **Output**: `dist/` directory
- **Type Declarations**: Generated in `dist/types/`
- **Strict Mode**: Enabled for maximum type safety

### Biome Configuration ([biome.json](biome.json))

- **Formatter**: 100 char line width, 2-space indent
- **Linter**: Recommended rules with custom overrides
- **File Patterns**: `src/**/*.ts`, `tests/**/*.ts`
- **Special Rules**: Relaxed explicit any checks in test files

### Package Configuration ([package.json](package.json))

- **Type**: `"module"` (ES modules)
- **Main Entry**: `dist/index.js`
- **Type Definitions**: `dist/index.d.ts`
- **Exports**: Dual support for require/import
- **Files**: Only `dist/` directory published to npm

## Project Metadata

- **Repository**: [https://github.com/openscan-explorer/network-connectors](https://github.com/openscan-explorer/network-connectors)
- **Issues**: [https://github.com/openscan-explorer/network-connectors/issues](https://github.com/openscan-explorer/network-connectors/issues)
- **Package**: [@openscan/network-connectors on npm](https://www.npmjs.com/package/@openscan/network-connectors)
- **License**: [MIT](LICENSE)

## Additional Resources

- **CLAUDE.md**: Comprehensive AI assistant context file with detailed codebase documentation
- **TypeScript Handbook**: [https://www.typescriptlang.org/docs/handbook/intro.html](https://www.typescriptlang.org/docs/handbook/intro.html)
- **Biome Documentation**: [https://biomejs.dev/](https://biomejs.dev/)
- **Node.js Test Framework**: [https://nodejs.org/api/test.html](https://nodejs.org/api/test.html)

## Support

For questions, issues, or contributions:

1. **Check existing issues**: [GitHub Issues](https://github.com/openscan-explorer/network-connectors/issues)
2. **Open a new issue**: Provide detailed description, steps to reproduce, and environment info
3. **Contribute**: Follow the contribution guidelines above

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with TypeScript, tested with Node.js, formatted with Biome.
