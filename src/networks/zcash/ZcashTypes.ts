/**
 * Zcash RPC Types (Zebra / zebrad)
 *
 * Type definitions for the Zcash JSON-RPC API as served by Zebra, the Zcash
 * Foundation's node implementation. Supports mainnet and testnet.
 *
 * Zebra supersedes `zcashd`, which reached its automatic end-of-support halt on
 * 2026-07-18 and no longer runs. These types therefore model Zebra's RPC surface,
 * not the historical `zcashd` surface.
 *
 * @see https://zebra.zfnd.org/
 * @see https://docs.rs/zebra-rpc/latest/zebra_rpc/methods/
 */

// ===== Chain ID Constants (CAIP-2 format: bip122:<first-32-chars-of-genesis-hash>) =====

/**
 * CAIP-2 chain ID for Zcash Mainnet
 * Format: bip122:<32-char-genesis-block-hash-prefix>
 *
 * Genesis: 00040fe8ec8471911baa1db1266ea15dd06b4a8a5c453883c000b031973dce08
 */
export const ZCASH_MAINNET = "bip122:00040fe8ec8471911baa1db1266ea15d" as const;

/**
 * CAIP-2 chain ID for Zcash Testnet
 *
 * Genesis: 05a60a92d99d85997cce3b87616c089f6124d7342af37106edc76126334a2c38
 */
export const ZCASH_TESTNET = "bip122:05a60a92d99d85997cce3b87616c089f" as const;

/**
 * Supported Zcash chain IDs (CAIP-2 format)
 */
export type ZcashChainId = typeof ZCASH_MAINNET | typeof ZCASH_TESTNET;

// ===== Common types =====

/**
 * A block hash or a block height. Zebra accepts both as a string, so a height
 * must be passed as a decimal string (e.g. "3444000"), not a number.
 */
export type ZecHashOrHeight = string;

/**
 * Shielded value pool identifiers, in the order Zcash introduced them
 */
export type ZecValuePoolId =
  | "transparent"
  | "sprout"
  | "sapling"
  | "orchard"
  | "lockbox"
  | "ironwood";

/**
 * Activation status of a network upgrade
 */
export type ZecUpgradeStatus = "active" | "pending";

// ===== Chain / blockchain info =====

/**
 * Balance of a single shielded or transparent value pool
 */
export interface ZecValuePoolBalance {
  id: ZecValuePoolId;
  /** Pool balance in ZEC */
  chainValue: number;
  /** Pool balance in zatoshis (1 ZEC = 100_000_000 zat) */
  chainValueZat: number;
  monitored: boolean;
}

/**
 * Total chain supply, using the same shape as a value pool minus the id
 */
export interface ZecChainSupply {
  chainValue: number;
  chainValueZat: number;
  monitored: boolean;
}

/**
 * A network upgrade entry, keyed in `upgrades` by its consensus branch ID
 */
export interface ZecNetworkUpgradeInfo {
  name: string;
  activationheight: number;
  status: ZecUpgradeStatus;
}

/**
 * Consensus branch IDs for the current tip and the next block
 */
export interface ZecTipConsensusBranch {
  chaintip: string;
  nextblock: string;
}

/**
 * Response from getblockchaininfo
 */
export interface ZecBlockchainInfo {
  /** Network name: "main", "test" or "regtest" */
  chain: string;
  blocks: number;
  headers: number;
  difficulty: number;
  verificationprogress: number;
  chainwork: number;
  pruned: boolean;
  size_on_disk: number;
  commitments: number;
  bestblockhash: string;
  estimatedheight: number;
  chainSupply: ZecChainSupply;
  valuePools: ZecValuePoolBalance[];
  /** Network upgrades keyed by consensus branch ID hex */
  upgrades: Record<string, ZecNetworkUpgradeInfo>;
  consensus: ZecTipConsensusBranch;
}

/**
 * Response from getbestblockheightandhash
 */
export interface ZecBlockHeightAndHash {
  height: number;
  hash: string;
}

// ===== Blocks =====

/**
 * Sapling / Orchard note commitment tree sizes for a block
 */
