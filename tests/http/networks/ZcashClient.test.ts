import { describe, it } from "node:test";
import assert from "node:assert";
import { ZcashClient } from "../../../src/networks/zcash/ZcashClient.js";
import { ZCASH_MAINNET, ZCASH_TESTNET } from "../../../src/networks/zcash/ZcashTypes.js";
import type {
  ZecBlock,
  ZecBlockHeader,
  ZecBlockVerbose,
  ZecBlockchainInfo,
  ZecMempoolInfo,
  ZecNetworkInfo,
  ZecRawTransaction,
  ZecTxOut,
  ZecValidateAddress,
} from "../../../src/networks/zcash/ZcashTypes.js";
import { ClientFactory } from "../../../src/factory/ClientRegistry.js";
import { BitcoinClient } from "../../../src/networks/bitcoin/BitcoinClient.js";
import { BITCOIN_MAINNET } from "../../../src/networks/bitcoin/BitcoinTypes.js";
import type { StrategyConfig } from "../../../src/strategies/requestStrategy.js";
import { getZcashTestEndpoints, hasTatumApiKey, hasZcashNodeUrl } from "../../helpers/env.js";

// =============================================================================
// Local validators
//
// tests/helpers/validators.ts is EVM/hex-oriented (0x-prefixed strings, addresses),
// which does not apply to Zcash's Bitcoin-style decimal/hex-digest responses.
// =============================================================================

function assertObject(value: unknown, label: string): asserts value is Record<string, unknown> {
  assert.ok(value !== null && typeof value === "object", `${label} should be an object`);
}

function assertString(value: unknown, label: string): asserts value is string {
  assert.strictEqual(typeof value, "string", `${label} should be a string`);
}

function assertNumber(value: unknown, label: string): asserts value is number {
  assert.strictEqual(typeof value, "number", `${label} should be a number`);
  assert.ok(Number.isFinite(value), `${label} should be finite`);
}

function assertBoolean(value: unknown, label: string): asserts value is boolean {
  assert.strictEqual(typeof value, "boolean", `${label} should be a boolean`);
}

/** A 64-char hex digest, the shape of every Zcash block hash and txid */
function assertHash(value: unknown, label: string): asserts value is string {
  assertString(value, label);
  assert.match(value, /^[0-9a-f]{64}$/, `${label} should be a 64-char lowercase hex digest`);
}

function validateBlockchainInfo(info: ZecBlockchainInfo): void {
  assertString(info.chain, "chain");
  assertNumber(info.blocks, "blocks");
  assertNumber(info.headers, "headers");
  assertNumber(info.difficulty, "difficulty");
  assertNumber(info.verificationprogress, "verificationprogress");
  assertBoolean(info.pruned, "pruned");
  assertNumber(info.estimatedheight, "estimatedheight");
  assertHash(info.bestblockhash, "bestblockhash");

  assertObject(info.chainSupply, "chainSupply");
  assertNumber(info.chainSupply.chainValue, "chainSupply.chainValue");
  assertNumber(info.chainSupply.chainValueZat, "chainSupply.chainValueZat");

  assert.ok(Array.isArray(info.valuePools), "valuePools should be an array");
  assert.ok(info.valuePools.length > 0, "valuePools should not be empty");
  for (const pool of info.valuePools) {
    assertString(pool.id, "valuePool.id");
    assertNumber(pool.chainValue, "valuePool.chainValue");
    assertNumber(pool.chainValueZat, "valuePool.chainValueZat");
    assertBoolean(pool.monitored, "valuePool.monitored");
  }

  assertObject(info.upgrades, "upgrades");
  for (const [branchId, upgrade] of Object.entries(info.upgrades)) {
    assertString(branchId, "upgrade branch ID");
    assertString(upgrade.name, "upgrade.name");
    assertNumber(upgrade.activationheight, "upgrade.activationheight");
    assertString(upgrade.status, "upgrade.status");
  }

  assertObject(info.consensus, "consensus");
  assertString(info.consensus.chaintip, "consensus.chaintip");
  assertString(info.consensus.nextblock, "consensus.nextblock");
}

