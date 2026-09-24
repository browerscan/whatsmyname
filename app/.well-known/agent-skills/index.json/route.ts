import { createHash } from "node:crypto";

import { buildAgentSkill, buildAgentSkillsIndex } from "@/lib/agent/documents";
import { jsonResponse } from "@/lib/agent/site";

export function GET() {
  const digest = createHash("sha256").update(buildAgentSkill()).digest("hex");
  return jsonResponse(buildAgentSkillsIndex(digest));
}
