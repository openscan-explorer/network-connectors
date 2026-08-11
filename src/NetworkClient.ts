import type { RequestStrategy, StrategyResult } from "./strategies/strategiesTypes.js";
import { StrategyFactory, type StrategyConfig } from "./strategies/requestStrategy.js";
import type { RpcEndpoint } from "./JsonRpcTransport.js";

/**
 * Base network client that uses strategy pattern for RPC requests
 * Provides a foundation for network-specific implementations
 */
export class NetworkClient {
  protected strategy: RequestStrategy;
  protected rpcUrls: (string | RpcEndpoint)[];

  constructor(config: StrategyConfig) {
    this.strategy = StrategyFactory.create(config);
    this.rpcUrls = config.rpcUrls;
  }

  /**
   * Execute any RPC method with the configured strategy
   * @param method - The RPC method name (e.g., "eth_blockNumber")
   * @param params - The method parameters
   * @returns Strategy result with data and optional metadata
   */
  // biome-ignore lint/suspicious/noExplicitAny: <TODO>
  async execute<T>(method: string, params: any[] = []): Promise<StrategyResult<T>> {
    return this.strategy.execute<T>(method, params);
  }

  /**
   * Get the underlying strategy instance
   */
  getStrategy(): RequestStrategy {
    return this.strategy;
  }

  /**
   * Get the strategy name (fallback or parallel)
   */
  getStrategyName(): string {
    return this.strategy.getName();
  }

  /**
   * Get the RPC URLs
   *
   * Endpoints configured as objects are normalized to their URL, so this always
   * returns plain strings and never exposes configured headers.
   */
  getRpcUrls(): string[] {
    return this.rpcUrls.map((endpoint) => (typeof endpoint === "string" ? endpoint : endpoint.url));
  }

  /**
   * Get the configured endpoints as provided, preserving any per-endpoint headers
   */
  getRpcEndpoints(): (string | RpcEndpoint)[] {
    return this.rpcUrls;
  }

  /**
   * Update Strategy
   */
  updateStrategy(type: StrategyConfig["type"]) {
    // Fire-and-forget close on old strategy (no-op for HTTP, closes WebSocket connections)
    this.strategy.close?.();
    this.strategy = StrategyFactory.create({
      type,
      rpcUrls: this.rpcUrls,
    });
  }

  /**
   * Close underlying transports (e.g., WebSocket connections)
   * Should be called when the client is no longer needed
   */
  async close(): Promise<void> {
    await this.strategy.close?.();
  }
}
