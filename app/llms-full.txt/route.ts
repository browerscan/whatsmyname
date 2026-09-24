import { buildLlmsFullTxt } from "@/lib/agent/documents";
import { textResponse } from "@/lib/agent/site";

export function GET() {
  return textResponse(buildLlmsFullTxt(), "text/plain; charset=utf-8");
}
