import { HomeClient } from "@/components/pages/HomeClient";
import { EducationalContent } from "@/components/features/EducationalContent";
import { HomeFaq } from "@/components/features/HomeFaq";
import { StructuredData } from "@/components/seo/StructuredData";

export default function Home() {
  return (
    <>
      <StructuredData />
      <HomeClient />
      <EducationalContent />
      <HomeFaq />
    </>
  );
}
