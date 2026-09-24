import { buildAiCatalog } from "@/lib/agent/documents";
import { jsonResponse } from "@/lib/agent/site";

export function GET() {
  return jsonResponse(buildAiCatalog());
}
