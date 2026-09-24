import { buildAgentSkill } from "@/lib/agent/documents";
import { textResponse } from "@/lib/agent/site";

export function GET() {
  return textResponse(buildAgentSkill(), "text/markdown; charset=utf-8");
}
