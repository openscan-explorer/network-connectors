import { describe, it } from "node:test";
import assert from "node:assert";
import { createTransport } from "../../src/JsonRpcTransport.js";
import { RpcClient } from "../../src/RpcClient.js";
import { WebSocketRpcClient } from "../../src/WebSocketRpcClient.js";
import { NetworkClient } from "../../src/NetworkClient.js";
import type { RpcEndpoint, StrategyConfig } from "../../src/strategies/requestStrategy.js";

const HTTP_URL = "https://ethereum.publicnode.com";
const WS_URL = "wss://ethereum.publicnode.com";

describe("RpcEndpoint - createTransport accepts strings and endpoint objects [strong]", () => {
  it("should create an RpcClient from a plain URL string", () => {
    const transport = createTransport(HTTP_URL);

    assert.ok(transport instanceof RpcClient, "Should create RpcClient");
    assert.strictEqual(transport.getUrl(), HTTP_URL, "Should preserve the URL");
  });

  it("should create an RpcClient from an endpoint object", () => {
    const transport = createTransport({ url: HTTP_URL, headers: { "x-api-key": "test-key" } });

    assert.ok(transport instanceof RpcClient, "Should create RpcClient");
    assert.strictEqual(transport.getUrl(), HTTP_URL, "Should unwrap the URL from the object");
  });

  it("should create an RpcClient from an endpoint object without headers", () => {
    const transport = createTransport({ url: HTTP_URL });

    assert.ok(transport instanceof RpcClient, "Should create RpcClient");
    assert.strictEqual(transport.getUrl(), HTTP_URL, "Should unwrap the URL");
  });

  it("should still detect WebSocket transport from an endpoint object", () => {
    const transport = createTransport({ url: WS_URL });

    assert.ok(
      transport instanceof WebSocketRpcClient,
      "Should create WebSocketRpcClient for a wss endpoint object",
    );
    assert.strictEqual(transport.getUrl(), WS_URL, "Should unwrap the URL");
  });
});

describe("RpcEndpoint - NetworkClient URL normalization [strong]", () => {
  it("should return plain strings from getRpcUrls for mixed input", () => {
    const config: StrategyConfig = {
      type: "fallback",
      rpcUrls: [HTTP_URL, { url: "https://cloudflare-eth.com", headers: { "x-api-key": "k" } }],
    };
    const client = new NetworkClient(config);

    assert.deepStrictEqual(
      client.getRpcUrls(),
      [HTTP_URL, "https://cloudflare-eth.com"],
      "getRpcUrls should normalize endpoint objects to their URL",
    );
  });

  it("should never expose configured headers via getRpcUrls", () => {
    const config: StrategyConfig = {
      type: "fallback",
      rpcUrls: [{ url: HTTP_URL, headers: { "x-api-key": "super-secret" } }],
    };
    const client = new NetworkClient(config);

    for (const url of client.getRpcUrls()) {
      assert.strictEqual(typeof url, "string", "Each entry should be a string");
      assert.ok(!url.includes("super-secret"), "Header values must not leak into getRpcUrls");
    }
  });

  it("should preserve endpoint objects via getRpcEndpoints", () => {
    const endpoint: RpcEndpoint = { url: HTTP_URL, headers: { "x-api-key": "k" } };
    const client = new NetworkClient({ type: "fallback", rpcUrls: [endpoint] });

    assert.deepStrictEqual(
      client.getRpcEndpoints(),
      [endpoint],
      "getRpcEndpoints should return the configured endpoints unchanged",
    );
  });

  it("should preserve endpoint headers across updateStrategy", () => {
    const endpoint: RpcEndpoint = { url: HTTP_URL, headers: { "x-api-key": "k" } };
    const client = new NetworkClient({ type: "fallback", rpcUrls: [endpoint] });

    client.updateStrategy("parallel");

    assert.strictEqual(client.getStrategyName(), "parallel", "Strategy should have switched");
    assert.deepStrictEqual(
      client.getRpcEndpoints(),
      [endpoint],
      "Endpoint headers should survive a strategy swap",
    );
  });
});

describe("RpcEndpoint - headers are actually transmitted [strong]", () => {
  // Tatum rejects a bad API key with HTTP 401 but serves anonymous requests, so the
  // two outcomes distinguish "header sent" from "header dropped" against a real server.
  const TATUM_URL = "https://zcash-mainnet-zebrad.gateway.tatum.io";

  it("should send configured headers on the request", async () => {
    const client = new RpcClient(TATUM_URL, { "x-api-key": "definitely-not-a-valid-key" });

    await assert.rejects(
      () => client.call<number>("getblockcount"),
      /401/,
      "An invalid x-api-key should be rejected, proving the header reached the server",
    );
  });

  it("should not send an auth header when none is configured", async () => {
    const client = new RpcClient(TATUM_URL);
    const result = await client.call<number>("getblockcount");

    assert.strictEqual(typeof result, "number", "Anonymous access should still succeed");
    assert.ok(result > 0, "Block count should be positive");
  });
});
