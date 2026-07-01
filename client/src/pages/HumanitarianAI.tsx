import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Shield, 
  Building2, 
  Users, 
  CheckCircle2,
  Zap,
  Award,
  Globe,
  Lock,
  TrendingUp
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HumanitarianAI() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-20 md:py-32">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              {/* Forward Edge-AI Logo */}
              <div className="flex justify-center mb-6">
                <img 
                  src="/images/ForwardEdge-AI.png" 
                  alt="Forward Edge-AI Logo" 
                  className="h-12 w-auto"
                />
              </div>
              
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Heart className="h-4 w-4" />
                <span>INTEGRATED WITH RAPIDAPPLICATIONS</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Humanitarian AI for Regulated Sectors
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Forward Edge-AI, integrated with RapidApplications, delivers mass-market, humanitarian-oriented AI solutions that enhance safety and security while meeting the highest compliance standards for regulated and critical sectors.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <a href="/contact/demo">
                    Book a Demo
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" asChild>
                  <a href="/contact/expert">
                    Talk to an Expert
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-12 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-mono text-3xl font-bold text-primary mb-2">TruSight</div>
                <div className="text-sm text-muted-foreground">Risk Assessment Certified</div>
              </div>
              <div className="text-center">
                <div className="text-mono text-3xl font-bold text-accent mb-2">BioMedSA</div>
                <div className="text-sm text-muted-foreground">Healthcare Innovation Member</div>
              </div>
              <div className="text-center">
                <div className="text-mono text-3xl font-bold text-primary mb-2">Regulated</div>
                <div className="text-sm text-muted-foreground">Critical Sector Focus</div>
              </div>
              <div className="text-center">
                <div className="text-mono text-3xl font-bold text-accent mb-2">Humanitarian</div>
                <div className="text-sm text-muted-foreground">Social Impact Mission</div>
              </div>
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Four Pillars of Humanitarian AI
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Forward Edge-AI transforms how organizations serve communities while maintaining the highest standards for security, compliance, and social responsibility.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Humanitarian Focus</h3>
                  <p className="text-muted-foreground mb-4">
                    Mass-market AI solutions designed to enhance safety and security of the free world, with dedicated support for first responders and elder communities.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "First responder foundations support",
                      "Elder community assistance programs",
                      "Public safety enhancement",
                      "Community engagement initiatives"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                    <Shield className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Regulatory Compliance & Security</h3>
                  <p className="text-muted-foreground mb-4">
                    TruSight third-party Risk Assessment Program certification demonstrates readiness to serve security and compliance-sensitive clients in regulated industries.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "TruSight Risk Assessment certified",
                      "Financial services industry ready",
                      "Compliance-sensitive client capability",
                      "Regulated sector expertise"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Healthcare & Biosciences</h3>
                  <p className="text-muted-foreground mb-4">
                    BioMedSA membership supports innovation in healthcare and biosciences, bringing AI capabilities to medical and life sciences applications.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "BioMedSA member organization",
                      "Healthcare innovation support",
                      "Medical AI applications",
                      "Life sciences expertise"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-6">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Social Responsibility</h3>
                  <p className="text-muted-foreground mb-4">
                    Active collaboration with partners and foundations that honor first responders and assist elder communities, demonstrating commitment to social impact.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "First responder honor foundations",
                      "Elder community assistance",
                      "Partner collaboration network",
                      "Mission-driven engagement"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Target Markets */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Serving Critical Sectors
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Forward Edge-AI delivers specialized AI solutions for organizations in regulated and humanitarian sectors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Financial Services</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    TruSight-certified solutions for banks, credit unions, and financial institutions requiring rigorous risk assessment and compliance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">TruSight Certified</span>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Risk Assessment</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Healthcare & Biosciences</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    BioMedSA-connected AI solutions for hospitals, research organizations, and medical institutions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">BioMedSA Member</span>
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Medical AI</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Public Safety & First Responders</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI solutions supporting emergency services, first responder programs, and public safety agencies.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">First Responders</span>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Public Safety</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Elder Care & Community Services</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Humanitarian AI for organizations serving elder communities and providing social services.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Elder Care</span>
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Community Support</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Humanitarian Organizations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI-powered solutions for foundations and nonprofits focused on social impact and community service.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Foundations</span>
                    <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Social Impact</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Regulated Industries</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Compliance-ready AI for organizations in heavily regulated sectors requiring rigorous security standards.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Compliance</span>
                    <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Security</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Integration with RapidApplications */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                  Integrated with RapidApplications
                </h2>
                <p className="text-lg text-muted-foreground">
                  Forward Edge-AI's humanitarian AI capabilities seamlessly integrate with RapidApplications's platform to deliver enhanced functionality for mission-driven organizations.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="p-6">
                    <Zap className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-3">AI-Powered Application Screening</h3>
                    <p className="text-sm text-muted-foreground">
                      Intelligent screening and evaluation for humanitarian programs, grants, and scholarships with bias detection and fairness monitoring.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-accent mb-4" />
                    <h3 className="text-lg font-bold mb-3">Compliance Automation</h3>
                    <p className="text-sm text-muted-foreground">
                      Automated compliance monitoring and reporting for regulated sectors, ensuring adherence to industry standards and requirements.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <TrendingUp className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-3">Impact Measurement</h3>
                    <p className="text-sm text-muted-foreground">
                      AI-driven analytics to measure and report social impact for humanitarian initiatives, foundations, and community programs.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <Award className="h-8 w-8 text-accent mb-4" />
                    <h3 className="text-lg font-bold mb-3">Risk Assessment</h3>
                    <p className="text-sm text-muted-foreground">
                      TruSight-certified risk assessment for security-sensitive programs in financial services and regulated industries.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-accent">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-6">
                Ready to Enhance Your Humanitarian Impact?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                See how Forward Edge-AI, integrated with RapidApplications, can deliver AI-powered solutions that enhance safety, security, and social impact for your organization.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card className="bg-white/10 border-white/20 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">Schedule a Live Demo</h3>
                    <p className="text-sm text-white/80 mb-4">
                      See the platform in action with humanitarian and regulated sector scenarios
                    </p>
                    <Button size="lg" variant="secondary" asChild className="w-full">
                      <a href="/contact/demo">
                        Book a Demo
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <h3 className="text-xl font-bold mb-2">Talk to Our Team</h3>
                    <p className="text-sm text-white/80 mb-4">
                      Discuss your operational challenges and humanitarian mission
                    </p>
                    <Button size="lg" variant="secondary" asChild className="w-full">
                      <a href="/contact/expert">
                        Talk to an Expert
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
