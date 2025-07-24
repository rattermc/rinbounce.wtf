import { Shield, Users, Code } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Good Bypasses",
    description: "Bypasses most AntiCheat like Grim, Vulcan, Intave and more.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Active Community",
    description: "Join thousands of users in our supportive Discord community.",
    color: "from-purple-500 to-indigo-500"
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Transparent development with full source code available on GitHub.",
    color: "from-green-500 to-emerald-500"
  }
];

const WhyChoose = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              RinBounce
            </span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A Good LiquidFork for Vietnamese Server
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card-gaming hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 mb-6`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;