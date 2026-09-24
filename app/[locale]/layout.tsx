import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ThemeProvider } from "@/components/providers";
import { Header, Footer } from "@/components/layout";
import { isSupportedLocale, locales } from "@/i18n/request";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  // Resolve shell copy before emitting header/main/footer siblings. Independent
  // async shell siblings can otherwise be streamed around the main boundary.
  const [messages, tAi, tApp, tTheme, tLanguage, tFooter, tPages] = await Promise.all([
    getMessages({ locale }),
    getTranslations({ locale, namespace: "ai" }),
    getTranslations({ locale, namespace: "common.app" }),
    getTranslations({ locale, namespace: "common.theme" }),
    getTranslations({ locale, namespace: "common.language" }),
    getTranslations({ locale, namespace: "footer" }),
    getTranslations({ locale, namespace: "pages" }),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <Header
          locale={locale}
          appName={tApp("name")}
          aiAssistantLabel={tAi("assistant_label")}
          themeLabel={tTheme("toggle_aria")}
          languageLabel={tLanguage("label")}
          localeOptions={locales.map((value) => ({ value, label: tLanguage(value) }))}
        />
      </ThemeProvider>
      <main id="main-content" className="flex-1">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </main>
      <Footer locale={locale} copy={{
        aboutTitle: tFooter("about_title"), aboutDescription: tFooter("about_description"),
        featuresTitle: tFooter("features_title"), usernameSearch: tFooter("features.username_search"),
        categories: tPages("categories_index.breadcrumb"), tools: tPages("tools.breadcrumb"),
        blog: tPages("blog_index.breadcrumb"), connectTitle: tFooter("connect_title"),
        copyright: tFooter("copyright", { year: new Date().getFullYear() }),
        legalTitle: tFooter("legal_title"), privacy: tFooter("privacy"), terms: tFooter("terms"),
      }} />
    </div>
  );
}
