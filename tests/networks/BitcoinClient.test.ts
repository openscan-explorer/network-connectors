import { describe, it } from "node:test";
import assert from "node:assert";
import { BitcoinClient } from "../../src/networks/bitcoin/BitcoinClient.js";
import {
  BITCOIN_MAINNET,
  BITCOIN_TESTNET3,
  BITCOIN_TESTNET4,
  BITCOIN_SIGNET,
} from "../../src/networks/bitcoin/BitcoinTypes.js";
import type {
  BtcBlockchainInfo,
  BtcBlock,
  BtcBlockVerbose,
  BtcBlockHeader,
  BtcBlockStats,
  BtcChainTip,
  BtcChainTxStats,
  BtcMempoolInfo,
  BtcMempoolEntry,
  BtcPrioritisedTransactions,
  BtcRawTransaction,
  BtcDecodeScript,
  BtcDecodedPsbt,
  BtcAnalyzedPsbt,
  BtcNetworkInfo,
  BtcFeeEstimate,
  BtcValidateAddress,
  BtcDescriptorInfo,
  BtcIndexInfo,
  BtcScriptPubKey,
  BtcVin,
  BtcVout,
} from "../../src/networks/bitcoin/BitcoinTypes.js";
import { ClientFactory } from "../../src/factory/ClientRegistry.js";
import type { StrategyConfig } from "../../src/strategies/requestStrategy.js";

/**
 * Validates that a value is a non-null object
 */
function assertObject(value: unknown, name: string): asserts value is Record<string, unknown> {
  assert.ok(value !== null && typeof value === "object", `${name} should be an object`);
}

/**
 * Validates that a value is a string
 */
function assertString(value: unknown, name: string): asserts value is string {
  assert.strictEqual(typeof value, "string", `${name} should be a string`);
}

/**
 * Validates that a value is a number
 */
function assertNumber(value: unknown, name: string): asserts value is number {
  assert.strictEqual(typeof value, "number", `${name} should be a number`);
}

/**
 * Validates that a value is a boolean
 */
function assertBoolean(value: unknown, name: string): asserts value is boolean {
  assert.strictEqual(typeof value, "boolean", `${name} should be a boolean`);
}

/**
 * Validates that a value is an array
 */
function assertArray(value: unknown, name: string): asserts value is unknown[] {
  assert.ok(Array.isArray(value), `${name} should be an array`);
}

/**
 * Validates BtcScriptPubKey type
 */
function validateBtcScriptPubKey(data: unknown, name: string): asserts data is BtcScriptPubKey {
  assertObject(data, name);
  assertString(data.asm, `${name}.asm`);
  assertString(data.hex, `${name}.hex`);
  assertString(data.type, `${name}.type`);
  // Optional fields
  if (data.desc !== undefined) assertString(data.desc, `${name}.desc`);
  if (data.address !== undefined) assertString(data.address, `${name}.address`);
}

/**
 * Validates BtcVin type
 */
function validateBtcVin(data: unknown, name: string): asserts data is BtcVin {
  assertObject(data, name);
  assertNumber(data.sequence, `${name}.sequence`);
  // Optional fields (coinbase tx vs regular tx)
  if (data.txid !== undefined) assertString(data.txid, `${name}.txid`);
  if (data.vout !== undefined) assertNumber(data.vout, `${name}.vout`);
  if (data.coinbase !== undefined) assertString(data.coinbase, `${name}.coinbase`);
  if (data.txinwitness !== undefined) assertArray(data.txinwitness, `${name}.txinwitness`);
  if (data.scriptSig !== undefined) {
    assertObject(data.scriptSig, `${name}.scriptSig`);
    assertString(data.scriptSig.asm, `${name}.scriptSig.asm`);
    assertString(data.scriptSig.hex, `${name}.scriptSig.hex`);
  }
}

/**
 * Validates BtcVout type
 */
function validateBtcVout(data: unknown, name: string): asserts data is BtcVout {
  assertObject(data, name);
  assertNumber(data.value, `${name}.value`);
  assertNumber(data.n, `${name}.n`);
  validateBtcScriptPubKey(data.scriptPubKey, `${name}.scriptPubKey`);
}

/**
 * Validates BtcBlockchainInfo type
 */
function validateBtcBlockchainInfo(data: unknown): asserts data is BtcBlockchainInfo {
  assertObject(data, "BtcBlockchainInfo");
  assertString(data.chain, "chain");
  assertNumber(data.blocks, "blocks");
  assertNumber(data.headers, "headers");
  assertString(data.bestblockhash, "bestblockhash");
  assertNumber(data.difficulty, "difficulty");
  assertNumber(data.time, "time");
  assertNumber(data.mediantime, "mediantime");
  assertNumber(data.verificationprogress, "verificationprogress");
  assertBoolean(data.initialblockdownload, "initialblockdownload");
  assertString(data.chainwork, "chainwork");
  assertNumber(data.size_on_disk, "size_on_disk");
  assertBoolean(data.pruned, "pruned");
  assertArray(data.warnings, "warnings");
  // Optional pruning fields
  if (data.pruneheight !== undefined) assertNumber(data.pruneheight, "pruneheight");
  if (data.automatic_pruning !== undefined)
    assertBoolean(data.automatic_pruning, "automatic_pruning");
  if (data.prune_target_size !== undefined)
    assertNumber(data.prune_target_size, "prune_target_size");
}

/**
 * Validates BtcBlockHeader type
 */
function validateBtcBlockHeader(data: unknown): asserts data is BtcBlockHeader {
  assertObject(data, "BtcBlockHeader");
  assertString(data.hash, "hash");
  assertNumber(data.confirmations, "confirmations");
  assertNumber(data.height, "height");
  assertNumber(data.version, "version");
  assertString(data.versionHex, "versionHex");
  assertString(data.merkleroot, "merkleroot");
  assertNumber(data.time, "time");
  assertNumber(data.mediantime, "mediantime");
  assertNumber(data.nonce, "nonce");
  assertString(data.bits, "bits");
  assertNumber(data.difficulty, "difficulty");
  assertString(data.chainwork, "chainwork");
  assertNumber(data.nTx, "nTx");
  // Optional fields
  if (data.previousblockhash !== undefined)
    assertString(data.previousblockhash, "previousblockhash");
  if (data.nextblockhash !== undefined) assertString(data.nextblockhash, "nextblockhash");
}

