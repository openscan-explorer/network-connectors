import type { StrategyConfig } from "../strategies/requestStrategy.js";
import type { NetworkClient } from "../NetworkClient.js";
import { EthereumClient } from "../networks/1/EthereumClient.js";
import { OptimismClient } from "../networks/10/OptimismClient.js";
import { BNBClient } from "../networks/56/BNBClient.js";
import { PolygonClient } from "../networks/137/PolygonClient.js";
import { BaseClient } from "../networks/8453/BaseClient.js";
import { ArbitrumClient } from "../networks/42161/ArbitrumClient.js";
import { AvalancheClient } from "../networks/43114/AvalancheClient.js";
import { AztecClient } from "../networks/677868/AztecClient.js";
import { HardhatClient } from "../networks/31337/HardhatClient.js";
import { SepoliaClient } from "../networks/11155111/SepoliaClient.js";
import { BitcoinClient } from "../networks/bitcoin/BitcoinClient.js";
import {
  BITCOIN_MAINNET,
  BITCOIN_TESTNET3,
  BITCOIN_TESTNET4,
  BITCOIN_SIGNET,
  type BitcoinChainId,
} from "../networks/bitcoin/BitcoinTypes.js";
import { ZcashClient } from "../networks/zcash/ZcashClient.js";
import { ZCASH_MAINNET, ZCASH_TESTNET, type ZcashChainId } from "../networks/zcash/ZcashTypes.js";
import { SolanaClient } from "../networks/solana/SolanaClient.js";
import {
  SOLANA_MAINNET,
  SOLANA_DEVNET,
  SOLANA_TESTNET,
  type SolanaChainId,
} from "../networks/solana/SolanaTypes.js";

/**
 * Supported EVM chain IDs for the client factory
 */
export type SupportedChainId =
  | 1
  | 10
  | 56
  | 97
  | 137
  | 8453
  | 42161
  | 43114
  | 677868
  | 31337
  | 11155111;

/**
 * Supported Bitcoin chain IDs (CAIP-2 format with BIP122 namespace)
 */
export type SupportedBitcoinChainId = BitcoinChainId;

/**
 * Supported Zcash chain IDs (CAIP-2 format with BIP122 namespace)
 *
 * Note Zcash shares the `bip122:` namespace with Bitcoin, since it is a Bitcoin
 * fork. Routing therefore discriminates on registry membership, not on the
 * namespace prefix — see {@link isZcashNetwork} and {@link isBitcoinNetwork}.
 */
export type SupportedZcashChainId = ZcashChainId;

/**
 * Supported Solana chain IDs (CAIP-2 format with solana namespace)
 */
export type SupportedSolanaChainId = SolanaChainId;

/**
 * All supported network identifiers (EVM chain IDs + Bitcoin, Zcash and Solana CAIP-2 chain IDs)
 */
export type SupportedNetwork =
  | SupportedChainId
  | SupportedBitcoinChainId
  | SupportedZcashChainId
  | SupportedSolanaChainId;

/**
 * Constructor type for network clients
 */
export type ClientConstructor = new (config: StrategyConfig) => NetworkClient;

/**
 * Map EVM chain IDs to their specific client types
 */
export type ChainIdToClient<T extends SupportedChainId> = T extends 1 | 11155111
  ? EthereumClient
  : T extends 31337
    ? HardhatClient
    : T extends 10
      ? OptimismClient
      : T extends 56 | 97
        ? BNBClient
        : T extends 137
          ? PolygonClient
          : T extends 8453
            ? BaseClient
            : T extends 42161
              ? ArbitrumClient
              : T extends 43114
                ? AvalancheClient
                : T extends 677868
                  ? AztecClient
                  : NetworkClient;

/**
 * Map any network identifier to its specific client type
 */
export type NetworkToClient<T extends SupportedNetwork> = T extends SupportedSolanaChainId
  ? SolanaClient
  : T extends SupportedZcashChainId
    ? ZcashClient
    : T extends SupportedBitcoinChainId
      ? BitcoinClient
      : T extends SupportedChainId
        ? ChainIdToClient<T>
        : NetworkClient;

/**
 * Registry mapping EVM chain IDs to their corresponding client constructors
 */
const CHAIN_REGISTRY: Record<SupportedChainId, ClientConstructor> = {
  1: EthereumClient,
  10: OptimismClient,
  56: BNBClient,
  97: BNBClient,
  137: PolygonClient,
  8453: BaseClient,
  42161: ArbitrumClient,
  43114: AvalancheClient,
  677868: AztecClient,
  31337: HardhatClient, // Hardhat local development network
  11155111: SepoliaClient, // Sepolia testnet mapped to EthereumClient
};

/**
 * Registry mapping Bitcoin CAIP-2 chain IDs to the Bitcoin client constructor
 */
const BITCOIN_REGISTRY: Record<SupportedBitcoinChainId, typeof BitcoinClient> = {
  [BITCOIN_MAINNET]: BitcoinClient,
  [BITCOIN_TESTNET3]: BitcoinClient,
  [BITCOIN_TESTNET4]: BitcoinClient,
  [BITCOIN_SIGNET]: BitcoinClient,
};

/**
 * Registry mapping Zcash CAIP-2 chain IDs to the Zcash client constructor
 */
const ZCASH_REGISTRY: Record<SupportedZcashChainId, typeof ZcashClient> = {
  [ZCASH_MAINNET]: ZcashClient,
  [ZCASH_TESTNET]: ZcashClient,
};

/**
 * Registry mapping Solana CAIP-2 chain IDs to the Solana client constructor
 */
