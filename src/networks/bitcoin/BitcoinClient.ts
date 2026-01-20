/**
 * Bitcoin Core RPC Client (v28+)
 *
 * Provides typed methods for all Bitcoin Core JSON-RPC API calls.
 * Supports mainnet, testnet3, testnet4, signet, and regtest.
 *
 * @see https://developer.bitcoin.org/reference/rpc/
 */

import { NetworkClient } from "../../NetworkClient.js";
import type { StrategyResult } from "../../strategies/strategiesTypes.js";
import type {
  BtcAddedNodeInfo,
  BtcAddressInfo,
  BtcAnalyzedPsbt,
  BtcBalances,
  BtcBannedEntry,
  BtcBlock,
  BtcBlockchainInfo,
  BtcBlockFilter,
  BtcBlockHeader,
  BtcBlockStats,
  BtcBlockTemplate,
  BtcBlockVerbose,
  BtcBumpFeeResult,
  BtcChainTip,
  BtcChainTxStats,
  BtcCreateMultisig,
  BtcCreateWalletResult,
  BtcDecodeScript,
  BtcDecodedPsbt,
  BtcDescriptorInfo,
  BtcFeeEstimate,
  BtcFinalizedPsbt,
  BtcFundRawTransactionResult,
  BtcHdKey,
  BtcImportDescriptor,
  BtcImportDescriptorResult,
  BtcIndexInfo,
  BtcListDescriptors,
  BtcListSinceBlock,
  BtcListTransactionsEntry,
  BtcLoadWalletResult,
  BtcLockedUnspent,
  BtcMemoryInfo,
  BtcMempoolAcceptResult,
  BtcMempoolEntry,
  BtcMempoolInfo,
  BtcMiningInfo,
  BtcNetTotals,
  BtcNetworkInfo,
  BtcNodeAddress,
  BtcPeerInfo,
  BtcPrioritisedTransactions,
  BtcRawTransaction,
  BtcReceivedByAddress,
  BtcReceivedByLabel,
  BtcRpcInfo,
  BtcScanBlocksResult,
  BtcScanTxOutSetResult,
  BtcSendResult,
  BtcSignerInfo,
  BtcSubmitPackageResult,
  BtcTxOutSetInfo,
  BtcUnspent,
  BtcUtxo,
  BtcValidateAddress,
  BtcWalletCreateFundedPsbtResult,
  BtcWalletDirEntry,
  BtcWalletInfo,
  BtcWalletTransaction,
} from "./BitcoinTypes.js";

/**
 * Bitcoin Core RPC Client
 *
 * Provides typed methods for interacting with Bitcoin Core nodes.
 * All methods return StrategyResult<T> for consistent error handling.
 */
export class BitcoinClient extends NetworkClient {
  /**
   * Returns the hash of the best (tip) block in the most-work fully-validated chain.
   */
  async getBestBlockHash(): Promise<StrategyResult<string>> {
    return this.execute<string>("getbestblockhash");
  }

  /**
   * Returns block data.
   * @param blockhash The block hash
   * @param verbosity 0=hex, 1=JSON (default), 2=JSON with tx details, 3=JSON with prevout
   */
  async getBlock(blockhash: string, verbosity?: 0): Promise<StrategyResult<string>>;
  async getBlock(blockhash: string, verbosity: 1): Promise<StrategyResult<BtcBlock>>;
  async getBlock(blockhash: string, verbosity: 2 | 3): Promise<StrategyResult<BtcBlockVerbose>>;
  async getBlock(
    blockhash: string,
    verbosity: 0 | 1 | 2 | 3 = 1,
  ): Promise<StrategyResult<string | BtcBlock | BtcBlockVerbose>> {
    return this.execute("getblock", [blockhash, verbosity]);
  }

  /**
   * Returns blockchain state info.
   */
  async getBlockchainInfo(): Promise<StrategyResult<BtcBlockchainInfo>> {
    return this.execute<BtcBlockchainInfo>("getblockchaininfo");
  }

  /**
   * Returns the height of the most-work fully-validated chain.
   */
  async getBlockCount(): Promise<StrategyResult<number>> {
    return this.execute<number>("getblockcount");
  }

  /**
   * Retrieve a BIP 157 content filter for a particular block.
   * @param blockhash The block hash
   * @param filtertype The type name of the filter (default: basic)
   */
  async getBlockFilter(
    blockhash: string,
    filtertype?: string,
  ): Promise<StrategyResult<BtcBlockFilter>> {
    const params: (string | undefined)[] = [blockhash];
    if (filtertype !== undefined) params.push(filtertype);
    return this.execute<BtcBlockFilter>("getblockfilter", params);
  }

  /**
   * Returns hash of block in best-block-chain at height provided.
   * @param height The height index
   */
  async getBlockHash(height: number): Promise<StrategyResult<string>> {
    return this.execute<string>("getblockhash", [height]);
  }

  /**
   * Returns block header data.
   * @param blockhash The block hash
   * @param verbose true for JSON object, false for hex-encoded data
   */
  async getBlockHeader(blockhash: string, verbose?: true): Promise<StrategyResult<BtcBlockHeader>>;
  async getBlockHeader(blockhash: string, verbose: false): Promise<StrategyResult<string>>;
  async getBlockHeader(
    blockhash: string,
    verbose = true,
  ): Promise<StrategyResult<BtcBlockHeader | string>> {
    return this.execute("getblockheader", [blockhash, verbose]);
  }

  /**
   * Compute per block statistics for a given window.
   * @param hashOrHeight The block hash or height
   * @param stats Stats to return (omit for all)
   */
  async getBlockStats(
    hashOrHeight: string | number,
    stats?: string[],
  ): Promise<StrategyResult<BtcBlockStats>> {
    const params: (string | number | string[])[] = [hashOrHeight];
    if (stats !== undefined) params.push(stats);
    return this.execute<BtcBlockStats>("getblockstats", params);
  }

  /**
   * Return information about all known tips in the block tree.
   */
  async getChainTips(): Promise<StrategyResult<BtcChainTip[]>> {
    return this.execute<BtcChainTip[]>("getchaintips");
  }

  /**
   * Compute statistics about the total number and rate of transactions in the chain.
   * @param nblocks Size of the window in number of blocks
   * @param blockhash The hash of the block that ends the window
   */
  async getChainTxStats(
    nblocks?: number,
    blockhash?: string,
  ): Promise<StrategyResult<BtcChainTxStats>> {
    const params: (number | string)[] = [];
    if (nblocks !== undefined) params.push(nblocks);
    if (blockhash !== undefined) params.push(blockhash);
    return this.execute<BtcChainTxStats>("getchaintxstats", params);
  }

  /**
   * Returns the proof-of-work difficulty as a multiple of the minimum difficulty.
   */
  async getDifficulty(): Promise<StrategyResult<number>> {
    return this.execute<number>("getdifficulty");
  }

  /**
   * Returns details about an unspent transaction output.
   * @param txid The transaction id
   * @param n vout number
   * @param includeMempool Whether to include the mempool
   */
  async getTxOut(
    txid: string,
    n: number,
    includeMempool?: boolean,
  ): Promise<StrategyResult<BtcUtxo | null>> {
    const params: (string | number | boolean)[] = [txid, n];
    if (includeMempool !== undefined) params.push(includeMempool);
    return this.execute<BtcUtxo | null>("gettxout", params);
  }

  /**
   * Returns a hex-encoded proof that "txid" was included in a block.
   * @param txids An array of txids to filter
   * @param blockhash Look for txids in the block with this hash
   */
  async getTxOutProof(txids: string[], blockhash?: string): Promise<StrategyResult<string>> {
    const params: (string[] | string)[] = [txids];
    if (blockhash !== undefined) params.push(blockhash);
    return this.execute<string>("gettxoutproof", params);
  }

  /**
   * Returns statistics about the unspent transaction output set.
   * @param hashType Which UTXO set hash should be calculated
   * @param hashOrHeight The block hash or height
   * @param useIndex Use coinstatsindex if available
   */
  async getTxOutSetInfo(
    hashType?: "hash_serialized_3" | "muhash" | "none",
    hashOrHeight?: string | number,
    useIndex?: boolean,
  ): Promise<StrategyResult<BtcTxOutSetInfo>> {
    const params: (string | number | boolean)[] = [];
    if (hashType !== undefined) params.push(hashType);
    if (hashOrHeight !== undefined) params.push(hashOrHeight);
    if (useIndex !== undefined) params.push(useIndex);
    return this.execute<BtcTxOutSetInfo>("gettxoutsetinfo", params);
  }

  /**
   * Treats a block as if it were received before others with the same work.
   * @param blockhash The hash of the block to mark as precious
   */
  async preciousBlock(blockhash: string): Promise<StrategyResult<null>> {
    return this.execute<null>("preciousblock", [blockhash]);
  }

  /**
   * Prune the blockchain up to a specified height or timestamp.
   * @param height The block height to prune up to
   */
  async pruneBlockchain(height: number): Promise<StrategyResult<number>> {
    return this.execute<number>("pruneblockchain", [height]);
  }

