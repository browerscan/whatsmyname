"use client";

import { useState, useCallback } from "react";
import {
  Share2,
  Check,
  Link as LinkIcon,
  Twitter,
  Facebook,
  Mail,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Constants for share dialog
const SHARE_DIALOG_WIDTH = 550;
const SHARE_DIALOG_HEIGHT = 420;
const SHARE_DIALOG_FEATURES = `width=${SHARE_DIALOG_WIDTH},height=${SHARE_DIALOG_HEIGHT}`;

// Constants for URL parameters
const URL_PARAM_USER = "user";

interface ShareButtonProps {
  username: string;
  foundCount?: number;
  disabled?: boolean;
}

export function ShareButton({
  username,
  foundCount,
  disabled = false,
}: ShareButtonProps) {
  const t = useTranslations("share");
  const [copied, setCopied] = useState(false);

  // Generate the shareable URL
  const getShareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    params.set(URL_PARAM_USER, encodeURIComponent(username));
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [username]);

  // Generate share text
  const getShareText = useCallback(() => {
    return foundCount !== undefined
      ? t("text_with_results", { username, count: foundCount })
      : t("text_basic", { username });
  }, [username, foundCount, t]);

  // Share handlers
  const shareToTwitter = () => {
    const url = getShareUrl();
    const text = getShareText();
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, "_blank", SHARE_DIALOG_FEATURES);
  };

  const shareToFacebook = () => {
    const url = getShareUrl();
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank", SHARE_DIALOG_FEATURES);
  };

  const shareToLinkedIn = () => {
    const url = getShareUrl();
    const text = getShareText();
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    window.open(linkedInUrl, "_blank", SHARE_DIALOG_FEATURES);
  };

  const shareViaEmail = () => {
    const url = getShareUrl();
    const subject = t("email_subject", { username });
    const body = t("email_body", { username, url });
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const copyToClipboard = async () => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  // Native Web Share API (works on mobile devices)
  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: t("title", { username }),
          text: getShareText(),
          url: getShareUrl(),
        });
      } catch (error) {
        // User cancelled or error occurred
        console.error("Native share failed:", error);
      }
    } else {
      // Fallback to clipboard
      copyToClipboard();
    }
  };

  // Check if native share is supported
  const supportsNativeShare =
    typeof navigator !== "undefined" && "share" in navigator;

  // Mobile users get native share, desktop get dropdown
  if (supportsNativeShare) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={nativeShare}
        disabled={disabled}
        className="gap-2"
        aria-label={t("aria_label")}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">{t("share")}</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className="gap-2"
          aria-label={t("aria_label")}
        >
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t("share")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareToTwitter} className="cursor-pointer">
          <Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" />
          <span>{t("twitter")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToFacebook} className="cursor-pointer">
          <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
          <span>{t("facebook")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareToLinkedIn} className="cursor-pointer">
          <svg
            className="h-4 w-4 mr-2 text-[#0A66C2]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          <span>{t("linkedin")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
          <Mail className="h-4 w-4 mr-2" />
          <span>{t("via_email")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <Check className="h-4 w-4 mr-2 text-green-500" />
          ) : (
            <LinkIcon className="h-4 w-4 mr-2" />
          )}
          <span>{copied ? t("copied") : t("copy_link")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper to read shared user from URL
export function getSharedUserFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  return params.get(URL_PARAM_USER);
}

// Helper to update URL without triggering navigation
export function updateUrlWithUser(username: string): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.set(URL_PARAM_USER, username);
  window.history.replaceState({}, "", url.toString());
}

// Helper to clear user from URL
export function clearUserFromUrl(): void {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  url.searchParams.delete(URL_PARAM_USER);
  window.history.replaceState({}, "", url.toString());
}
