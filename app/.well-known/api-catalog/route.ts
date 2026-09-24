import { buildApiCatalog } from "@/lib/agent/documents";
import { jsonResponse } from "@/lib/agent/site";

// RFC 9727 API catalog.
export function GET() {
  return jsonResponse(
    buildApiCatalog(),
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
  );
}
