/* Federal Modernism Design: Use Cases page showcasing customer success stories */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, GraduationCap, Users2, FlaskConical, Zap, School, Heart, Network, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function UseCases() {
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
                <span>SUCCESS STORIES</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Trusted Across Industries
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                From federal agencies to universities and foundations, organizations rely on RapidApplications to manage their mission-critical awards programs.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Federal & Government */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">Federal & Government Agencies</h2>
                      <p className="text-sm text-muted-foreground">Mission-critical compliance & security</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Federal agencies trust RapidApplications and our partner MissionInsights for secure, compliant grants management and AI-powered IT portfolio lifecycle management that meet the highest standards for data protection, accessibility, and operational excellence.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "FedRAMP-ready security and compliance",
                          "Uniform Guidance (2 CFR 200) built-in",
                          "Section 508 accessibility standards",
                          "Multi-year grant lifecycle management",
                          "Comprehensive audit trails"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Trusted By:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">U.S. Air Force</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">CISA</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">U.S. OPM</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                      <a href="/solutions/grants">
                        Grants Management →
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="/partners/portfolio">
                        Portfolio Management →
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Universities */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                      <GraduationCap className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">Universities & Higher Education</h2>
                      <p className="text-sm text-muted-foreground">Scholarships, grants & student support</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Universities use RapidApplications to manage scholarships, research grants, and student emergency funds with streamlined workflows and donor stewardship.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "Customizable scholarship applications",
                          "Automated eligibility screening",
                          "Committee review coordination",
                          "Donor management and reporting",
                          "FERPA compliance built-in"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Trusted By:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Harvard University</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">200+ Institutions</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/solutions/scholarships">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Foundations & Nonprofits */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users2 className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">Foundations & Nonprofits</h2>
                      <p className="text-sm text-muted-foreground">Grantmaking & impact measurement</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Foundations and nonprofits streamline their grantmaking processes, track impact, and engage donors with RapidApplications's comprehensive platform.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "Flexible grantmaking workflows",
                          "Impact measurement and reporting",
                          "Donor engagement and stewardship",
                          "Financial tracking and disbursement",
                          "Multi-program management"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/solutions/grants">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Research Institutions */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FlaskConical className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">Research Institutions</h2>
                      <p className="text-sm text-muted-foreground">Research funding & compliance</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Research institutions manage complex funding programs, peer review processes, and compliance requirements with RapidApplications's specialized tools.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "Proposal submission and tracking",
                          "Peer review coordination",
                          "IRB and compliance management",
                          "Budget and spending oversight",
                          "Publication tracking"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/solutions/research">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Humanitarian & Regulated Sectors */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">Humanitarian & Regulated Sectors</h2>
                      <p className="text-sm text-muted-foreground">AI-powered solutions for social impact</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Organizations in humanitarian, healthcare, financial services, and public safety sectors use RapidApplications with Forward Edge-AI to deliver compliant, secure programs that enhance community safety and social impact.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "TruSight Risk Assessment certified",
                          "BioMedSA healthcare innovation",
                          "First responder program support",
                          "Elder community assistance",
                          "Regulated sector compliance"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Perfect For:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Financial Services</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Healthcare</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Public Safety</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Elder Care</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/partners/humanitarian-ai">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Process Intelligence & Operations */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Network className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">Enterprise Operations & Process Excellence</h2>
                      <p className="text-sm text-muted-foreground">AI-powered process intelligence</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Organizations seeking operational excellence use RapidApplications with ARIS process intelligence to optimize awards workflows through digital twins, process mining, and intelligent automation.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "Governed digital twin of operations",
                          "Real-time process mining and analysis",
                          "AI-powered workflow optimization",
                          "Bottleneck identification and resolution",
                          "Continuous improvement foundation"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Perfect For:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Large Enterprises</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Federal Agencies</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Complex Operations</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/partners/process-intelligence">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* AI Transformation & Digital Services */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">AI Transformation & Digital Services</h2>
                      <p className="text-sm text-muted-foreground">AI automation meets federal compliance</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Organizations pursuing digital transformation use RapidApplications with LSI Media to revolutionize awards operations through AI automation while maintaining government-grade compliance and security standards.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "AI-powered workflow automation",
                          "Federal compliance and accessibility",
                          "Enterprise digital transformation",
                          "Marketing automation integration",
                          "Data-driven insights and analytics"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Perfect For:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Federal Agencies</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Enterprise Organizations</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Digital Transformation</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/partners/digital-transformation">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* K-12 Education */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <School className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-display text-2xl font-bold">K-12 Schools & Districts</h2>
                      <p className="text-sm text-muted-foreground">Complete student lifecycle management</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    K-12 schools and districts use RapidApplications to manage the complete student journey from admissions through graduation with integrated parent engagement.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {[
                          "Digital admissions and enrollment",
                          "Academic and attendance tracking",
                          "Parent engagement mobile apps",
                          "Financial and fee management",
                          "Student success and retention tools"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-sm text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Perfect For:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Public Schools</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Charter Schools</span>
                        <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Private Schools</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button asChild>
                    <a href="/partners/education">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-white">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-6">
                See How RapidApplications Works for Your Organization
              </h2>
              <p className="text-lg text-white/90 mb-8">
                Schedule a demo tailored to your specific use case and industry requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <a href="/contact/demo">
                    Book a Demo
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="/contact/demo">
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
