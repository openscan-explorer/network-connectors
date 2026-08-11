import { describe, it } from "node:test";
import assert from "node:assert";
import { ClientFactory } from "../../../src/factory/ClientRegistry.js";
import { EthereumClient } from "../../../src/networks/1/EthereumClient.js";
import { OptimismClient } from "../../../src/networks/10/OptimismClient.js";
import { BNBClient } from "../../../src/networks/56/BNBClient.js";
import { PolygonClient } from "../../../src/networks/137/PolygonClient.js";
import { BaseClient } from "../../../src/networks/8453/BaseClient.js";
import { ArbitrumClient } from "../../../src/networks/42161/ArbitrumClient.js";
import { AztecClient } from "../../../src/networks/677868/AztecClient.js";
import { SepoliaClient } from "../../../src/networks/11155111/SepoliaClient.js";
import { SolanaClient } from "../../../src/networks/solana/SolanaClient.js";
import { ZcashClient } from "../../../src/networks/zcash/ZcashClient.js";
import { ZCASH_MAINNET, ZCASH_TESTNET } from "../../../src/networks/zcash/ZcashTypes.js";
import { BitcoinClient } from "../../../src/networks/bitcoin/BitcoinClient.js";
import { BITCOIN_MAINNET, BITCOIN_TESTNET3 } from "../../../src/networks/bitcoin/BitcoinTypes.js";
import {
  SOLANA_MAINNET,
  SOLANA_DEVNET,
  SOLANA_TESTNET,
} from "../../../src/networks/solana/SolanaTypes.js";
import type { StrategyConfig } from "../../../src/strategies/requestStrategy.js";

const TEST_URLS = ["https://rpc.example.com"];

const TEST_CONFIG: StrategyConfig = {
  type: "fallback",
  rpcUrls: TEST_URLS,
};

