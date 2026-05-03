import { HeroSection } from "@/components/homepage/hero-section"
import { FeaturesSection } from "@/components/homepage/features-section"
import { CodeExample } from "@/components/homepage/code-example"
import { Footer } from "@/components/homepage/footer"
import { Geist, Geist_Mono } from 'next/font/google'
import { MotivationSection } from "@/components/homepage/motivation"


const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });


export default function HomePage() {
  return (
    <main className="absolute w-full min-h-screen bg-background">
      <HeroSection />
      <FeaturesSection />
      <CodeExample />
      <MotivationSection />
      <Footer />
    </main>
  );
}
