// Base client
export { NetworkClient } from "./NetworkClient";

// Ethereum (Chain ID: 1)
export { EthereumClient } from "./networks/1/EthereumClient";
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
} from "./networks/1/EthereumTypes";

// Optimism (Chain ID: 10)
export { OptimismClient } from "./networks/10/OptimismClient";
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
} from "./networks/10/OptimismTypes";

// BNB Smart Chain (Chain ID: 56)
export { BNBClient } from "./networks/56/BNBClient";
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
} from "./networks/56/BNBTypes";

// Polygon (Chain ID: 137)
export { PolygonClient } from "./networks/137/PolygonClient";
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
} from "./networks/137/PolygonTypes";

// Base (Chain ID: 8453)
export { BaseClient } from "./networks/8453/BaseClient";
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
} from "./networks/8453/BaseTypes";

// Arbitrum (Chain ID: 42161)
export { ArbitrumClient } from "./networks/42161/ArbitrumClient";
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
} from "./networks/42161/ArbitrumTypes";

// Aztec (Chain ID: 677868)
export { AztecClient } from "./networks/677868/AztecClient";
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
} from "./networks/677868/AztecTypes";

// Client Factory (Chain ID-based instantiation)
export { ClientFactory } from "./factory/ClientRegistry";
export type { SupportedChainId, ClientConstructor, ChainIdToClient } from "./factory/ClientRegistry";

// Strategy types and factory
export { StrategyFactory } from "./strategies/requestStrategy";
export type { StrategyConfig } from "./strategies/requestStrategy";
export type {
  RequestStrategy,
  StrategyResult,
  RPCMetadata,
  RPCProviderResponse,
} from "./strategies/strategiesTypes";

// Concrete strategies
export { FallbackStrategy } from "./strategies/fallbackStrategy";
export { ParallelStrategy } from "./strategies/parallelStrategy";

// Legacy RPC client (for backwards compatibility)
export { RpcClient } from "./RpcClient";
