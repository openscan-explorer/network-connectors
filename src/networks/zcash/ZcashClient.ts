/**
 * Zcash RPC Client (Zebra / zebrad)
 *
 * Provides typed methods for the Zcash JSON-RPC API as served by Zebra.
 * Supports mainnet and testnet.
 *
 * Zebra's RPC server is HTTP-only, so — unlike the EVM and Solana clients —
 * there is no WebSocket transport or subscription support for Zcash.
 *
 * All methods return StrategyResult<T> for consistent error handling.
 *
 * @see https://zebra.zfnd.org/
 * @see https://docs.rs/zebra-rpc/latest/zebra_rpc/methods/
 */

import { NetworkClient } from "../../NetworkClient.js";
import type { StrategyResult } from "../../strategies/strategiesTypes.js";
import type {
  ZecAddressBalance,
  ZecAddressRequest,
  ZecAddressTxIdsRequest,
  ZecAddressUtxo,
  ZecBlock,
  ZecBlockHeader,
  ZecBlockHeightAndHash,
  ZecBlockSubsidy,
  ZecBlockTemplate,
  ZecBlockTemplateRequest,
  ZecBlockVerbose,
  ZecBlockchainInfo,
  ZecDeprecationInfo,
  ZecHashOrHeight,
  ZecInfo,
  ZecMempoolEntry,
  ZecMempoolInfo,
  ZecMiningInfo,
  ZecNetworkInfo,
  ZecPeerInfo,
  ZecRawTransaction,
  ZecStandardFee,
  ZecSubmitBlockResult,
  ZecSubtrees,
  ZecTreestate,
  ZecTxOut,
  ZecUnifiedReceivers,
  ZecValidateAddress,
  ZecZValidateAddress,
} from "./ZcashTypes.js";

export class ZcashClient extends NetworkClient {
  // ===== Chain & Blocks =====

  /**
   * Returns various state info regarding blockchain processing
   */
  async getBlockchainInfo(): Promise<StrategyResult<ZecBlockchainInfo>> {
    return this.execute<ZecBlockchainInfo>("getblockchaininfo");
  }

  /**
   * Returns the height of the most-work fully-validated chain
   */
  async getBlockCount(): Promise<StrategyResult<number>> {
    return this.execute<number>("getblockcount");
  }

  /**
   * Returns the hash of the best (tip) block in the best chain
   */
  async getBestBlockHash(): Promise<StrategyResult<string>> {
    return this.execute<string>("getbestblockhash");
  }

  /**
   * Returns the height and hash of the best block in a single call
   */
  async getBestBlockHeightAndHash(): Promise<StrategyResult<ZecBlockHeightAndHash>> {
    return this.execute<ZecBlockHeightAndHash>("getbestblockheightandhash");
  }

  /**
   * Returns the hash of the block at the given height
   * @param index - Block height. Negative values count back from the tip.
   */
  async getBlockHash(index: number): Promise<StrategyResult<string>> {
    return this.execute<string>("getblockhash", [index]);
  }

  /**
   * Returns block data
   * @param hashOrHeight - Block hash, or height as a decimal string (e.g. "3444000")
   * @param verbosity - 0 = hex, 1 = JSON with txids (default), 2 = JSON with full transactions
   */
  async getBlock(hashOrHeight: ZecHashOrHeight, verbosity: 0): Promise<StrategyResult<string>>;
  async getBlock(hashOrHeight: ZecHashOrHeight, verbosity?: 1): Promise<StrategyResult<ZecBlock>>;
  async getBlock(
    hashOrHeight: ZecHashOrHeight,
    verbosity: 2,
  ): Promise<StrategyResult<ZecBlockVerbose>>;
  async getBlock(
    hashOrHeight: ZecHashOrHeight,
    verbosity: 0 | 1 | 2 = 1,
  ): Promise<StrategyResult<string | ZecBlock | ZecBlockVerbose>> {
    return this.execute("getblock", [hashOrHeight, verbosity]);
  }

