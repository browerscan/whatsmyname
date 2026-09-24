import { buildLlmsTxt } from "@/lib/agent/documents";
import { textResponse } from "@/lib/agent/site";

export function GET() {
  return textResponse(buildLlmsTxt(), "text/plain; charset=utf-8");
}
