/* Federal Modernism Design: Solutions page showcasing all product offerings */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, TrendingUp, FileCheck, Zap, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Solutions() {
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
                <span>COMPREHENSIVE SOLUTIONS</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Complete Awards Management Solutions
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                From grants and scholarships to fellowships and research programs, CommunityForce delivers end-to-end management solutions tailored to your mission.
              </p>
            </div>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Grants Management */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-display text-2xl font-bold">Grants Management</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Pre-award through closeout for federal agencies, foundations, and nonprofits. Uniform Guidance compliance built-in.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Federal Uniform Guidance (2 CFR 200) compliance",
                      "Multi-year grant lifecycle management",
                      "Budget tracking and financial reporting",
                      "Automated compliance monitoring",
                      "Audit trail and documentation"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild>
                    <a href="/solutions/grants">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Scholarships Management */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <h2 className="text-display text-2xl font-bold">Scholarships Management</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Streamline scholarship programs from application to award disbursement with automated workflows and donor management.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Customizable application forms",
                      "Automated eligibility screening",
                      "Committee review and scoring",
                      "Award disbursement tracking",
                      "Donor reporting and stewardship"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild>
                    <a href="/solutions/scholarships">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Fellowship Management */}
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <h2 className="text-display text-2xl font-bold">Fellowship Management</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Manage competitive fellowship programs with sophisticated review processes and ongoing monitoring.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Multi-stage application process",
                      "Expert panel coordination",
                      "Progress milestone tracking",
                      "Cohort management tools",
                      "Impact measurement and reporting"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild>
                    <a href="/solutions/fellowships">
                      Learn More →
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Research Management */}
              <Card className="border-2 border-accent">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                      <FileCheck className="h-6 w-6 text-accent" />
                    </div>
                    <h2 className="text-display text-2xl font-bold">Research Management</h2>
                  </div>
                  
                  <p className="text-muted-foreground mb-6">
                    Support research funding programs with proposal management, peer review, and compliance tracking.
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Proposal submission and tracking",
                      "Peer review coordination",
                      "IRB and compliance management",
                      "Budget and spending oversight",
                      "Publication and outcome tracking"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="h-2 w-2 rounded-full bg-accent" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild>
                    <a href="/solutions/research">
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
                Ready to Transform Your Awards Management?
              </h2>
              <p className="text-lg text-white/90 mb-8">
                See how CommunityForce can streamline your entire operation with one comprehensive platform.
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