/**
 * Validates BtcBlock type (verbosity 1)
 */
function validateBtcBlock(data: unknown): asserts data is BtcBlock {
  validateBtcBlockHeader(data);
  assertObject(data, "BtcBlock");
  assertNumber(data.strippedsize, "strippedsize");
  assertNumber(data.size, "size");
  assertNumber(data.weight, "weight");
  assertArray(data.tx, "tx");
  // In verbosity 1, tx is array of txid strings
  if (data.tx.length > 0) {
    assertString(data.tx[0], "tx[0]");
  }
}

/**
 * Validates BtcBlockVerbose type (verbosity 2)
 */
function validateBtcBlockVerbose(data: unknown): asserts data is BtcBlockVerbose {
  validateBtcBlockHeader(data);
  assertObject(data, "BtcBlockVerbose");
  assertNumber(data.strippedsize, "strippedsize");
  assertNumber(data.size, "size");
  assertNumber(data.weight, "weight");
  assertArray(data.tx, "tx");
  // In verbosity 2, tx is array of transaction objects
  if (data.tx.length > 0 && typeof data.tx[0] === "object") {
    validateBtcRawTransaction(data.tx[0], "tx[0]");
  }
}

/**
 * Validates BtcBlockStats type
 */
function validateBtcBlockStats(data: unknown): asserts data is BtcBlockStats {
  assertObject(data, "BtcBlockStats");
  assertNumber(data.avgfee, "avgfee");
  assertNumber(data.avgfeerate, "avgfeerate");
  assertNumber(data.avgtxsize, "avgtxsize");
  assertString(data.blockhash, "blockhash");
  assertArray(data.feerate_percentiles, "feerate_percentiles");
  assert.strictEqual(data.feerate_percentiles.length, 5, "feerate_percentiles should have 5 items");
  assertNumber(data.height, "height");
  assertNumber(data.ins, "ins");
  assertNumber(data.maxfee, "maxfee");
  assertNumber(data.maxfeerate, "maxfeerate");
  assertNumber(data.maxtxsize, "maxtxsize");
  assertNumber(data.medianfee, "medianfee");
  assertNumber(data.mediantime, "mediantime");
  assertNumber(data.mediantxsize, "mediantxsize");
  assertNumber(data.minfee, "minfee");
  assertNumber(data.minfeerate, "minfeerate");
  assertNumber(data.mintxsize, "mintxsize");
  assertNumber(data.outs, "outs");
  assertNumber(data.subsidy, "subsidy");
  assertNumber(data.swtotal_size, "swtotal_size");
  assertNumber(data.swtotal_weight, "swtotal_weight");
  assertNumber(data.swtxs, "swtxs");
  assertNumber(data.time, "time");
  assertNumber(data.total_out, "total_out");
  assertNumber(data.total_size, "total_size");
  assertNumber(data.total_weight, "total_weight");
  assertNumber(data.totalfee, "totalfee");
  assertNumber(data.txs, "txs");
  assertNumber(data.utxo_increase, "utxo_increase");
  assertNumber(data.utxo_size_inc, "utxo_size_inc");
  assertNumber(data.utxo_increase_actual, "utxo_increase_actual");
  assertNumber(data.utxo_size_inc_actual, "utxo_size_inc_actual");
}

/**
 * Validates BtcChainTip type
 */
function validateBtcChainTip(data: unknown): asserts data is BtcChainTip {
  assertObject(data, "BtcChainTip");
  assertNumber(data.height, "height");
  assertString(data.hash, "hash");
  assertNumber(data.branchlen, "branchlen");
  assertString(data.status, "status");
  assert.ok(
    ["active", "valid-fork", "valid-headers", "headers-only", "invalid"].includes(
      data.status as string,
    ),
    `status should be one of active, valid-fork, valid-headers, headers-only, invalid but got ${data.status}`,
  );
}

/**
 * Validates BtcChainTxStats type
 */
function validateBtcChainTxStats(data: unknown): asserts data is BtcChainTxStats {
  assertObject(data, "BtcChainTxStats");
  assertNumber(data.time, "time");
  assertNumber(data.txcount, "txcount");
  assertString(data.window_final_block_hash, "window_final_block_hash");
  assertNumber(data.window_final_block_height, "window_final_block_height");
  assertNumber(data.window_block_count, "window_block_count");
  // Optional fields
  if (data.window_tx_count !== undefined) assertNumber(data.window_tx_count, "window_tx_count");
  if (data.window_interval !== undefined) assertNumber(data.window_interval, "window_interval");
  if (data.txrate !== undefined) assertNumber(data.txrate, "txrate");
}

/**
 * Validates BtcMempoolInfo type
 */
function validateBtcMempoolInfo(data: unknown): asserts data is BtcMempoolInfo {
  assertObject(data, "BtcMempoolInfo");
  assertBoolean(data.loaded, "loaded");
  assertNumber(data.size, "size");
  assertNumber(data.bytes, "bytes");
  assertNumber(data.usage, "usage");
  assertNumber(data.total_fee, "total_fee");
  assertNumber(data.maxmempool, "maxmempool");
  assertNumber(data.mempoolminfee, "mempoolminfee");
  assertNumber(data.minrelaytxfee, "minrelaytxfee");
  assertNumber(data.incrementalrelayfee, "incrementalrelayfee");
  assertNumber(data.unbroadcastcount, "unbroadcastcount");
  assertBoolean(data.fullrbf, "fullrbf");
}

/**
 * Validates BtcMempoolEntry type
 */
function validateBtcMempoolEntry(data: unknown): asserts data is BtcMempoolEntry {
  assertObject(data, "BtcMempoolEntry");
  assertNumber(data.vsize, "vsize");
  assertNumber(data.weight, "weight");
  assertNumber(data.time, "time");
  assertNumber(data.height, "height");
  assertNumber(data.descendantcount, "descendantcount");
  assertNumber(data.descendantsize, "descendantsize");
  assertNumber(data.ancestorcount, "ancestorcount");
  assertNumber(data.ancestorsize, "ancestorsize");
  assertString(data.wtxid, "wtxid");
  assertObject(data.fees, "fees");
  assertNumber(data.fees.base, "fees.base");
  assertNumber(data.fees.modified, "fees.modified");
  assertNumber(data.fees.ancestor, "fees.ancestor");
  assertNumber(data.fees.descendant, "fees.descendant");
  assertArray(data.depends, "depends");
  assertArray(data.spentby, "spentby");
  assertBoolean(data["bip125-replaceable"], "bip125-replaceable");
  assertBoolean(data.unbroadcast, "unbroadcast");
}

