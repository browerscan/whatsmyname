"use client";

import { Sparkles } from "lucide-react";
import { useAIStore } from "@/stores";
import { useTranslations } from "next-intl";

interface AIButtonProps {
  disabled?: boolean;
}

export function AIButton({ disabled = false }: AIButtonProps) {
  const { isOpen, openDialog } = useAIStore();
  const t = useTranslations("ai");

  return (
    <button
      onClick={() => {
        openDialog();
      }}
      disabled={disabled}
      aria-label={t("open_aria")}
      className={`fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isOpen ? "animate-none" : "animate-pulse"}`}
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
