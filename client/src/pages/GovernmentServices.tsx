/* Federal Modernism Design: Government Services Overview */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield, 
  Zap, 
  Award, 
  TrendingUp,
  CheckCircle2,
  Lock,
  FileCheck,
  Users,
  BarChart3,
  Cpu,
  Building2,
  Target
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function GovernmentServices() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-muted via-background to-muted py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>FEDERAL GOVERNMENT CONTRACTING • AI AUTOMATION SERVICES</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Specialized Government Contracting & AI Automation
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                RapidApplications delivers comprehensive digital transformation, enterprise modernization, and artificial intelligence services to federal agencies with over 10 years of proven government contracting experience and 7 years pioneering AI-driven automation solutions.
              </p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">$30M+</div>
                  <div className="text-sm text-muted-foreground">Federal Contracts</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">50K+</div>
                  <div className="text-sm text-muted-foreground">Federal Users Served</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">10+ Years</div>
                  <div className="text-sm text-muted-foreground">Federal Experience</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/expert">Request Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/government-services/federal-projects">View Project Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Core Capabilities */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Core Capabilities
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive services combining deep federal sector expertise with cutting-edge AI automation capabilities, enabling agencies to modernize legacy systems, optimize workflows, and implement intelligent automation solutions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* AI Automation Services */}
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">AI Automation Services</h3>
                  <p className="text-muted-foreground">
                    Comprehensive AI audit, implementation, and optimization services including intelligent document processing, conversational AI systems, and workflow automation.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/government-services/ai-automation">Learn More →</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Federal Government Contracting */}
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Federal Government Contracting</h3>
                  <p className="text-muted-foreground">
                    Proven track record delivering $30M+ in successful federal contracts with 100% on-time, on-budget delivery across U.S. Air Force and Department of Defense agencies.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/government-services/federal-projects">View Projects →</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Modernization */}
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Enterprise Modernization</h3>
                  <p className="text-muted-foreground">
                    Digital transformation, learning management systems, and assessment platform modernization serving 45,000+ Air Force personnel.
                  </p>
                </CardContent>
              </Card>

              {/* Data & Analytics */}
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Data & Analytics</h3>
                  <p className="text-muted-foreground">
                    AI-powered data analysis, predictive modeling, enterprise architecture, and data integration supporting $2B+ in annual IT investment decisions.
                  </p>
                </CardContent>
              </Card>

              {/* Accessibility Compliance */}
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Accessibility Compliance</h3>
                  <p className="text-muted-foreground">
                    Section 508 and WCAG testing, remediation, and training with DHS Certified Trusted Tester expertise ensuring federal accessibility standards.
                  </p>
                </CardContent>
              </Card>

              {/* Project Management */}
              <Card className="border-primary/20 hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Project Management</h3>
                  <p className="text-muted-foreground">
                    PMP-certified program managers with expertise in agile methodologies, stakeholder management, and complex federal procurement processes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Federal Agencies Served */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Federal Agencies Served
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Trusted partner to the U.S. Air Force, Department of Defense, and federal civilian agencies delivering mission-critical systems and services.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">U.S. Air Force Education and Training Command (AETC)</h3>
                      <p className="text-sm text-muted-foreground">
                        Learning ecosystem modernization, assessment platforms, and enterprise architecture serving 45,000+ personnel.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">U.S. Air Force Reserve Personnel Center (ARPC)</h3>
                      <p className="text-sm text-muted-foreground">
                        Digital forms modernization and workflow automation supporting 5,000+ Air Force Reserve personnel.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">U.S. Air Force Headquarters (SAF/MG)</h3>
                      <p className="text-sm text-muted-foreground">
                        Enterprise architecture, certified data delivery, and portfolio management supporting $2B+ in annual IT investments.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Department of Defense Agencies</h3>
                      <p className="text-sm text-muted-foreground">
                        Various DoD agencies supported through prime and subcontractor relationships (details subject to disclosure restrictions).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Federal Compliance & Standards */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Federal Compliance & Standards
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Rigorous compliance with federal standards and regulations across all government contracting work, ensuring security, accessibility, and quality.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Security & Privacy */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Security & Privacy</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>NIST 800-53 Implementation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>FISMA Compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>FedRAMP Awareness</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>CMMC Awareness</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Zero Security Incidents</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Accessibility Standards */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Accessibility</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Section 508 Compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>WCAG 2.0/2.1 Level AA</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>DHS Certified Trusted Tester</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Remediation Services</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Accessibility Training</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Quality Management */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Quality Management</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>CMMI Process Framework</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Agile/Scrum Methodologies</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>DevSecOps Practices</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>PMP-Certified Managers</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>100% On-Time Delivery</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Contracting Qualifications */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Contracting</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Active SAM Registration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Security Clearances</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Prime & Subcontractor</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>FAR/DFARS Compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span>Small Business Ready</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Performance Metrics
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Proven track record of excellence across federal government contracting engagements.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-primary mb-2">$30M+</div>
                <div className="text-sm text-muted-foreground">Federal Contract Value</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-accent mb-2">50,000+</div>
                <div className="text-sm text-muted-foreground">Federal Users Served</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">On-Time Delivery Rate</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-accent mb-2">100%</div>
                <div className="text-sm text-muted-foreground">On-Budget Performance</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-primary mb-2">95%+</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-accent mb-2">10+ Years</div>
                <div className="text-sm text-muted-foreground">Federal Engagement</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-primary mb-2">Zero</div>
                <div className="text-sm text-muted-foreground">Security Incidents</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center">
                <div className="text-mono text-3xl font-bold text-accent mb-2">Zero</div>
                <div className="text-sm text-muted-foreground">Cost Overruns</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground">
                Ready to Partner with a Proven Federal Contractor?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how RapidApplications can support your agency's digital transformation, AI automation, and enterprise modernization initiatives with proven expertise and 100% on-time, on-budget delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/expert">Request Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/government-services/federal-projects">View Project Portfolio</Link>
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
