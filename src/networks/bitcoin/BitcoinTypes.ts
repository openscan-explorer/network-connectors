/**
 * Bitcoin Core RPC Types (v28+)
 *
 * Type definitions for Bitcoin Core JSON-RPC API responses.
 * Supports mainnet, testnet3, testnet4, signet, and regtest.
 *
 * @see https://developer.bitcoin.org/reference/rpc/
 */

/**
 * CAIP-2 chain ID for Bitcoin Mainnet
 * Format: bip122:<32-char-genesis-block-hash-prefix>
 */
export const BITCOIN_MAINNET = "bip122:000000000019d6689c085ae165831e93" as const;

/**
 * CAIP-2 chain ID for Bitcoin Testnet3
 */
export const BITCOIN_TESTNET3 = "bip122:000000000933ea01ad0ee984209779ba" as const;

/**
 * CAIP-2 chain ID for Bitcoin Testnet4
 */
export const BITCOIN_TESTNET4 = "bip122:00000000da84f2bafbbc53dee25a72ae" as const;

/**
 * CAIP-2 chain ID for Bitcoin Signet
 */
export const BITCOIN_SIGNET = "bip122:00000008819873e925422c1ff0f99f7c" as const;

/**
 * Supported Bitcoin chain IDs (CAIP-2 format)
 */
export type BitcoinChainId =
  | typeof BITCOIN_MAINNET
  | typeof BITCOIN_TESTNET3
  | typeof BITCOIN_TESTNET4
  | typeof BITCOIN_SIGNET;

/**
 * Script signature (input script)
 */
export interface BtcScriptSig {
  asm: string;
  hex: string;
}

/**
 * Script public key (output script)
 */
export interface BtcScriptPubKey {
  asm: string;
  desc?: string;
  hex: string;
  type: string;
  address?: string;
}

/**
 * Transaction input
 */
export interface BtcVin {
  txid?: string;
  vout?: number;
  scriptSig?: BtcScriptSig;
  coinbase?: string;
  txinwitness?: string[];
  sequence: number;
  prevout?: BtcVout;
}

/**
 * Transaction output
 */
export interface BtcVout {
  value: number;
  n: number;
  scriptPubKey: BtcScriptPubKey;
}

/**
 * Raw transaction (decoded)
 */
export interface BtcRawTransaction {
  txid: string;
  hash: string;
  version: number;
  size: number;
  vsize: number;
  weight: number;
  locktime: number;
  vin: BtcVin[];
  vout: BtcVout[];
  hex?: string;
  blockhash?: string;
  confirmations?: number;
  time?: number;
  blocktime?: number;
  fee?: number;
}

/**
 * Transaction details (wallet)
 */
export interface BtcWalletTransaction {
  amount: number;
  fee?: number;
  confirmations: number;
  blockhash?: string;
  blockheight?: number;
  blockindex?: number;
  blocktime?: number;
  txid: string;
  wtxid: string;
  walletconflicts: string[];
  replaced_by_txid?: string;
  replaces_txid?: string;
  time: number;
  timereceived: number;
  "bip125-replaceable": "yes" | "no" | "unknown";
  details: BtcTransactionDetail[];
  hex: string;
  decoded?: BtcRawTransaction;
}

/**
 * Transaction detail entry
 */
export interface BtcTransactionDetail {
  address?: string;
  category: "send" | "receive" | "generate" | "immature" | "orphan";
  amount: number;
  label?: string;
  vout: number;
  fee?: number;
  abandoned?: boolean;
}

/**
 * Block header
 */
export interface BtcBlockHeader {
  hash: string;
  confirmations: number;
  height: number;
  version: number;
  versionHex: string;
  merkleroot: string;
  time: number;
  mediantime: number;
  nonce: number;
  bits: string;
  difficulty: number;
  chainwork: string;
  nTx: number;
  previousblockhash?: string;
  nextblockhash?: string;
}

/**
 * Full block (verbosity 1: txids only)
 */
export interface BtcBlock extends BtcBlockHeader {
  strippedsize: number;
  size: number;
  weight: number;
  tx: string[];
}

/**
 * Full block with transactions (verbosity 2+)
 */
export interface BtcBlockVerbose extends BtcBlockHeader {
  strippedsize: number;
  size: number;
  weight: number;
  tx: BtcRawTransaction[];
}

/**
 * Block stats
 */