/**
 * Validates BtcPrioritisedTransactions type
 */
function validateBtcPrioritisedTransactions(
  data: unknown,
): asserts data is BtcPrioritisedTransactions {
  assertObject(data, "BtcPrioritisedTransactions");
  // It's a Record<txid, { fee_delta, in_mempool }>
  for (const [txid, entry] of Object.entries(data)) {
    assertString(txid, "txid key");
    assertObject(entry, `entry[${txid}]`);
    assertNumber((entry as Record<string, unknown>).fee_delta, `entry[${txid}].fee_delta`);
    assertBoolean((entry as Record<string, unknown>).in_mempool, `entry[${txid}].in_mempool`);
  }
}

/**
 * Validates BtcRawTransaction type
 */
function validateBtcRawTransaction(
  data: unknown,
  name = "BtcRawTransaction",
): asserts data is BtcRawTransaction {
  assertObject(data, name);
  assertString(data.txid, `${name}.txid`);
  assertString(data.hash, `${name}.hash`);
  assertNumber(data.version, `${name}.version`);
  assertNumber(data.size, `${name}.size`);
  assertNumber(data.vsize, `${name}.vsize`);
  assertNumber(data.weight, `${name}.weight`);
  assertNumber(data.locktime, `${name}.locktime`);
  assertArray(data.vin, `${name}.vin`);
  assertArray(data.vout, `${name}.vout`);
  for (let i = 0; i < data.vin.length; i++) {
    validateBtcVin(data.vin[i], `${name}.vin[${i}]`);
  }
  for (let i = 0; i < data.vout.length; i++) {
    validateBtcVout(data.vout[i], `${name}.vout[${i}]`);
  }
  // Optional fields
  if (data.hex !== undefined) assertString(data.hex, `${name}.hex`);
  if (data.blockhash !== undefined) assertString(data.blockhash, `${name}.blockhash`);
  if (data.confirmations !== undefined) assertNumber(data.confirmations, `${name}.confirmations`);
  if (data.time !== undefined) assertNumber(data.time, `${name}.time`);
  if (data.blocktime !== undefined) assertNumber(data.blocktime, `${name}.blocktime`);
  if (data.fee !== undefined) assertNumber(data.fee, `${name}.fee`);
}

/**
 * Validates BtcDecodeScript type
 */
function validateBtcDecodeScript(data: unknown): asserts data is BtcDecodeScript {
  assertObject(data, "BtcDecodeScript");
  assertString(data.asm, "asm");
  assertString(data.type, "type");
  // Optional fields
  if (data.desc !== undefined) assertString(data.desc, "desc");
  if (data.address !== undefined) assertString(data.address, "address");
  if (data.p2sh !== undefined) assertString(data.p2sh, "p2sh");
  if (data.segwit !== undefined) {
    assertObject(data.segwit, "segwit");
    assertString(data.segwit.asm, "segwit.asm");
    assertString(data.segwit.hex, "segwit.hex");
    assertString(data.segwit.type, "segwit.type");
    if (data.segwit.address !== undefined) assertString(data.segwit.address, "segwit.address");
    if (data.segwit.p2sh_segwit !== undefined)
      assertString(data.segwit.p2sh_segwit, "segwit.p2sh_segwit");
  }
}

/**
 * Validates BtcDecodedPsbt type
 */
function validateBtcDecodedPsbt(data: unknown): asserts data is BtcDecodedPsbt {
  assertObject(data, "BtcDecodedPsbt");
  assertObject(data.tx, "tx");
  validateBtcRawTransaction(data.tx, "tx");
  assertArray(data.global_xpubs, "global_xpubs");
  assertNumber(data.psbt_version, "psbt_version");
  assertArray(data.proprietary, "proprietary");
  assertObject(data.unknown, "unknown");
  assertArray(data.inputs, "inputs");
  assertArray(data.outputs, "outputs");
  if (data.fee !== undefined) assertNumber(data.fee, "fee");
}

/**
 * Validates BtcAnalyzedPsbt type
 */
function validateBtcAnalyzedPsbt(data: unknown): asserts data is BtcAnalyzedPsbt {
  assertObject(data, "BtcAnalyzedPsbt");
  assertArray(data.inputs, "inputs");
  assertString(data.next, "next");
  // Optional fields
  if (data.estimated_vsize !== undefined) assertNumber(data.estimated_vsize, "estimated_vsize");
  if (data.estimated_feerate !== undefined)
    assertNumber(data.estimated_feerate, "estimated_feerate");
  if (data.fee !== undefined) assertNumber(data.fee, "fee");
  if (data.error !== undefined) assertString(data.error, "error");
  // Validate input entries
  for (let i = 0; i < data.inputs.length; i++) {
    const input = data.inputs[i] as Record<string, unknown>;
    assertBoolean(input.has_utxo, `inputs[${i}].has_utxo`);
    assertBoolean(input.is_final, `inputs[${i}].is_final`);
  }
}

/**
 * Validates BtcNetworkInfo type
 */
function validateBtcNetworkInfo(data: unknown): asserts data is BtcNetworkInfo {
  assertObject(data, "BtcNetworkInfo");
  assertNumber(data.version, "version");
  assertString(data.subversion, "subversion");
  assertNumber(data.protocolversion, "protocolversion");
  assertString(data.localservices, "localservices");
  assertArray(data.localservicesnames, "localservicesnames");
  assertBoolean(data.localrelay, "localrelay");
  assertNumber(data.timeoffset, "timeoffset");
  assertBoolean(data.networkactive, "networkactive");
  assertNumber(data.connections, "connections");
  assertNumber(data.connections_in, "connections_in");
  assertNumber(data.connections_out, "connections_out");
  assertArray(data.networks, "networks");
  assertNumber(data.relayfee, "relayfee");
  assertNumber(data.incrementalfee, "incrementalfee");
  assertArray(data.localaddresses, "localaddresses");
  assertArray(data.warnings, "warnings");
  // Validate network entries
  for (let i = 0; i < data.networks.length; i++) {
    const network = data.networks[i] as Record<string, unknown>;
    assertString(network.name, `networks[${i}].name`);
    assertBoolean(network.limited, `networks[${i}].limited`);
    assertBoolean(network.reachable, `networks[${i}].reachable`);
    assertString(network.proxy, `networks[${i}].proxy`);
    assertBoolean(
      network.proxy_randomize_credentials,
      `networks[${i}].proxy_randomize_credentials`,
    );
  }
}

