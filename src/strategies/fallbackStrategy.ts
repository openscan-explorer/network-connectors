import type {
  RequestStrategy,
  StrategyResult,
  RPCProviderResponse,
  RPCMetadata,
} from "./strategiesTypes.js";
import type { RpcClient } from "../RpcClient.js";

export class FallbackStrategy implements RequestStrategy {
  private rpcClients: RpcClient[];
  constructor(rpcClients: RpcClient[]) {
    if (rpcClients.length === 0) {
      throw new Error("At least one RPC client must be provided");
    }
    this.rpcClients = rpcClients;
  }

  /**
   * Execute request with automatic fallback
   * Tries each RPC client sequentially until one succeeds
   * Returns metadata tracking all attempted providers
   */

  // biome-ignore lint/suspicious/noExplicitAny: <TODO>
  async execute<T>(method: string, params: any[]): Promise<StrategyResult<T>> {
    const timestamp = Date.now();
    const responses: RPCProviderResponse[] = [];

    // Try each RPC client in order
    for (const rpcClient of this.rpcClients) {
      const startTime = Date.now();
      try {
        const data = await rpcClient.call<T>(method, params);
        const responseTime = Date.now() - startTime;

        responses.push({
          url: rpcClient.getUrl(),
          status: "success",
          responseTime,
          data,
        });

        return {
          success: true,
          data,
          metadata: {
            strategy: "fallback",
            timestamp,
            responses,
            hasInconsistencies: false,
          },
        };
      } catch (error) {
        const responseTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : String(error);
        responses.push({
          url: rpcClient.getUrl(),
          status: "error",
          responseTime,
          error: errorMessage,
        });
        // Continue to next RPC client
      }
    }

    // All RPC clients failed - return errors with metadata
    const metadata: RPCMetadata = {
      strategy: "fallback",
      timestamp,
      responses,
      hasInconsistencies: false,
    };

    return {
      success: false,
      errors: responses,
      metadata,
    };
  }

  getName(): string {
    return "fallback";
  }
}