export interface ZecBlockTrees {
  sapling?: { size: number };
  orchard?: { size: number };
}

/**
 * Fields shared by getblockheader (verbose) and getblock (verbosity >= 1)
 */
export interface ZecBlockHeader {
  hash: string;
  confirmations: number;
  height: number;
  version: number;
  merkleroot: string;
  /** Block commitments hash (hashBlockCommitments), NU5 onwards */
  blockcommitments: string;
  finalsaplingroot: string;
  /** Only present on post-NU5 blocks */
  finalorchardroot?: string;
  time: number;
  /** 32-byte hex string, unlike Bitcoin's numeric nonce */
  nonce: string;
  /** Equihash solution, hex-encoded — Zcash specific */
  solution: string;
  bits: string;
  difficulty: number;
  chainwork?: string;
  previousblockhash?: string;
  nextblockhash?: string;
}

/**
 * Fields getblock adds on top of the block header, at any verbosity >= 1
 */
interface ZecBlockCommon extends ZecBlockHeader {
  size?: number;
  nTx?: number;
  trees?: ZecBlockTrees;
  /** Total chain supply as of this block */
  chainSupply?: ZecChainSupply;
  /** Per-pool balances as of this block */
  valuePools?: ZecValuePoolBalance[];
}

/**
 * Response from getblock with verbosity 1 (transaction IDs only)
 */
export interface ZecBlock extends ZecBlockCommon {
  tx: string[];
}

/**
 * Response from getblock with verbosity 2 (full transaction objects)
 */
export interface ZecBlockVerbose extends ZecBlockCommon {
  tx: ZecRawTransaction[];
}

// ===== Transactions =====

/**
 * Script signature of a transparent input
 */
export interface ZecScriptSig {
  asm: string;
  hex: string;
}

/**
 * Output script of a transparent output
 */
export interface ZecScriptPubKey {
  asm: string;
  hex: string;
  reqSigs?: number;
  type: string;
  addresses?: string[];
}

/**
 * Transparent transaction input
 */
export interface ZecVin {
  txid?: string;
  vout?: number;
  scriptSig?: ZecScriptSig;
  /** Present instead of txid/vout on coinbase inputs */
  coinbase?: string;
  sequence: number;
  value?: number;
  valueZat?: number;
  address?: string;
}

/**
 * Transparent transaction output
 */
export interface ZecVout {
  /** Value in ZEC */
  value: number;
  /** Value in zatoshis */
  valueZat?: number;
  n: number;
  scriptPubKey: ZecScriptPubKey;
}

/**
 * Sapling shielded spend description
 */
export interface ZecShieldedSpend {
  cv: string;
  anchor: string;
  nullifier: string;
  rk: string;
  proof: string;
  spendAuthSig: string;
}

/**
 * Sapling shielded output description
 */
export interface ZecShieldedOutput {
  cv: string;
  cmu: string;
  ephemeralKey: string;
  encCiphertext: string;
  outCiphertext: string;
  proof: string;
}

/**
 * Orchard action (combined spend and output), NU5 onwards
 */
export interface ZecOrchardAction {
  cv: string;
  nullifier: string;
  rk: string;
  cmx: string;
  ephemeralKey: string;
  encCiphertext: string;
  spendAuthSig: string;
  outCiphertext: string;
}

/**
 * Orchard bundle attached to a transaction
 */
export interface ZecOrchardBundle {
  actions: ZecOrchardAction[];
  valueBalance?: number;
  valueBalanceZat?: number;
}

/**
 * Sprout-era JoinSplit description
 */
export interface ZecJoinSplit {
  vpub_old: number;
  vpub_new: number;
  vpub_oldZat?: number;
  vpub_newZat?: number;
  anchor: string;
  nullifiers: string[];
  commitments: string[];
  onetimePubKey: string;
  randomSeed: string;
  macs: string[];
  proof: string;
  ciphertexts: string[];
}

/**
 * Response from getrawtransaction with verbose 1
 */
