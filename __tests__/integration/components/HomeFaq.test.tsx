import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HomeFaq } from "@/components/features/HomeFaq";
import { getHomeFaq } from "@/content/faq";
import { locales } from "@/i18n/request";

const localeState = vi.hoisted(() => ({ current: "en" }));
vi.mock("next-intl/server", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next-intl/server")>()),
  getLocale: async () => localeState.current,
}));

describe("HomeFaq", () => {
  it.each([...locales])("publishes FAQPage JSON-LD that matches the visible questions in %s", async (locale) => {
    localeState.current = locale;
    const { container } = render(await HomeFaq());
    const faq = getHomeFaq(locale);

    expect(screen.getByRole("heading", { level: 2, name: faq.title })).toBeInTheDocument();
    const visible = screen.getAllByRole("heading", { level: 3 }).map((heading) => ({
      question: heading.textContent,
      answer: heading.nextElementSibling?.textContent,
    }));

    const script = container.querySelector('script[type="application/ld+json"]');
    const schema = JSON.parse(script?.textContent ?? "{}");
    expect(schema["@type"]).toBe("FAQPage");
    const published = schema.mainEntity.map((item: { name: string; acceptedAnswer: { text: string } }) => ({
      question: item.name,
      answer: item.acceptedAnswer.text,
    }));

    expect(published).toEqual(visible);
    expect(published).toEqual(faq.entries);
  });
});