export interface BtcBlockStats {
  avgfee: number;
  avgfeerate: number;
  avgtxsize: number;
  blockhash: string;
  feerate_percentiles: [number, number, number, number, number];
  height: number;
  ins: number;
  maxfee: number;
  maxfeerate: number;
  maxtxsize: number;
  medianfee: number;
  mediantime: number;
  mediantxsize: number;
  minfee: number;
  minfeerate: number;
  mintxsize: number;
  outs: number;
  subsidy: number;
  swtotal_size: number;
  swtotal_weight: number;
  swtxs: number;
  time: number;
  total_out: number;
  total_size: number;
  total_weight: number;
  totalfee: number;
  txs: number;
  utxo_increase: number;
  utxo_size_inc: number;
  utxo_increase_actual: number;
  utxo_size_inc_actual: number;
}

/**
 * Unspent transaction output (gettxout)
 */
export interface BtcUtxo {
  bestblock: string;
  confirmations: number;
  value: number;
  scriptPubKey: BtcScriptPubKey;
  coinbase: boolean;
}

/**
 * Unspent output (listunspent)
 */
export interface BtcUnspent {
  txid: string;
  vout: number;
  address?: string;
  label?: string;
  scriptPubKey: string;
  amount: number;
  confirmations: number;
  spendable: boolean;
  solvable: boolean;
  reused?: boolean;
  desc?: string;
  parent_descs?: string[];
  safe: boolean;
}

/**
 * Mempool info
 */
export interface BtcMempoolInfo {
  loaded: boolean;
  size: number;
  bytes: number;
  usage: number;
  total_fee: number;
  maxmempool: number;
  mempoolminfee: number;
  minrelaytxfee: number;
  incrementalrelayfee: number;
  unbroadcastcount: number;
  fullrbf: boolean;
}

/**
 * Mempool entry
 */
export interface BtcMempoolEntry {
  vsize: number;
  weight: number;
  time: number;
  height: number;
  descendantcount: number;
  descendantsize: number;
  ancestorcount: number;
  ancestorsize: number;
  wtxid: string;
  fees: {
    base: number;
    modified: number;
    ancestor: number;
    descendant: number;
  };
  depends: string[];
  spentby: string[];
  "bip125-replaceable": boolean;
  unbroadcast: boolean;
}

/**
 * Test mempool accept result
 */
export interface BtcMempoolAcceptResult {
  txid: string;
  wtxid: string;
  allowed?: boolean;
  vsize?: number;
  fees?: {
    base: number;
    "effective-feerate"?: number;
    "effective-includes"?: string[];
  };
  "reject-reason"?: string;
}

/**
 * Blockchain info
 */
export interface BtcBlockchainInfo {
  chain: string;
  blocks: number;
  headers: number;
  bestblockhash: string;
  difficulty: number;
  time: number;
  mediantime: number;
  verificationprogress: number;
  initialblockdownload: boolean;
  chainwork: string;
  size_on_disk: number;
  pruned: boolean;
  pruneheight?: number;
  automatic_pruning?: boolean;
  prune_target_size?: number;
  warnings: string[];
}

/**
 * Chain tip
 */
export interface BtcChainTip {
  height: number;
  hash: string;
  branchlen: number;
  status: "active" | "valid-fork" | "valid-headers" | "headers-only" | "invalid";
}

/**
 * Chain tx stats
 */
export interface BtcChainTxStats {
  time: number;
  txcount: number;
  window_final_block_hash: string;
  window_final_block_height: number;
  window_block_count: number;
  window_tx_count?: number;
  window_interval?: number;
  txrate?: number;
}

/**
 * UTXO set info
 */
export interface BtcTxOutSetInfo {
  height: number;
  bestblock: string;
  txouts: number;
  bogosize: number;
  hash_serialized_3?: string;
  muhash?: string;
  total_amount: number;
  transactions?: number;
  disk_size?: number;
}

/**
 * Network info
 */
export interface BtcNetworkInfo {
  version: number;
  subversion: string;
  protocolversion: number;
  localservices: string;
  localservicesnames: string[];
  localrelay: boolean;
  timeoffset: number;
  networkactive: boolean;
  connections: number;
  connections_in: number;
  connections_out: number;
  networks: BtcNetwork[];
  relayfee: number;
  incrementalfee: number;
  localaddresses: BtcLocalAddress[];
  warnings: string[];
}

/**
 * Network details
 */
export interface BtcNetwork {
  name: string;
  limited: boolean;
  reachable: boolean;
  proxy: string;
  proxy_randomize_credentials: boolean;
}

