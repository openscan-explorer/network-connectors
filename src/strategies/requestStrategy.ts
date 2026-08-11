import type { RequestStrategy } from "./strategiesTypes.js";
import { FallbackStrategy } from "./fallbackStrategy.js";
import { ParallelStrategy } from "./parallelStrategy.js";
import { RaceStrategy } from "./raceStrategy.js";
import { createTransport, type RpcEndpoint } from "../JsonRpcTransport.js";

export type { RpcEndpoint };

export interface StrategyConfig {
  type: "fallback" | "parallel" | "race";
  /** RPC endpoints — plain URL strings, or objects carrying per-endpoint headers */
  rpcUrls: (string | RpcEndpoint)[];
}

export class StrategyFactory {
  /**
   * Create a request strategy with multiple RPC clients
   * @param config - Strategy configuration with type and RPC URLs
   * @returns Configured request strategy
   */
  static create(config: StrategyConfig): RequestStrategy {
    if (!config.rpcUrls || config.rpcUrls.length === 0) {
      throw new Error("At least one RPC URL must be provided");
    }

    // Create transports for each endpoint (auto-detects HTTP vs WebSocket from scheme)
    const rpcClients = config.rpcUrls.map((endpoint) => createTransport(endpoint));

    switch (config.type) {
      case "fallback":
        return new FallbackStrategy(rpcClients);
      case "parallel":
        return new ParallelStrategy(rpcClients);
      case "race":
        return new RaceStrategy(rpcClients);
      default:
        throw new Error(`Unknown strategy type: ${config.type}`);
    }
  }
}
