import Navigation from "@/components/Navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Is RinBounce safe to use?",
    answer: "Yes, RinBounce uses advanced anti-detection methods to minimize the risk of bans. However, no client can guarantee 100% safety. Always use responsibly and be aware of server rules."
  },
  {
    question: "Which Minecraft version does RinBounce support?",
    answer: "RinBounce is specifically designed for Minecraft 1.8.9, the most popular version for PvP. We focus on this version to provide the best possible experience."
  },
  {
    question: "How do I install RinBounce?",
    answer: "1. Download Minecraft 1.8.9 and Forge\n2. Download RinBounce from our official website\n3. Place the .jar file in your mods folder\n4. Launch Minecraft with Forge profile\n5. Press RShift to open the client menu"
  },
  {
    question: "Can I get banned for using RinBounce?",
    answer: "While RinBounce has strong anti-detection features, there's always a risk when using any client. We recommend using it responsibly and avoiding obvious cheating behaviors."
  },
  {
    question: "Is RinBounce free?",
    answer: "Yes, RinBounce is completely free to download and use. We believe in making quality PvP tools accessible to everyone."
  },
  {
    question: "How do I open the client menu?",
    answer: "Press RShift (Right Shift) key to open the RinBounce client menu. From there you can configure all modules and settings."
  },
  {
    question: "Does RinBounce work on servers like Hypixel?",
    answer: "RinBounce is designed to work on most servers, but some features may be disabled on certain servers with strict anti-cheat. Always check server rules before using."
  },
  {
    question: "Can I use RinBounce with other mods?",
    answer: "Yes, RinBounce is compatible with most other mods. However, we recommend testing in single-player first to ensure compatibility."
  },
  {
    question: "How often is RinBounce updated?",
    answer: "We regularly update RinBounce to add new features, fix bugs, and maintain compatibility with server anti-cheats. Check our Discord for update announcements."
  },
  {
    question: "Where can I get support?",
    answer: "Join our Discord community for support, updates, and to connect with other users. You can also check our GitHub repository for technical issues."
  },
  {
    question: "What makes RinBounce different from other clients?",
    answer: "RinBounce focuses on being undetectable while maintaining high performance. Our code is optimized, regularly updated, and we have an active community of developers."
  },
  {
    question: "Can I contribute to RinBounce development?",
    answer: "Yes! RinBounce is open source. You can contribute code, report bugs, or suggest features on our GitHub repository."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Frequently Asked{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
                Questions
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about RinBounce. Can't find what you're looking for? 
              Join our Discord community for more help.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-gaming">
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="text-left font-semibold hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="card-gaming">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-muted-foreground mb-8">
                Join our active Discord community where you can get help from other users and developers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-gaming">
                  Join Discord
                </button>
                <a 
                  href="https://github.com/rattermc/RinBounce69" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-outline-gaming"
                >
                  View GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FAQ;