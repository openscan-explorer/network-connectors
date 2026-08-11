// Base client
export { NetworkClient } from "./NetworkClient.js";

// Ethereum (Chain ID: 1)
export { EthereumClient } from "./networks/1/EthereumClient.js";
export type {
  EthBlock,
  EthTransaction,
  EthTransactionReceipt,
  EthLog,
  EthLogFilter,
  EthCallObject,
  EthWithdrawal,
  EthSyncingStatus,
  BlockNumberOrTag as EthBlockNumberOrTag,
  BlockTag as EthBlockTag,
  AccessListEntry as EthAccessListEntry,
} from "./networks/1/EthereumTypes.js";

// Hardhat (Chain ID: 31337)
export { HardhatClient } from "./networks/31337/HardhatClient.js";
export type {
  HardhatBlock,
  HardhatTransaction,
  HardhatTransactionReceipt,
  HardhatLog,
  HardhatLogFilter,
  HardhatCallObject,
  HardhatWithdrawal,
  HardhatSyncingStatus,
  HardhatMetadata,
  HardhatForkedNetworkInfo,
  HardhatResetOptions,
  HardhatCompilationResult,
  BlockNumberOrTag as HardhatBlockNumberOrTag,
  BlockTag as HardhatBlockTag,
  AccessListEntry as HardhatAccessListEntry,
} from "./networks/31337/HardhatTypes.js";

// Optimism (Chain ID: 10)
export { OptimismClient } from "./networks/10/OptimismClient.js";
export type {
  OptimismBlock,
  OptimismTransaction,
  OptimismTransactionReceipt,
  OptimismLog,
  OptimismLogFilter,
  OptimismCallObject,
  OptimismOutputAtBlock,
  OptimismSyncStatus,
  OptimismRollupConfig,
  OpP2PSelfInfo,
  OpP2PPeersResponse,
  OpP2PPeerStats,
  BlockNumberOrTag as OptimismBlockNumberOrTag,
  BlockTag as OptimismBlockTag,
  AccessListEntry as OptimismAccessListEntry,
} from "./networks/10/OptimismTypes.js";

// BNB Smart Chain (Chain ID: 56)
export { BNBClient } from "./networks/56/BNBClient.js";
export type {
  BNBBlock,
  BNBTransaction,
  BNBTransactionReceipt,
  BNBLog,
  BNBLogFilter,
  BNBCallObject,
  BNBSyncingStatus,
  BNBFinalizedHeader,
  BNBFinalizedBlock,
  BNBBlobSidecars,
  BNBBlobSidecar,
  BNBTransactionDataAndReceipt,
  BNBHealthStatus,
  BNBTxPoolStatus,
  BlockNumberOrTag as BNBBlockNumberOrTag,
  BlockTag as BNBBlockTag,
  AccessListEntry as BNBAccessListEntry,
} from "./networks/56/BNBTypes.js";

// BNB Smart Chain Testnet (Chain ID: 97)
export { BNBTestnetClient } from "./networks/97/BNBTestnetClient.js";
export type {
  BNBTestnetBlock,
  BNBTestnetTransaction,
  BNBTestnetTransactionReceipt,
  BNBTestnetLog,
  BNBTestnetLogFilter,
  BNBTestnetCallObject,
  BNBTestnetSyncingStatus,
  BNBTestnetFinalizedHeader,
  BNBTestnetFinalizedBlock,
  BNBTestnetBlobSidecars,
  BNBTestnetBlobSidecar,
  BNBTestnetTransactionDataAndReceipt,
  BNBTestnetHealthStatus,
  BNBTestnetTxPoolStatus,
  BlockNumberOrTag as BNBTestnetBlockNumberOrTag,
  BlockTag as BNBTestnetBlockTag,
  AccessListEntry as BNBTestnetAccessListEntry,
} from "./networks/97/BNBTestnetTypes.js";

