import dotenvFlow from "dotenv-flow";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { RpcEndpoint } from "../../src/strategies/requestStrategy.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenvFlow.config({ path: resolve(__dirname, "../..") });

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const ALCHEMY_NETWORKS: Record<string, string> = {
  "eth-mainnet": "eth-mainnet",
  "opt-mainnet": "opt-mainnet",
  "bnb-mainnet": "bnb-mainnet",
  "bnb-testnet": "bnb-testnet",
  "matic-mainnet": "matic-mainnet",
  "base-mainnet": "base-mainnet",
  "arb-mainnet": "arb-mainnet",
  "avax-mainnet": "avax-mainnet",
  "eth-sepolia": "eth-sepolia",
  "bitcoin-mainnet": "bitcoin-mainnet",
  "solana-devnet": "solana-devnet",
};

export function getTestUrls(network: string, baseUrls: string[]): string[] {
  if (!ALCHEMY_API_KEY) return baseUrls;
  const subdomain = ALCHEMY_NETWORKS[network];
  if (!subdomain) return baseUrls;
  return [...baseUrls, `https://${subdomain}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`];
}

export function getTestWsUrls(network: string, baseUrls: string[]): string[] {
  if (!ALCHEMY_API_KEY) return baseUrls;
  const subdomain = ALCHEMY_NETWORKS[network];
  if (!subdomain) return baseUrls;
  return [...baseUrls, `wss://${subdomain}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`];
}

const TATUM_API_KEY = process.env.TATUM_API_KEY;

/**
 * Whether a Tatum API key is configured.
 *
 * Without one, the Tatum gateway serves anonymous traffic capped at 5 requests
 * per minute (shared across all its hosts), and whitelists only a subset of RPC
 * methods. Tests that would exceed that budget should be skipped when this is false.
 */
export const hasTatumApiKey = Boolean(TATUM_API_KEY);

/**
 * Attach the Tatum API key to a gateway URL, if one is configured.
 *
 * Tatum authenticates via the `x-api-key` header — a key embedded in the URL path
 * is silently ignored — so this returns an RpcEndpoint rather than a string when
 * a key is present. Headers are scoped per endpoint, so the key is never sent to
 * other providers in the same RPC URL list.
 */
export function withTatumKey(url: string): string | RpcEndpoint {
  if (!TATUM_API_KEY) return url;
  return { url, headers: { "x-api-key": TATUM_API_KEY } };
}

/**
 * Zcash RPC endpoints for tests.
 *
 * Defaults to the public Tatum gateways (the only free no-key Zcash JSON-RPC
 * available). Setting ZCASH_RPC_URL prepends a self-hosted zebrad or another
 * provider, which takes priority under the fallback strategy.
 */
export function getZcashTestEndpoints(baseUrls: string[]): (string | RpcEndpoint)[] {
  const endpoints = baseUrls.map(withTatumKey);
  const override = process.env.ZCASH_RPC_URL;
  return override ? [override, ...endpoints] : endpoints;
}

/**
 * Whether a non-Tatum Zcash node is configured, which lifts both the rate limit
 * and the gateway's method whitelist.
 */
export const hasZcashNodeUrl = Boolean(process.env.ZCASH_RPC_URL);