function validateBlockHeader(header: ZecBlockHeader): void {
  assertHash(header.hash, "hash");
  assertNumber(header.confirmations, "confirmations");
  assertNumber(header.height, "height");
  assertNumber(header.version, "version");
  assertHash(header.merkleroot, "merkleroot");
  assertString(header.blockcommitments, "blockcommitments");
  assertString(header.finalsaplingroot, "finalsaplingroot");
  assertNumber(header.time, "time");
  // Zcash-specific: nonce is a 32-byte hex string, not a number as in Bitcoin
  assertString(header.nonce, "nonce");
  assert.strictEqual(header.nonce.length, 64, "nonce should be 32 bytes of hex");
  // Zcash-specific: Equihash solution
  assertString(header.solution, "solution");
  assert.ok(header.solution.length > 0, "solution should not be empty");
  assertString(header.bits, "bits");
  assertNumber(header.difficulty, "difficulty");
}

function validateBlock(block: ZecBlock): void {
  validateBlockHeader(block);
  assert.ok(Array.isArray(block.tx), "tx should be an array");
  for (const txid of block.tx) {
    assertHash(txid, "tx entry");
  }
}

function validateRawTransaction(tx: ZecRawTransaction): void {
  assertString(tx.hex, "hex");
  assert.ok(Array.isArray(tx.vin), "vin should be an array");
  assert.ok(Array.isArray(tx.vout), "vout should be an array");

  for (const vin of tx.vin) {
    assertNumber(vin.sequence, "vin.sequence");
    // A transparent input has either a txid/vout pair or a coinbase field
    assert.ok(
      vin.txid !== undefined || vin.coinbase !== undefined,
      "vin should carry either txid or coinbase",
    );
  }

  for (const vout of tx.vout) {
    assertNumber(vout.value, "vout.value");
    assertNumber(vout.n, "vout.n");
    assertObject(vout.scriptPubKey, "vout.scriptPubKey");
    assertString(vout.scriptPubKey.asm, "scriptPubKey.asm");
    assertString(vout.scriptPubKey.hex, "scriptPubKey.hex");
    assertString(vout.scriptPubKey.type, "scriptPubKey.type");
  }
}

// =============================================================================
// Test configuration
// =============================================================================

// The only free no-key Zcash JSON-RPC endpoints. Both are Tatum hosts sharing a
// single per-IP bucket of 5 req/min, so they buy redundancy rather than throughput.
// A TATUM_API_KEY raises the ceiling; ZCASH_RPC_URL substitutes another node.
const TEST_ENDPOINTS = getZcashTestEndpoints([
  "https://zcash-mainnet-zebrad.gateway.tatum.io",
  "https://zcash-mainnet.gateway.tatum.io",
]);

const config: StrategyConfig = { type: "fallback", rpcUrls: TEST_ENDPOINTS };

// Tatum's gateway whitelists methods, rejecting shielded, address-index, mining
// and node-admin RPCs with -32601. Those need a full node via ZCASH_RPC_URL.
const needsFullNode = {
  skip: hasZcashNodeUrl ? false : "requires ZCASH_RPC_URL (full zebrad node)",
};

// Anything beyond a handful of calls blows the 5 req/min anonymous budget.
const needsBudget = { skip: hasTatumApiKey || hasZcashNodeUrl ? false : "requires TATUM_API_KEY" };

// Well-known mainnet data
const GENESIS_BLOCK_HASH = "00040fe8ec8471911baa1db1266ea15dd06b4a8a5c453883c000b031973dce08";
const VALID_TRANSPARENT_ADDRESS = "t1Ku2KLyndDPsR32jwnrTMd3yvi9tfFP8ML";
const INVALID_ADDRESS = "t1InvalidAddressXXXXXXXXXXXXXXXXXXX";

// =============================================================================
// Offline tests — no network access
// =============================================================================

