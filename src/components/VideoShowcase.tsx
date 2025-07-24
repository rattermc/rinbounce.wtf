import { Button } from "@/components/ui/button";
import { Play, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const VideoShowcase = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              Featured
            </span>{" "}
            Showcase
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the power of RinBounce through our featured demonstration video.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="group relative">
            <div className="card-gaming overflow-hidden">
              <div className="relative aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/WjGC_pkmSDc"
                  title="RinBounce Featured Video"
                  className="w-full h-full rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                {/* External link icon */}
                <div className="absolute top-4 right-4">
                  <a 
                    href="https://www.youtube.com/watch?v=WjGC_pkmSDc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-background/80 backdrop-blur-sm rounded-lg p-2 border border-border hover:bg-background/90 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-foreground" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button variant="outline-gaming" size="lg" asChild>
            <Link to="/showcase">
              View More Content
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;