/**
 * Local address
 */
export interface BtcLocalAddress {
  address: string;
  port: number;
  score: number;
}

/**
 * Peer info
 */
export interface BtcPeerInfo {
  id: number;
  addr: string;
  addrbind?: string;
  addrlocal?: string;
  network: string;
  services: string;
  servicesnames: string[];
  relaytxes: boolean;
  lastsend: number;
  lastrecv: number;
  last_transaction: number;
  last_block: number;
  bytessent: number;
  bytesrecv: number;
  conntime: number;
  timeoffset: number;
  pingtime?: number;
  minping?: number;
  pingwait?: number;
  version: number;
  subver: string;
  inbound: boolean;
  bip152_hb_to: boolean;
  bip152_hb_from: boolean;
  startingheight: number;
  presynced_headers: number;
  synced_headers: number;
  synced_blocks: number;
  inflight: number[];
  permissions: string[];
  minfeefilter: number;
  bytessent_per_msg: Record<string, number>;
  bytesrecv_per_msg: Record<string, number>;
  connection_type: string;
  transport_protocol_type: string;
  session_id?: string;
}

/**
 * Added node info
 */
export interface BtcAddedNodeInfo {
  addednode: string;
  connected: boolean;
  addresses?: Array<{ address: string; connected: "inbound" | "outbound" }>;
}

/**
 * Node address
 */
export interface BtcNodeAddress {
  time: number;
  services: number;
  address: string;
  port: number;
  network: string;
}

/**
 * Banned entry
 */
export interface BtcBannedEntry {
  address: string;
  ban_created: number;
  banned_until: number;
  ban_duration: number;
  time_remaining: number;
}

/**
 * Net totals
 */
export interface BtcNetTotals {
  totalbytesrecv: number;
  totalbytessent: number;
  timemillis: number;
  uploadtarget: {
    timeframe: number;
    target: number;
    target_reached: boolean;
    serve_historical_blocks: boolean;
    bytes_left_in_cycle: number;
    time_left_in_cycle: number;
  };
}

// ============================================================================
// Fee Estimation Types
// ============================================================================

/**
 * Smart fee estimate
 */
export interface BtcFeeEstimate {
  feerate?: number;
  errors?: string[];
  blocks: number;
}

/**
 * Mining info
 */
export interface BtcMiningInfo {
  blocks: number;
  difficulty: number;
  networkhashps: number;
  pooledtx: number;
  chain: string;
  warnings: string[];
}

/**
 * Block template transaction
 */
export interface BtcBlockTemplateTransaction {
  data: string;
  txid: string;
  hash: string;
  depends: number[];
  fee: number;
  sigops: number;
  weight: number;
}

/**
 * Block template
 */
export interface BtcBlockTemplate {
  version: number;
  rules: string[];
  vbavailable: Record<string, number>;
  vbrequired: number;
  previousblockhash: string;
  transactions: BtcBlockTemplateTransaction[];
  coinbaseaux: Record<string, string>;
  coinbasevalue: number;
  longpollid: string;
  target: string;
  mintime: number;
  mutable: string[];
  noncerange: string;
  sigoplimit: number;
  sizelimit: number;
  weightlimit: number;
  curtime: number;
  bits: string;
  height: number;
  default_witness_commitment?: string;
}

/**
 * BIP32 derivation
 */
export interface BtcBip32Deriv {
  pubkey: string;
  master_fingerprint: string;
  path: string;
}

/**
 * PSBT input
 */
export interface BtcPsbtInput {
  non_witness_utxo?: BtcRawTransaction;
  witness_utxo?: BtcVout;
  partial_signatures?: Record<string, string>;
  sighash?: string;
  redeem_script?: BtcScriptPubKey;
  witness_script?: BtcScriptPubKey;
  bip32_derivs?: BtcBip32Deriv[];
  final_scriptsig?: BtcScriptSig;
  final_scriptwitness?: string[];
  unknown?: Record<string, string>;
}

/**
 * PSBT output
 */
export interface BtcPsbtOutput {
  redeem_script?: BtcScriptPubKey;
  witness_script?: BtcScriptPubKey;
  bip32_derivs?: BtcBip32Deriv[];
  unknown?: Record<string, string>;
}

/**
 * Decoded PSBT
 */