// Polygon (Chain ID: 137)
export { PolygonClient } from "./networks/137/PolygonClient.js";
export type {
  PolygonBlock,
  PolygonTransaction,
  PolygonTransactionReceipt,
  PolygonLog,
  PolygonLogFilter,
  PolygonCallObject,
  BorValidator,
  BorSnapshot,
  BlockNumberOrTag as PolygonBlockNumberOrTag,
  BlockTag as PolygonBlockTag,
  AccessListEntry as PolygonAccessListEntry,
} from "./networks/137/PolygonTypes.js";

// Base (Chain ID: 8453)
export { BaseClient } from "./networks/8453/BaseClient.js";
export type {
  BaseBlock,
  BaseTransaction,
  BaseTransactionReceipt,
  BaseLog,
  BaseLogFilter,
  BaseCallObject,
  OptimismOutputAtBlock as BaseOutputAtBlock,
  OptimismSyncStatus as BaseSyncStatus,
  OptimismRollupConfig as BaseRollupConfig,
  OpP2PSelfInfo as BaseP2PSelfInfo,
  OpP2PPeersResponse as BaseP2PPeersResponse,
  OpP2PPeerStats as BaseP2PPeerStats,
  BlockNumberOrTag as BaseBlockNumberOrTag,
  BlockTag as BaseBlockTag,
  AccessListEntry as BaseAccessListEntry,
} from "./networks/8453/BaseTypes.js";

// Avalanche C-Chain (Chain ID: 43114)
export { AvalancheClient } from "./networks/43114/AvalancheClient.js";
export type {
  AvalancheBlock,
  AvalancheTransaction,
  AvalancheTransactionReceipt,
  AvalancheLog,
  AvalancheLogFilter,
  AvalancheCallObject,
  AvalancheWithdrawal,
  AvalancheSyncingStatus,
  AvalancheChainConfig,
  AvalancheCallDetailedResult,
  AvalancheBadBlock,
  AvalancheSuggestPriceOptions,
  AvalanchePriceTier,
  AvalancheWarpSignedMessage,
  AvalancheVMConfig,
  AvalancheGetUTXOsResponse,
  AvalancheUTXOIndex,
  AvalancheAtomicTxStatus,
  AvalancheAtomicTx,
  BlockNumberOrTag as AvalancheBlockNumberOrTag,
  BlockTag as AvalancheBlockTag,
  AccessListEntry as AvalancheAccessListEntry,
} from "./networks/43114/AvalancheTypes.js";

// Arbitrum (Chain ID: 42161)
export { ArbitrumClient } from "./networks/42161/ArbitrumClient.js";
export type {
  ArbitrumBlock,
  ArbitrumTransaction,
  ArbitrumTransactionReceipt,
  ArbitrumLog,
  ArbitrumLogFilter,
  ArbitrumCallObject,
  ArbitrumTrace,
  ArbitrumTraceResponse,
  ArbitrumTraceOptions,
  BlockNumberOrTag as ArbitrumBlockNumberOrTag,
} from "./networks/42161/ArbitrumTypes.js";

// Aztec (Chain ID: 677868)
export { AztecClient } from "./networks/677868/AztecClient.js";
export type {
  L2Block as AztecL2Block,
  BlockHeader as AztecBlockHeader,
  L2Tips as AztecL2Tips,
  Tx as AztecTx,
  TxReceipt as AztecTxReceipt,
  IndexedTxEffect as AztecIndexedTxEffect,
  TxValidationResult as AztecTxValidationResult,
  PublicSimulationOutput as AztecPublicSimulationOutput,
  WorldStateSyncStatus as AztecWorldStateSyncStatus,
  NodeInfo as AztecNodeInfo,
  L1ContractAddresses as AztecL1ContractAddresses,
  ProtocolContractAddresses as AztecProtocolContractAddresses,
  GasFees as AztecGasFees,
  BlockNumberOrLatest as AztecBlockNumberOrLatest,
} from "./networks/677868/AztecTypes.js";

// Sepolia Testnet (Chain ID: 11155111)
export { SepoliaClient } from "./networks/11155111/SepoliaClient.js";
export type {
  SepoliaBlock,
  SepoliaTransaction,
  SepoliaTransactionReceipt,
  SepoliaLog,
  SepoliaLogFilter,
  SepoliaCallObject,
  SepoliaWithdrawal,
  SepoliaSyncingStatus,
  BlockNumberOrTag as SepoliaBlockNumberOrTag,
  BlockTag as SepoliaBlockTag,
  AccessListEntry as SepoliaAccessListEntry,
} from "./networks/11155111/SepoliaTypes.js";