  /**
   * Dumps the mempool to disk.
   */
  async saveMempool(): Promise<StrategyResult<{ filename: string }>> {
    return this.execute<{ filename: string }>("savemempool");
  }

  /**
   * Scans the unspent transaction output set for entries that match certain output descriptors.
   * @param action The action to execute ("start", "abort", "status")
   * @param scanobjects Array of scan objects (descriptors)
   */
  async scanTxOutSet(
    action: "start",
    scanobjects: Array<string | { desc: string; range?: number | [number, number] }>,
  ): Promise<StrategyResult<BtcScanTxOutSetResult>>;
  async scanTxOutSet(
    action: "abort" | "status",
  ): Promise<StrategyResult<boolean | { progress: number }>>;
  // biome-ignore lint/suspicious/noExplicitAny: Multiple return types based on action
  async scanTxOutSet(action: string, scanobjects?: any[]): Promise<StrategyResult<any>> {
    const params: (string | unknown[])[] = [action];
    if (scanobjects !== undefined) params.push(scanobjects);
    return this.execute("scantxoutset", params);
  }

  /**
   * Verifies blockchain database.
   * @param checklevel How thorough the block verification is (0-4)
   * @param nblocks The number of blocks to check (0 = all)
   */
  async verifyChain(checklevel?: number, nblocks?: number): Promise<StrategyResult<boolean>> {
    const params: number[] = [];
    if (checklevel !== undefined) params.push(checklevel);
    if (nblocks !== undefined) params.push(nblocks);
    return this.execute<boolean>("verifychain", params);
  }

