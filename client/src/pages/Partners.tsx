/* Federal Modernism Design: Partners page showcasing partner solutions */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Network, Zap, Heart, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Partners() {
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
                <span>PARTNER SOLUTIONS</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Comprehensive Solutions Through Strategic Partnerships
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                RapidApplications partners with leading solution providers to deliver specialized capabilities that extend our core platform and serve diverse markets.
              </p>
            </div>
          </div>
        </section>

        {/* Partner Solutions Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
              {/* MissionInsights - Portfolio Management Partner */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Network className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">MissionInsights</h2>
                      <p className="text-sm text-muted-foreground">Portfolio Lifecycle Management Partner</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    <strong>MissionInsights</strong> is our strategic partner for AI-powered IT portfolio management. Integrated with RapidApplications's platform, MissionInsights delivers zero-discrepancy, fully auditable portfolio lifecycle management that transforms reactive administration into proactive, intelligent orchestration for federal agencies and enterprises.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Capabilities:</h4>
                      <ul className="space-y-2">
                        {[
                          "13 integrated portfolio management modules",
                          "6 AI agents orchestrating complete lifecycle",
                          "FedRAMP High authorized compliance",
                          "Blockchain-enabled audit trail",
                          "Cloud management and FinOps"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Perfect For:</h4>
                      <ul className="space-y-2">
                        {[
                          "Federal agencies (Treasury, IRS)",
                          "Enterprise IT organizations",
                          "Regulated industries",
                          "Cloud transformation initiatives",
                          "Portfolio optimization programs"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Measurable Impact:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-accent">19X</div>
                        <div className="text-sm text-muted-foreground">ROI</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">82%</div>
                        <div className="text-sm text-muted-foreground">Cost Reduction</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">&gt;90%</div>
                        <div className="text-sm text-muted-foreground">AI Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">100%</div>
                        <div className="text-sm text-muted-foreground">Compliance</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10" asChild>
                    <a href="/partners/portfolio">
                      Explore MissionInsights Solution →
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Forward Edge-AI - Humanitarian AI Partner */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src="/images/ForwardEdge-AI.png" 
                      alt="Forward Edge-AI Logo" 
                      className="h-16 w-auto"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">Forward Edge-AI</h2>
                      <p className="text-sm text-muted-foreground">Humanitarian AI Partner</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    <strong>Forward Edge-AI</strong> is our strategic partner for humanitarian-oriented AI solutions. Integrated with RapidApplications's platform, Forward Edge-AI delivers mass-market AI capabilities that enhance safety and security for regulated and critical sectors while maintaining the highest compliance standards.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Capabilities:</h4>
                      <ul className="space-y-2">
                        {[
                          "TruSight Risk Assessment certified",
                          "BioMedSA healthcare innovation member",
                          "First responder support programs",
                          "Elder community assistance",
                          "Regulated sector AI solutions"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Perfect For:</h4>
                      <ul className="space-y-2">
                        {[
                          "Financial services institutions",
                          "Healthcare and biosciences",
                          "Public safety agencies",
                          "Humanitarian organizations",
                          "Elder care providers"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Certifications & Memberships:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-accent">TruSight</div>
                        <div className="text-sm text-muted-foreground">Risk Certified</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">BioMedSA</div>
                        <div className="text-sm text-muted-foreground">Member</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">Regulated</div>
                        <div className="text-sm text-muted-foreground">Sector Ready</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">Social</div>
                        <div className="text-sm text-muted-foreground">Impact Focus</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10" asChild>
                    <a href="/partners/humanitarian-ai">
                      Explore Forward Edge-AI Solution →
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* ARIS - Process Intelligence Partner */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src="/images/aris-logo.png" 
                      alt="ARIS Logo" 
                      className="h-16 w-auto"
                    />
                    <div>
                      <h2 className="text-2xl font-bold">ARIS</h2>
                      <p className="text-sm text-muted-foreground">Process Intelligence Partner</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    <strong>ARIS</strong> is our strategic partner for AI-powered process intelligence. Integrated with RapidApplications's platform, ARIS delivers digital twin technology, process mining, and agentic AI that transform awards management operations through continuous process improvement and intelligent automation.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Capabilities:</h4>
                      <ul className="space-y-2">
                        {[
                          "Governed digital twin foundation",
                          "Real-time process mining and analysis",
                          "Agentic AI for workflow automation",
                          "Continuous process optimization",
                          "30+ years process excellence"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Perfect For:</h4>
                      <ul className="space-y-2">
                        {[
                          "Large enterprise operations",
                          "Federal agencies seeking efficiency",
                          "Complex awards programs",
                          "Organizations pursuing AI adoption",
                          "Process excellence initiatives"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Trusted By Global Leaders:</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Siemens</span>
                      <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Standard Bank</span>
                      <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Dubai Health Authority</span>
                      <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Volkswagen</span>
                      <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Tesco</span>
                      <span className="text-xs bg-card border border-border px-3 py-1 rounded-full">Philips</span>
                    </div>
                  </div>
                  
                  <Button size="lg" asChild>
                    <a href="/partners/process-intelligence">
                      Explore ARIS Solution →
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Educian - Education Management Partner */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src="/images/EducianLogo.svg" 
                      alt="Educian Logo" 
                      className="h-16 w-auto"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Education Management Partner</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    <strong>Educian</strong> is our strategic partner for K-12 education management solutions. Integrated with RapidApplications's platform, Educian delivers complete student lifecycle management from admissions through graduation with integrated parent engagement and operational excellence.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Capabilities:</h4>
                      <ul className="space-y-2">
                        {[
                          "Digital admissions and enrollment",
                          "Academic and attendance management",
                          "Parent engagement mobile apps",
                          "Financial and fee management",
                          "Student success and retention tools"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Perfect For:</h4>
                      <ul className="space-y-2">
                        {[
                          "K-12 public schools",
                          "Charter school networks",
                          "Private and independent schools",
                          "School districts",
                          "Educational institutions"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Measurable Impact:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">70%</div>
                        <div className="text-sm text-muted-foreground">Faster Enrollment</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">50%</div>
                        <div className="text-sm text-muted-foreground">Higher Conversion</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">75%</div>
                        <div className="text-sm text-muted-foreground">Parent Engagement</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary">40%</div>
                        <div className="text-sm text-muted-foreground">Lower Dropout</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="lg" asChild>
                    <a href="/partners/education">
                      Explore Educian Solution →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* LSI Media LLC - Digital Transformation Partner */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <img 
                      src="/images/lsimedia-logo.png" 
                      alt="LSI Media LLC Logo" 
                      className="h-16 w-auto"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">Digital Transformation & Government Services Partner</p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-lg">
                    <strong>LSI Media LLC</strong> is our strategic partner for AI automation and digital transformation. Integrated with RapidApplications's platform, LSI Media delivers AI-powered workflow automation and government-grade compliance solutions that revolutionize awards management operations while meeting the highest federal standards.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Key Capabilities:</h4>
                      <ul className="space-y-2">
                        {[
                          "AI-powered workflow automation",
                          "Comprehensive AI audit & assessment",
                          "Section 508 accessibility compliance",
                          "Enterprise digital transformation",
                          "Federal contracting expertise"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Perfect For:</h4>
                      <ul className="space-y-2">
                        {[
                          "Federal agencies seeking modernization",
                          "Enterprise organizations",
                          "Digital transformation initiatives",
                          "Organizations pursuing AI adoption",
                          "Government compliance requirements"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <div className="h-2 w-2 rounded-full bg-accent" />
                            </div>
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-foreground mb-3">Proven Track Record:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-accent">12+</div>
                        <div className="text-sm text-muted-foreground">Years Experience</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">100's</div>
                        <div className="text-sm text-muted-foreground">Projects Created</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-accent">Federal</div>
                        <div className="text-sm text-muted-foreground">Compliance Ready</div>
                      </div>
                    </div>
                  </div>
                  
                  <Button size="lg" asChild>
                    <a href="/partners/digital-transformation">
                      Explore LSI Media Solution →
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
                Interested in Partnering with RapidApplications?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                We're always looking for strategic partnerships that bring value to our customers. Let's discuss how we can work together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <a href="/contact/demo">
                    Schedule a Meeting
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <a href="/contact/expert">
                    Learn More About Partnerships
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
