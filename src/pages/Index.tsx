import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import WhyChoose from "@/components/WhyChoose";
import VideoShowcase from "@/components/VideoShowcase";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <WhyChoose />
        <VideoShowcase />
      </main>
    </div>
  );
};

export default Index;
