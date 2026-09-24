"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function CopyLinkButton({ url }: { url: string }) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setManualCopy(false);
    } catch {
      setCopied(false);
      setManualCopy(true);
    }
  }

  return (
    <div>
      <button type="button" onClick={copy} className="px-4 py-2 rounded-lg bg-muted border border-border/30 hover:bg-muted/70 transition-colors text-sm font-medium">
        {copied ? t("copied") : t("copy_link")}
      </button>
      {manualCopy && (
        <input aria-label={t("copy_link")} readOnly value={url} onFocus={(event) => event.currentTarget.select()} className="mt-2 block w-full rounded border p-2 bg-background text-sm" />
      )}
    </div>
  );
}