  /**
   * Verifies that a proof points to a transaction in a block.
   * @param proof The hex-encoded proof
   */
  async verifyTxOutProof(proof: string): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("verifytxoutproof", [proof]);
  }

  /**
   * Return relevant blockhashes for given descriptors (requires -blockfilterindex).
   * @param action The action ("start", "abort", "status")
   * @param scanobjects Scan objects (descriptors)
   * @param startHeight Start height
   * @param stopHeight Stop height
   * @param filtertype Filter type
   * @param options Options object
   */
  async scanBlocks(
    action: "start",
    scanobjects: Array<string | { desc: string; range?: number | [number, number] }>,
    startHeight?: number,
    stopHeight?: number,
    filtertype?: string,
    options?: { filter_false_positives?: boolean },
  ): Promise<StrategyResult<BtcScanBlocksResult>>;
  async scanBlocks(
    action: "abort" | "status",
  ): Promise<StrategyResult<{ progress: number } | boolean>>;
  async scanBlocks(
    action: string,
    scanobjects?: unknown[],
    startHeight?: number,
    stopHeight?: number,
    filtertype?: string,
    options?: { filter_false_positives?: boolean },
    // biome-ignore lint/suspicious/noExplicitAny: Multiple return types based on action
  ): Promise<StrategyResult<any>> {
    const params: unknown[] = [action];
    if (scanobjects !== undefined) params.push(scanobjects);
    if (startHeight !== undefined) params.push(startHeight);
    if (stopHeight !== undefined) params.push(stopHeight);
    if (filtertype !== undefined) params.push(filtertype);
    if (options !== undefined) params.push(options);
    return this.execute("scanblocks", params);
  }

  /**
   * Returns all transaction ids in memory pool as a json array of string transaction ids.
   * @param verbose True for a json object, false for array of txids
   * @param mempoolSequence If verbose=true, also return the mempool sequence value
   */
  async getRawMempool(
    verbose?: false,
    mempoolSequence?: boolean,
  ): Promise<StrategyResult<string[]>>;
  async getRawMempool(
    verbose: true,
    mempoolSequence?: boolean,
  ): Promise<StrategyResult<Record<string, BtcMempoolEntry>>>;
  async getRawMempool(
    verbose = false,
    mempoolSequence?: boolean,
  ): Promise<StrategyResult<string[] | Record<string, BtcMempoolEntry>>> {
    const params: boolean[] = [verbose];
    if (mempoolSequence !== undefined) params.push(mempoolSequence);
    return this.execute("getrawmempool", params);
  }

  /**
   * Returns mempool data for given transaction.
   * @param txid The transaction id
   */
  async getMempoolEntry(txid: string): Promise<StrategyResult<BtcMempoolEntry>> {
    return this.execute<BtcMempoolEntry>("getmempoolentry", [txid]);
  }

  /**
   * If txid is in the mempool, returns all in-mempool ancestors.
   * @param txid The transaction id
   * @param verbose True for JSON objects, false for array of txids
   */
  async getMempoolAncestors(txid: string, verbose?: false): Promise<StrategyResult<string[]>>;
  async getMempoolAncestors(
    txid: string,
    verbose: true,
  ): Promise<StrategyResult<Record<string, BtcMempoolEntry>>>;
  async getMempoolAncestors(
    txid: string,
    verbose = false,
  ): Promise<StrategyResult<string[] | Record<string, BtcMempoolEntry>>> {
    return this.execute("getmempoolancestors", [txid, verbose]);
  }

  /**
   * If txid is in the mempool, returns all in-mempool descendants.
   * @param txid The transaction id
   * @param verbose True for JSON objects, false for array of txids
   */
  async getMempoolDescendants(txid: string, verbose?: false): Promise<StrategyResult<string[]>>;
  async getMempoolDescendants(
    txid: string,
    verbose: true,
  ): Promise<StrategyResult<Record<string, BtcMempoolEntry>>>;
  async getMempoolDescendants(
    txid: string,
    verbose = false,
  ): Promise<StrategyResult<string[] | Record<string, BtcMempoolEntry>>> {
    return this.execute("getmempooldescendants", [txid, verbose]);
  }

  /**
   * Returns details on the active state of the TX memory pool.
   */
  async getMempoolInfo(): Promise<StrategyResult<BtcMempoolInfo>> {
    return this.execute<BtcMempoolInfo>("getmempoolinfo");
  }

  /**
   * Returns result of mempool acceptance tests indicating if raw transaction would be accepted.
   * @param rawtxs Array of raw transaction hex strings
   * @param maxfeerate Reject transactions with fee rates higher than this
   */
  async testMempoolAccept(
    rawtxs: string[],
    maxfeerate?: number | string,
  ): Promise<StrategyResult<BtcMempoolAcceptResult[]>> {
    const params: (string[] | number | string)[] = [rawtxs];
    if (maxfeerate !== undefined) params.push(maxfeerate);
    return this.execute<BtcMempoolAcceptResult[]>("testmempoolaccept", params);
  }

  /**
   * Submit a package of raw transactions (parent-child) to local node.
   * @param rawtxs Array of raw transaction hex strings
   * @param maxfeerate Maximum fee rate (v28+)
   * @param maxburnamount Maximum burn amount (v28+)
   */
  async submitPackage(
    rawtxs: string[],
    maxfeerate?: number | string,
    maxburnamount?: number,
  ): Promise<StrategyResult<BtcSubmitPackageResult>> {
    const params: (string[] | number | string)[] = [rawtxs];
    if (maxfeerate !== undefined) params.push(maxfeerate);
    if (maxburnamount !== undefined) params.push(maxburnamount);
    return this.execute<BtcSubmitPackageResult>("submitpackage", params);
  }

  /**
   * Returns a map of all prioritised transactions with their fee deltas.
   */
  async getPrioritisedTransactions(): Promise<StrategyResult<BtcPrioritisedTransactions>> {
    return this.execute<BtcPrioritisedTransactions>("getprioritisedtransactions");
  }

  /**
   * Return the raw transaction data.
   * @param txid The transaction id
   * @param verbosity 0=hex, 1=JSON, 2=JSON with prevout
   * @param blockhash The block in which to look for the transaction
   */
  async getRawTransaction(
    txid: string,
    verbosity?: 0,
    blockhash?: string,
  ): Promise<StrategyResult<string>>;
  async getRawTransaction(
    txid: string,
    verbosity: 1 | 2,
    blockhash?: string,
  ): Promise<StrategyResult<BtcRawTransaction>>;
  async getRawTransaction(
    txid: string,
    verbosity: 0 | 1 | 2 = 0,
    blockhash?: string,
  ): Promise<StrategyResult<string | BtcRawTransaction>> {
    const params: (string | number)[] = [txid, verbosity];
    if (blockhash !== undefined) params.push(blockhash);
    return this.execute("getrawtransaction", params);
  }

  /**
   * Return a JSON object representing the serialized, hex-encoded transaction.
   * @param hexstring The transaction hex string
   * @param iswitness Whether the transaction hex is a serialized witness transaction
   */
  async decodeRawTransaction(
    hexstring: string,
    iswitness?: boolean,
  ): Promise<StrategyResult<BtcRawTransaction>> {
    const params: (string | boolean)[] = [hexstring];
    if (iswitness !== undefined) params.push(iswitness);
    return this.execute<BtcRawTransaction>("decoderawtransaction", params);
  }

  /**
   * Decode a hex-encoded script.
   * @param hexstring The hex-encoded script
   */
  async decodeScript(hexstring: string): Promise<StrategyResult<BtcDecodeScript>> {
    return this.execute<BtcDecodeScript>("decodescript", [hexstring]);
  }

  /**
   * Submit a raw transaction (serialized, hex-encoded) to local node and network.
   * @param hexstring The hex string of the raw transaction
   * @param maxfeerate Reject transactions whose fee rate is higher than this
   * @param maxburnamount Reject transactions with provably unspendable outputs exceeding this
   */
  async sendRawTransaction(
    hexstring: string,
    maxfeerate?: number | string,
    maxburnamount?: number,
  ): Promise<StrategyResult<string>> {
    const params: (string | number)[] = [hexstring];
    if (maxfeerate !== undefined) params.push(maxfeerate);
    if (maxburnamount !== undefined) params.push(maxburnamount);
    return this.execute<string>("sendrawtransaction", params);
  }

  /**
   * Create a transaction spending the given inputs and creating new outputs.
   * @param inputs Array of inputs
   * @param outputs Array of outputs
   * @param locktime Raw locktime
   * @param replaceable Marks this transaction as BIP125-replaceable
   */
  async createRawTransaction(
    inputs: Array<{ txid: string; vout: number; sequence?: number }>,
    outputs: Array<Record<string, number | string>>,
    locktime?: number,
    replaceable?: boolean,
  ): Promise<StrategyResult<string>> {
    const params: unknown[] = [inputs, outputs];
    if (locktime !== undefined) params.push(locktime);
    if (replaceable !== undefined) params.push(replaceable);
    return this.execute<string>("createrawtransaction", params);
  }

  /**
   * Combine multiple partially signed transactions into one transaction.
   * @param txs Array of hex strings of partially signed transactions
   */
  async combineRawTransaction(txs: string[]): Promise<StrategyResult<string>> {
    return this.execute<string>("combinerawtransaction", [txs]);
  }

  /**
   * Sign inputs for raw transaction.
   * @param hexstring The transaction hex string
   * @param privkeys Array of private keys
   * @param prevtxs Array of previous dependent transaction outputs
   * @param sighashtype The signature hash type
   */
  async signRawTransactionWithKey(
    hexstring: string,
    privkeys: string[],
    prevtxs?: Array<{
      txid: string;
      vout: number;
      scriptPubKey: string;
      redeemScript?: string;
      witnessScript?: string;
      amount?: number;
    }>,
    sighashtype?: string,
  ): Promise<StrategyResult<{ hex: string; complete: boolean; errors?: unknown[] }>> {
    const params: unknown[] = [hexstring, privkeys];
    if (prevtxs !== undefined) params.push(prevtxs);
    if (sighashtype !== undefined) params.push(sighashtype);
    return this.execute("signrawtransactionwithkey", params);
  }

  /**
   * Creates a transaction in the Partially Signed Transaction format.
   * @param inputs Array of inputs
   * @param outputs Array of outputs
   * @param locktime Raw locktime
   * @param replaceable Marks this transaction as BIP125-replaceable
   */
  async createPsbt(
    inputs: Array<{ txid: string; vout: number; sequence?: number }>,
    outputs: Array<Record<string, number | string>>,
    locktime?: number,
    replaceable?: boolean,
  ): Promise<StrategyResult<string>> {
    const params: unknown[] = [inputs, outputs];
    if (locktime !== undefined) params.push(locktime);
    if (replaceable !== undefined) params.push(replaceable);
    return this.execute<string>("createpsbt", params);
  }

  /**
   * Return a JSON object representing the serialized, base64-encoded partially signed Bitcoin transaction.
   * @param psbt The PSBT base64 string
   */
  async decodePsbt(psbt: string): Promise<StrategyResult<BtcDecodedPsbt>> {
    return this.execute<BtcDecodedPsbt>("decodepsbt", [psbt]);
  }

  /**
   * Analyzes and provides information about the current status of a PSBT and its inputs.
   * @param psbt The PSBT base64 string
   */
  async analyzePsbt(psbt: string): Promise<StrategyResult<BtcAnalyzedPsbt>> {
    return this.execute<BtcAnalyzedPsbt>("analyzepsbt", [psbt]);
  }

  /**
   * Combine multiple partially signed Bitcoin transactions into one transaction.
   * @param txs Array of base64 strings of partially signed transactions
   */
  async combinePsbt(txs: string[]): Promise<StrategyResult<string>> {
    return this.execute<string>("combinepsbt", [txs]);
  }

  /**
   * Finalize the inputs of a PSBT.
   * @param psbt The PSBT base64 string
   * @param extract If true and the transaction is complete, extract and return the raw transaction
   */
  async finalizePsbt(psbt: string, extract?: boolean): Promise<StrategyResult<BtcFinalizedPsbt>> {
    const params: (string | boolean)[] = [psbt];
    if (extract !== undefined) params.push(extract);
    return this.execute<BtcFinalizedPsbt>("finalizepsbt", params);
  }

  /**
   * Joins multiple distinct PSBTs with different inputs and outputs into one PSBT.
   * @param txs Array of base64 strings of PSBTs to join
   */
  async joinPsbts(txs: string[]): Promise<StrategyResult<string>> {
    return this.execute<string>("joinpsbts", [txs]);
  }

  /**
   * Converts a network serialized transaction to a PSBT.
   * @param hexstring The hex string of a raw transaction
   * @param permitsigdata If true, the PSBT can have signatures
   * @param iswitness Whether the transaction hex is a serialized witness transaction
   */
  async convertToPsbt(
    hexstring: string,
    permitsigdata?: boolean,
    iswitness?: boolean,
  ): Promise<StrategyResult<string>> {
    const params: (string | boolean)[] = [hexstring];
    if (permitsigdata !== undefined) params.push(permitsigdata);
    if (iswitness !== undefined) params.push(iswitness);
    return this.execute<string>("converttopsbt", params);
  }

  /**
   * Updates all segwit inputs and outputs in a PSBT with data from output descriptors.
   * @param psbt The PSBT base64 string
   * @param descriptors Array of descriptors
   */
  async utxoUpdatePsbt(
    psbt: string,
    descriptors?: Array<string | { desc: string; range?: number | [number, number] }>,
  ): Promise<StrategyResult<string>> {
    const params: (string | unknown[])[] = [psbt];
    if (descriptors !== undefined) params.push(descriptors);
    return this.execute<string>("utxoupdatepsbt", params);
  }

  /**
   * Returns an object containing various state info regarding P2P networking.
   */
  async getNetworkInfo(): Promise<StrategyResult<BtcNetworkInfo>> {
    return this.execute<BtcNetworkInfo>("getnetworkinfo");
  }

  /**
   * Returns data about each connected network node.
   */
  async getPeerInfo(): Promise<StrategyResult<BtcPeerInfo[]>> {
    return this.execute<BtcPeerInfo[]>("getpeerinfo");
  }

  /**
   * Returns the number of connections to other nodes.
   */
  async getConnectionCount(): Promise<StrategyResult<number>> {
    return this.execute<number>("getconnectioncount");
  }

  /**
   * Returns information about network traffic, including bytes in, bytes out, and current time.
   */
  async getNetTotals(): Promise<StrategyResult<BtcNetTotals>> {
    return this.execute<BtcNetTotals>("getnettotals");
  }

  /**
   * Returns information about the given added node.
   * @param node The node address (optional, returns all if omitted)
   */
  async getAddedNodeInfo(node?: string): Promise<StrategyResult<BtcAddedNodeInfo[]>> {
    const params: string[] = node !== undefined ? [node] : [];
    return this.execute<BtcAddedNodeInfo[]>("getaddednodeinfo", params);
  }

  /**
   * Return known addresses which can potentially be used to find new nodes in the network.
   * @param count The maximum number of addresses to return
   * @param network Return only addresses of the specified network
   */
  async getNodeAddresses(
    count?: number,
    network?: string,
  ): Promise<StrategyResult<BtcNodeAddress[]>> {
    const params: (number | string)[] = [];
    if (count !== undefined) params.push(count);
    if (network !== undefined) params.push(network);
    return this.execute<BtcNodeAddress[]>("getnodeaddresses", params);
  }

  /**
   * Requests that a ping be sent to all other nodes.
   */
  async ping(): Promise<StrategyResult<null>> {
    return this.execute<null>("ping");
  }

  /**
   * Attempts to add or remove a node from the addnode list.
   * @param node The node address
   * @param command 'add' to add a node, 'remove' to remove a node, 'onetry' to try a connection once
   * @param v2transport Use v2 transport protocol for this connection
   */
  async addNode(
    node: string,
    command: "add" | "remove" | "onetry",
    v2transport?: boolean,
  ): Promise<StrategyResult<null>> {
    const params: (string | boolean)[] = [node, command];
    if (v2transport !== undefined) params.push(v2transport);
    return this.execute<null>("addnode", params);
  }

  /**
   * Immediately disconnects from the specified peer node.
   * @param address The IP address/port of the node
   * @param nodeid The node ID (can be found using getpeerinfo)
   */
  async disconnectNode(address?: string, nodeid?: number): Promise<StrategyResult<null>> {
    if (address !== undefined) {
      return this.execute<null>("disconnectnode", [address]);
    }
    if (nodeid !== undefined) {
      return this.execute<null>("disconnectnode", ["", nodeid]);
    }
    throw new Error("Either address or nodeid must be provided");
  }

  /**
   * List all manually banned IPs/Subnets.
   */
  async listBanned(): Promise<StrategyResult<BtcBannedEntry[]>> {
    return this.execute<BtcBannedEntry[]>("listbanned");
  }

  /**
   * Attempts to add or remove an IP/Subnet from the banned list.
   * @param subnet The IP/Subnet
   * @param command 'add' to add a node, 'remove' to remove a node
   * @param bantime Time in seconds how long the IP is banned (default 24h)
   * @param absolute If set, the bantime must be an absolute timestamp
   */
  async setBan(
    subnet: string,
    command: "add" | "remove",
    bantime?: number,
    absolute?: boolean,
  ): Promise<StrategyResult<null>> {
    const params: (string | number | boolean)[] = [subnet, command];
    if (bantime !== undefined) params.push(bantime);
    if (absolute !== undefined) params.push(absolute);
    return this.execute<null>("setban", params);
  }

  /**
   * Clear all banned IPs.
   */
  async clearBanned(): Promise<StrategyResult<null>> {
    return this.execute<null>("clearbanned");
  }

  /**
   * Disable/enable all p2p network activity.
   * @param state true to enable networking, false to disable
   */
  async setNetworkActive(state: boolean): Promise<StrategyResult<boolean>> {
    return this.execute<boolean>("setnetworkactive", [state]);
  }

  /**
   * Estimates the approximate fee per kilobyte needed for a transaction.
   * @param confTarget Confirmation target in blocks
   * @param estimateMode The fee estimate mode (economical is default in v28+)
   */
  async estimateSmartFee(
    confTarget: number,
    estimateMode?: "unset" | "economical" | "conservative",
  ): Promise<StrategyResult<BtcFeeEstimate>> {
    const params: (number | string)[] = [confTarget];
    if (estimateMode !== undefined) params.push(estimateMode);
    return this.execute<BtcFeeEstimate>("estimatesmartfee", params);
  }

  /**
   * Returns an object containing information about memory usage.
   * @param mode "stats" returns general statistics, "mallocinfo" returns malloc_info output
   */
  async getMemoryInfo(mode?: "stats"): Promise<StrategyResult<BtcMemoryInfo>>;
  async getMemoryInfo(mode: "mallocinfo"): Promise<StrategyResult<string>>;
  async getMemoryInfo(
    mode: "stats" | "mallocinfo" = "stats",
  ): Promise<StrategyResult<BtcMemoryInfo | string>> {
    return this.execute("getmemoryinfo", [mode]);
  }

  /**
   * Returns details of the RPC server.
   */
  async getRpcInfo(): Promise<StrategyResult<BtcRpcInfo>> {
    return this.execute<BtcRpcInfo>("getrpcinfo");
  }

  /**
   * List all commands, or get help for a specified command.
   * @param command The command to get help for
   */
  async help(command?: string): Promise<StrategyResult<string>> {
    const params: string[] = command !== undefined ? [command] : [];
    return this.execute<string>("help", params);
  }

  /**
   * Returns the total uptime of the server.
   */
  async uptime(): Promise<StrategyResult<number>> {
    return this.execute<number>("uptime");
  }

  /**
   * Gets and sets the logging configuration.
   * @param include Array of categories to include
   * @param exclude Array of categories to exclude
   */
  async logging(
    include?: string[],
    exclude?: string[],
  ): Promise<StrategyResult<Record<string, boolean>>> {
    const params: (string[] | undefined)[] = [];
    if (include !== undefined || exclude !== undefined) {
      params.push(include);
      if (exclude !== undefined) params.push(exclude);
    }
    return this.execute<Record<string, boolean>>("logging", params);
  }

  /**
   * Request a graceful shutdown of Bitcoin Core.
   */
  async stop(): Promise<StrategyResult<string>> {
    return this.execute<string>("stop");
  }

  /**
   * Return information about the given bitcoin address.
   * @param address The bitcoin address to validate
   */
  async validateAddress(address: string): Promise<StrategyResult<BtcValidateAddress>> {
    return this.execute<BtcValidateAddress>("validateaddress", [address]);
  }

  /**
   * Analyzes a descriptor.
   * @param descriptor The descriptor
   */
  async getDescriptorInfo(descriptor: string): Promise<StrategyResult<BtcDescriptorInfo>> {
    return this.execute<BtcDescriptorInfo>("getdescriptorinfo", [descriptor]);
  }

  /**
   * Derives one or more addresses corresponding to an output descriptor.
   * @param descriptor The descriptor
   * @param range Range of addresses to derive (for ranged descriptors)
   */
  async deriveAddresses(
    descriptor: string,
    range?: number | [number, number],
  ): Promise<StrategyResult<string[]>> {
    const params: (string | number | [number, number])[] = [descriptor];
    if (range !== undefined) params.push(range);
    return this.execute<string[]>("deriveaddresses", params);
  }

  /**
   * Creates a multi-signature address with n signature of m keys required.
   * @param nrequired The number of required signatures
   * @param keys Array of hex-encoded public keys
   * @param addressType The address type to use (legacy, p2sh-segwit, bech32, bech32m)
   */
  async createMultisig(
    nrequired: number,
    keys: string[],
    addressType?: "legacy" | "p2sh-segwit" | "bech32" | "bech32m",
  ): Promise<StrategyResult<BtcCreateMultisig>> {
    const params: (number | string[] | string)[] = [nrequired, keys];
    if (addressType !== undefined) params.push(addressType);
    return this.execute<BtcCreateMultisig>("createmultisig", params);
  }

  /**
   * Verify a signed message.
   * @param address The bitcoin address to use for the signature
   * @param signature The signature provided by the signer
   * @param message The message that was signed
   */
  async verifyMessage(
    address: string,
    signature: string,
    message: string,
  ): Promise<StrategyResult<boolean>> {
    return this.execute<boolean>("verifymessage", [address, signature, message]);
  }

  /**
   * Sign a message with the private key of an address.
   * @param privkey The private key to sign the message with
   * @param message The message to sign
   */
  async signMessageWithPrivKey(privkey: string, message: string): Promise<StrategyResult<string>> {
    return this.execute<string>("signmessagewithprivkey", [privkey, message]);
  }

  /**
   * Returns the status of one or all available indices currently running in the node.
   * @param indexName Filter results for an index with a specific name
   */
  async getIndexInfo(indexName?: string): Promise<StrategyResult<BtcIndexInfo>> {
    const params: string[] = indexName !== undefined ? [indexName] : [];
    return this.execute<BtcIndexInfo>("getindexinfo", params);
  }

  /**
   * Returns an object containing mining-related information.
   */
  async getMiningInfo(): Promise<StrategyResult<BtcMiningInfo>> {
    return this.execute<BtcMiningInfo>("getmininginfo");
  }

  /**
   * Returns the estimated network hashes per second based on the last n blocks.
   * @param nblocks The number of blocks to average
   * @param height Height to estimate at (-1 for current tip)
   */
  async getNetworkHashPs(nblocks?: number, height?: number): Promise<StrategyResult<number>> {
    const params: number[] = [];
    if (nblocks !== undefined) params.push(nblocks);
    if (height !== undefined) params.push(height);
    return this.execute<number>("getnetworkhashps", params);
  }

  /**
   * Returns data needed to construct a block to work on.
   * @param templateRequest Template request parameters
   */
  async getBlockTemplate(templateRequest?: {
    mode?: "template" | "proposal";
    capabilities?: string[];
    rules: string[];
    longpollid?: string;
    data?: string;
  }): Promise<StrategyResult<BtcBlockTemplate>> {
    const params = templateRequest !== undefined ? [templateRequest] : [];
    return this.execute<BtcBlockTemplate>("getblocktemplate", params);
  }

  /**
   * Attempts to submit new block to network.
   * @param hexdata The hex-encoded block data to submit
   */
  async submitBlock(hexdata: string): Promise<StrategyResult<null | string>> {
    return this.execute<null | string>("submitblock", [hexdata]);
  }

  /**
   * Decode the given hexdata as a header and submit it as a candidate chain tip.
   * @param hexdata The hex-encoded block header data
   */
  async submitHeader(hexdata: string): Promise<StrategyResult<null>> {
    return this.execute<null>("submitheader", [hexdata]);
  }

  /**
   * Mine blocks immediately to a specified address (regtest only).
   * @param nblocks Number of blocks to generate
   * @param address The address to send the newly generated bitcoin to
   * @param maxtries Maximum iterations to try
   */
  async generateToAddress(
    nblocks: number,
    address: string,
    maxtries?: number,
  ): Promise<StrategyResult<string[]>> {
    const params: (number | string)[] = [nblocks, address];
    if (maxtries !== undefined) params.push(maxtries);
    return this.execute<string[]>("generatetoaddress", params);
  }

  /**
   * Mine a block with a set of ordered transactions immediately to a specified address or descriptor.
   * @param output The address or descriptor to send the newly generated bitcoin to
   * @param transactions Array of hex-encoded transactions to include
   */
  async generateBlock(
    output: string,
    transactions: string[],
  ): Promise<StrategyResult<{ hash: string }>> {
    return this.execute<{ hash: string }>("generateblock", [output, transactions]);
  }

  /**
   * Mine blocks immediately to a specified descriptor (regtest only).
   * @param nblocks Number of blocks to generate
   * @param descriptor The descriptor to send the newly generated bitcoin to
   * @param maxtries Maximum iterations to try
   */
  async generateToDescriptor(
    nblocks: number,
    descriptor: string,
    maxtries?: number,
  ): Promise<StrategyResult<string[]>> {
    const params: (number | string)[] = [nblocks, descriptor];
    if (maxtries !== undefined) params.push(maxtries);
    return this.execute<string[]>("generatetodescriptor", params);
  }

  /**
   * Accepts the transaction into mined blocks at a higher (or lower) priority.
   * @param txid The transaction id
   * @param dummy API-compatibility for previous API. Must be zero or null.
   * @param feeDelta The fee value to add (in satoshis)
   */
  async prioritiseTransaction(
    txid: string,
    dummy: 0 | null,
    feeDelta: number,
  ): Promise<StrategyResult<boolean>> {
    return this.execute<boolean>("prioritisetransaction", [txid, dummy, feeDelta]);
  }

  /**
   * Returns an object containing various wallet state info.
   */
  async getWalletInfo(): Promise<StrategyResult<BtcWalletInfo>> {
    return this.execute<BtcWalletInfo>("getwalletinfo");
  }

  /**
   * Returns an object with all balances in BTC.
   */
  async getBalances(): Promise<StrategyResult<BtcBalances>> {
    return this.execute<BtcBalances>("getbalances");
  }

  /**
   * Returns the total available balance.
   * @param dummy Remains for backward compatibility. Must be excluded or set to "*".
   * @param minconf Only include transactions confirmed at least this many times
   * @param includeWatchonly Also include balance in watch-only addresses
   * @param avoidReuse Do not include balance in dirty outputs
   */
  async getBalance(
    dummy?: "*",
    minconf?: number,
    includeWatchonly?: boolean,
    avoidReuse?: boolean,
  ): Promise<StrategyResult<number>> {
    const params: (string | number | boolean)[] = [];
    if (dummy !== undefined) params.push(dummy);
    if (minconf !== undefined) params.push(minconf);
    if (includeWatchonly !== undefined) params.push(includeWatchonly);
    if (avoidReuse !== undefined) params.push(avoidReuse);
    return this.execute<number>("getbalance", params);
  }

  /**
   * Returns a list of currently loaded wallets.
   */
  async listWallets(): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("listwallets");
  }

  /**
   * Loads a wallet from a wallet file or directory.
   * @param filename The wallet directory or .dat file
   * @param loadOnStartup Save wallet name to persistent settings
   */
  async loadWallet(
    filename: string,
    loadOnStartup?: boolean,
  ): Promise<StrategyResult<BtcLoadWalletResult>> {
    const params: (string | boolean)[] = [filename];
    if (loadOnStartup !== undefined) params.push(loadOnStartup);
    return this.execute<BtcLoadWalletResult>("loadwallet", params);
  }

  /**
   * Unloads the wallet referenced by the request endpoint.
   * @param walletName The name of the wallet to unload
   * @param loadOnStartup Save wallet name to persistent settings
   */
  async unloadWallet(
    walletName?: string,
    loadOnStartup?: boolean,
  ): Promise<StrategyResult<BtcLoadWalletResult>> {
    const params: (string | boolean | null)[] = [];
    if (walletName !== undefined || loadOnStartup !== undefined) {
      params.push(walletName ?? null);
      if (loadOnStartup !== undefined) params.push(loadOnStartup);
    }
    return this.execute<BtcLoadWalletResult>("unloadwallet", params);
  }

  /**
   * Creates and loads a new wallet.
   * @param walletName The name for the new wallet
   * @param disablePrivateKeys Disable the ability of the wallet to have private keys
   * @param blank Create a blank wallet
   * @param passphrase Encrypt the wallet with this passphrase
   * @param avoidReuse Keep track of coin reuse
   * @param descriptors Create a native descriptor wallet
   * @param loadOnStartup Save wallet name to persistent settings
   * @param externalSigner Use an external signer such as a hardware wallet
   */
  async createWallet(
    walletName: string,
    disablePrivateKeys?: boolean,
    blank?: boolean,
    passphrase?: string,
    avoidReuse?: boolean,
    descriptors?: boolean,
    loadOnStartup?: boolean,
    externalSigner?: boolean,
  ): Promise<StrategyResult<BtcCreateWalletResult>> {
    const params: (string | boolean | null)[] = [walletName];
    if (disablePrivateKeys !== undefined) params.push(disablePrivateKeys);
    if (blank !== undefined) params.push(blank);
    if (passphrase !== undefined) params.push(passphrase);
    if (avoidReuse !== undefined) params.push(avoidReuse);
    if (descriptors !== undefined) params.push(descriptors);
    if (loadOnStartup !== undefined) params.push(loadOnStartup);
    if (externalSigner !== undefined) params.push(externalSigner);
    return this.execute<BtcCreateWalletResult>("createwallet", params);
  }

  /**
   * Returns a list of wallets in the wallet directory.
   */
  async listWalletDir(): Promise<StrategyResult<{ wallets: BtcWalletDirEntry[] }>> {
    return this.execute<{ wallets: BtcWalletDirEntry[] }>("listwalletdir");
  }

  /**
   * Returns a new Bitcoin address for receiving payments.
   * @param label The label to use
   * @param addressType The address type to use (legacy, p2sh-segwit, bech32, bech32m)
   */
  async getNewAddress(
    label?: string,
    addressType?: "legacy" | "p2sh-segwit" | "bech32" | "bech32m",
  ): Promise<StrategyResult<string>> {
    const params: string[] = [];
    if (label !== undefined) params.push(label);
    if (addressType !== undefined) params.push(addressType);
    return this.execute<string>("getnewaddress", params);
  }

  /**
   * Returns a new Bitcoin address, for receiving change.
   * @param addressType The address type to use
   */
  async getRawChangeAddress(
    addressType?: "legacy" | "p2sh-segwit" | "bech32" | "bech32m",
  ): Promise<StrategyResult<string>> {
    const params: string[] = addressType !== undefined ? [addressType] : [];
    return this.execute<string>("getrawchangeaddress", params);
  }

  /**
   * Return information about the given bitcoin address.
   * @param address The bitcoin address
   */
  async getAddressInfo(address: string): Promise<StrategyResult<BtcAddressInfo>> {
    return this.execute<BtcAddressInfo>("getaddressinfo", [address]);
  }

  /**
   * Returns the list of all addresses assigned to the specified label.
   * @param label The label
   */
  async getAddressesByLabel(
    label: string,
  ): Promise<StrategyResult<Record<string, { purpose: string }>>> {
    return this.execute<Record<string, { purpose: string }>>("getaddressesbylabel", [label]);
  }

  /**
   * Sets the label associated with the given address.
   * @param address The bitcoin address
   * @param label The label to assign
   */
  async setLabel(address: string, label: string): Promise<StrategyResult<null>> {
    return this.execute<null>("setlabel", [address, label]);
  }

  /**
   * Returns the list of all labels, or labels that are assigned to addresses with a specific purpose.
   * @param purpose Address purpose to filter by
   */
  async listLabels(purpose?: "send" | "receive"): Promise<StrategyResult<string[]>> {
    const params: string[] = purpose !== undefined ? [purpose] : [];
    return this.execute<string[]>("listlabels", params);
  }

  /**
   * Get detailed information about an in-wallet transaction.
   * @param txid The transaction id
   * @param includeWatchonly Include watch-only addresses
   * @param verbose Include decoded transaction
   */
  async getTransaction(
    txid: string,
    includeWatchonly?: boolean,
    verbose?: boolean,
  ): Promise<StrategyResult<BtcWalletTransaction>> {
    const params: (string | boolean)[] = [txid];
    if (includeWatchonly !== undefined) params.push(includeWatchonly);
    if (verbose !== undefined) params.push(verbose);
    return this.execute<BtcWalletTransaction>("gettransaction", params);
  }

  /**
   * Returns up to 'count' most recent transactions skipping the first 'skip'.
   * @param label Filter by label
   * @param count Number of transactions to return
   * @param skip Number of transactions to skip
   * @param includeWatchonly Include watch-only addresses
   */
  async listTransactions(
    label?: string,
    count?: number,
    skip?: number,
    includeWatchonly?: boolean,
  ): Promise<StrategyResult<BtcListTransactionsEntry[]>> {
    const params: (string | number | boolean)[] = [];
    if (label !== undefined) params.push(label);
    if (count !== undefined) params.push(count);
    if (skip !== undefined) params.push(skip);
    if (includeWatchonly !== undefined) params.push(includeWatchonly);
    return this.execute<BtcListTransactionsEntry[]>("listtransactions", params);
  }

  /**
   * Get all transactions in blocks since block [blockhash].
   * @param blockhash The block hash
   * @param targetConfirmations Wait for this many confirmations
   * @param includeWatchonly Include watch-only addresses
   * @param includeRemoved Include transactions removed due to reorg
   * @param includeChange Include change outputs
   */
  async listSinceBlock(
    blockhash?: string,
    targetConfirmations?: number,
    includeWatchonly?: boolean,
    includeRemoved?: boolean,
    includeChange?: boolean,
  ): Promise<StrategyResult<BtcListSinceBlock>> {
    const params: (string | number | boolean)[] = [];
    if (blockhash !== undefined) params.push(blockhash);
    if (targetConfirmations !== undefined) params.push(targetConfirmations);
    if (includeWatchonly !== undefined) params.push(includeWatchonly);
    if (includeRemoved !== undefined) params.push(includeRemoved);
    if (includeChange !== undefined) params.push(includeChange);
    return this.execute<BtcListSinceBlock>("listsinceblock", params);
  }

  /**
   * List balances by receiving address.
   * @param minconf Minimum confirmations
   * @param includeEmpty Include addresses with no received value
   * @param includeWatchonly Include watch-only addresses
   * @param addressFilter Filter to a specific address
   * @param includeImmatureCoinbase Include immature coinbase transactions
   */
  async listReceivedByAddress(
    minconf?: number,
    includeEmpty?: boolean,
    includeWatchonly?: boolean,
    addressFilter?: string,
    includeImmatureCoinbase?: boolean,
  ): Promise<StrategyResult<BtcReceivedByAddress[]>> {
    const params: (number | boolean | string)[] = [];
    if (minconf !== undefined) params.push(minconf);
    if (includeEmpty !== undefined) params.push(includeEmpty);
    if (includeWatchonly !== undefined) params.push(includeWatchonly);
    if (addressFilter !== undefined) params.push(addressFilter);
    if (includeImmatureCoinbase !== undefined) params.push(includeImmatureCoinbase);
    return this.execute<BtcReceivedByAddress[]>("listreceivedbyaddress", params);
  }

  /**
   * List received transactions by label.
   * @param minconf Minimum confirmations
   * @param includeEmpty Include labels with no received value
   * @param includeWatchonly Include watch-only addresses
   * @param includeImmatureCoinbase Include immature coinbase transactions
   */
  async listReceivedByLabel(
    minconf?: number,
    includeEmpty?: boolean,
    includeWatchonly?: boolean,
    includeImmatureCoinbase?: boolean,
  ): Promise<StrategyResult<BtcReceivedByLabel[]>> {
    const params: (number | boolean)[] = [];
    if (minconf !== undefined) params.push(minconf);
    if (includeEmpty !== undefined) params.push(includeEmpty);
    if (includeWatchonly !== undefined) params.push(includeWatchonly);
    if (includeImmatureCoinbase !== undefined) params.push(includeImmatureCoinbase);
    return this.execute<BtcReceivedByLabel[]>("listreceivedbylabel", params);
  }

  /**
   * Mark in-wallet transaction as abandoned.
   * @param txid The transaction id
   */
  async abandonTransaction(txid: string): Promise<StrategyResult<null>> {
    return this.execute<null>("abandontransaction", [txid]);
  }

  /**
   * Stops current wallet rescan triggered by an RPC call.
   */
  async abortRescan(): Promise<StrategyResult<boolean>> {
    return this.execute<boolean>("abortrescan");
  }

  /**
   * Rescan the local blockchain for wallet related transactions.
   * @param startHeight Block height where the rescan should start
   * @param stopHeight Block height where the rescan should stop
   */
  async rescanBlockchain(
    startHeight?: number,
    stopHeight?: number,
  ): Promise<StrategyResult<{ start_height: number; stop_height: number }>> {
    const params: number[] = [];
    if (startHeight !== undefined) params.push(startHeight);
    if (stopHeight !== undefined) params.push(stopHeight);
    return this.execute<{ start_height: number; stop_height: number }>("rescanblockchain", params);
  }

  /**
   * Send an amount to a given address.
   * @param address The bitcoin address
   * @param amount The amount in BTC
   * @param comment A comment
   * @param commentTo A comment to the recipient
   * @param subtractFeeFromAmount Subtract fee from the amount
   * @param replaceable Allow this transaction to be replaced by a transaction with higher fees
   * @param confTarget Confirmation target in blocks
   * @param estimateMode The fee estimate mode
   * @param avoidReuse Avoid spending from dirty addresses
   * @param feeRate Set a specific fee rate in BTC/kvB
   * @param verbose Return extra information
   */
  async sendToAddress(
    address: string,
    amount: number | string,
    comment?: string,
    commentTo?: string,
    subtractFeeFromAmount?: boolean,
    replaceable?: boolean,
    confTarget?: number,
    estimateMode?: "unset" | "economical" | "conservative",
    avoidReuse?: boolean,
    feeRate?: number | string,
    verbose?: boolean,
  ): Promise<StrategyResult<string | { txid: string; fee_reason?: string }>> {
    const params: unknown[] = [address, amount];
    if (comment !== undefined) params.push(comment);
    if (commentTo !== undefined) params.push(commentTo);
    if (subtractFeeFromAmount !== undefined) params.push(subtractFeeFromAmount);
    if (replaceable !== undefined) params.push(replaceable);
    if (confTarget !== undefined) params.push(confTarget);
    if (estimateMode !== undefined) params.push(estimateMode);
    if (avoidReuse !== undefined) params.push(avoidReuse);
    if (feeRate !== undefined) params.push(feeRate);
    if (verbose !== undefined) params.push(verbose);
    return this.execute("sendtoaddress", params);
  }

  /**
   * Send multiple times.
   * @param amounts Object with addresses as keys and amounts as values
   * @param minconf Minimum confirmations
   * @param comment A comment
   * @param subtractFeeFrom Array of addresses to subtract fee from
   * @param replaceable Allow this transaction to be replaced
   * @param confTarget Confirmation target in blocks
   * @param estimateMode The fee estimate mode
   * @param feeRate Set a specific fee rate in BTC/kvB
   * @param verbose Return extra information
   */
  async sendMany(
    amounts: Record<string, number | string>,
    minconf?: number,
    comment?: string,
    subtractFeeFrom?: string[],
    replaceable?: boolean,
    confTarget?: number,
    estimateMode?: "unset" | "economical" | "conservative",
    feeRate?: number | string,
    verbose?: boolean,
  ): Promise<StrategyResult<string | { txid: string; fee_reason?: string }>> {
    // Note: First param is dummy "" for backward compatibility
    const params: unknown[] = ["", amounts];
    if (minconf !== undefined) params.push(minconf);
    if (comment !== undefined) params.push(comment);
    if (subtractFeeFrom !== undefined) params.push(subtractFeeFrom);
    if (replaceable !== undefined) params.push(replaceable);
    if (confTarget !== undefined) params.push(confTarget);
    if (estimateMode !== undefined) params.push(estimateMode);
    if (feeRate !== undefined) params.push(feeRate);
    if (verbose !== undefined) params.push(verbose);
    return this.execute("sendmany", params);
  }

  /**
   * EXPERIMENTAL: Send a transaction.
   * @param outputs Array of outputs
   * @param options Options object
   */
  async send(
    outputs: Array<Record<string, number | string>>,
    options?: {
      conf_target?: number;
      estimate_mode?: "unset" | "economical" | "conservative";
      fee_rate?: number | string;
      include_unsafe?: boolean;
      add_inputs?: boolean;
      include_watching?: boolean;
      change_address?: string;
      change_position?: number;
      change_type?: "legacy" | "p2sh-segwit" | "bech32" | "bech32m";
      inputs?: Array<{ txid: string; vout: number; sequence?: number }>;
      locktime?: number;
      lock_unspents?: boolean;
      psbt?: boolean;
      subtract_fee_from_outputs?: number[];
      replaceable?: boolean;
      max_tx_weight?: number;
    },
  ): Promise<StrategyResult<BtcSendResult>> {
    const params: unknown[] = [outputs];
    if (options !== undefined) params.push(options);
    return this.execute<BtcSendResult>("send", params);
  }

  /**
   * EXPERIMENTAL: Spend the value of all (or specific) confirmed UTXOs to an address.
   * @param recipients Array of addresses with amounts or "data" key
   * @param options Options object
   */
  async sendAll(
    recipients: Array<string | Record<string, number | string>>,
    options?: {
      conf_target?: number;
      estimate_mode?: "unset" | "economical" | "conservative";
      fee_rate?: number | string;
      include_watching?: boolean;
      inputs?: Array<{ txid: string; vout: number; sequence?: number }>;
      locktime?: number;
      lock_unspents?: boolean;
      psbt?: boolean;
      send_max?: boolean;
      minconf?: number;
      maxconf?: number;
      replaceable?: boolean;
    },
  ): Promise<StrategyResult<BtcSendResult>> {
    const params: unknown[] = [recipients];
    if (options !== undefined) params.push(options);
    return this.execute<BtcSendResult>("sendall", params);
  }

  /**
   * Returns array of unspent transaction outputs.
   * @param minconf Minimum confirmations
   * @param maxconf Maximum confirmations
   * @param addresses Filter to only these addresses
   * @param includeUnsafe Include outputs that are not safe to spend
   * @param queryOptions Query options object
   */
  async listUnspent(
    minconf?: number,
    maxconf?: number,
    addresses?: string[],
    includeUnsafe?: boolean,
    queryOptions?: {
      minimumAmount?: number | string;
      maximumAmount?: number | string;
      maximumCount?: number;
      minimumSumAmount?: number | string;
      include_immature_coinbase?: boolean;
    },
  ): Promise<StrategyResult<BtcUnspent[]>> {
    const params: unknown[] = [];
    if (minconf !== undefined) params.push(minconf);
    if (maxconf !== undefined) params.push(maxconf);
    if (addresses !== undefined) params.push(addresses);
    if (includeUnsafe !== undefined) params.push(includeUnsafe);
    if (queryOptions !== undefined) params.push(queryOptions);
    return this.execute<BtcUnspent[]>("listunspent", params);
  }

  /**
   * Updates list of temporarily unspendable outputs.
   * @param unlock Whether to unlock (true) or lock (false) the outputs
   * @param transactions Array of outputs to lock or unlock
   * @param permanent Whether the lock is permanent
   */
  async lockUnspent(
    unlock: boolean,
    transactions?: Array<{ txid: string; vout: number }>,
    permanent?: boolean,
  ): Promise<StrategyResult<boolean>> {
    const params: (boolean | Array<{ txid: string; vout: number }>)[] = [unlock];
    if (transactions !== undefined) params.push(transactions);
    if (permanent !== undefined) params.push(permanent);
    return this.execute<boolean>("lockunspent", params);
  }

  /**
   * Returns list of temporarily unspendable outputs.
   */
  async listLockUnspent(): Promise<StrategyResult<BtcLockedUnspent[]>> {
    return this.execute<BtcLockedUnspent[]>("listlockunspent");
  }

  /**
   * Creates and funds a transaction in the Partially Signed Transaction format.
   * @param inputs Array of inputs
   * @param outputs Array of outputs
   * @param locktime Raw locktime
   * @param options Options object
   * @param bip32derivs Include BIP 32 derivation paths
   */
  async walletCreateFundedPsbt(
    inputs: Array<{ txid: string; vout: number; sequence?: number }>,
    outputs: Array<Record<string, number | string>>,
    locktime?: number,
    options?: {
      add_inputs?: boolean;
      include_unsafe?: boolean;
      minconf?: number;
      maxconf?: number;
      changeAddress?: string;
      changePosition?: number;
      change_type?: "legacy" | "p2sh-segwit" | "bech32" | "bech32m";
      includeWatching?: boolean;
      lockUnspents?: boolean;
      fee_rate?: number | string;
      feeRate?: number | string;
      subtractFeeFromOutputs?: number[];
      replaceable?: boolean;
      conf_target?: number;
      estimate_mode?: "unset" | "economical" | "conservative";
      max_tx_weight?: number;
    },
    bip32derivs?: boolean,
  ): Promise<StrategyResult<BtcWalletCreateFundedPsbtResult>> {
    const params: unknown[] = [inputs, outputs];
    if (locktime !== undefined) params.push(locktime);
    if (options !== undefined) params.push(options);
    if (bip32derivs !== undefined) params.push(bip32derivs);
    return this.execute<BtcWalletCreateFundedPsbtResult>("walletcreatefundedpsbt", params);
  }

  /**
   * Update a PSBT with input information from our wallet.
   * @param psbt The PSBT base64 string
   * @param sign Sign the transaction and update the PSBT
   * @param sighashtype The signature hash type
   * @param bip32derivs Include BIP 32 derivation paths
   * @param finalize Finalize inputs when possible
   */
  async walletProcessPsbt(
    psbt: string,
    sign?: boolean,
    sighashtype?: string,
    bip32derivs?: boolean,
    finalize?: boolean,
  ): Promise<StrategyResult<{ psbt: string; complete: boolean; fee?: number }>> {
    const params: (string | boolean)[] = [psbt];
    if (sign !== undefined) params.push(sign);
    if (sighashtype !== undefined) params.push(sighashtype);
    if (bip32derivs !== undefined) params.push(bip32derivs);
    if (finalize !== undefined) params.push(finalize);
    return this.execute("walletprocesspsbt", params);
  }

  /**
   * Add inputs to a transaction until it has enough in value to meet its out value.
   * @param hexstring The hex string of the raw transaction
   * @param options Options object
   * @param iswitness Whether the transaction hex is a serialized witness transaction
   */
  async fundRawTransaction(
    hexstring: string,
    options?: {
      add_inputs?: boolean;
      include_unsafe?: boolean;
      minconf?: number;
      maxconf?: number;
      changeAddress?: string;
      changePosition?: number;
      change_type?: "legacy" | "p2sh-segwit" | "bech32" | "bech32m";
      includeWatching?: boolean;
      lockUnspents?: boolean;
      fee_rate?: number | string;
      feeRate?: number | string;
      subtractFeeFromOutputs?: number[];
      replaceable?: boolean;
      conf_target?: number;
      estimate_mode?: "unset" | "economical" | "conservative";
      max_tx_weight?: number;
      input_weights?: Array<{ txid: string; vout: number; weight: number }>;
    },
    iswitness?: boolean,
  ): Promise<StrategyResult<BtcFundRawTransactionResult>> {
    const params: unknown[] = [hexstring];
    if (options !== undefined) params.push(options);
    if (iswitness !== undefined) params.push(iswitness);
    return this.execute<BtcFundRawTransactionResult>("fundrawtransaction", params);
  }

  /**
   * Bumps the fee of an opt-in-RBF transaction T.
   * @param txid The txid of the transaction to bump
   * @param options Options object
   */
  async bumpFee(
    txid: string,
    options?: {
      conf_target?: number;
      fee_rate?: number | string;
      replaceable?: boolean;
      estimate_mode?: "unset" | "economical" | "conservative";
      outputs?: Array<Record<string, number | string>>;
    },
  ): Promise<StrategyResult<BtcBumpFeeResult>> {
    const params: unknown[] = [txid];
    if (options !== undefined) params.push(options);
    return this.execute<BtcBumpFeeResult>("bumpfee", params);
  }

  /**
   * Bumps the fee of an opt-in-RBF transaction T, replacing it with a new PSBT.
   * @param txid The txid of the transaction to bump
   * @param options Options object
   */
  async psbtBumpFee(
    txid: string,
    options?: {
      conf_target?: number;
      fee_rate?: number | string;
      replaceable?: boolean;
      estimate_mode?: "unset" | "economical" | "conservative";
      outputs?: Array<Record<string, number | string>>;
    },
  ): Promise<StrategyResult<{ psbt: string; origfee: number; fee: number; errors?: string[] }>> {
    const params: unknown[] = [txid];
    if (options !== undefined) params.push(options);
    return this.execute("psbtbumpfee", params);
  }

  /**
   * Set the transaction fee per kB for this wallet.
   * @param amount The transaction fee in BTC/kvB
   */
  async setTxFee(amount: number | string): Promise<StrategyResult<boolean>> {
    return this.execute<boolean>("settxfee", [amount]);
  }

  /**
   * Reveals the private key corresponding to 'address'.
   * @param address The bitcoin address
   */
  async dumpPrivKey(address: string): Promise<StrategyResult<string>> {
    return this.execute<string>("dumpprivkey", [address]);
  }

  /**
   * Dumps all wallet keys in a human-readable format to a server-side file.
   * @param filename The filename with path
   */
  async dumpWallet(filename: string): Promise<StrategyResult<{ filename: string }>> {
    return this.execute<{ filename: string }>("dumpwallet", [filename]);
  }

  /**
   * Adds a private key (as returned by dumpprivkey) to your wallet.
   * @param privkey The private key
   * @param label An optional label
   * @param rescan Rescan the wallet for transactions
   */
  async importPrivKey(
    privkey: string,
    label?: string,
    rescan?: boolean,
  ): Promise<StrategyResult<null>> {
    const params: (string | boolean)[] = [privkey];
    if (label !== undefined) params.push(label);
    if (rescan !== undefined) params.push(rescan);
    return this.execute<null>("importprivkey", params);
  }

  /**
   * Adds an address or script to the wallet without the associated private key.
   * @param address The Bitcoin address (or hex-encoded script)
   * @param label An optional label
   * @param rescan Rescan the wallet for transactions
   * @param p2sh Add the P2SH version of the script as well
   */
  async importAddress(
    address: string,
    label?: string,
    rescan?: boolean,
    p2sh?: boolean,
  ): Promise<StrategyResult<null>> {
    const params: (string | boolean)[] = [address];
    if (label !== undefined) params.push(label);
    if (rescan !== undefined) params.push(rescan);
    if (p2sh !== undefined) params.push(p2sh);
    return this.execute<null>("importaddress", params);
  }

  /**
   * Adds a public key to a watch-only wallet.
   * @param pubkey The hex-encoded public key
   * @param label An optional label
   * @param rescan Rescan the wallet for transactions
   */
  async importPubKey(
    pubkey: string,
    label?: string,
    rescan?: boolean,
  ): Promise<StrategyResult<null>> {
    const params: (string | boolean)[] = [pubkey];
    if (label !== undefined) params.push(label);
    if (rescan !== undefined) params.push(rescan);
    return this.execute<null>("importpubkey", params);
  }

  /**
   * Import addresses/scripts, optionally rescanning the blockchain.
   * @param requests Array of import requests
   * @param options Options object
   */
  async importMulti(
    requests: Array<{
      desc?: string;
      scriptPubKey?: string | { address: string };
      timestamp: number | "now";
      redeemscript?: string;
      witnessscript?: string;
      pubkeys?: string[];
      keys?: string[];
      range?: number | [number, number];
      internal?: boolean;
      watchonly?: boolean;
      label?: string;
      keypool?: boolean;
    }>,
    options?: { rescan?: boolean },
  ): Promise<
    StrategyResult<
      Array<{ success: boolean; warnings?: string[]; error?: { code: number; message: string } }>
    >
  > {
    const params: unknown[] = [requests];
    if (options !== undefined) params.push(options);
    return this.execute("importmulti", params);
  }

  /**
   * Import descriptors.
   * @param requests Array of descriptor import requests
   */
  async importDescriptors(
    requests: BtcImportDescriptor[],
  ): Promise<StrategyResult<BtcImportDescriptorResult[]>> {
    return this.execute<BtcImportDescriptorResult[]>("importdescriptors", [requests]);
  }

  /**
   * Imports funds without rescan.
   * @param rawtransaction A raw transaction in hex
   * @param txoutproof The hex output from gettxoutproof
   */
  async importPrunedFunds(
    rawtransaction: string,
    txoutproof: string,
  ): Promise<StrategyResult<null>> {
    return this.execute<null>("importprunedfunds", [rawtransaction, txoutproof]);
  }

  /**
   * Deletes the specified transaction from the wallet.
   * @param txid The transaction id
   */
  async removePrunedFunds(txid: string): Promise<StrategyResult<null>> {
    return this.execute<null>("removeprunedfunds", [txid]);
  }

  /**
   * Safely copies current wallet file to destination.
   * @param destination The destination path
   */
  async backupWallet(destination: string): Promise<StrategyResult<null>> {
    return this.execute<null>("backupwallet", [destination]);
  }

  /**
   * Restores and loads a wallet from backup.
   * @param walletName The name to give the restored wallet
   * @param backupFile The backup file path
   * @param loadOnStartup Save wallet name to persistent settings
   */
  async restoreWallet(
    walletName: string,
    backupFile: string,
    loadOnStartup?: boolean,
  ): Promise<StrategyResult<BtcLoadWalletResult>> {
    const params: (string | boolean)[] = [walletName, backupFile];
    if (loadOnStartup !== undefined) params.push(loadOnStartup);
    return this.execute<BtcLoadWalletResult>("restorewallet", params);
  }

  /**
   * Sign a message with the private key of an address.
   * @param address The bitcoin address
   * @param message The message to sign
   */
  async signMessage(address: string, message: string): Promise<StrategyResult<string>> {
    return this.execute<string>("signmessage", [address, message]);
  }

  /**
   * Sign inputs for raw transaction (requires wallet to be unlocked).
   * @param hexstring The transaction hex string
   * @param prevtxs Array of previous dependent transaction outputs
   * @param sighashtype The signature hash type
   */
  async signRawTransactionWithWallet(
    hexstring: string,
    prevtxs?: Array<{
      txid: string;
      vout: number;
      scriptPubKey: string;
      redeemScript?: string;
      witnessScript?: string;
      amount?: number;
    }>,
    sighashtype?: string,
  ): Promise<StrategyResult<{ hex: string; complete: boolean; errors?: unknown[] }>> {
    const params: unknown[] = [hexstring];
    if (prevtxs !== undefined) params.push(prevtxs);
    if (sighashtype !== undefined) params.push(sighashtype);
    return this.execute("signrawtransactionwithwallet", params);
  }

  /**
   * Creates a new wallet descriptor for the wallet (v28+).
   * @param type The type of descriptor to create
   * @param options Options object
   */
  async createWalletDescriptor(
    type: "legacy" | "p2sh-segwit" | "bech32" | "bech32m",
    options?: {
      internal?: boolean;
      hdkey?: string;
    },
  ): Promise<StrategyResult<{ descs: string[] }>> {
    const params: unknown[] = [type];
    if (options !== undefined) params.push(options);
    return this.execute("createwalletdescriptor", params);
  }

  /**
   * List all the HD extended public keys used by all of the descriptors (v28+).
   * @param options Options object
   */
  async getHdKeys(options?: {
    active_only?: boolean;
    private?: boolean;
  }): Promise<StrategyResult<BtcHdKey[]>> {
    const params = options !== undefined ? [options] : [];
    return this.execute<BtcHdKey[]>("gethdkeys", params);
  }

  /**
   * List descriptors imported into a descriptor-enabled wallet.
   * @param privateKeys Include private key info
   */
  async listDescriptors(privateKeys?: boolean): Promise<StrategyResult<BtcListDescriptors>> {
    const params: boolean[] = privateKeys !== undefined ? [privateKeys] : [];
    return this.execute<BtcListDescriptors>("listdescriptors", params);
  }

  /**
   * Set or generate a new HD wallet seed (non-descriptor wallets only).
   * @param newkeypool Flush old unused addresses
   * @param seed The WIF private key to use as the new HD seed
   */
  async setHdSeed(newkeypool?: boolean, seed?: string): Promise<StrategyResult<null>> {
    const params: (boolean | string)[] = [];
    if (newkeypool !== undefined) params.push(newkeypool);
    if (seed !== undefined) params.push(seed);
    return this.execute<null>("sethdseed", params);
  }

  /**
   * Fills the keypool.
   * @param newsize The new keypool size
   */
  async keypoolRefill(newsize?: number): Promise<StrategyResult<null>> {
    const params: number[] = newsize !== undefined ? [newsize] : [];
    return this.execute<null>("keypoolrefill", params);
  }

  /**
   * Encrypts the wallet with 'passphrase'.
   * @param passphrase The passphrase to encrypt the wallet with
   */
  async encryptWallet(passphrase: string): Promise<StrategyResult<string>> {
    return this.execute<string>("encryptwallet", [passphrase]);
  }

  /**
   * Removes the wallet encryption key from memory, locking the wallet.
   */
  async walletLock(): Promise<StrategyResult<null>> {
    return this.execute<null>("walletlock");
  }

  /**
   * Stores the wallet decryption key in memory for 'timeout' seconds.
   * @param passphrase The wallet passphrase
   * @param timeout The time to keep the decryption key in seconds
   */
  async walletPassphrase(passphrase: string, timeout: number): Promise<StrategyResult<null>> {
    return this.execute<null>("walletpassphrase", [passphrase, timeout]);
  }

  /**
   * Changes the wallet passphrase.
   * @param oldpassphrase The current passphrase
   * @param newpassphrase The new passphrase
   */
  async walletPassphraseChange(
    oldpassphrase: string,
    newpassphrase: string,
  ): Promise<StrategyResult<null>> {
    return this.execute<null>("walletpassphrasechange", [oldpassphrase, newpassphrase]);
  }

  /**
   * Change the state of the given wallet flag for a wallet.
   * @param flag The name of the flag to change
   * @param value The new state
   */
  async setWalletFlag(
    flag: "avoid_reuse",
    value?: boolean,
  ): Promise<StrategyResult<{ flag_name: string; flag_state: boolean; warnings?: string[] }>> {
    const params: (string | boolean)[] = [flag];
    if (value !== undefined) params.push(value);
    return this.execute("setwalletflag", params);
  }

  /**
   * Upgrade the wallet.
   * @param version The version number to upgrade to
   */
  async upgradeWallet(version?: number): Promise<
    StrategyResult<{
      wallet_name: string;
      previous_version: number;
      current_version: number;
      result?: string;
      error?: string;
    }>
  > {
    const params: number[] = version !== undefined ? [version] : [];
    return this.execute("upgradewallet", params);
  }

  /**
   * Returns a list of external signers from -signer.
   */
  async enumerateSigners(): Promise<StrategyResult<{ signers: BtcSignerInfo[] }>> {
    return this.execute<{ signers: BtcSignerInfo[] }>("enumeratesigners");
  }

  /**
   * Display an address on an external signer for verification.
   * @param address Bitcoin address to display
   */
  async signerDisplayAddress(address: string): Promise<StrategyResult<null>> {
    return this.execute<null>("signerdisplayaddress", [address]);
  }
}