// Bitcoin (CAIP-2 Chain IDs: bip122:*)
export { BitcoinClient } from "./networks/bitcoin/BitcoinClient.js";
export {
  BITCOIN_MAINNET,
  BITCOIN_TESTNET3,
  BITCOIN_TESTNET4,
  BITCOIN_SIGNET,
} from "./networks/bitcoin/BitcoinTypes.js";
export type {
  BitcoinChainId,
  BtcBlock,
  BtcBlockHeader,
  BtcBlockVerbose,
  BtcBlockStats,
  BtcRawTransaction,
  BtcVin,
  BtcVout,
  BtcScriptSig,
  BtcScriptPubKey,
  BtcUtxo,
  BtcUnspent,
  BtcMempoolInfo,
  BtcMempoolEntry,
  BtcMempoolAcceptResult,
  BtcBlockchainInfo,
  BtcChainTip,
  BtcChainTxStats,
  BtcTxOutSetInfo,
  BtcNetworkInfo,
  BtcNetwork,
  BtcLocalAddress,
  BtcPeerInfo,
  BtcAddedNodeInfo,
  BtcNodeAddress,
  BtcBannedEntry,
  BtcNetTotals,
  BtcFeeEstimate,
  BtcMiningInfo,
  BtcBlockTemplate,
  BtcBlockTemplateTransaction,
  BtcDecodedPsbt,
  BtcAnalyzedPsbt,
  BtcFinalizedPsbt,
  BtcPsbtInput,
  BtcPsbtOutput,
  BtcBip32Deriv,
  BtcWalletInfo,
  BtcBalances,
  BtcAddressInfo,
  BtcWalletTransaction,
  BtcTransactionDetail,
  BtcListTransactionsEntry,
  BtcListSinceBlock,
  BtcReceivedByAddress,
  BtcReceivedByLabel,
  BtcDescriptorInfo,
  BtcListDescriptors,
  BtcListDescriptorsEntry,
  BtcHdKey,
  BtcImportDescriptor,
  BtcImportDescriptorResult,
  BtcSendResult,
  BtcBumpFeeResult,
  BtcFundRawTransactionResult,
  BtcWalletCreateFundedPsbtResult,
  BtcCreateWalletResult,
  BtcLoadWalletResult,
  BtcWalletDirEntry,
  BtcLockedUnspent,
  BtcMemoryInfo,
  BtcRpcInfo,
  BtcValidateAddress,
  BtcDecodeScript,
  BtcCreateMultisig,
  BtcIndexInfo,
  BtcSignerInfo,
  BtcSubmitPackageResult,
  BtcPrioritisedTransactions,
  BtcScanTxOutSetResult,
  BtcScanBlocksResult,
  BtcBlockFilter,
} from "./networks/bitcoin/BitcoinTypes.js";

// Zcash (CAIP-2 Chain IDs: bip122:*)
export { ZcashClient } from "./networks/zcash/ZcashClient.js";
export { ZCASH_MAINNET, ZCASH_TESTNET } from "./networks/zcash/ZcashTypes.js";
export type {
  ZcashChainId,
  ZecHashOrHeight,
  ZecValuePoolId,
  ZecUpgradeStatus,
  ZecValuePoolBalance,
  ZecChainSupply,
  ZecNetworkUpgradeInfo,
  ZecTipConsensusBranch,
  ZecBlockchainInfo,
  ZecBlockHeightAndHash,
  ZecBlockTrees,
  ZecBlockHeader,
  ZecBlock,
  ZecBlockVerbose,
  ZecScriptSig,
  ZecScriptPubKey,
  ZecVin,
  ZecVout,
  ZecShieldedSpend,
  ZecShieldedOutput,
  ZecOrchardAction,
  ZecOrchardBundle,
  ZecJoinSplit,
  ZecRawTransaction,
  ZecTxOut,
  ZecMempoolInfo,
  ZecMempoolEntry,
  ZecAddressRequest,
  ZecAddressTxIdsRequest,
  ZecAddressBalance,
  ZecAddressUtxo,
  ZecTreestatePool,
  ZecTreestate,
  ZecSubtree,
  ZecSubtrees,
  ZecUnifiedReceivers,
  ZecValidateAddress,
  ZecZValidateAddress,
  ZecInfo,
  ZecDeprecationInfo,
  ZecNetwork,
  ZecLocalAddress,
  ZecNetworkInfo,
  ZecPeerInfo,
  ZecMiningInfo,
  ZecFundingStream,
  ZecBlockSubsidy,
  ZecStandardFee,
  ZecBlockTemplateTransaction,
  ZecBlockTemplateCoinbase,
  ZecBlockTemplate,
  ZecBlockTemplateRequest,
  ZecSubmitBlockResult,
} from "./networks/zcash/ZcashTypes.js";