  /**
   * Returns the block header
   * @param hashOrHeight - Block hash, or height as a decimal string
   * @param verbose - false returns hex, true returns a JSON object (default)
   */
  async getBlockHeader(
    hashOrHeight: ZecHashOrHeight,
    verbose: false,
  ): Promise<StrategyResult<string>>;
  async getBlockHeader(
    hashOrHeight: ZecHashOrHeight,
    verbose?: true,
  ): Promise<StrategyResult<ZecBlockHeader>>;
  async getBlockHeader(
    hashOrHeight: ZecHashOrHeight,
    verbose = true,
  ): Promise<StrategyResult<string | ZecBlockHeader>> {
    return this.execute("getblockheader", [hashOrHeight, verbose]);
  }

  /**
   * Returns the proof-of-work difficulty as a multiple of the minimum difficulty
   */
  async getDifficulty(): Promise<StrategyResult<number>> {
    return this.execute<number>("getdifficulty");
  }

  // ===== Transactions =====

  /**
   * Returns raw transaction data
   * @param txid - The transaction ID
   * @param verbose - 0 returns hex (default), 1 returns a JSON object
   * @param blockHash - Optional block hash to look the transaction up in
   */
  async getRawTransaction(
    txid: string,
    verbose: 0,
    blockHash?: string,
  ): Promise<StrategyResult<string>>;
  async getRawTransaction(
    txid: string,
    verbose: 1,
    blockHash?: string,
  ): Promise<StrategyResult<ZecRawTransaction>>;
  async getRawTransaction(
    txid: string,
    verbose: 0 | 1 = 0,
    blockHash?: string,
  ): Promise<StrategyResult<string | ZecRawTransaction>> {
    const params: (string | number)[] = [txid, verbose];
    if (blockHash !== undefined) params.push(blockHash);
    return this.execute("getrawtransaction", params);
  }

  /**
   * Submits a raw transaction (serialized, hex-encoded) to the network
   * @param hexString - The hex-encoded raw transaction
   * @param allowHighFees - Whether to allow unusually high fees
   * @returns The transaction ID
   */
  async sendRawTransaction(
    hexString: string,
    allowHighFees?: boolean,
  ): Promise<StrategyResult<string>> {
    const params: (string | boolean)[] = [hexString];
    if (allowHighFees !== undefined) params.push(allowHighFees);
    return this.execute<string>("sendrawtransaction", params);
  }

  /**
   * Returns details about an unspent transaction output
   * @param txid - The transaction ID
   * @param n - The output index (vout)
   * @param includeMempool - Whether to include the mempool (default true)
   */
  async getTxOut(
    txid: string,
    n: number,
    includeMempool?: boolean,
  ): Promise<StrategyResult<ZecTxOut | null>> {
    const params: (string | number | boolean)[] = [txid, n];
    if (includeMempool !== undefined) params.push(includeMempool);
    return this.execute<ZecTxOut | null>("gettxout", params);
  }

  // ===== Mempool =====

  /**
   * Returns details on the active state of the transaction memory pool
   */
  async getMempoolInfo(): Promise<StrategyResult<ZecMempoolInfo>> {
    return this.execute<ZecMempoolInfo>("getmempoolinfo");
  }

  /**
   * Returns all transaction IDs in the memory pool
   * @param verbose - false returns an array of txids (default), true returns detailed entries
   */
  async getRawMempool(verbose?: false): Promise<StrategyResult<string[]>>;
  async getRawMempool(verbose: true): Promise<StrategyResult<Record<string, ZecMempoolEntry>>>;
  async getRawMempool(
    verbose = false,
  ): Promise<StrategyResult<string[] | Record<string, ZecMempoolEntry>>> {
    return this.execute("getrawmempool", [verbose]);
  }

  // ===== Address Index =====

  /**
   * Returns the balance for the given transparent addresses
   *
   * Requires the node to be running with an address index.
   * @param request - Object bag of the form `{ addresses: ["t1..."] }`
   */
  async getAddressBalance(request: ZecAddressRequest): Promise<StrategyResult<ZecAddressBalance>> {
    return this.execute<ZecAddressBalance>("getaddressbalance", [request]);
  }