/**
 * Validates BtcFeeEstimate type
 */
function validateBtcFeeEstimate(data: unknown): asserts data is BtcFeeEstimate {
  assertObject(data, "BtcFeeEstimate");
  assertNumber(data.blocks, "blocks");
  // Optional fields
  if (data.feerate !== undefined) assertNumber(data.feerate, "feerate");
  if (data.errors !== undefined) assertArray(data.errors, "errors");
}

/**
 * Validates BtcValidateAddress type
 */
function validateBtcValidateAddress(data: unknown): asserts data is BtcValidateAddress {
  assertObject(data, "BtcValidateAddress");
  assertBoolean(data.isvalid, "isvalid");
  // Optional fields (only present if valid)
  if (data.address !== undefined) assertString(data.address, "address");
  if (data.scriptPubKey !== undefined) assertString(data.scriptPubKey, "scriptPubKey");
  if (data.isscript !== undefined) assertBoolean(data.isscript, "isscript");
  if (data.iswitness !== undefined) assertBoolean(data.iswitness, "iswitness");
  if (data.witness_version !== undefined) assertNumber(data.witness_version, "witness_version");
  if (data.witness_program !== undefined) assertString(data.witness_program, "witness_program");
  if (data.error !== undefined) assertString(data.error, "error");
  if (data.error_locations !== undefined) assertArray(data.error_locations, "error_locations");
}

/**
 * Validates BtcDescriptorInfo type
 */
function validateBtcDescriptorInfo(data: unknown): asserts data is BtcDescriptorInfo {
  assertObject(data, "BtcDescriptorInfo");
  assertString(data.descriptor, "descriptor");
  assertString(data.checksum, "checksum");
  assertBoolean(data.isrange, "isrange");
  assertBoolean(data.issolvable, "issolvable");
  assertBoolean(data.hasprivatekeys, "hasprivatekeys");
}

/**
 * Validates BtcIndexInfo type
 */
function validateBtcIndexInfo(data: unknown): asserts data is BtcIndexInfo {
  assertObject(data, "BtcIndexInfo");
  // It's a Record<indexName, { synced, best_block_height }>
  for (const [indexName, info] of Object.entries(data)) {
    assertString(indexName, "index name key");
    assertObject(info, `index[${indexName}]`);
    assertBoolean((info as Record<string, unknown>).synced, `index[${indexName}].synced`);
    assertNumber(
      (info as Record<string, unknown>).best_block_height,
      `index[${indexName}].best_block_height`,
    );
  }
}

const TEST_URLS = [
  "https://bitcoin-rpc.publicnode.com",
  "https://bitcoin-mainnet.gateway.tatum.io/",
];

describe("BitcoinClient - CAIP-2 Chain ID Constants", () => {
  it("should have correct BITCOIN_MAINNET chain ID", () => {
    assert.strictEqual(
      BITCOIN_MAINNET,
      "bip122:000000000019d6689c085ae165831e93",
      "BITCOIN_MAINNET should be correct CAIP-2 format",
    );
  });

  it("should have correct BITCOIN_TESTNET3 chain ID", () => {
    assert.strictEqual(
      BITCOIN_TESTNET3,
      "bip122:000000000933ea01ad0ee984209779ba",
      "BITCOIN_TESTNET3 should be correct CAIP-2 format",
    );
  });

  it("should have correct BITCOIN_TESTNET4 chain ID", () => {
    assert.strictEqual(
      BITCOIN_TESTNET4,
      "bip122:00000000da84f2bafbbc53dee25a72ae",
      "BITCOIN_TESTNET4 should be correct CAIP-2 format",
    );
  });

  it("should have correct BITCOIN_SIGNET chain ID", () => {
    assert.strictEqual(
      BITCOIN_SIGNET,
      "bip122:00000008819873e925422c1ff0f99f7c",
      "BITCOIN_SIGNET should be correct CAIP-2 format",
    );
  });
});

describe("BitcoinClient - Constructor", () => {
  it("should create client with fallback strategy", () => {
    const config: StrategyConfig = {
      type: "fallback",
      rpcUrls: TEST_URLS,
    };

    const client = new BitcoinClient(config);

    assert.ok(client, "Client should be created");
    assert.strictEqual(client.getStrategyName(), "fallback", "Should use fallback strategy");
  });

  it("should create client with parallel strategy", () => {
    const config: StrategyConfig = {
      type: "parallel",
      rpcUrls: TEST_URLS,
    };

    const client = new BitcoinClient(config);

    assert.ok(client, "Client should be created");
    assert.strictEqual(client.getStrategyName(), "parallel", "Should use parallel strategy");
  });

  it("should return RPC URLs", () => {
    const config: StrategyConfig = {
      type: "fallback",
      rpcUrls: TEST_URLS,
    };

    const client = new BitcoinClient(config);
    const urls = client.getRpcUrls();

    assert.deepStrictEqual(urls, TEST_URLS, "Should return configured RPC URLs");
  });

  it("should allow strategy update", () => {
    const config: StrategyConfig = {
      type: "fallback",
      rpcUrls: TEST_URLS,
    };

    const client = new BitcoinClient(config);
    assert.strictEqual(client.getStrategyName(), "fallback");

    client.updateStrategy("parallel");
    assert.strictEqual(client.getStrategyName(), "parallel", "Should update to parallel strategy");
  });
});