describe("ClientFactory - createClient", () => {
  it("should create EthereumClient for chain ID 1", () => {
    const client = ClientFactory.createClient(1, TEST_CONFIG);

    assert.ok(client instanceof EthereumClient, "Should create EthereumClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create OptimismClient for chain ID 10", () => {
    const client = ClientFactory.createClient(10, TEST_CONFIG);

    assert.ok(client instanceof OptimismClient, "Should create OptimismClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create BNBClient for chain ID 56", () => {
    const client = ClientFactory.createClient(56, TEST_CONFIG);

    assert.ok(client instanceof BNBClient, "Should create BNBClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create BNBClient for chain ID 97 (BNB Testnet)", () => {
    const client = ClientFactory.createClient(97, TEST_CONFIG);

    assert.ok(client instanceof BNBClient, "Should create BNBClient instance for BNB Testnet");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create PolygonClient for chain ID 137", () => {
    const client = ClientFactory.createClient(137, TEST_CONFIG);

    assert.ok(client instanceof PolygonClient, "Should create PolygonClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create BaseClient for chain ID 8453", () => {
    const client = ClientFactory.createClient(8453, TEST_CONFIG);

    assert.ok(client instanceof BaseClient, "Should create BaseClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create ArbitrumClient for chain ID 42161", () => {
    const client = ClientFactory.createClient(42161, TEST_CONFIG);

    assert.ok(client instanceof ArbitrumClient, "Should create ArbitrumClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create AztecClient for chain ID 677868", () => {
    const client = ClientFactory.createClient(677868, TEST_CONFIG);

    assert.ok(client instanceof AztecClient, "Should create AztecClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create EthereumClient for chain ID 31337 (Hardhat)", () => {
    const client = ClientFactory.createClient(31337, TEST_CONFIG);

    assert.ok(
      client instanceof EthereumClient,
      "Should create EthereumClient instance for Hardhat",
    );
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create SepoliaClient for chain ID 11155111", () => {
    const client = ClientFactory.createClient(11155111, TEST_CONFIG);

    assert.ok(client instanceof SepoliaClient, "Should create SepoliaClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create SolanaClient for SOLANA_MAINNET", () => {
    const client = ClientFactory.createClient(SOLANA_MAINNET, TEST_CONFIG);

    assert.ok(client instanceof SolanaClient, "Should create SolanaClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create SolanaClient for SOLANA_DEVNET", () => {
    const client = ClientFactory.createClient(SOLANA_DEVNET, TEST_CONFIG);

    assert.ok(client instanceof SolanaClient, "Should create SolanaClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create SolanaClient for SOLANA_TESTNET", () => {
    const client = ClientFactory.createClient(SOLANA_TESTNET, TEST_CONFIG);

    assert.ok(client instanceof SolanaClient, "Should create SolanaClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create ZcashClient for ZCASH_MAINNET", () => {
    const client = ClientFactory.createClient(ZCASH_MAINNET, TEST_CONFIG);

    assert.ok(client instanceof ZcashClient, "Should create ZcashClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create ZcashClient for ZCASH_TESTNET", () => {
    const client = ClientFactory.createClient(ZCASH_TESTNET, TEST_CONFIG);

    assert.ok(client instanceof ZcashClient, "Should create ZcashClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create BitcoinClient for BITCOIN_MAINNET", () => {
    const client = ClientFactory.createClient(BITCOIN_MAINNET, TEST_CONFIG);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });
});

describe("ClientFactory - bip122 namespace routing", () => {
  // Bitcoin and Zcash share the bip122: CAIP-2 namespace, so the factory must
  // discriminate on registry membership rather than the namespace prefix.
  it("should route Bitcoin and Zcash chain IDs to distinct clients", () => {
    const bitcoin = ClientFactory.createClient(BITCOIN_MAINNET, TEST_CONFIG);
    const zcash = ClientFactory.createClient(ZCASH_MAINNET, TEST_CONFIG);

    assert.ok(bitcoin instanceof BitcoinClient, "Bitcoin ID should yield BitcoinClient");
    assert.ok(zcash instanceof ZcashClient, "Zcash ID should yield ZcashClient");
    assert.ok(!(bitcoin instanceof ZcashClient), "Bitcoin must not yield ZcashClient");
    assert.ok(!(zcash instanceof BitcoinClient), "Zcash must not yield BitcoinClient");
  });

  it("should keep all bip122 testnet IDs routed to their own client", () => {
    assert.ok(ClientFactory.createClient(BITCOIN_TESTNET3, TEST_CONFIG) instanceof BitcoinClient);
    assert.ok(ClientFactory.createClient(ZCASH_TESTNET, TEST_CONFIG) instanceof ZcashClient);
  });

  it("should throw for an unregistered bip122 chain ID", () => {
    assert.throws(
      () =>
        ClientFactory.createClient(
          "bip122:ffffffffffffffffffffffffffffffff" as typeof ZCASH_MAINNET,
          TEST_CONFIG,
        ),
      /Unsupported/,
      "An unknown bip122 ID should be rejected rather than silently routed",
    );
  });
});

describe("ClientFactory - createTypedClient", () => {
  it("should create typed EthereumClient for chain ID 1", () => {
    const client = ClientFactory.createTypedClient(1, TEST_CONFIG);

    assert.ok(client instanceof EthereumClient, "Should create EthereumClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed OptimismClient for chain ID 10", () => {
    const client = ClientFactory.createTypedClient(10, TEST_CONFIG);

    assert.ok(client instanceof OptimismClient, "Should create OptimismClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed BNBClient for chain ID 56", () => {
    const client = ClientFactory.createTypedClient(56, TEST_CONFIG);

    assert.ok(client instanceof BNBClient, "Should create BNBClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed PolygonClient for chain ID 137", () => {
    const client = ClientFactory.createTypedClient(137, TEST_CONFIG);

    assert.ok(client instanceof PolygonClient, "Should create PolygonClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed BaseClient for chain ID 8453", () => {
    const client = ClientFactory.createTypedClient(8453, TEST_CONFIG);

    assert.ok(client instanceof BaseClient, "Should create BaseClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed ArbitrumClient for chain ID 42161", () => {
    const client = ClientFactory.createTypedClient(42161, TEST_CONFIG);

    assert.ok(client instanceof ArbitrumClient, "Should create ArbitrumClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed AztecClient for chain ID 677868", () => {
    const client = ClientFactory.createTypedClient(677868, TEST_CONFIG);

    assert.ok(client instanceof AztecClient, "Should create AztecClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed SepoliaClient for chain ID 11155111", () => {
    const client = ClientFactory.createTypedClient(11155111, TEST_CONFIG);

    assert.ok(client instanceof SepoliaClient, "Should create SepoliaClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create typed ZcashClient for ZCASH_MAINNET", () => {
    const client = ClientFactory.createTypedClient(ZCASH_MAINNET, TEST_CONFIG);

    assert.ok(client instanceof ZcashClient, "Should create ZcashClient instance");
    // TypeScript should infer client as ZcashClient
  });

  it("should create typed BitcoinClient for BITCOIN_MAINNET", () => {
    const client = ClientFactory.createTypedClient(BITCOIN_MAINNET, TEST_CONFIG);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
  });

  it("should create typed SolanaClient for SOLANA_DEVNET", () => {
    const client = ClientFactory.createTypedClient(SOLANA_DEVNET, TEST_CONFIG);

    assert.ok(client instanceof SolanaClient, "Should create SolanaClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });
});

describe("ClientFactory - Strategy Configuration", () => {
  it("should create client with parallel strategy", () => {
    const config: StrategyConfig = {
      type: "parallel",
      rpcUrls: TEST_URLS,
    };

    const client = ClientFactory.createClient(1, config);

    assert.ok(client instanceof EthereumClient, "Should create EthereumClient instance");
    assert.strictEqual(client.getStrategyName(), "parallel", "Should use parallel strategy");
  });

  it("should create client with multiple RPC URLs", () => {
    const config: StrategyConfig = {
      type: "fallback",
      rpcUrls: ["https://rpc1.example.com", "https://rpc2.example.com", "https://rpc3.example.com"],
    };

    const client = ClientFactory.createClient(42161, config);

    assert.ok(client instanceof ArbitrumClient, "Should create ArbitrumClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });
});

describe("ClientFactory - All Networks Coverage", () => {
  it("should support all documented chain IDs", () => {
    const chainIds: Array<1 | 10 | 56 | 97 | 137 | 8453 | 42161 | 677868 | 31337 | 11155111> = [
      1, // Ethereum Mainnet
      10, // Optimism
      56, // BNB Smart Chain
      97, // BNB Testnet
      137, // Polygon
      8453, // Base
      42161, // Arbitrum One
      677868, // Aztec
      31337, // Hardhat Local
      11155111, // Sepolia Testnet
    ];

    for (const chainId of chainIds) {
      const client = ClientFactory.createClient(chainId, TEST_CONFIG);
      assert.ok(client, `Should create client for chain ID ${chainId}`);
      assert.strictEqual(
        typeof client.getStrategyName,
        "function",
        `Client for chain ${chainId} should have getStrategyName method`,
      );
    }
  });

  it("should create correct client types for all networks", () => {
    const expectedTypes = [
      { chainId: 1 as const, clientClass: EthereumClient, name: "Ethereum" },
      { chainId: 10 as const, clientClass: OptimismClient, name: "Optimism" },
      { chainId: 56 as const, clientClass: BNBClient, name: "BNB" },
      { chainId: 97 as const, clientClass: BNBClient, name: "BNB Testnet" },
      { chainId: 137 as const, clientClass: PolygonClient, name: "Polygon" },
      { chainId: 8453 as const, clientClass: BaseClient, name: "Base" },
      { chainId: 42161 as const, clientClass: ArbitrumClient, name: "Arbitrum" },
      { chainId: 677868 as const, clientClass: AztecClient, name: "Aztec" },
      { chainId: 31337 as const, clientClass: EthereumClient, name: "Hardhat" },
      { chainId: 11155111 as const, clientClass: SepoliaClient, name: "Sepolia" },
    ];

    for (const { chainId, clientClass, name } of expectedTypes) {
      const client = ClientFactory.createClient(chainId, TEST_CONFIG);
      assert.ok(
        client instanceof clientClass,
        `Should create ${name} client (${clientClass.name}) for chain ID ${chainId}`,
      );
    }
  });
});