export interface BtcDecodedPsbt {
  tx: BtcRawTransaction;
  global_xpubs: Array<{
    xpub: string;
    master_fingerprint: string;
    path: string;
  }>;
  psbt_version: number;
  proprietary: Array<{
    identifier: string;
    subtype: number;
    key: string;
    value: string;
  }>;
  unknown: Record<string, string>;
  inputs: BtcPsbtInput[];
  outputs: BtcPsbtOutput[];
  fee?: number;
}

/**
 * Analyzed PSBT
 */
export interface BtcAnalyzedPsbt {
  inputs: Array<{
    has_utxo: boolean;
    is_final: boolean;
    missing?: {
      pubkeys?: string[];
      signatures?: string[];
      redeemscript?: string;
      witnessscript?: string;
    };
    next?: string;
  }>;
  estimated_vsize?: number;
  estimated_feerate?: number;
  fee?: number;
  next: string;
  error?: string;
}

/**
 * Finalized PSBT result
 */
export interface BtcFinalizedPsbt {
  psbt?: string;
  hex?: string;
  complete: boolean;
}

/**
 * Wallet info
 */
export interface BtcWalletInfo {
  walletname: string;
  walletversion: number;
  format: string;
  balance: number;
  unconfirmed_balance: number;
  immature_balance: number;
  txcount: number;
  keypoololdest?: number;
  keypoolsize: number;
  keypoolsize_hd_internal?: number;
  unlocked_until?: number;
  paytxfee: number;
  hdseedid?: string;
  private_keys_enabled: boolean;
  avoid_reuse: boolean;
  scanning:
    | false
    | {
        duration: number;
        progress: number;
      };
  descriptors: boolean;
  external_signer: boolean;
  blank: boolean;
  birthtime?: number;
  lastprocessedblock: {
    hash: string;
    height: number;
  };
}

/**
 * Wallet balances
 */
export interface BtcBalances {
  mine: {
    trusted: number;
    untrusted_pending: number;
    immature: number;
    used?: number;
  };
  watchonly?: {
    trusted: number;
    untrusted_pending: number;
    immature: number;
  };
  lastprocessedblock: {
    hash: string;
    height: number;
  };
}

/**
 * Address info
 */
export interface BtcAddressInfo {
  address: string;
  scriptPubKey: string;
  ismine: boolean;
  solvable: boolean;
  desc?: string;
  parent_desc?: string;
  iswatchonly: boolean;
  isscript: boolean;
  iswitness: boolean;
  witness_version?: number;
  witness_program?: string;
  pubkey?: string;
  ischange: boolean;
  timestamp?: number;
  hdkeypath?: string;
  hdseedid?: string;
  hdmasterfingerprint?: string;
  labels: string[];
}

/**
 * List received by address entry
 */
export interface BtcReceivedByAddress {
  involvesWatchonly?: boolean;
  address: string;
  amount: number;
  confirmations: number;
  label: string;
  txids: string[];
}

/**
 * List received by label entry
 */
export interface BtcReceivedByLabel {
  involvesWatchonly?: boolean;
  amount: number;
  confirmations: number;
  label: string;
}

/**
 * List transactions entry
 */
export interface BtcListTransactionsEntry {
  involvesWatchonly?: boolean;
  address?: string;
  category: "send" | "receive" | "generate" | "immature" | "orphan";
  amount: number;
  label?: string;
  vout?: number;
  fee?: number;
  confirmations: number;
  blockhash?: string;
  blockheight?: number;
  blockindex?: number;
  blocktime?: number;
  txid: string;
  wtxid: string;
  walletconflicts: string[];
  replaced_by_txid?: string;
  replaces_txid?: string;
  time: number;
  timereceived: number;
  "bip125-replaceable": "yes" | "no" | "unknown";
  abandoned?: boolean;
  parent_descs?: string[];
}

/**
 * List since block result
 */
export interface BtcListSinceBlock {
  transactions: BtcListTransactionsEntry[];
  removed?: BtcListTransactionsEntry[];
  lastblock: string;
}

/**
 * Import descriptor request
 */
export interface BtcImportDescriptor {
  desc: string;
  active?: boolean;
  range?: number | [number, number];
  next_index?: number;
  timestamp: number | "now";
  internal?: boolean;
  label?: string;
}

/**
 * Import descriptor result
 */