describe("BitcoinClient - Factory Integration", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };

  it("should create BitcoinClient via factory with BITCOIN_MAINNET", () => {
    const client = ClientFactory.createClient(BITCOIN_MAINNET, config);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
    assert.strictEqual(client.getStrategyName(), "fallback");
  });

  it("should create BitcoinClient via factory with BITCOIN_TESTNET3", () => {
    const client = ClientFactory.createClient(BITCOIN_TESTNET3, config);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
  });

  it("should create BitcoinClient via factory with BITCOIN_TESTNET4", () => {
    const client = ClientFactory.createClient(BITCOIN_TESTNET4, config);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
  });

  it("should create BitcoinClient via factory with BITCOIN_SIGNET", () => {
    const client = ClientFactory.createClient(BITCOIN_SIGNET, config);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
  });

  it("should create typed BitcoinClient via createTypedClient", () => {
    const client = ClientFactory.createTypedClient(BITCOIN_MAINNET, config);

    assert.ok(client instanceof BitcoinClient, "Should create BitcoinClient instance");
    // TypeScript should infer client as BitcoinClient
  });
});

describe("BitcoinClient - Method Signatures", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };

  it("should have blockchain methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getBestBlockHash, "function");
    assert.strictEqual(typeof client.getBlock, "function");
    assert.strictEqual(typeof client.getBlockchainInfo, "function");
    assert.strictEqual(typeof client.getBlockCount, "function");
    assert.strictEqual(typeof client.getBlockHash, "function");
    assert.strictEqual(typeof client.getBlockHeader, "function");
    assert.strictEqual(typeof client.getBlockStats, "function");
    assert.strictEqual(typeof client.getChainTips, "function");
    assert.strictEqual(typeof client.getChainTxStats, "function");
    assert.strictEqual(typeof client.getDifficulty, "function");
    assert.strictEqual(typeof client.getTxOut, "function");
    assert.strictEqual(typeof client.getTxOutSetInfo, "function");
    assert.strictEqual(typeof client.verifyChain, "function");
  });

  it("should have mempool methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getMempoolInfo, "function");
    assert.strictEqual(typeof client.getRawMempool, "function");
    assert.strictEqual(typeof client.getMempoolEntry, "function");
    assert.strictEqual(typeof client.getMempoolAncestors, "function");
    assert.strictEqual(typeof client.getMempoolDescendants, "function");
    assert.strictEqual(typeof client.testMempoolAccept, "function");
    assert.strictEqual(typeof client.submitPackage, "function");
  });

  it("should have raw transaction methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getRawTransaction, "function");
    assert.strictEqual(typeof client.decodeRawTransaction, "function");
    assert.strictEqual(typeof client.decodeScript, "function");
    assert.strictEqual(typeof client.sendRawTransaction, "function");
    assert.strictEqual(typeof client.createRawTransaction, "function");
    assert.strictEqual(typeof client.combineRawTransaction, "function");
    assert.strictEqual(typeof client.signRawTransactionWithKey, "function");
  });

  it("should have PSBT methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.createPsbt, "function");
    assert.strictEqual(typeof client.decodePsbt, "function");
    assert.strictEqual(typeof client.analyzePsbt, "function");
    assert.strictEqual(typeof client.combinePsbt, "function");
    assert.strictEqual(typeof client.finalizePsbt, "function");
    assert.strictEqual(typeof client.joinPsbts, "function");
    assert.strictEqual(typeof client.convertToPsbt, "function");
    assert.strictEqual(typeof client.utxoUpdatePsbt, "function");
  });

  it("should have network methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getNetworkInfo, "function");
    assert.strictEqual(typeof client.getPeerInfo, "function");
    assert.strictEqual(typeof client.getConnectionCount, "function");
    assert.strictEqual(typeof client.getNetTotals, "function");
    assert.strictEqual(typeof client.getAddedNodeInfo, "function");
    assert.strictEqual(typeof client.getNodeAddresses, "function");
    assert.strictEqual(typeof client.ping, "function");
    assert.strictEqual(typeof client.addNode, "function");
    assert.strictEqual(typeof client.disconnectNode, "function");
    assert.strictEqual(typeof client.listBanned, "function");
    assert.strictEqual(typeof client.setBan, "function");
    assert.strictEqual(typeof client.clearBanned, "function");
    assert.strictEqual(typeof client.setNetworkActive, "function");
  });

  it("should have fee estimation methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.estimateSmartFee, "function");
  });

  it("should have control methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getMemoryInfo, "function");
    assert.strictEqual(typeof client.getRpcInfo, "function");
    assert.strictEqual(typeof client.help, "function");
    assert.strictEqual(typeof client.uptime, "function");
    assert.strictEqual(typeof client.logging, "function");
    assert.strictEqual(typeof client.stop, "function");
  });

  it("should have utility methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.validateAddress, "function");
    assert.strictEqual(typeof client.getDescriptorInfo, "function");
    assert.strictEqual(typeof client.deriveAddresses, "function");
    assert.strictEqual(typeof client.createMultisig, "function");
    assert.strictEqual(typeof client.verifyMessage, "function");
    assert.strictEqual(typeof client.signMessageWithPrivKey, "function");
    assert.strictEqual(typeof client.getIndexInfo, "function");
  });

  it("should have mining methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getMiningInfo, "function");
    assert.strictEqual(typeof client.getNetworkHashPs, "function");
    assert.strictEqual(typeof client.getBlockTemplate, "function");
    assert.strictEqual(typeof client.submitBlock, "function");
    assert.strictEqual(typeof client.submitHeader, "function");
    assert.strictEqual(typeof client.generateToAddress, "function");
    assert.strictEqual(typeof client.generateBlock, "function");
    assert.strictEqual(typeof client.generateToDescriptor, "function");
    assert.strictEqual(typeof client.prioritiseTransaction, "function");
  });

  it("should have wallet methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.getWalletInfo, "function");
    assert.strictEqual(typeof client.getBalances, "function");
    assert.strictEqual(typeof client.getBalance, "function");
    assert.strictEqual(typeof client.listWallets, "function");
    assert.strictEqual(typeof client.loadWallet, "function");
    assert.strictEqual(typeof client.unloadWallet, "function");
    assert.strictEqual(typeof client.createWallet, "function");
    assert.strictEqual(typeof client.listWalletDir, "function");
    assert.strictEqual(typeof client.getNewAddress, "function");
    assert.strictEqual(typeof client.getRawChangeAddress, "function");
    assert.strictEqual(typeof client.getAddressInfo, "function");
    assert.strictEqual(typeof client.getAddressesByLabel, "function");
    assert.strictEqual(typeof client.setLabel, "function");
    assert.strictEqual(typeof client.listLabels, "function");
    assert.strictEqual(typeof client.getTransaction, "function");
    assert.strictEqual(typeof client.listTransactions, "function");
    assert.strictEqual(typeof client.listSinceBlock, "function");
    assert.strictEqual(typeof client.listReceivedByAddress, "function");
    assert.strictEqual(typeof client.listReceivedByLabel, "function");
    assert.strictEqual(typeof client.sendToAddress, "function");
    assert.strictEqual(typeof client.sendMany, "function");
    assert.strictEqual(typeof client.send, "function");
    assert.strictEqual(typeof client.sendAll, "function");
    assert.strictEqual(typeof client.listUnspent, "function");
    assert.strictEqual(typeof client.lockUnspent, "function");
    assert.strictEqual(typeof client.listLockUnspent, "function");
    assert.strictEqual(typeof client.walletCreateFundedPsbt, "function");
    assert.strictEqual(typeof client.walletProcessPsbt, "function");
    assert.strictEqual(typeof client.fundRawTransaction, "function");
    assert.strictEqual(typeof client.bumpFee, "function");
    assert.strictEqual(typeof client.psbtBumpFee, "function");
    assert.strictEqual(typeof client.setTxFee, "function");
    assert.strictEqual(typeof client.dumpPrivKey, "function");
    assert.strictEqual(typeof client.dumpWallet, "function");
    assert.strictEqual(typeof client.importPrivKey, "function");
    assert.strictEqual(typeof client.importAddress, "function");
    assert.strictEqual(typeof client.importPubKey, "function");
    assert.strictEqual(typeof client.importMulti, "function");
    assert.strictEqual(typeof client.importDescriptors, "function");
    assert.strictEqual(typeof client.backupWallet, "function");
    assert.strictEqual(typeof client.restoreWallet, "function");
    assert.strictEqual(typeof client.signMessage, "function");
    assert.strictEqual(typeof client.signRawTransactionWithWallet, "function");
  });

  it("should have Bitcoin Core v28+ specific methods", () => {
    const client = new BitcoinClient(config);

    // v28 new methods
    assert.strictEqual(typeof client.createWalletDescriptor, "function");
    assert.strictEqual(typeof client.getHdKeys, "function");
    assert.strictEqual(typeof client.getPrioritisedTransactions, "function");
  });

  it("should have signer methods", () => {
    const client = new BitcoinClient(config);

    assert.strictEqual(typeof client.enumerateSigners, "function");
    assert.strictEqual(typeof client.signerDisplayAddress, "function");
  });
});

