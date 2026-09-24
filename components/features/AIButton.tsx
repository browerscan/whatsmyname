"use client";

import { Sparkles } from "lucide-react";
import { useAIStore } from "@/stores";
import { useTranslations } from "next-intl";

interface AIButtonProps {
  disabled?: boolean;
}

export function AIButton({ disabled = false }: AIButtonProps) {
  const openDialog = useAIStore((state) => state.openDialog);
  const t = useTranslations("ai");

  return (
    <button
      onClick={() => {
        openDialog();
      }}
      disabled={disabled}
      aria-label={t("open_aria")}
      className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-custom-lg ring-4 ring-primary/15 transition hover:scale-105 hover:shadow-glow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
      }}
    >
      <Sparkles className="h-6 w-6" />
    </button>
  );
}