describe("ZcashClient - CAIP-2 Chain ID Constants [strong]", () => {
  it("should expose the mainnet CAIP-2 chain ID", () => {
    assert.strictEqual(ZCASH_MAINNET, "bip122:00040fe8ec8471911baa1db1266ea15d");
  });

  it("should expose the testnet CAIP-2 chain ID", () => {
    assert.strictEqual(ZCASH_TESTNET, "bip122:05a60a92d99d85997cce3b87616c089f");
  });

  it("should derive the mainnet reference from the genesis block hash", () => {
    const reference = ZCASH_MAINNET.split(":")[1];
    assert.strictEqual(
      reference,
      GENESIS_BLOCK_HASH.substring(0, 32),
      "CAIP-2 reference should be the first 32 chars of the genesis hash",
    );
  });

  it("should use the bip122 namespace shared with Bitcoin", () => {
    assert.ok(ZCASH_MAINNET.startsWith("bip122:"), "Zcash is a Bitcoin fork");
    assert.ok(ZCASH_TESTNET.startsWith("bip122:"), "Zcash is a Bitcoin fork");
    assert.notStrictEqual(ZCASH_MAINNET, BITCOIN_MAINNET, "Must not collide with Bitcoin");
  });
});

describe("ZcashClient - Constructor [strong]", () => {
  it("should construct with the fallback strategy", () => {
    const client = new ZcashClient(config);
    assert.strictEqual(client.getStrategyName(), "fallback");
  });

  it("should construct with the parallel strategy", () => {
    const client = new ZcashClient({ type: "parallel", rpcUrls: TEST_ENDPOINTS });
    assert.strictEqual(client.getStrategyName(), "parallel");
  });

  it("should expose the configured RPC URLs as strings", () => {
    const client = new ZcashClient(config);
    const urls = client.getRpcUrls();

    assert.strictEqual(urls.length, TEST_ENDPOINTS.length);
    for (const url of urls) {
      assert.strictEqual(typeof url, "string", "getRpcUrls should return plain strings");
    }
  });

  it("should switch strategies via updateStrategy", () => {
    const client = new ZcashClient(config);
    client.updateStrategy("race");
    assert.strictEqual(client.getStrategyName(), "race");
  });
});

describe("ZcashClient - Factory Integration [strong]", () => {
  it("should create a ZcashClient for ZCASH_MAINNET", () => {
    const client = ClientFactory.createClient(ZCASH_MAINNET, config);

    assert.ok(client instanceof ZcashClient, "Should create ZcashClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback");
  });

  it("should create a ZcashClient for ZCASH_TESTNET", () => {
    const client = ClientFactory.createClient(ZCASH_TESTNET, config);
    assert.ok(client instanceof ZcashClient, "Should create ZcashClient instance");
  });

  it("should create a typed ZcashClient via createTypedClient", () => {
    const client = ClientFactory.createTypedClient(ZCASH_MAINNET, config);
    assert.ok(client instanceof ZcashClient, "Should create ZcashClient instance");
  });

  it("should still route Bitcoin chain IDs to BitcoinClient", () => {
    // Regression guard: Zcash and Bitcoin share the bip122: namespace, so routing
    // must discriminate on registry membership rather than the prefix.
    const client = ClientFactory.createClient(BITCOIN_MAINNET, config);

    assert.ok(client instanceof BitcoinClient, "Bitcoin must not be captured by Zcash");
    assert.ok(!(client instanceof ZcashClient), "Bitcoin must not resolve to ZcashClient");
  });

  it("should not route Zcash chain IDs to BitcoinClient", () => {
    const client = ClientFactory.createClient(ZCASH_MAINNET, config);
    assert.ok(!(client instanceof BitcoinClient), "Zcash must not resolve to BitcoinClient");
  });

  it("should throw for an unknown bip122 chain ID", () => {
    assert.throws(
      () =>
        ClientFactory.createClient(
          "bip122:0000000000000000000000000000000f" as typeof ZCASH_MAINNET,
          config,
        ),
      /Unsupported/,
      "An unregistered bip122 ID should be rejected, not silently routed",
    );
  });
});