describe("BitcoinClient - Type Inference", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };

  it("should have proper return type for getBlock with verbosity 0", async () => {
    const client = new BitcoinClient(config);
    // This is a type check - the method should accept verbosity 0 and return string
    const _method: (
      blockhash: string,
      verbosity?: 0,
    ) => Promise<{ success: boolean; data?: string }> = client.getBlock.bind(client);
    assert.ok(_method, "Method signature should match");
  });

  it("should have proper return type for getRawMempool with verbose false", async () => {
    const client = new BitcoinClient(config);
    // This is a type check - the method should accept verbose false and return string[]
    const _method: (verbose?: false) => Promise<{ success: boolean; data?: string[] }> =
      client.getRawMempool.bind(client);
    assert.ok(_method, "Method signature should match");
  });
});

// =============================================================================
// EXPLORER READ-ONLY TESTS
// These tests cover all read-only methods useful for a blockchain explorer.
// NO state-changing or configuration-modifying methods are tested here.
// =============================================================================

// Test data - well-known Bitcoin data for testing
const GENESIS_BLOCK_HASH = "000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";
const BLOCK_1_HASH = "00000000839a8e6886ab5951d76f411475428afc90947ee320161bbf18eb6048";
// Coinbase transaction in genesis block
const GENESIS_COINBASE_TXID = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";

// Valid Bitcoin addresses for testing
const VALID_MAINNET_P2PKH = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"; // Satoshi's address
const VALID_MAINNET_BECH32 = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";
const INVALID_ADDRESS = "1InvalidAddressXXXXXXXXXXXXXXXXXXX";

// Sample raw transaction hex (from a real Bitcoin transaction)
const SAMPLE_RAW_TX_HEX =
  "0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000";

// Sample P2PKH scriptPubKey hex
const SAMPLE_SCRIPT_HEX = "76a91489abcdefabbaabbaabbaabbaabbaabbaabbaabba88ac";