export interface ZecRawTransaction {
  in_active_chain?: boolean;
  hex: string;
  txid?: string;
  authdigest?: string;
  size?: number;
  overwintered?: boolean;
  version?: number;
  versiongroupid?: string;
  locktime?: number;
  expiryheight?: number;
  vin: ZecVin[];
  vout: ZecVout[];
  /** Net value moved into (negative) or out of (positive) the Sapling pool, in ZEC */
  valueBalance?: number;
  valueBalanceZat?: number;
  vShieldedSpend?: ZecShieldedSpend[];
  vShieldedOutput?: ZecShieldedOutput[];
  bindingSig?: string;
  orchard?: ZecOrchardBundle;
  vjoinsplit?: ZecJoinSplit[];
  joinSplitPubKey?: string;
  joinSplitSig?: string;
  blockhash?: string;
  height?: number;
  confirmations?: number;
  time?: number;
  blocktime?: number;
}

/**
 * Response from gettxout
 */
export interface ZecTxOut {
  bestblock: string;
  confirmations: number;
  /** Value in ZEC */
  value: number;
  scriptPubKey: ZecScriptPubKey;
  version: number;
  coinbase: boolean;
}

// ===== Mempool =====

/**
 * Response from getmempoolinfo
 */
export interface ZecMempoolInfo {
  size: number;
  bytes: number;
  usage: number;
}

/**
 * A verbose mempool entry, returned by getrawmempool with verbose = true
 */
export interface ZecMempoolEntry {
  size: number;
  fee: number;
  modifiedfee: number;
  time: number;
  height: number;
  descendantcount: number;
  descendantsize: number;
  descendantfees: number;
  depends: string[];
}

// ===== Address index =====

/**
 * Request bag for getaddressbalance and getaddressutxos
 */
export interface ZecAddressRequest {
  addresses: string[];
}

/**
 * Request bag for getaddresstxids
 */
export interface ZecAddressTxIdsRequest {
  addresses: string[];
  start?: number;
  end?: number;
}

/**
 * Response from getaddressbalance
 */
export interface ZecAddressBalance {
  /** Balance in zatoshis */
  balance: number;
  received?: number;
}

/**
 * A single UTXO returned by getaddressutxos
 */
export interface ZecAddressUtxo {
  address: string;
  txid: string;
  outputIndex: number;
  script: string;
  /** Value in zatoshis */
  satoshis: number;
  height: number;
}

// ===== Shielded pools =====

/**
 * State of a single note commitment tree at a given block
 */
export interface ZecTreestatePool {
  /** Hex-encoded note commitment tree state */
  commitments: {
    finalState: string;
  };
  skipHash?: string;
}

/**
 * Response from z_gettreestate
 */
export interface ZecTreestate {
  hash: string;
  height: number;
  time: number;
  sapling?: ZecTreestatePool;
  orchard?: ZecTreestatePool;
}

/**
 * A single note commitment subtree
 */
export interface ZecSubtree {
  root: string;
  end_height: number;
}

/**
 * Response from z_getsubtreesbyindex
 */
export interface ZecSubtrees {
  pool: string;
  start_index: number;
  subtrees: ZecSubtree[];
}

/**
 * Response from z_listunifiedreceivers — each field is present only if the
 * unified address contains a receiver of that type
 */
export interface ZecUnifiedReceivers {
  orchard?: string;
  sapling?: string;
  p2pkh?: string;
  p2sh?: string;
}

// ===== Address validation =====

/**
 * Response from validateaddress (transparent addresses)
 */
export interface ZecValidateAddress {
  isvalid: boolean;
  address?: string;
  scriptPubKey?: string;
  isscript?: boolean;
}

/**
 * Response from z_validateaddress (shielded and unified addresses)
 */
export interface ZecZValidateAddress {
  isvalid: boolean;
  address?: string;
  /** "sprout", "sapling" or "unified" */
  address_type?: string;
  ismine?: boolean;
  payingkey?: string;
  transmissionkey?: string;
  diversifier?: string;
  diversifiedtransmissionkey?: string;
}

// ===== Node / network =====

/**
 * Response from getinfo
 */
