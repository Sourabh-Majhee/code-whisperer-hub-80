import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import codeEditorIcon from "@/assets/code-editor-icon.png";
import aiExplanationIcon from "@/assets/ai-explanation-icon.png";
import hackathonIcon from "@/assets/hackathon-icon.png";

const features = [
  {
    icon: codeEditorIcon,
    title: "Smart Code Editor",
    description: "VSCode-like editor with AI-powered explanations on every line. Write, run, and understand code in real-time.",
    features: ["Syntax highlighting", "Live execution", "Multi-language support", "Runtime traces"],
    link: "/editor",
    buttonText: "Try Editor",
    buttonVariant: "hero" as const,
  },
  {
    icon: aiExplanationIcon,
    title: "AI Explanations",
    description: "Get detailed explanations for every line of code with confidence scores and multiple difficulty levels.",
    features: ["Line-by-line breakdown", "Multiple languages", "Adaptive complexity", "Visual flow charts"],
    link: "/practice",
    buttonText: "Start Learning",
    buttonVariant: "success" as const,
  },
  {
    icon: hackathonIcon,
    title: "Hackathon Prep",
    description: "Prepare for competitions with project templates, team matching, and AI-generated pitch assistance.",
    features: ["Project templates", "Team finder", "Mock judging", "Pitch generator"],
    link: "/hackathon",
    buttonText: "Join Hackathons",
    buttonVariant: "practice" as const,
  },
];

export function Features() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Master Coding
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered explanations to hackathon preparation, 
            we've got every aspect of your coding journey covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover-lift group">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={feature.icon} 
                    alt={feature.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Feature List */}
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant={feature.buttonVariant} 
                  className="w-full group-hover:scale-105 transition-transform"
                  asChild
                >
                  <Link to={feature.link}>
                    {feature.buttonText}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Button variant="glass" size="lg" asChild>
            <Link to="/features">
              Explore All Features
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}