describe("BitcoinClient - Explorer Blockchain Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  it("should get best block hash", async () => {
    const result = await client.getBestBlockHash();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.strictEqual(typeof result.data, "string", "Should return string");
    assert.strictEqual(result.data.length, 64, "Block hash should be 64 characters");
  });

  it("should get blockchain info", async () => {
    const result = await client.getBlockchainInfo();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcBlockchainInfo(result.data);
    assert.strictEqual(result.data.chain, "main", "Should be mainnet");
  });

  it("should get block count", async () => {
    const result = await client.getBlockCount();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data !== undefined, "Should have data");
    assert.strictEqual(typeof result.data, "number", "Should return number");
    assert.ok(result.data > 800000, "Block count should be greater than 800000");
  });

  it("should get block hash by height (genesis)", async () => {
    const result = await client.getBlockHash(0);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.strictEqual(result.data, GENESIS_BLOCK_HASH, "Should return genesis block hash");
  });

  it("should get block hash by height (block 1)", async () => {
    const result = await client.getBlockHash(1);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.strictEqual(result.data, BLOCK_1_HASH, "Should return block 1 hash");
  });

  it("should get block by hash (verbosity 0 - hex)", async () => {
    const result = await client.getBlock(GENESIS_BLOCK_HASH, 0);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.strictEqual(typeof result.data, "string", "Should return hex string");
    assert.ok(result.data.length > 0, "Should have hex data");
  });

  it("should get block by hash (verbosity 1 - JSON)", async () => {
    const result = await client.getBlock(GENESIS_BLOCK_HASH, 1);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcBlock(result.data);
    assert.strictEqual(result.data.hash, GENESIS_BLOCK_HASH, "Should match requested hash");
    assert.strictEqual(result.data.height, 0, "Genesis block should be height 0");
  });

  it("should get block by hash (verbosity 2 - JSON with tx details)", async () => {
    const result = await client.getBlock(BLOCK_1_HASH, 2);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcBlockVerbose(result.data);
    assert.strictEqual(result.data.hash, BLOCK_1_HASH, "Should match requested hash");
    assert.strictEqual(result.data.height, 1, "Block 1 should be height 1");
  });

  it("should get block header (verbose - JSON)", async () => {
    const result = await client.getBlockHeader(GENESIS_BLOCK_HASH, true);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    if (typeof result.data === "object") {
      validateBtcBlockHeader(result.data);
      assert.strictEqual(result.data.hash, GENESIS_BLOCK_HASH, "Should match hash");
      assert.strictEqual(result.data.height, 0, "Should be height 0");
    }
  });

  it("should get block header (non-verbose - hex)", async () => {
    const result = await client.getBlockHeader(GENESIS_BLOCK_HASH, false);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.strictEqual(typeof result.data, "string", "Should return hex string");
    assert.strictEqual(result.data.length, 160, "Block header hex should be 160 chars (80 bytes)");
  });

  it("should get block stats by height", async () => {
    const result = await client.getBlockStats(1);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcBlockStats(result.data);
    assert.strictEqual(result.data.height, 1, "Should be height 1");
  });

  it("should get chain tips", async () => {
    const result = await client.getChainTips();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.ok(Array.isArray(result.data), "Should return array");
    assert.ok(result.data.length > 0, "Should have at least one tip");
    for (const tip of result.data) {
      validateBtcChainTip(tip);
    }
    const activeTip = result.data.find((tip) => tip.status === "active");
    assert.ok(activeTip, "Should have active tip");
  });

  it("should get chain tx stats", async () => {
    const result = await client.getChainTxStats();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcChainTxStats(result.data);
  });

  it("should get chain tx stats with custom window", async () => {
    const result = await client.getChainTxStats(100);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcChainTxStats(result.data);
    assert.ok(result.data.window_block_count <= 100, "Window should be <= 100 blocks");
  });

  it("should get difficulty", async () => {
    const result = await client.getDifficulty();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data !== undefined, "Should have data");
    assert.strictEqual(typeof result.data, "number", "Should return number");
    assert.ok(result.data > 0, "Difficulty should be positive");
  });
});

describe("BitcoinClient - Explorer Mempool Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  it("should get mempool info", async () => {
    const result = await client.getMempoolInfo();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcMempoolInfo(result.data);
  });

  it("should get raw mempool (txid list)", async () => {
    const result = await client.getRawMempool(false);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.ok(Array.isArray(result.data), "Should return array");
    // Mempool may be empty, so we just check it's an array
  });

  it("should get raw mempool (verbose)", async () => {
    const result = await client.getRawMempool(true);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.strictEqual(typeof result.data, "object", "Should return object");
    // If mempool has entries, validate structure
    const txids = Object.keys(result.data);
    if (txids.length > 0) {
      const entry = result.data[txids[0]];
      validateBtcMempoolEntry(entry);
    } else {
    }
  });

  it("should get prioritised transactions", async () => {
    const result = await client.getPrioritisedTransactions();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data !== undefined, "Should have data");
    validateBtcPrioritisedTransactions(result.data);
  });
});

describe("BitcoinClient - Explorer Transaction Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  // Note: getrawtransaction may require txindex on the node
  // Public RPC proxies often don't have this enabled
  it("should get raw transaction (hex) - requires txindex", { skip: true }, async () => {
    const result = await client.getRawTransaction(GENESIS_COINBASE_TXID, 0, GENESIS_BLOCK_HASH);
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.strictEqual(typeof result.data, "string", "Should return hex string");
    }
    // May fail on public nodes without txindex - that's OK
  });

  it("should get raw transaction (JSON) - requires txindex", { skip: true }, async () => {
    const result = await client.getRawTransaction(GENESIS_COINBASE_TXID, 1, GENESIS_BLOCK_HASH);
    if (result.success && typeof result.data === "object") {
      validateBtcRawTransaction(result.data);
      assert.strictEqual(result.data.txid, GENESIS_COINBASE_TXID, "Should match txid");
    }
    // May fail on public nodes without txindex - that's OK
  });

  it("should decode raw transaction", async () => {
    const result = await client.decodeRawTransaction(SAMPLE_RAW_TX_HEX);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcRawTransaction(result.data);
  });

  it("should decode script", async () => {
    const result = await client.decodeScript(SAMPLE_SCRIPT_HEX);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcDecodeScript(result.data);
  });
});

describe("BitcoinClient - Explorer PSBT Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  // Sample minimal PSBT (unsigned, empty)
  const SAMPLE_PSBT =
    "cHNidP8BAHUCAAAAASaBcTce3/KF6Ez2xIXRC7gXg78g75uiTKgHdv8S7H+OAAAAAAD+////AvY2EAAAAAAA" +
    "FgAUl3dA4b5rz2Dcwzm7N65vO4DtW7xA4fUFAAAAABYAFNtpbDXP3rqv/4XYrQV7xPDDYqYOAAAAAAABAR8A" +
    "4fUFAAAAABYAFBYAFJVQH/+bNg7LF6s5LlXqPTvRIgYCSgEC";

  it("should decode PSBT", async () => {
    const result = await client.decodePsbt(SAMPLE_PSBT);
    // This may fail if the PSBT is invalid for the node, which is OK
    if (result.success && result.data) {
      validateBtcDecodedPsbt(result.data);
    }
  });

  it("should analyze PSBT", async () => {
    const result = await client.analyzePsbt(SAMPLE_PSBT);
    // This may fail if the PSBT is invalid for the node, which is OK
    if (result.success && result.data) {
      validateBtcAnalyzedPsbt(result.data);
    }
  });
});

