import { Button } from "@/components/ui/button";
import { Download, Play, Star } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="decorative-circle w-96 h-96 -top-48 -right-48"></div>
        <div className="decorative-circle w-64 h-64 -bottom-32 -left-32"></div>
        <div className="decorative-circle w-32 h-32 top-1/4 right-1/4 opacity-40"></div>
        <div className="decorative-circle w-48 h-48 bottom-1/4 right-1/3 opacity-30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-primary">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-sm font-medium">Best LiquidFork for Vietnamese Server</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Minecraft{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                  1.8.9
                </span>
                <br />
                Hack Client
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg">
                The most advanced and undetectable PvP client for Minecraft 1.8.9 
                with unique features and stylish visuals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="gaming" size="xl" asChild>
                <Link to="/download">
                  <Download className="w-5 h-5" />
                  Download Now
                </Link>
              </Button>
              
              <Button variant="outline-gaming" size="xl" asChild>
                <Link to="/showcase">
                  <Play className="w-5 h-5" />
                  Learn More
                </Link>
              </Button>
            </div>

          </div>

          {/* Hero Video */}
          <div className="relative">
            <div className="card-gaming overflow-hidden">
              <div className="relative aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/qHpD_O2DJG4?autoplay=1&mute=1&loop=1&playlist=qHpD_O2DJG4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
                  title="RinBounce Demo Video"
                  className="w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Floating UI elements */}
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium">Live Demo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;