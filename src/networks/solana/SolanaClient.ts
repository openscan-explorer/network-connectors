/**
 * Solana RPC Client
 *
 * Provides typed methods for all Solana JSON-RPC API calls and WebSocket subscriptions.
 * Supports mainnet-beta, devnet, and testnet clusters.
 *
 * HTTP methods use the configured strategy (fallback, parallel, race) via this.execute().
 * Subscription methods use a lazily-created WebSocketRpcClient from the first wss:// URL in rpcUrls.
 * The subscription WebSocket is independent of the strategy — updateStrategy() does not affect it.
 *
 * @see https://solana.com/docs/rpc
 */

import { NetworkClient } from "../../NetworkClient.js";
import { WebSocketRpcClient } from "../../WebSocketRpcClient.js";
import type { StrategyConfig } from "../../strategies/requestStrategy.js";
import type { StrategyResult } from "../../strategies/strategiesTypes.js";
import type {
  Commitment,
  SolAccountInfo,
  SolAccountNotification,
  SolAccountSubscribeConfig,
  SolBlock,
  SolBlockCommitment,
  SolBlockNotification,
  SolBlockProduction,
  SolBlockSubscribeConfig,
  SolClusterNode,
  SolEpochInfo,
  SolEpochSchedule,
  SolGetAccountInfoConfig,
  SolGetBlockConfig,
  SolGetBlockProductionConfig,
  SolGetInflationRewardConfig,
  SolGetLargestAccountsConfig,
  SolGetLeaderScheduleConfig,
  SolGetProgramAccountsConfig,
  SolGetSignatureStatusesConfig,
  SolGetSignaturesConfig,
  SolGetSupplyConfig,
  SolGetTokenAccountsConfig,
  SolGetTransactionConfig,
  SolGetVoteAccountsConfig,
  SolHighestSnapshotSlot,
  SolInflationGovernor,
  SolInflationRate,
  SolInflationReward,
  SolKeyedAccount,
  SolLargestAccount,
  SolLatestBlockhash,
  SolLeaderSchedule,
  SolLogsNotification,
  SolLogsSubscribeConfig,
  SolPerfSample,
  SolPrioritizationFee,
  SolProgramNotification,
  SolProgramSubscribeConfig,
  SolRootNotification,
  SolRpcResponse,
  SolSendTransactionConfig,
  SolSignatureInfo,
  SolSignatureNotification,
  SolSignatureSubscribeConfig,
  SolSignatureStatus,
  SolSimulateTransactionConfig,
  SolSimulateTransactionResult,
  SolSlotNotification,
  SolSlotsUpdatesNotification,
  SolStakeActivation,
  SolSupply,
  SolTokenAccount,
  SolTokenAccountFilter,
  SolTokenAmount,
  SolTokenLargestAccount,
  SolTransaction,
  SolVersion,
  SolVoteAccount,
  SolVoteNotification,
} from "./SolanaTypes.js";

export class SolanaClient extends NetworkClient {
  private subscriptionWs: WebSocketRpcClient | null = null;
  private subscriptionWsUrl: string | null;

  constructor(config: StrategyConfig) {
    super(config);
    this.subscriptionWsUrl =
      config.rpcUrls
        .map((endpoint) => (typeof endpoint === "string" ? endpoint : endpoint.url))
        .find((url) => url.startsWith("wss://") || url.startsWith("ws://")) ?? null;
  }

  private getSubscriptionWs(): WebSocketRpcClient {
    if (!this.subscriptionWsUrl) {
      throw new Error("Solana subscriptions require at least one ws:// or wss:// URL in rpcUrls");
    }
    if (!this.subscriptionWs) {
      this.subscriptionWs = new WebSocketRpcClient(this.subscriptionWsUrl);
    }
    return this.subscriptionWs;
  }

  // ─── Account / State Methods ───