  /**
   * Returns the transaction IDs involving the given transparent addresses
   * @param request - Object bag of the form `{ addresses, start, end }`
   */
  async getAddressTxIds(request: ZecAddressTxIdsRequest): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("getaddresstxids", [request]);
  }

  /**
   * Returns all unspent outputs for the given transparent addresses
   * @param request - Object bag of the form `{ addresses: ["t1..."] }`
   */
  async getAddressUtxos(request: ZecAddressRequest): Promise<StrategyResult<ZecAddressUtxo[]>> {
    return this.execute<ZecAddressUtxo[]>("getaddressutxos", [request]);
  }

  // ===== Shielded Pools =====

  /**
   * Returns the Sapling and Orchard note commitment tree state at the given block
   * @param hashOrHeight - Block hash, or height as a decimal string
   */
  async zGetTreestate(hashOrHeight: ZecHashOrHeight): Promise<StrategyResult<ZecTreestate>> {
    return this.execute<ZecTreestate>("z_gettreestate", [hashOrHeight]);
  }

  /**
   * Returns note commitment subtrees for a shielded pool
   * @param pool - "sapling" or "orchard"
   * @param startIndex - The subtree index to start from
   * @param limit - Maximum number of subtrees to return
   */
  async zGetSubtreesByIndex(
    pool: string,
    startIndex: number,
    limit?: number,
  ): Promise<StrategyResult<ZecSubtrees>> {
    const params: (string | number)[] = [pool, startIndex];
    if (limit !== undefined) params.push(limit);
    return this.execute<ZecSubtrees>("z_getsubtreesbyindex", params);
  }

  /**
   * Returns the individual receivers contained in a unified address
   * @param address - A unified address (u1...)
   */
  async zListUnifiedReceivers(address: string): Promise<StrategyResult<ZecUnifiedReceivers>> {
    return this.execute<ZecUnifiedReceivers>("z_listunifiedreceivers", [address]);
  }

  // ===== Address Validation =====

  /**
   * Validates a transparent address
   * @param address - The transparent address to validate (t1.../t3...)
   */
  async validateAddress(address: string): Promise<StrategyResult<ZecValidateAddress>> {
    return this.execute<ZecValidateAddress>("validateaddress", [address]);
  }

  /**
   * Validates a shielded or unified address
   * @param address - The shielded (zs.../zc...) or unified (u1...) address to validate
   */
  async zValidateAddress(address: string): Promise<StrategyResult<ZecZValidateAddress>> {
    return this.execute<ZecZValidateAddress>("z_validateaddress", [address]);
  }

  // ===== Mining =====

  /**
   * Returns data needed to construct a block to work on
   * @param request - Optional template request parameters
   */
  async getBlockTemplate(
    request?: ZecBlockTemplateRequest,
  ): Promise<StrategyResult<ZecBlockTemplate>> {
    const params: ZecBlockTemplateRequest[] = [];
    if (request !== undefined) params.push(request);
    return this.execute<ZecBlockTemplate>("getblocktemplate", params);
  }

  /**
   * Submits a new block to the network
   * @param hexData - The hex-encoded block data
   * @param parameters - Optional extra parameters (ignored by Zebra)
   * @returns null on success, otherwise a rejection reason
   */
  async submitBlock(
    hexData: string,
    parameters?: Record<string, string>,
  ): Promise<StrategyResult<ZecSubmitBlockResult>> {
    const params: (string | Record<string, string>)[] = [hexData];
    if (parameters !== undefined) params.push(parameters);
    return this.execute<ZecSubmitBlockResult>("submitblock", params);
  }

  /**
   * Returns mining-related information
   */
  async getMiningInfo(): Promise<StrategyResult<ZecMiningInfo>> {
    return this.execute<ZecMiningInfo>("getmininginfo");
  }

  /**
   * Returns the estimated network solutions per second
   * @param numBlocks - Number of blocks to average over (default 120)
   * @param height - Estimate at the given height instead of the tip
   */
  async getNetworkSolPs(numBlocks?: number, height?: number): Promise<StrategyResult<number>> {
    const params: number[] = [];
    if (numBlocks !== undefined) params.push(numBlocks);
    if (height !== undefined) params.push(height);
    return this.execute<number>("getnetworksolps", params);
  }

  /**
   * Returns the estimated network solutions per second
   *
   * @deprecated Zebra keeps this only for zcashd compatibility — prefer
   * {@link ZcashClient.getNetworkSolPs}, which it delegates to.
   */
  async getNetworkHashPs(numBlocks?: number, height?: number): Promise<StrategyResult<number>> {
    const params: number[] = [];
    if (numBlocks !== undefined) params.push(numBlocks);
    if (height !== undefined) params.push(height);
    return this.execute<number>("getnetworkhashps", params);
  }

  /**
   * Returns the block subsidy split into miner, funding stream and lockbox portions
   * @param height - Block height to query (defaults to the next block)
   */
  async getBlockSubsidy(height?: number): Promise<StrategyResult<ZecBlockSubsidy>> {
    const params: number[] = [];
    if (height !== undefined) params.push(height);
    return this.execute<ZecBlockSubsidy>("getblocksubsidy", params);
  }

  /**
   * Returns the standard (conventional) fee for the current network upgrade
   */
  async getStandardFee(): Promise<StrategyResult<ZecStandardFee>> {
    return this.execute<ZecStandardFee>("getstandardfee");
  }

  /**
   * Mines blocks immediately (regtest only)
   * @param numBlocks - Number of blocks to generate
   * @returns The hashes of the generated blocks
   */
  async generate(numBlocks: number): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("generate", [numBlocks]);
  }

  /**
   * Mines blocks immediately to a given address (regtest only)
   * @param numBlocks - Number of blocks to generate
   * @param address - The address to send the coinbase to
   */
  async generateToAddress(numBlocks: number, address: string): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("generatetoaddress", [numBlocks, address]);
  }

  // ===== Node & Network =====

  /**
   * Returns general information about the node and network
   */
  async getInfo(): Promise<StrategyResult<ZecInfo>> {
    return this.execute<ZecInfo>("getinfo");
  }

  /**
   * Returns deprecation information for the running node
   */
  async getDeprecationInfo(): Promise<StrategyResult<ZecDeprecationInfo>> {
    return this.execute<ZecDeprecationInfo>("getdeprecationinfo");
  }

  /**
   * Returns information about the node's network connections
   */
  async getNetworkInfo(): Promise<StrategyResult<ZecNetworkInfo>> {
    return this.execute<ZecNetworkInfo>("getnetworkinfo");
  }

  /**
   * Returns data about each connected network peer
   */
  async getPeerInfo(): Promise<StrategyResult<ZecPeerInfo[]>> {
    return this.execute<ZecPeerInfo[]>("getpeerinfo");
  }

  /**
   * Requests that a ping be sent to all other nodes, to measure ping time
   */
  async ping(): Promise<StrategyResult<null>> {
    return this.execute<null>("ping");
  }

  /**
   * Adds, removes or reconnects to a peer node
   * @param addr - The peer address as "host:port"
   * @param command - "add", "remove" or "onetry"
   */
  async addNode(addr: string, command: "add" | "remove" | "onetry"): Promise<StrategyResult<null>> {
    return this.execute<null>("addnode", [addr, command]);
  }

  /**
   * Requests a graceful shutdown of the node
   */
  async stop(): Promise<StrategyResult<string>> {
    return this.execute<string>("stop");
  }

  // ===== Chain Manipulation =====

  /**
   * Permanently marks a block as invalid, as if it violated a consensus rule
   * @param blockHash - The hash of the block to invalidate
   */
  async invalidateBlock(blockHash: string): Promise<StrategyResult<null>> {
    return this.execute<null>("invalidateblock", [blockHash]);
  }

  /**
   * Removes invalidity status from a block previously marked invalid
   * @param blockHash - The hash of the block to reconsider
   */
  async reconsiderBlock(blockHash: string): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("reconsiderblock", [blockHash]);
  }
}
