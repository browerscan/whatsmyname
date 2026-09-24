import { buildLlmsTxt } from "@/lib/agent/documents";
import { AGENT_PATHS, getBaseUrl, textResponse } from "@/lib/agent/site";

// Singular spelling that agents and people also try; same file as /llms.txt.
export function GET() {
  const response = textResponse(buildLlmsTxt(), "text/plain; charset=utf-8");
  response.headers.set("Link", `<${getBaseUrl()}${AGENT_PATHS.llms}>; rel="canonical"`);
  return response;
}
