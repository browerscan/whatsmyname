import { getLocale } from "next-intl/server";
import { FAQPageJsonLd } from "@/components/seo/schema-org";
import { getHomeFaq } from "@/content/faq";

export async function HomeFaq() {
  const faq = getHomeFaq(await getLocale());

  return (
    <div className="container mx-auto px-4 pb-12 max-w-4xl">
      <FAQPageJsonLd questions={faq.entries} />
      <section aria-labelledby="home-faq-title">
        <h2 id="home-faq-title" className="text-2xl font-bold mb-4">
          {faq.title}
        </h2>
        {faq.entries.map((entry) => (
          <div key={entry.question} className="mb-8">
            <h3 className="text-xl font-semibold mb-3">{entry.question}</h3>
            <p className="text-muted-foreground">{entry.answer}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
