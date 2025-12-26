"use client";

import { useState } from "react";
import { Download, Check, FileJson, FileSpreadsheet, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  results: SearchResult[];
  username: string;
  disabled?: boolean;
}

type ExportFormat = "csv" | "json" | "clipboard";

export function ExportButton({
  results,
  username,
  disabled = false,
}: ExportButtonProps) {
  const t = useTranslations("export");
  const [copied, setCopied] = useState(false);

  // Filter results to only include found ones for export
  const foundResults = results.filter((r) => r.checkResult.isExist);

  const generateFilename = (extension: string) => {
    const date = new Date().toISOString().split("T")[0];
    return `whatsmyname-${username}-${date}.${extension}`;
  };

  const generateCSV = (): string => {
    const headers = [
      "Platform",
      "Username",
      "URL",
      "Category",
      "Tags",
      "Response Time (ms)",
    ];
    const rows = foundResults.map((result) => [
      result.source,
      result.username,
      result.url,
      result.category,
      (result.tags || []).join(", "),
      result.checkResult.responseTime.toString(),
    ]);

    // Combine headers and rows with proper CSV escaping
    const escapeCSV = (text: string): string => {
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    // Add BOM for Excel compatibility
    return "\uFEFF" + csvContent;
  };

  const generateJSON = (): string => {
    const exportData = {
      username,
      exportedAt: new Date().toISOString(),
      totalResults: foundResults.length,
      results: foundResults.map((result) => ({
        platform: result.source,
        username: result.username,
        url: result.url,
        category: result.category,
        tags: result.tags || [],
        isNSFW: result.isNSFW,
        responseTime: result.checkResult.responseTime,
        status: result.checkResult.status,
        checkType: result.checkResult.checkType,
      })),
    };

    return JSON.stringify(exportData, null, 2);
  };

  const generateTextSummary = (): string => {
    const lines = [
      `Username Search Results for: ${username}`,
      `Exported: ${new Date().toLocaleString()}`,
      `Total Found: ${foundResults.length} platform(s)`,
      "",
    ];

    foundResults.forEach((result, index) => {
      lines.push(`${index + 1}. ${result.source}`);
      lines.push(`   URL: ${result.url}`);
      lines.push(`   Category: ${result.category}`);
      lines.push(`   Tags: ${(result.tags || []).join(", ") || "N/A"}`);
      lines.push("");
    });

    return lines.join("\n");
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const exportToCSV = () => {
    const csv = generateCSV();
    downloadFile(csv, generateFilename("csv"), "text/csv;charset=utf-8");
  };

  const exportToJSON = () => {
    const json = generateJSON();
    downloadFile(json, generateFilename("json"), "application/json");
  };

  const copyToClipboard = async () => {
    try {
      const text = generateTextSummary();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const isDisabled = disabled || foundResults.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={isDisabled}
          className="gap-2"
          aria-label={t("aria_label")}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{t("export")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-sm text-muted-foreground">
          {t("results_count", { count: foundResults.length })}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          <span>{t("format_csv")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="cursor-pointer">
          <FileJson className="h-4 w-4 mr-2" />
          <span>{t("format_json")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          <span>{copied ? t("copied") : t("format_clipboard")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Also export a simple function for programmatic export
export function exportResults(
  results: SearchResult[],
  username: string,
  format: ExportFormat,
): void {
  const foundResults = results.filter((r) => r.checkResult.isExist);

  const generateCSV = () => {
    const headers = [
      "Platform",
      "Username",
      "URL",
      "Category",
      "Tags",
      "Response Time (ms)",
    ];
    const rows = foundResults.map((result) => [
      result.source,
      result.username,
      result.url,
      result.category,
      (result.tags || []).join(", "),
      result.checkResult.responseTime.toString(),
    ]);

    const escapeCSV = (text: string): string => {
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    return [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");
  };

  const generateJSON = () => {
    return JSON.stringify(
      {
        username,
        exportedAt: new Date().toISOString(),
        totalResults: foundResults.length,
        results: foundResults.map((result) => ({
          platform: result.source,
          username: result.username,
          url: result.url,
          category: result.category,
          tags: result.tags || [],
          isNSFW: result.isNSFW,
          responseTime: result.checkResult.responseTime,
        })),
      },
      null,
      2,
    );
  };

  const date = new Date().toISOString().split("T")[0];
  const filename = `whatsmyname-${username}-${date}`;

  switch (format) {
    case "csv":
      downloadFile(
        "\uFEFF" + generateCSV(),
        `${filename}.csv`,
        "text/csv;charset=utf-8",
      );
      break;
    case "json":
      downloadFile(generateJSON(), `${filename}.json`, "application/json");
      break;
    case "clipboard":
      navigator.clipboard.writeText(
        foundResults.map((r) => `${r.source}: ${r.url}`).join("\n"),
      );
      break;
  }
}

function downloadFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