  /**
   * Returns all information associated with the account of provided Pubkey
   */
  async getAccountInfo(
    pubkey: string,
    config?: SolGetAccountInfoConfig,
  ): Promise<StrategyResult<SolRpcResponse<SolAccountInfo | null>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkey];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolAccountInfo | null>>("getAccountInfo", params);
  }

  /**
   * Returns the lamport balance of the account of provided Pubkey
   */
  async getBalance(
    pubkey: string,
    config?: { commitment?: Commitment; minContextSlot?: number },
  ): Promise<StrategyResult<SolRpcResponse<number>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkey];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<number>>("getBalance", params);
  }

  /**
   * Returns the account information for a list of Pubkeys
   */
  async getMultipleAccounts(
    pubkeys: string[],
    config?: SolGetAccountInfoConfig,
  ): Promise<StrategyResult<SolRpcResponse<(SolAccountInfo | null)[]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkeys];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<(SolAccountInfo | null)[]>>("getMultipleAccounts", params);
  }

  /**
   * Returns all accounts owned by the provided program Pubkey
   */
  async getProgramAccounts(
    programId: string,
    config?: SolGetProgramAccountsConfig,
  ): Promise<StrategyResult<SolKeyedAccount[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [programId];
    if (config) params.push(config);
    return this.execute<SolKeyedAccount[]>("getProgramAccounts", params);
  }

  /**
   * Returns the token balance of an SPL Token account
   */
  async getTokenAccountBalance(
    pubkey: string,
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<SolTokenAmount>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkey];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<SolTokenAmount>>("getTokenAccountBalance", params);
  }

  /**
   * Returns all SPL Token accounts by approved delegate
   */
  async getTokenAccountsByDelegate(
    delegate: string,
    filter: SolTokenAccountFilter,
    config?: SolGetTokenAccountsConfig,
  ): Promise<StrategyResult<SolRpcResponse<SolTokenAccount[]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [delegate, filter];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolTokenAccount[]>>("getTokenAccountsByDelegate", params);
  }

  /**
   * Returns all SPL Token accounts by token owner
   */
  async getTokenAccountsByOwner(
    owner: string,
    filter: SolTokenAccountFilter,
    config?: SolGetTokenAccountsConfig,
  ): Promise<StrategyResult<SolRpcResponse<SolTokenAccount[]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [owner, filter];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolTokenAccount[]>>("getTokenAccountsByOwner", params);
  }

  /**
   * Returns the 20 largest accounts of a particular SPL Token type
   */
  async getTokenLargestAccounts(
    mint: string,
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<SolTokenLargestAccount[]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [mint];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<SolTokenLargestAccount[]>>(
      "getTokenLargestAccounts",
      params,
    );
  }

  /**
   * Returns the total supply of an SPL Token type
   */
  async getTokenSupply(
    mint: string,
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<SolTokenAmount>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [mint];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<SolTokenAmount>>("getTokenSupply", params);
  }

  /**
   * Returns the 20 largest accounts, by lamport balance
   */
  async getLargestAccounts(
    config?: SolGetLargestAccountsConfig,
  ): Promise<StrategyResult<SolRpcResponse<SolLargestAccount[]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolLargestAccount[]>>("getLargestAccounts", params);
  }

  /**
   * Returns minimum balance required to make account rent exempt
   */
  async getMinimumBalanceForRentExemption(
    dataLength: number,
    commitment?: Commitment,
  ): Promise<StrategyResult<number>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [dataLength];
    if (commitment) params.push({ commitment });
    return this.execute<number>("getMinimumBalanceForRentExemption", params);
  }

  /**
   * Returns the stake minimum delegation, in lamports
   */
  async getStakeMinimumDelegation(
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<number>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<number>>("getStakeMinimumDelegation", params);
  }

  // ─── Block / Slot Methods ───

  /**
   * Returns identity and transaction information about a confirmed block
   */
  async getBlock(
    slot: number,
    config?: SolGetBlockConfig,
  ): Promise<StrategyResult<SolBlock | null>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [slot];
    if (config) params.push(config);
    return this.execute<SolBlock | null>("getBlock", params);
  }

  /**
   * Returns the current block height
   */
  async getBlockHeight(commitment?: Commitment): Promise<StrategyResult<number>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<number>("getBlockHeight", params);
  }

  /**
   * Returns recent block production information
   */
  async getBlockProduction(
    config?: SolGetBlockProductionConfig,
  ): Promise<StrategyResult<SolRpcResponse<SolBlockProduction>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolBlockProduction>>("getBlockProduction", params);
  }

  /**
   * Returns commitment for particular block
   */
  async getBlockCommitment(slot: number): Promise<StrategyResult<SolBlockCommitment>> {
    return this.execute<SolBlockCommitment>("getBlockCommitment", [slot]);
  }

  /**
   * Returns a list of confirmed blocks between two slots
   */
  async getBlocks(
    startSlot: number,
    endSlot?: number,
    commitment?: Commitment,
  ): Promise<StrategyResult<number[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [startSlot];
    if (endSlot !== undefined) params.push(endSlot);
    if (commitment) params.push({ commitment });
    return this.execute<number[]>("getBlocks", params);
  }

  /**
   * Returns a list of confirmed blocks starting at the given slot
   */
  async getBlocksWithLimit(
    startSlot: number,
    limit: number,
    commitment?: Commitment,
  ): Promise<StrategyResult<number[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [startSlot, limit];
    if (commitment) params.push({ commitment });
    return this.execute<number[]>("getBlocksWithLimit", params);
  }

  /**
   * Returns the estimated production time of a block
   */
  async getBlockTime(slot: number): Promise<StrategyResult<number | null>> {
    return this.execute<number | null>("getBlockTime", [slot]);
  }

  /**
   * Returns the current slot
   */
  async getSlot(commitment?: Commitment): Promise<StrategyResult<number>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<number>("getSlot", params);
  }

  /**
   * Returns the current slot leader
   */
  async getSlotLeader(commitment?: Commitment): Promise<StrategyResult<string>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<string>("getSlotLeader", params);
  }

  /**
   * Returns the slot leaders for a given slot range
   */
  async getSlotLeaders(startSlot: number, limit: number): Promise<StrategyResult<string[]>> {
    return this.execute<string[]>("getSlotLeaders", [startSlot, limit]);
  }

  // ─── Transaction Methods ───

  /**
   * Returns transaction details for a confirmed transaction
   */
  async getTransaction(
    signature: string,
    config?: SolGetTransactionConfig,
  ): Promise<StrategyResult<SolTransaction | null>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [signature];
    if (config) params.push(config);
    return this.execute<SolTransaction | null>("getTransaction", params);
  }

  /**
   * Returns confirmed signatures for transactions involving an address
   */
  async getSignaturesForAddress(
    address: string,
    config?: SolGetSignaturesConfig,
  ): Promise<StrategyResult<SolSignatureInfo[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [address];
    if (config) params.push(config);
    return this.execute<SolSignatureInfo[]>("getSignaturesForAddress", params);
  }

  /**
   * Returns the statuses of a list of signatures
   */
  async getSignatureStatuses(
    signatures: string[],
    config?: SolGetSignatureStatusesConfig,
  ): Promise<StrategyResult<SolRpcResponse<(SolSignatureStatus | null)[]>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [signatures];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<(SolSignatureStatus | null)[]>>(
      "getSignatureStatuses",
      params,
    );
  }

  /**
   * Submits a signed transaction to the cluster for processing
   */
  async sendTransaction(
    encodedTransaction: string,
    config?: SolSendTransactionConfig,
  ): Promise<StrategyResult<string>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [encodedTransaction];
    if (config) params.push(config);
    return this.execute<string>("sendTransaction", params);
  }

  /**
   * Simulate sending a transaction
   */
  async simulateTransaction(
    encodedTransaction: string,
    config?: SolSimulateTransactionConfig,
  ): Promise<StrategyResult<SolRpcResponse<SolSimulateTransactionResult>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [encodedTransaction];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolSimulateTransactionResult>>(
      "simulateTransaction",
      params,
    );
  }

  /**
   * Returns a list of prioritization fees from recent blocks
   */
  async getRecentPrioritizationFees(
    addresses?: string[],
  ): Promise<StrategyResult<SolPrioritizationFee[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (addresses) params.push(addresses);
    return this.execute<SolPrioritizationFee[]>("getRecentPrioritizationFees", params);
  }

  /**
   * Returns whether a blockhash is still valid
   */
  async isBlockhashValid(
    blockhash: string,
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<boolean>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [blockhash];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<boolean>>("isBlockhashValid", params);
  }

  /**
   * Returns a recent block hash and the associated fee schedule
   */
  async getLatestBlockhash(
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<SolLatestBlockhash>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<SolLatestBlockhash>>("getLatestBlockhash", params);
  }

  /**
   * Returns the fee the network will charge for a particular message
   */
  async getFeeForMessage(
    message: string,
    commitment?: Commitment,
  ): Promise<StrategyResult<SolRpcResponse<number | null>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [message];
    if (commitment) params.push({ commitment });
    return this.execute<SolRpcResponse<number | null>>("getFeeForMessage", params);
  }

  // ─── Cluster / Network Methods ───

  /**
   * Returns information about all the nodes participating in the cluster
   */
  async getClusterNodes(): Promise<StrategyResult<SolClusterNode[]>> {
    return this.execute<SolClusterNode[]>("getClusterNodes", []);
  }

  /**
   * Returns information about the current epoch
   */
  async getEpochInfo(commitment?: Commitment): Promise<StrategyResult<SolEpochInfo>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<SolEpochInfo>("getEpochInfo", params);
  }

  /**
   * Returns the epoch schedule information from this cluster's genesis config
   */
  async getEpochSchedule(): Promise<StrategyResult<SolEpochSchedule>> {
    return this.execute<SolEpochSchedule>("getEpochSchedule", []);
  }

  /**
   * Returns the genesis hash
   */
  async getGenesisHash(): Promise<StrategyResult<string>> {
    return this.execute<string>("getGenesisHash", []);
  }

  /**
   * Returns the current health of the node ("ok" if healthy)
   */
  async getHealth(): Promise<StrategyResult<string>> {
    return this.execute<string>("getHealth", []);
  }

  /**
   * Returns the highest slot information that the node has snapshots for
   */
  async getHighestSnapshotSlot(): Promise<StrategyResult<SolHighestSnapshotSlot>> {
    return this.execute<SolHighestSnapshotSlot>("getHighestSnapshotSlot", []);
  }

  /**
   * Returns the identity pubkey for the current node
   */
  async getIdentity(): Promise<StrategyResult<{ identity: string }>> {
    return this.execute<{ identity: string }>("getIdentity", []);
  }

  /**
   * Returns the current inflation governor
   */
  async getInflationGovernor(
    commitment?: Commitment,
  ): Promise<StrategyResult<SolInflationGovernor>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<SolInflationGovernor>("getInflationGovernor", params);
  }

  /**
   * Returns the specific inflation values for the current epoch
   */
  async getInflationRate(): Promise<StrategyResult<SolInflationRate>> {
    return this.execute<SolInflationRate>("getInflationRate", []);
  }

  /**
   * Returns the inflation / staking reward for a list of addresses for an epoch
   */
  async getInflationReward(
    addresses: string[],
    config?: SolGetInflationRewardConfig,
  ): Promise<StrategyResult<(SolInflationReward | null)[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [addresses];
    if (config) params.push(config);
    return this.execute<(SolInflationReward | null)[]>("getInflationReward", params);
  }

  /**
   * Returns the leader schedule for an epoch
   */
  async getLeaderSchedule(
    slot?: number | null,
    config?: SolGetLeaderScheduleConfig,
  ): Promise<StrategyResult<SolLeaderSchedule | null>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (slot !== undefined) params.push(slot);
    if (config) params.push(config);
    return this.execute<SolLeaderSchedule | null>("getLeaderSchedule", params);
  }

  /**
   * Returns the max slot seen from retransmit stage
   */
  async getMaxRetransmitSlot(): Promise<StrategyResult<number>> {
    return this.execute<number>("getMaxRetransmitSlot", []);
  }

  /**
   * Returns the max slot seen from after shred insert
   */
  async getMaxShredInsertSlot(): Promise<StrategyResult<number>> {
    return this.execute<number>("getMaxShredInsertSlot", []);
  }

  /**
   * Returns a list of recent performance samples
   */
  async getRecentPerformanceSamples(limit?: number): Promise<StrategyResult<SolPerfSample[]>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (limit !== undefined) params.push(limit);
    return this.execute<SolPerfSample[]>("getRecentPerformanceSamples", params);
  }

  /**
   * Returns information about the current supply
   */
  async getSupply(config?: SolGetSupplyConfig): Promise<StrategyResult<SolRpcResponse<SolSupply>>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (config) params.push(config);
    return this.execute<SolRpcResponse<SolSupply>>("getSupply", params);
  }

  /**
   * Returns the current transaction count
   */
  async getTransactionCount(commitment?: Commitment): Promise<StrategyResult<number>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (commitment) params.push({ commitment });
    return this.execute<number>("getTransactionCount", params);
  }

  /**
   * Returns the current Solana version running on the node
   */
  async getVersion(): Promise<StrategyResult<SolVersion>> {
    return this.execute<SolVersion>("getVersion", []);
  }

  /**
   * Returns the account info and associated stake for all the voting accounts
   */
  async getVoteAccounts(
    config?: SolGetVoteAccountsConfig,
  ): Promise<StrategyResult<{ current: SolVoteAccount[]; delinquent: SolVoteAccount[] }>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [];
    if (config) params.push(config);
    return this.execute<{ current: SolVoteAccount[]; delinquent: SolVoteAccount[] }>(
      "getVoteAccounts",
      params,
    );
  }

  /**
   * Returns epoch activation information for a stake account
   */
  async getStakeActivation(
    pubkey: string,
    config?: { commitment?: Commitment; epoch?: number; minContextSlot?: number },
  ): Promise<StrategyResult<SolStakeActivation>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkey];
    if (config) params.push(config);
    return this.execute<SolStakeActivation>("getStakeActivation", params);
  }

  /**
   * Returns the lowest slot that the node has information about in its ledger
   */
  async minimumLedgerSlot(): Promise<StrategyResult<number>> {
    return this.execute<number>("minimumLedgerSlot", []);
  }

  /**
   * Requests an airdrop of lamports to a Pubkey
   */
  async requestAirdrop(
    pubkey: string,
    lamports: number,
    commitment?: Commitment,
  ): Promise<StrategyResult<string>> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkey, lamports];
    if (commitment) params.push({ commitment });
    return this.execute<string>("requestAirdrop", params);
  }

  /**
   * Returns the first available block after a given slot
   */
  async getFirstAvailableBlock(): Promise<StrategyResult<number>> {
    return this.execute<number>("getFirstAvailableBlock", []);
  }

  // ─── Subscription Methods ───

  /**
   * Subscribe to an account to receive notifications when the lamports or data change
   */
  async accountSubscribe(
    pubkey: string,
    callback: (data: SolRpcResponse<SolAccountNotification>) => void,
    config?: SolAccountSubscribeConfig,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [pubkey];
    if (config) params.push(config);
    return this.getSubscriptionWs().subscribe<SolRpcResponse<SolAccountNotification>>(
      "accountSubscribe",
      "accountUnsubscribe",
      params,
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to a program to receive notifications when the lamports or data for an
   * account owned by the given program changes
   */
  async programSubscribe(
    programId: string,
    callback: (data: SolRpcResponse<SolProgramNotification>) => void,
    config?: SolProgramSubscribeConfig,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [programId];
    if (config) params.push(config);
    return this.getSubscriptionWs().subscribe<SolRpcResponse<SolProgramNotification>>(
      "programSubscribe",
      "programUnsubscribe",
      params,
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to transaction logging
   */
  async logsSubscribe(
    filter: "all" | "allWithVotes" | { mentions: string[] },
    callback: (data: SolRpcResponse<SolLogsNotification>) => void,
    config?: SolLogsSubscribeConfig,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [filter];
    if (config) params.push(config);
    return this.getSubscriptionWs().subscribe<SolRpcResponse<SolLogsNotification>>(
      "logsSubscribe",
      "logsUnsubscribe",
      params,
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to receive notification when a transaction with the given signature is confirmed
   */
  async signatureSubscribe(
    signature: string,
    callback: (data: SolRpcResponse<SolSignatureNotification>) => void,
    config?: SolSignatureSubscribeConfig,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [signature];
    if (config) params.push(config);
    return this.getSubscriptionWs().subscribe<SolRpcResponse<SolSignatureNotification>>(
      "signatureSubscribe",
      "signatureUnsubscribe",
      params,
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to receive notification anytime a slot is processed by the validator
   */
  async slotSubscribe(
    callback: (data: SolSlotNotification) => void,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    return this.getSubscriptionWs().subscribe<SolSlotNotification>(
      "slotSubscribe",
      "slotUnsubscribe",
      [],
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to receive a notification from the validator on a variety of updates on every slot
   */
  async slotsUpdatesSubscribe(
    callback: (data: SolSlotsUpdatesNotification) => void,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    return this.getSubscriptionWs().subscribe<SolSlotsUpdatesNotification>(
      "slotsUpdatesSubscribe",
      "slotsUpdatesUnsubscribe",
      [],
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to receive notification anytime a new root is set by the validator
   */
  async rootSubscribe(
    callback: (data: SolRootNotification) => void,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    return this.getSubscriptionWs().subscribe<SolRootNotification>(
      "rootSubscribe",
      "rootUnsubscribe",
      [],
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to receive notification anytime a new block is confirmed or finalized
   */
  async blockSubscribe(
    filter: "all" | { mentionsAccountOrProgram: string },
    callback: (data: SolRpcResponse<SolBlockNotification>) => void,
    config?: SolBlockSubscribeConfig,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    // biome-ignore lint/suspicious/noExplicitAny: params built conditionally
    const params: any[] = [filter];
    if (config) params.push(config);
    return this.getSubscriptionWs().subscribe<SolRpcResponse<SolBlockNotification>>(
      "blockSubscribe",
      "blockUnsubscribe",
      params,
      callback,
      errorHandler,
    );
  }

  /**
   * Subscribe to receive notification anytime a new vote is observed in gossip
   */
  async voteSubscribe(
    callback: (data: SolVoteNotification) => void,
    errorHandler?: (error: Error) => void,
  ): Promise<{ subscriptionId: number; unsubscribe: () => Promise<boolean> }> {
    return this.getSubscriptionWs().subscribe<SolVoteNotification>(
      "voteSubscribe",
      "voteUnsubscribe",
      [],
      callback,
      errorHandler,
    );
  }

  /**
   * Close underlying transports including the subscription WebSocket
   */
  async close(): Promise<void> {
    await super.close();
    if (this.subscriptionWs) {
      await this.subscriptionWs.close();
      this.subscriptionWs = null;
    }
  }
}