// Solana (CAIP-2 Chain IDs: solana:*)
export { SolanaClient } from "./networks/solana/SolanaClient.js";
export {
  SOLANA_MAINNET,
  SOLANA_DEVNET,
  SOLANA_TESTNET,
} from "./networks/solana/SolanaTypes.js";
export type {
  SolanaChainId,
  Commitment as SolCommitment,
  Encoding as SolEncoding,
  SolRpcResponse,
  SolAccountInfo,
  SolKeyedAccount,
  SolTokenAmount,
  SolTokenAccount,
  SolTokenLargestAccount,
  SolTransaction,
  SolTransactionData,
  SolTransactionMessage,
  SolTransactionMeta,
  SolInnerInstruction,
  SolTokenBalance,
  SolLoadedAddresses,
  SolReturnData,
  SolBlock,
  SolReward,
  SolVersion,
  SolEpochInfo,
  SolEpochSchedule,
  SolInflationGovernor,
  SolInflationRate,
  SolInflationReward,
  SolSupply,
  SolVoteAccount,
  SolClusterNode,
  SolPerfSample,
  SolBlockProduction,
  SolHighestSnapshotSlot,
  SolPrioritizationFee,
  SolSignatureStatus,
  SolSignatureInfo,
  SolStakeActivation,
  SolLeaderSchedule,
  SolLargestAccount,
  SolBlockCommitment,
  SolLatestBlockhash,
  SolSimulateTransactionResult,
  SolAccountNotification,
  SolProgramNotification,
  SolLogsNotification,
  SolSignatureNotification,
  SolSlotNotification,
  SolSlotsUpdatesNotification,
  SolRootNotification,
  SolBlockNotification,
  SolVoteNotification,
} from "./networks/solana/SolanaTypes.js";

// Client Factory (Chain ID-based instantiation)
export { ClientFactory } from "./factory/ClientRegistry.js";
export type {
  SupportedChainId,
  SupportedBitcoinChainId,
  SupportedZcashChainId,
  SupportedSolanaChainId,
  SupportedNetwork,
  ClientConstructor,
  ChainIdToClient,
  NetworkToClient,
} from "./factory/ClientRegistry.js";

// Strategy types and factory
export { StrategyFactory } from "./strategies/requestStrategy.js";
export type { StrategyConfig, RpcEndpoint } from "./strategies/requestStrategy.js";
export type {
  RequestStrategy,
  StrategyResult,
  RPCMetadata,
  RPCProviderResponse,
} from "./strategies/strategiesTypes.js";

// Concrete strategies
export { FallbackStrategy } from "./strategies/fallbackStrategy.js";
export { ParallelStrategy } from "./strategies/parallelStrategy.js";
export { RaceStrategy } from "./strategies/raceStrategy.js";

// Transport layer
export type { JsonRpcTransport } from "./JsonRpcTransport.js";
export { createTransport } from "./JsonRpcTransport.js";
export { WebSocketRpcClient } from "./WebSocketRpcClient.js";
export { RpcClient } from "./RpcClient.js";
export type { JsonRpcNotification } from "./RpcClientTypes.js";