describe("ZcashClient - Method Signatures [strong]", () => {
  const client = new ZcashClient(config);

  const methodGroups: Record<string, string[]> = {
    "chain and blocks": [
      "getBlockchainInfo",
      "getBlockCount",
      "getBestBlockHash",
      "getBestBlockHeightAndHash",
      "getBlockHash",
      "getBlock",
      "getBlockHeader",
      "getDifficulty",
    ],
    transactions: ["getRawTransaction", "sendRawTransaction", "getTxOut"],
    mempool: ["getMempoolInfo", "getRawMempool"],
    "address index": ["getAddressBalance", "getAddressTxIds", "getAddressUtxos"],
    shielded: ["zGetTreestate", "zGetSubtreesByIndex", "zValidateAddress", "zListUnifiedReceivers"],
    mining: [
      "getBlockTemplate",
      "submitBlock",
      "getMiningInfo",
      "getNetworkSolPs",
      "getNetworkHashPs",
      "getBlockSubsidy",
      "getStandardFee",
      "generate",
      "generateToAddress",
    ],
    "node and network": [
      "getInfo",
      "getDeprecationInfo",
      "getNetworkInfo",
      "getPeerInfo",
      "ping",
      "addNode",
      "stop",
      "validateAddress",
    ],
    "chain manipulation": ["invalidateBlock", "reconsiderBlock"],
  };

  for (const [group, methods] of Object.entries(methodGroups)) {
    it(`should expose all ${group} methods`, () => {
      for (const method of methods) {
        assert.strictEqual(
          typeof (client as unknown as Record<string, unknown>)[method],
          "function",
          `${method} should be a function`,
        );
      }
    });
  }
});

// =============================================================================
// Live tests — real RPC calls, no mocks
// =============================================================================

describe("ZcashClient - Explorer Chain Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get blockchain info", async () => {
    const result = await client.getBlockchainInfo();

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBlockchainInfo(result.data);
    assert.strictEqual(result.data.chain, "main", "Should be mainnet");
  });

  it("should get the genesis block hash matching the CAIP-2 constant", async () => {
    const result = await client.getBlockHash(0);

    assert.strictEqual(result.success, true, "Should succeed");
    assert.strictEqual(result.data, GENESIS_BLOCK_HASH, "Should return the genesis hash");

    const reference = ZCASH_MAINNET.split(":")[1];
    assert.strictEqual(
      result.data?.substring(0, 32),
      reference,
      "Genesis hash prefix should match the CAIP-2 chain ID reference",
    );
  });

  it("should get the block count", { ...needsBudget }, async () => {
    const result = await client.getBlockCount();

    assert.strictEqual(result.success, true, "Should succeed");
    assertNumber(result.data, "block count");
    assert.ok(result.data > 3_400_000, "Mainnet should be past block 3.4M");
  });

  it("should get the best block hash", { ...needsBudget }, async () => {
    const result = await client.getBestBlockHash();

    assert.strictEqual(result.success, true, "Should succeed");
    assertHash(result.data, "best block hash");
  });

  it("should get the difficulty", { ...needsBudget }, async () => {
    const result = await client.getDifficulty();

    assert.strictEqual(result.success, true, "Should succeed");
    assertNumber(result.data, "difficulty");
    assert.ok(result.data > 0, "Difficulty should be positive");
  });
});