export interface ZecInfo {
  version: number;
  build: string;
  subversion: string;
  protocolversion: number;
  blocks: number;
  connections: number;
  proxy?: string;
  difficulty: number;
  testnet: boolean;
  paytxfee: number;
  relayfee: number;
  errors: string;
  errorstimestamp: number;
}

/**
 * Response from getdeprecationinfo
 */
export interface ZecDeprecationInfo {
  version: number;
  subversion: string;
  deprecationheight: number;
  end_of_service: {
    block_height: number;
    estimated_time: number;
  };
}

/**
 * A network stanza inside getnetworkinfo
 */
export interface ZecNetwork {
  name: string;
  limited: boolean;
  reachable: boolean;
  proxy: string;
  proxy_randomize_credentials: boolean;
}

/**
 * A local address stanza inside getnetworkinfo
 */
export interface ZecLocalAddress {
  address: string;
  port: number;
  score: number;
}

/**
 * Response from getnetworkinfo
 */
export interface ZecNetworkInfo {
  version: number;
  subversion: string;
  protocolversion: number;
  localservices: string;
  timeoffset: number;
  connections: number;
  networks: ZecNetwork[];
  relayfee: number;
  localaddresses: ZecLocalAddress[];
  warnings: string;
}

/**
 * A single peer entry from getpeerinfo
 */
export interface ZecPeerInfo {
  addr: string;
  inbound: boolean;
}

// ===== Mining =====

/**
 * Response from getmininginfo
 */
export interface ZecMiningInfo {
  blocks: number;
  currentblocksize?: number;
  currentblocktx?: number;
  difficulty?: number;
  errors?: string;
  genproclimit?: number;
  networksolps: number;
  networkhashps: number;
  pooledtx?: number;
  testnet: boolean;
  chain: string;
  generate?: boolean;
}

/**
 * A funding stream or lockbox entry inside getblocksubsidy
 */
export interface ZecFundingStream {
  recipient: string;
  specification: string;
  /** Value in ZEC */
  value: number;
  valueZat: number;
  address?: string;
}

/**
 * Response from getblocksubsidy
 */
export interface ZecBlockSubsidy {
  fundingstreams?: ZecFundingStream[];
  lockboxstreams?: ZecFundingStream[];
  /** Miner subsidy in ZEC */
  miner: number;
  founders?: number;
  fundingstreamstotal?: number;
  lockboxtotal?: number;
  totalblocksubsidy?: number;
}

/**
 * Response from getstandardfee
 */
export type ZecStandardFee = number;

/**
 * A transaction entry inside a block template
 */
export interface ZecBlockTemplateTransaction {
  data: string;
  hash: string;
  authdigest?: string;
  depends: number[];
  fee: number;
  sigops: number;
  required?: boolean;
}

/**
 * Coinbase transaction entry inside a block template
 */
export interface ZecBlockTemplateCoinbase {
  data: string;
  hash: string;
  authdigest?: string;
  depends: number[];
  fee: number;
  sigops: number;
  required: boolean;
}

/**
 * Response from getblocktemplate (in the default "template" mode)
 */
export interface ZecBlockTemplate {
  capabilities: string[];
  version: number;
  previousblockhash: string;
  blockcommitmentshash?: string;
  lightclientroothash?: string;
  finalsaplingroothash?: string;
  defaultroots?: Record<string, string>;
  transactions: ZecBlockTemplateTransaction[];
  coinbasetxn: ZecBlockTemplateCoinbase;
  longpollid: string;
  target: string;
  mintime: number;
  mutable: string[];
  noncerange: string;
  sigoplimit: number;
  sizelimit: number;
  curtime: number;
  bits: string;
  height: number;
  maxtime?: number;
  submitold?: boolean;
}

/**
 * Optional parameters for getblocktemplate
 */
export interface ZecBlockTemplateRequest {
  mode?: "template" | "proposal";
  data?: string;
  capabilities?: string[];
  longpollid?: string;
  _proposal_hash?: string;
}

/**
 * Result of submitblock — null on success, otherwise a rejection reason
 */
export type ZecSubmitBlockResult = string | null;
