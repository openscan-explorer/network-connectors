import type { StrategyConfig } from "../strategies/requestStrategy.js";
import type { NetworkClient } from "../NetworkClient.js";
import { EthereumClient } from "../networks/1/EthereumClient.js";
import { OptimismClient } from "../networks/10/OptimismClient.js";
import { BNBClient } from "../networks/56/BNBClient.js";
import { PolygonClient } from "../networks/137/PolygonClient.js";
import { BaseClient } from "../networks/8453/BaseClient.js";
import { ArbitrumClient } from "../networks/42161/ArbitrumClient.js";
import { AztecClient } from "../networks/677868/AztecClient.js";
import { SepoliaClient } from "../networks/11155111/SepoliaClient.js";
import { BitcoinClient } from "../networks/bitcoin/BitcoinClient.js";
import {
  BITCOIN_MAINNET,
  BITCOIN_TESTNET3,
  BITCOIN_TESTNET4,
  BITCOIN_SIGNET,
  type BitcoinChainId,
} from "../networks/bitcoin/BitcoinTypes.js";

/**
 * Supported EVM chain IDs for the client factory
 */
export type SupportedChainId = 1 | 10 | 56 | 97 | 137 | 8453 | 42161 | 677868 | 31337 | 11155111;

/**
 * Supported Bitcoin chain IDs (CAIP-2 format with BIP122 namespace)
 */
export type SupportedBitcoinChainId = BitcoinChainId;

/**
 * All supported network identifiers (EVM chain IDs + Bitcoin CAIP-2 chain IDs)
 */
export type SupportedNetwork = SupportedChainId | SupportedBitcoinChainId;

/**
 * Constructor type for network clients
 */
export type ClientConstructor = new (config: StrategyConfig) => NetworkClient;

/**
 * Map EVM chain IDs to their specific client types
 */
export type ChainIdToClient<T extends SupportedChainId> = T extends 1 | 31337 | 11155111
  ? EthereumClient
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
            : T extends 677868
              ? AztecClient
              : NetworkClient;

/**
 * Map any network identifier to its specific client type
 */
export type NetworkToClient<T extends SupportedNetwork> = T extends SupportedBitcoinChainId
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
  677868: AztecClient,
  31337: EthereumClient, // Hardhat local network mapped to EthereumClient
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
 * Check if a network identifier is a Bitcoin CAIP-2 chain ID
 */
function isBitcoinNetwork(network: SupportedNetwork): network is SupportedBitcoinChainId {
  return typeof network === "string" && network.startsWith("bip122:");
}

/**
 * Factory for creating network clients based on chain ID or network identifier
 * Provides a centralized registry for instantiating chain-specific clients
 */
export class ClientFactory {
  /**
   * Create an Ethereum client
   */
  static createClient(chainId: 1 | 31337, config: StrategyConfig): EthereumClient;
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
   * Create an Aztec client
   */
  static createClient(chainId: 677868, config: StrategyConfig): AztecClient;
  /**
   * Create a Bitcoin client (CAIP-2 chain ID)
   */
  static createClient(chainId: SupportedBitcoinChainId, config: StrategyConfig): BitcoinClient;
  /**
   * Create a network client for any supported network
   */
  static createClient(network: SupportedNetwork, config: StrategyConfig): NetworkClient;
  /**
   * Create a network client for the specified network identifier
   *
   * @param network - The network identifier (EVM chain ID or Bitcoin CAIP-2 chain ID)
   * @param config - Strategy configuration with RPC URLs and strategy type
   * @returns NetworkClient instance for the specified network
   * @throws Error if the network is not supported
   */
  static createClient(network: SupportedNetwork, config: StrategyConfig): NetworkClient {
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
   * @param network - The network identifier (EVM chain ID or Bitcoin CAIP-2 chain ID)
   * @param config - Strategy configuration with RPC URLs and strategy type
   * @returns Typed client instance (e.g., BitcoinClient for BITCOIN_MAINNET, EthereumClient for 1)
   * @throws Error if the network is not supported
   */
  static createTypedClient<T extends SupportedNetwork>(
    network: T,
    config: StrategyConfig,
  ): NetworkToClient<T> {
    return ClientFactory.createClient(network, config) as NetworkToClient<T>;
  }
}