describe("ZcashClient - Explorer Block Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get the genesis block with verbosity 1", { ...needsBudget }, async () => {
    // Zcash takes hash_or_height as a string, so a height is passed as "0"
    const result = await client.getBlock("0", 1);

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBlock(result.data as ZecBlock);
    assert.strictEqual((result.data as ZecBlock).height, 0, "Should be the genesis block");
    assert.strictEqual((result.data as ZecBlock).hash, GENESIS_BLOCK_HASH);
  });

  it("should get a block header", { ...needsBudget }, async () => {
    const result = await client.getBlockHeader("0", true);

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBlockHeader(result.data as ZecBlockHeader);
    assert.strictEqual((result.data as ZecBlockHeader).height, 0);
  });

  it("should get a block with verbosity 2 (full transactions)", { ...needsBudget }, async () => {
    const result = await client.getBlock("3444000", 2);

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");

    const block = result.data as ZecBlockVerbose;
    validateBlockHeader(block);
    assert.ok(Array.isArray(block.tx), "tx should be an array");
    assert.ok(block.tx.length > 0, "Block should contain transactions");
    for (const tx of block.tx) {
      assertObject(tx, "transaction");
      validateRawTransaction(tx);
    }
  });

  it(
    "should carry Zcash-specific shielded pool fields on a block",
    { ...needsBudget },
    async () => {
      const result = await client.getBlock("3444000", 1);

      assert.strictEqual(result.success, true, "Should succeed");
      const block = result.data as ZecBlock;

      // finalorchardroot only exists on post-NU5 blocks
      assertString(block.finalorchardroot, "finalorchardroot");
      assert.ok(block.trees, "Should carry note commitment tree sizes");
      assertNumber(block.trees?.sapling?.size, "trees.sapling.size");
      assertNumber(block.trees?.orchard?.size, "trees.orchard.size");
    },
  );
});

describe("ZcashClient - Explorer Transaction Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get a raw transaction verbosely", { ...needsBudget }, async () => {
    const mempool = await client.getRawMempool();
    assert.strictEqual(mempool.success, true, "Should read the mempool");

    const txid = mempool.data?.[0];
    if (!txid) {
      // An empty mempool is legitimate, not a failure
      return;
    }

    const result = await client.getRawTransaction(txid, 1);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateRawTransaction(result.data as ZecRawTransaction);
  });

  it("should return hex for a raw transaction at verbose 0", { ...needsBudget }, async () => {
    const mempool = await client.getRawMempool();
    const txid = mempool.data?.[0];
    if (!txid) return;

    const result = await client.getRawTransaction(txid, 0);
    assert.strictEqual(result.success, true, "Should succeed");
    assertString(result.data, "raw transaction hex");
  });
});

describe("ZcashClient - Explorer Mempool Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get mempool info", async () => {
    const result = await client.getMempoolInfo();

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");

    const info = result.data as ZecMempoolInfo;
    assertNumber(info.size, "size");
    assertNumber(info.bytes, "bytes");
    assertNumber(info.usage, "usage");
  });

  it("should get the raw mempool as txids", { ...needsBudget }, async () => {
    const result = await client.getRawMempool();

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(Array.isArray(result.data), "Should return an array");
    for (const txid of result.data ?? []) {
      assertHash(txid, "mempool txid");
    }
  });
});

describe("ZcashClient - Explorer Utility Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should validate a transparent address", { ...needsBudget }, async () => {
    const result = await client.validateAddress(VALID_TRANSPARENT_ADDRESS);

    assert.strictEqual(result.success, true, "Should succeed");
    const data = result.data as ZecValidateAddress;
    assert.strictEqual(data.isvalid, true, "Address should be valid");
    assert.strictEqual(data.address, VALID_TRANSPARENT_ADDRESS);
  });

  it("should reject an invalid address", { ...needsBudget }, async () => {
    const result = await client.validateAddress(INVALID_ADDRESS);

    assert.strictEqual(result.success, true, "Call should succeed");
    assert.strictEqual(
      (result.data as ZecValidateAddress).isvalid,
      false,
      "Address should be reported invalid",
    );
  });

  it("should get network info", { ...needsBudget }, async () => {
    const result = await client.getNetworkInfo();

    assert.strictEqual(result.success, true, "Should succeed");
    const info = result.data as ZecNetworkInfo;
    assertNumber(info.version, "version");
    assertString(info.subversion, "subversion");
    assertNumber(info.protocolversion, "protocolversion");
    assert.ok(Array.isArray(info.networks), "networks should be an array");
  });
});

// =============================================================================
// Methods the public gateway blocks — these need a full zebrad node
// =============================================================================

