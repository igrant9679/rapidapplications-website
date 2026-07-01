/* Federal Modernism Design: Features page highlighting platform capabilities */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Workflow, 
  Shield, 
  BarChart3, 
  Users, 
  Headphones, 
  Mail,
  Lock,
  Zap,
  FileText,
  DollarSign,
  CheckCircle2,
  Globe
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Features() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-20 md:py-32">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                <span>POWERFUL FEATURES</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Everything You Need in One Platform
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Stop paying for multiple systems. CommunityForce delivers comprehensive awards management, CRM, support, and campaign tools in a single, integrated platform.
              </p>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Core Awards Lifecycle Features
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Manage every stage of your awards program with powerful, AI-enabled tools.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="h-6 w-6" />,
                  title: "Pre-Award Management",
                  description: "Design programs, collect applications, and screen eligibility with our powerful Process Builder and form creation tools."
                },
                {
                  icon: <Workflow className="h-6 w-6" />,
                  title: "Award Management",
                  description: "Multi-stage reviews, committee collaboration, scoring rubrics, and automated decision workflows."
                },
                {
                  icon: <CheckCircle2 className="h-6 w-6" />,
                  title: "Post-Award Management",
                  description: "Ongoing monitoring, milestone tracking, progress reporting, and award closeout procedures."
                },
                {
                  icon: <DollarSign className="h-6 w-6" />,
                  title: "Financial Management",
                  description: "Budget approval, payment processing, disbursement tracking, and integration with QuickBooks, Peachtree, and bill.com."
                },
                {
                  icon: <Shield className="h-6 w-6" />,
                  title: "Compliance & Reporting",
                  description: "Regulatory compliance tracking, audit trails, impact measurement, and stakeholder reporting."
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Analytics & Insights",
                  description: "Real-time dashboards, custom reports, and AI-powered insights to optimize your programs."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 border-border hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <div className="text-primary">{feature.icon}</div>
                    </div>
                    <h3 className="text-display text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integrated Features */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Integrated Constituent Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Go beyond awards management with built-in CRM, support, and campaign tools.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "CRM & Engagement",
                  description: "Manage donors, reviewers, volunteers, and alumni alongside applicants—all in one database. Track interactions, segment audiences, and build lasting relationships."
                },
                {
                  icon: <Headphones className="h-6 w-6" />,
                  title: "Support Management",
                  description: "Integrated ticketing system so applicants and grantees get help without leaving your ecosystem. Track issues, automate responses, and measure satisfaction."
                },
                {
                  icon: <Mail className="h-6 w-6" />,
                  title: "Campaign Management",
                  description: "Email campaigns, program promotion, and social media tools without expensive third-party platforms. Design, send, and track all from one place."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 border-accent">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                      <div className="text-accent">{feature.icon}</div>
                    </div>
                    <h3 className="text-display text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Enterprise-Grade Security & Compliance
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Built for federal agencies and mission-critical operations.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <Shield className="h-6 w-6" />, title: "FedRAMP Ready", description: "Federal security standards" },
                { icon: <Lock className="h-6 w-6" />, title: "SOC 2 Certified", description: "Data security & privacy" },
                { icon: <CheckCircle2 className="h-6 w-6" />, title: "Section 508", description: "Accessibility compliant" },
                { icon: <Globe className="h-6 w-6" />, title: "FERPA & PCI-DSS", description: "Education & payment security" }
              ].map((cert, idx) => (
                <Card key={idx} className="text-center">
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <div className="text-primary">{cert.icon}</div>
                    </div>
                    <h3 className="text-display font-bold mb-2">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-6">
                See All Features in Action
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Schedule a personalized demo to explore how CommunityForce can transform your operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <a href="https://calendly.com/d/cn55-wdb-c65?utm_source=Website&utm_medium=Demo&utm_campaign=Marketing" target="_blank" rel="noopener noreferrer">
                    Book a Demo
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="https://calendly.com/communityforce/communityforce-discovery?utm_source=Website&utm_medium=Discovery%20Call&utm_campaign=Marketing" target="_blank" rel="noopener noreferrer">
                    Talk to an Expert
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
