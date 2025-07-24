import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Play, Eye, Crosshair, Shield, Zap, Settings } from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "KillAura",
    description: "Advanced combat assistance with customizable reach and targeting.",
    demo: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  {
    icon: Eye,
    title: "ESP & Tracers",
    description: "See players through walls with multiple rendering modes.",
    demo: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  {
    icon: Zap,
    title: "Velocity",
    description: "Reduce or eliminate knockback from other players.",
    demo: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  {
    icon: Shield,
    title: "AutoArmor",
    description: "Automatically equip the best armor from your inventory.",
    demo: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  {
    icon: Settings,
    title: "AutoClicker",
    description: "Consistent clicking with randomization to avoid detection.",
    demo: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  },
  {
    icon: Eye,
    title: "Freecam",
    description: "Fly around and explore the world while your player stays in place.",
    demo: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
  }
];

const videos = [
  {
    title: "RinBounce Main Showcase",
    videoId: "9hbP2KqGtWQ",
    duration: "5:42"
  }
];

const Showcase = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                Showcase
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore the powerful features that make RinBounce the best Minecraft PvP client. 
              Watch demonstrations and see why thousands choose RinBounce.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="card-gaming group hover:scale-105 transition-transform duration-300">
                    <div className="relative aspect-video mb-4 overflow-hidden rounded-xl">
                      <img
                        src={feature.demo}
                        alt={feature.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <Button variant="gaming" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Video Gallery */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Video</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="card-gaming overflow-hidden">
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videos[0].videoId}`}
                    title={videos[0].title}
                    className="w-full h-full rounded-2xl"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>

                  {/* Video info overlay */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                    <span className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {videos[0].duration}
                    </span>
                    <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-lg text-sm font-bold">
                      4K
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{videos[0].title}</h3>
                  <p className="text-muted-foreground">
                    Watch the comprehensive showcase of RinBounce features and capabilities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card-gaming">
              <h2 className="text-3xl font-bold mb-4">Ready to Dominate?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of players who have improved their PvP game with RinBounce.
              </p>
              <Button variant="gaming" size="xl">
                Download Now
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Showcase;