const SOLANA_REGISTRY: Record<SupportedSolanaChainId, typeof SolanaClient> = {
  [SOLANA_MAINNET]: SolanaClient,
  [SOLANA_DEVNET]: SolanaClient,
  [SOLANA_TESTNET]: SolanaClient,
};

/**
 * Check if a network identifier is a Zcash CAIP-2 chain ID
 *
 * Matches on registry membership rather than the `bip122:` prefix, which Zcash
 * shares with Bitcoin.
 */
function isZcashNetwork(network: SupportedNetwork): network is SupportedZcashChainId {
  return typeof network === "string" && network in ZCASH_REGISTRY;
}

/**
 * Check if a network identifier is a Bitcoin CAIP-2 chain ID
 *
 * Matches on registry membership rather than the `bip122:` prefix, which Bitcoin
 * shares with Zcash (and would share with any other Bitcoin fork added later).
 */
function isBitcoinNetwork(network: SupportedNetwork): network is SupportedBitcoinChainId {
  return typeof network === "string" && network in BITCOIN_REGISTRY;
}

/**
 * Check if a network identifier is a Solana CAIP-2 chain ID
 */
function isSolanaNetwork(network: SupportedNetwork): network is SupportedSolanaChainId {
  return typeof network === "string" && network.startsWith("solana:");
}

/**
 * Factory for creating network clients based on chain ID or network identifier
 * Provides a centralized registry for instantiating chain-specific clients
 */
export class ClientFactory {
  /**
   * Create an Ethereum client
   */
  static createClient(chainId: 1, config: StrategyConfig): EthereumClient;
  /**
   * Create a Hardhat client
   */
  static createClient(chainId: 31337, config: StrategyConfig): HardhatClient;
  /**
   * Create a Sepolia testnet client
   */
  static createClient(chainId: 11155111, config: StrategyConfig): SepoliaClient;
  /**
   * Create an Optimism client
   */
  static createClient(chainId: 10, config: StrategyConfig): OptimismClient;
  /**
   * Create a BNB Smart Chain client
   */
  static createClient(chainId: 56 | 97, config: StrategyConfig): BNBClient;
  /**
   * Create a Polygon client
   */
  static createClient(chainId: 137, config: StrategyConfig): PolygonClient;
  /**
   * Create a Base client
   */
  static createClient(chainId: 8453, config: StrategyConfig): BaseClient;
  /**
   * Create an Arbitrum client
   */
  static createClient(chainId: 42161, config: StrategyConfig): ArbitrumClient;
  /**
   * Create an Avalanche C-Chain client
   */
  static createClient(chainId: 43114, config: StrategyConfig): AvalancheClient;
  /**
   * Create an Aztec client
   */
  static createClient(chainId: 677868, config: StrategyConfig): AztecClient;
  /**
   * Create a Bitcoin client (CAIP-2 chain ID)
   */
  static createClient(chainId: SupportedBitcoinChainId, config: StrategyConfig): BitcoinClient;
  /**
   * Create a Zcash client (CAIP-2 chain ID)
   */
  static createClient(chainId: SupportedZcashChainId, config: StrategyConfig): ZcashClient;
  /**
   * Create a Solana client (CAIP-2 chain ID)
   */
  static createClient(chainId: SupportedSolanaChainId, config: StrategyConfig): SolanaClient;
  /**
   * Create a network client for any supported network
   */
  static createClient(network: SupportedNetwork, config: StrategyConfig): NetworkClient;
  /**
   * Create a network client for the specified network identifier
   *
   * @param network - The network identifier (EVM chain ID, or Bitcoin, Zcash or Solana CAIP-2 chain ID)
   * @param config - Strategy configuration with RPC URLs and strategy type
   * @returns NetworkClient instance for the specified network
   * @throws Error if the network is not supported
   */
  static createClient(network: SupportedNetwork, config: StrategyConfig): NetworkClient {
    if (isSolanaNetwork(network)) {
      const ClientClass = SOLANA_REGISTRY[network];
      if (!ClientClass) {
        throw new Error(`Unsupported Solana network: ${network}`);
      }
      return new ClientClass(config);
    }

    if (isZcashNetwork(network)) {
      const ClientClass = ZCASH_REGISTRY[network];
      if (!ClientClass) {
        throw new Error(`Unsupported Zcash network: ${network}`);
      }
      return new ClientClass(config);
    }

    if (isBitcoinNetwork(network)) {
      const ClientClass = BITCOIN_REGISTRY[network];
      if (!ClientClass) {
        throw new Error(`Unsupported Bitcoin network: ${network}`);
      }
      return new ClientClass(config);
    }

    const ClientClass = CHAIN_REGISTRY[network];
    if (!ClientClass) {
      throw new Error(`Unsupported chain ID: ${network}`);
    }
    return new ClientClass(config);
  }

  /**
   * Create a type-specific network client for the specified network
   * Automatically infers the correct client type based on the network identifier
   *
   * @param network - The network identifier (EVM chain ID, or Bitcoin, Zcash or Solana CAIP-2 chain ID)
   * @param config - Strategy configuration with RPC URLs and strategy type
   * @returns Typed client instance (e.g., SolanaClient for SOLANA_MAINNET, ZcashClient for ZCASH_MAINNET)
   * @throws Error if the network is not supported
   */
  static createTypedClient<T extends SupportedNetwork>(
    network: T,
    config: StrategyConfig,
  ): NetworkToClient<T> {
    return ClientFactory.createClient(network, config) as NetworkToClient<T>;
  }
}
