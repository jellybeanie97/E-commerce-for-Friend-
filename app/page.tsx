import Hero from "@/components/homePageLogic/hero";
import ShowcaseStrip from "@/components/homePageLogic/showcaseStrip";
import ProductCards from "@/components/homePageLogic/productCards";
import AboutLumea from "@/components/homePageLogic/aboutLumea";

export default function HomePage() 
{
  return (
    <main>
      <Hero />
      <ShowcaseStrip />
      <ProductCards />
      <AboutLumea />
    </main>
  );
}