export interface BtcImportDescriptorResult {
  success: boolean;
  warnings?: string[];
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Descriptor info
 */
export interface BtcDescriptorInfo {
  descriptor: string;
  checksum: string;
  isrange: boolean;
  issolvable: boolean;
  hasprivatekeys: boolean;
}

/**
 * List descriptors entry
 */
export interface BtcListDescriptorsEntry {
  desc: string;
  timestamp: number;
  active: boolean;
  internal?: boolean;
  range?: [number, number];
  next?: number;
  next_index?: number;
}

/**
 * List descriptors result
 */
export interface BtcListDescriptors {
  wallet_name: string;
  descriptors: BtcListDescriptorsEntry[];
}

/**
 * HD key info (v28+)
 */
export interface BtcHdKey {
  xpub: string;
  has_private: boolean;
  descriptors: Array<{
    desc: string;
    active: boolean;
  }>;
}

/**
 * Send result
 */
export interface BtcSendResult {
  complete: boolean;
  txid?: string;
  hex?: string;
  psbt?: string;
}

/**
 * Bump fee result
 */
export interface BtcBumpFeeResult {
  txid?: string;
  origfee: number;
  fee: number;
  errors?: string[];
  psbt?: string;
}

/**
 * Fund raw transaction result
 */
export interface BtcFundRawTransactionResult {
  hex: string;
  fee: number;
  changepos: number;
}

/**
 * Wallet create funded PSBT result
 */
export interface BtcWalletCreateFundedPsbtResult {
  psbt: string;
  fee: number;
  changepos: number;
}

/**
 * Create wallet result
 */
export interface BtcCreateWalletResult {
  name: string;
  warnings: string[];
}

/**
 * Load/unload wallet result
 */
export interface BtcLoadWalletResult {
  name: string;
  warnings: string[];
}

/**
 * Wallet directory entry
 */
export interface BtcWalletDirEntry {
  name: string;
}

/**
 * Locked unspent
 */
export interface BtcLockedUnspent {
  txid: string;
  vout: number;
}

/**
 * Memory info
 */
export interface BtcMemoryInfo {
  locked: {
    used: number;
    free: number;
    total: number;
    locked: number;
    chunks_used: number;
    chunks_free: number;
  };
}

/**
 * RPC info
 */
export interface BtcRpcInfo {
  active_commands: Array<{
    method: string;
    duration: number;
  }>;
  logpath: string;
}

/**
 * Validate address result
 */
export interface BtcValidateAddress {
  isvalid: boolean;
  address?: string;
  scriptPubKey?: string;
  isscript?: boolean;
  iswitness?: boolean;
  witness_version?: number;
  witness_program?: string;
  error?: string;
  error_locations?: number[];
}

/**
 * Decode script result
 */
export interface BtcDecodeScript {
  asm: string;
  desc?: string;
  type: string;
  address?: string;
  p2sh?: string;
  segwit?: {
    asm: string;
    hex: string;
    type: string;
    address?: string;
    p2sh_segwit?: string;
  };
}

/**
 * Create multisig result
 */
export interface BtcCreateMultisig {
  address: string;
  redeemScript: string;
  descriptor: string;
  warnings?: string[];
}

/**
 * Index info
 */
export interface BtcIndexInfo {
  [indexName: string]: {
    synced: boolean;
    best_block_height: number;
  };
}

/**
 * Signer info
 */
export interface BtcSignerInfo {
  fingerprint: string;
  name: string;
}

/**
 * Submit package result
 */
export interface BtcSubmitPackageResult {
  package_msg: string;
  "tx-results": Record<
    string,
    {
      txid: string;
      "other-wtxid"?: string;
      vsize?: number;
      fees?: {
        base: number;
        "effective-feerate"?: number;
        "effective-includes"?: string[];
      };
      error?: string;
    }
  >;
  replaced_transactions?: string[];
}

/**
 * Prioritised transactions
 */
export interface BtcPrioritisedTransactions {
  [txid: string]: {
    fee_delta: number;
    in_mempool: boolean;
  };
}

/**
 * Scan TXOUT set result
 */
export interface BtcScanTxOutSetResult {
  success: boolean;
  txouts: number;
  height: number;
  bestblock: string;
  unspents: Array<{
    txid: string;
    vout: number;
    scriptPubKey: string;
    desc: string;
    amount: number;
    coinbase: boolean;
    height: number;
    blockhash: string;
    confirmations: number;
  }>;
  total_amount: number;
}

/**
 * Scan blocks result
 */
export interface BtcScanBlocksResult {
  from_height: number;
  to_height: number;
  relevant_blocks: string[];
}

/**
 * Block filter
 */
export interface BtcBlockFilter {
  filter: string;
  header: string;
}
