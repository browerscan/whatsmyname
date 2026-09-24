import { handleMcpMessage } from "@/lib/agent/mcp";

// Stateless MCP Streamable HTTP endpoint: POST JSON-RPC in, JSON out. No
// sessions and no server-initiated streams, so GET is not offered.
const MAX_BODY_LENGTH = 64 * 1024;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "content-type, accept, mcp-protocol-version, mcp-session-id",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_LENGTH) {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Request too large" } }, 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, 400);
  }

  if (Array.isArray(payload)) {
    const responses = payload.map(handleMcpMessage).filter((response) => response !== null);
    return responses.length > 0 ? json(responses) : new Response(null, { status: 202, headers: CORS_HEADERS });
  }

  const response = handleMcpMessage(payload);
  return response ? json(response) : new Response(null, { status: 202, headers: CORS_HEADERS });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export function GET() {
  return new Response("Method Not Allowed\n", {
    status: 405,
    headers: { ...CORS_HEADERS, Allow: "POST, OPTIONS", "Content-Type": "text/plain; charset=utf-8" },
  });
}
