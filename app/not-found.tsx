import { useTranslations } from "next-intl";
import Link from "next/link";

export default function NotFound() {
  const t = useTranslations("not_found");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-primary">404</h1>
        </div>

        <h2 className="mb-2 text-2xl font-bold tracking-tight">{t("title")}</h2>

        <p className="mb-6 text-muted-foreground">{t("description")}</p>

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {t("go_home")}
        </Link>
      </div>
    </div>
  );
}
