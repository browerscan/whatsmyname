import { HomeClient } from "@/components/pages/HomeClient";
import { EducationalContent } from "@/components/features/EducationalContent";
import { StructuredData } from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <HomeClient />
      <EducationalContent />
    </>
  );
}