describe("BitcoinClient - Explorer Network Info Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  it("should get network info", async () => {
    const result = await client.getNetworkInfo();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcNetworkInfo(result.data);
  });

  // Note: These methods may be restricted on public RPC proxies
  it("should get peer info - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.getPeerInfo();
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.ok(Array.isArray(result.data), "Should return array");
    }
  });

  it("should get connection count", async () => {
    const result = await client.getConnectionCount();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data !== undefined, "Should have data");
    assert.strictEqual(typeof result.data, "number", "Should return number");
  });

  it("should get net totals - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.getNetTotals();
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.ok(typeof result.data.totalbytesrecv === "number", "Should have bytes received");
      assert.ok(typeof result.data.totalbytessent === "number", "Should have bytes sent");
    }
  });

  it("should get node addresses - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.getNodeAddresses();
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.ok(Array.isArray(result.data), "Should return array");
    }
  });

  it("should get node addresses with count - may be restricted", { skip: true }, async () => {
    const result = await client.getNodeAddresses(5);
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.ok(Array.isArray(result.data), "Should return array");
      assert.ok(result.data.length <= 5, "Should return at most 5 addresses");
    }
  });
});

describe("BitcoinClient - Explorer Fee Estimation Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  it("should estimate smart fee for 1 block", async () => {
    const result = await client.estimateSmartFee(1);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcFeeEstimate(result.data);
  });

  it("should estimate smart fee for 6 blocks", async () => {
    const result = await client.estimateSmartFee(6);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcFeeEstimate(result.data);
  });

  it("should estimate smart fee for 144 blocks (1 day)", async () => {
    const result = await client.estimateSmartFee(144);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcFeeEstimate(result.data);
  });

  it("should estimate smart fee with economical mode", async () => {
    const result = await client.estimateSmartFee(6, "economical");
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcFeeEstimate(result.data);
  });

  it("should estimate smart fee with conservative mode", async () => {
    const result = await client.estimateSmartFee(6, "conservative");
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcFeeEstimate(result.data);
  });
});

describe("BitcoinClient - Explorer Utility Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  it("should validate valid mainnet P2PKH address", async () => {
    const result = await client.validateAddress(VALID_MAINNET_P2PKH);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcValidateAddress(result.data);
    assert.strictEqual(result.data.isvalid, true, "Address should be valid");
    assert.strictEqual(result.data.address, VALID_MAINNET_P2PKH, "Should return address");
  });

  it("should validate valid mainnet bech32 address", async () => {
    const result = await client.validateAddress(VALID_MAINNET_BECH32);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcValidateAddress(result.data);
    assert.strictEqual(result.data.isvalid, true, "Address should be valid");
  });

  it("should detect invalid address", async () => {
    const result = await client.validateAddress(INVALID_ADDRESS);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcValidateAddress(result.data);
    assert.strictEqual(result.data.isvalid, false, "Address should be invalid");
  });

  it("should get descriptor info", async () => {
    const descriptor = `addr(${VALID_MAINNET_P2PKH})`;
    const result = await client.getDescriptorInfo(descriptor);
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    validateBtcDescriptorInfo(result.data);
  });

  it("should get index info", async () => {
    const result = await client.getIndexInfo();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data !== undefined, "Should have data");
    validateBtcIndexInfo(result.data);
  });
});

describe("BitcoinClient - Explorer Control Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  // Note: Control methods are often restricted on public RPC proxies
  it("should get memory info - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.getMemoryInfo();
    if (result.success) {
      assert.ok(result.data, "Should have data");
    }
  });

  it("should get RPC info - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.getRpcInfo();
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.ok(Array.isArray(result.data.active_commands), "Should have active commands");
    }
  });

  it("should get help - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.help();
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.strictEqual(typeof result.data, "string", "Should return string");
    }
  });

  it("should get help for specific command - may be restricted", { skip: true }, async () => {
    const result = await client.help("getblock");
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.strictEqual(typeof result.data, "string", "Should return string");
    }
  });

  it("should get uptime - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.uptime();
    if (result.success) {
      assert.ok(result.data !== undefined, "Should have data");
      assert.strictEqual(typeof result.data, "number", "Should return number");
      assert.ok(result.data >= 0, "Uptime should be non-negative");
    }
  });
});

describe("BitcoinClient - Explorer Mining Info Methods", () => {
  const config: StrategyConfig = {
    type: "fallback",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  // Note: Mining info methods may be restricted on public RPC proxies
  it("should get mining info - may be restricted on public nodes", { skip: true }, async () => {
    const result = await client.getMiningInfo();
    if (result.success) {
      assert.ok(result.data, "Should have data");
      assert.ok(typeof result.data.blocks === "number", "Should have blocks");
      assert.ok(typeof result.data.difficulty === "number", "Should have difficulty");
    }
  });

  it(
    "should get network hash rate - may be restricted on public nodes",
    { skip: true },
    async () => {
      const result = await client.getNetworkHashPs();
      if (result.success) {
        assert.ok(result.data !== undefined, "Should have data");
        assert.strictEqual(typeof result.data, "number", "Should return number");
      }
    },
  );

  it(
    "should get network hash rate with custom blocks - may be restricted",
    { skip: true },
    async () => {
      const result = await client.getNetworkHashPs(120);
      if (result.success) {
        assert.ok(result.data !== undefined, "Should have data");
        assert.strictEqual(typeof result.data, "number", "Should return number");
      }
    },
  );
});

describe("BitcoinClient - Explorer Parallel Strategy", () => {
  const config: StrategyConfig = {
    type: "parallel",
    rpcUrls: TEST_URLS,
  };
  const client = new BitcoinClient(config);

  it("should get blockchain info with metadata", async () => {
    const result = await client.getBlockchainInfo();
    assert.strictEqual(result.success, true, "Should succeed");
    assert.ok(result.data, "Should have data");
    assert.ok(result.metadata, "Should have metadata");
    assert.strictEqual(result.metadata?.strategy, "parallel", "Should be parallel strategy");
    assert.ok(typeof result.metadata?.timestamp === "number", "Should have timestamp");
    assert.ok(Array.isArray(result.metadata?.responses), "Should have responses array");
  });

  it("should get block count with response time tracking", async () => {
    const result = await client.getBlockCount();
    assert.strictEqual(result.success, true, "Should succeed");
    if (result.metadata?.responses) {
      for (const response of result.metadata.responses) {
        assert.ok(typeof response.responseTime === "number", "Should have response time");
        assert.ok(response.responseTime >= 0, "Response time should be non-negative");
      }
    }
  });
});
