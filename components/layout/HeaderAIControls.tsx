"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIStore } from "@/stores";

interface HeaderAIControlsProps {
  className?: string;
  iconOnly?: boolean;
  label: string;
}

export function HeaderAIControls({
  className,
  iconOnly = false,
  label,
}: HeaderAIControlsProps) {
  const openDialog = useAIStore((state) => state.openDialog);

  return (
    <Button
      aria-label={label}
      className={iconOnly ? className : `gap-2 text-muted-foreground hover:bg-accent/50 hover:text-primary ${className ?? ""}`.trim()}
      onClick={openDialog}
      size={iconOnly ? "icon" : "sm"}
      variant="ghost"
    >
      <MessageCircle className="h-4 w-4" />
      {!iconOnly && <span className="text-sm font-medium">{label}</span>}
    </Button>
  );
}