describe("ZcashClient - Shielded Pool Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get the treestate at a block", { ...needsFullNode }, async () => {
    const result = await client.zGetTreestate("3444000");

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assertHash(result.data.hash, "treestate hash");
    assertNumber(result.data.height, "treestate height");
  });

  it("should get sapling subtrees by index", { ...needsFullNode }, async () => {
    const result = await client.zGetSubtreesByIndex("sapling", 0, 1);

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.ok(Array.isArray(result.data.subtrees), "subtrees should be an array");
  });

  it("should validate a shielded address", { ...needsFullNode }, async () => {
    const result = await client.zValidateAddress(VALID_TRANSPARENT_ADDRESS);

    assert.strictEqual(result.success, true, "Should succeed");
    assertBoolean(result.data?.isvalid, "isvalid");
  });
});

describe("ZcashClient - Address Index Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get an address balance", { ...needsFullNode }, async () => {
    const result = await client.getAddressBalance({
      addresses: [VALID_TRANSPARENT_ADDRESS],
    });

    assert.strictEqual(result.success, true, "Should succeed");
    assertNumber(result.data?.balance, "balance");
  });

  it("should get address UTXOs", { ...needsFullNode }, async () => {
    const result = await client.getAddressUtxos({
      addresses: [VALID_TRANSPARENT_ADDRESS],
    });

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(Array.isArray(result.data), "Should return an array");
  });

  it("should get address transaction IDs", { ...needsFullNode }, async () => {
    const result = await client.getAddressTxIds({
      addresses: [VALID_TRANSPARENT_ADDRESS],
      start: 3_400_000,
      end: 3_400_100,
    });

    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(Array.isArray(result.data), "Should return an array");
  });
});

describe("ZcashClient - Node Info Methods [strong]", () => {
  const client = new ZcashClient(config);

  it("should get node info", { ...needsFullNode }, async () => {
    const result = await client.getInfo();

    assert.strictEqual(result.success, true, "Should succeed");
    assertNumber(result.data?.version, "version");
    assertString(result.data?.subversion, "subversion");
  });

  it("should get the block subsidy", { ...needsFullNode }, async () => {
    const result = await client.getBlockSubsidy();

    assert.strictEqual(result.success, true, "Should succeed");
    assertNumber(result.data?.miner, "miner subsidy");
  });

  it("should get mining info", { ...needsFullNode }, async () => {
    const result = await client.getMiningInfo();

    assert.strictEqual(result.success, true, "Should succeed");
    assertNumber(result.data?.blocks, "blocks");
  });
});

describe("ZcashClient - Error Handling [strong]", () => {
  it("should report failure for an unreachable endpoint", async () => {
    const client = new ZcashClient({
      type: "fallback",
      rpcUrls: ["http://127.0.0.1:1"],
    });

    const result = await client.getBlockCount();

    assert.strictEqual(result.success, false, "Should fail against a dead endpoint");
    assert.ok(result.errors, "Should carry error details");
  });

  it("should return an error for a nonexistent block height", { ...needsBudget }, async () => {
    const client = new ZcashClient(config);
    const result = await client.getBlock("999999999", 1);

    assert.strictEqual(result.success, false, "Should fail for an out-of-range height");
  });
});

describe("ZcashClient - TxOut [strong]", () => {
  const client = new ZcashClient(config);

  it("should return null for a spent or unknown output", { ...needsBudget }, async () => {
    const result = await client.getTxOut(GENESIS_BLOCK_HASH, 0);

    assert.strictEqual(result.success, true, "Call should succeed");
    // The genesis hash is not a txid, so there is no such output
    assert.strictEqual(result.data, null, "Unknown outputs should return null");
  });

  it("should describe a live UTXO when one is available", { ...needsFullNode }, async () => {
    const mempool = await client.getRawMempool();
    const txid = mempool.data?.[0];
    if (!txid) return;

    const result = await client.getTxOut(txid, 0, true);
    assert.strictEqual(result.success, true, "Should succeed");

    if (result.data) {
      const txout = result.data as ZecTxOut;
      assertHash(txout.bestblock, "bestblock");
      assertNumber(txout.value, "value");
      assertBoolean(txout.coinbase, "coinbase");
      assertObject(txout.scriptPubKey, "scriptPubKey");
    }
  });
});
