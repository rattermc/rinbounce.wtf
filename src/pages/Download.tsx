import { useState, useEffect } from "react";
import { Download as DownloadIcon, CheckCircle } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

interface Release {
  name: string;
  badge: string;
  badgeColor: string;
  description: string;
  size: string;
  downloadUrl: string;
  features: string[];
}

const SectionHeader = ({ title, gradientTitle, description }) => (
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold mb-4">
      {title}{" "}
      <span
        className="text-transparent bg-clip-text"
        style={{
          backgroundImage: "linear-gradient(to right, #DA5D63, #ec4899)", // #ec4899 = pink-500
        }}
      >
        {gradientTitle}
      </span>
    </h1>
    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
      {description}
    </p>
  </div>
);

const ReleaseCard = ({ release, isLoading, error }) => {
  if (isLoading) return <p className="text-center text-gray-400">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!release)
    return <p className="text-center text-gray-400">No release found.</p>;

  return (
    <div className="bg-#1C1B24 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h3 className="text-xl font-bold mb-2 sm:mb-0">{release.name}</h3>
        <span
          className={`${release.badgeColor} text-white px-3 py-1 rounded-full text-xs font-bold`}
        >
          {release.badge}
        </span>
      </div>

      <p className="text-gray-400 mb-6 flex-grow">{release.description}</p>

      <div className="space-y-3 mb-8">
        {release.features.map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        variant="gaming"
        size="lg"
        className="w-full flex items-center justify-center space-x-2 mt-auto"
        asChild
      >
        <a href={release.downloadUrl}>
          <DownloadIcon className="w-5 h-5" />
          <span>Download ({release.size})</span>
        </a>
      </Button>
    </div>
  );
};

const Download: React.FC = () => {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestRelease = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.github.com/repos/rattermc/RinBounce69/releases/latest"
        );
        if (!response.ok) throw new Error("Failed to fetch release");
        const data = await response.json();
        setRelease({
          name: data.name || "RinBounce Latest",
          badge: "Latest",
          badgeColor: "bg-blue-500",
          description: data.body || "Latest stable release of RinBounce.",
          size: " 1.8.9 ",
          downloadUrl: data.assets[0]?.browser_download_url || "#",
          features: data.body
            ? data.body
                .split("\n")
                .filter((line) => line.startsWith("- "))
                .map((line) => line.slice(2))
            : ["Latest features and improvements"],
        });
      } catch (err) {
        setError("Error fetching latest release. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLatestRelease();
  }, []);

  return (
    <div className="min-h-screen bg-#141219 text-white">
      <Navigation />

      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <section className="py-12">
          <SectionHeader
            title="Download"
            gradientTitle="RinBounce"
            description="Get the latest version of RinBounce for Minecraft 1.8.9."
          />
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6"></h2>
            <ReleaseCard release={release} isLoading={loading} error={error} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Download;