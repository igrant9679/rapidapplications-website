/* Federal Modernism Design: ARIS Process Intelligence Partner Solution Page */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Network, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle2,
  BarChart3,
  GitBranch,
  Brain,
  Target,
  Workflow
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function ProcessIntelligence() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-muted via-background to-muted py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/abstract-network.png')] opacity-5 bg-cover bg-center" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* ARIS Logo */}
              <div className="flex justify-center">
                <div className="bg-white px-8 py-4 rounded-lg shadow-md">
                  <img 
                    src="/images/aris-logo.png" 
                    alt="ARIS" 
                    className="h-12 w-auto"
                  />
                </div>
              </div>
              
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <Network className="h-4 w-4" />
                <span>ARIS • INTEGRATED WITH COMMUNITYFORCE</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Process Intelligence for Awards Management Excellence
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                ARIS, integrated with CommunityForce, delivers AI-powered process intelligence that transforms grants, scholarships, and awards operations through digital twins, process mining, and intelligent automation.
              </p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">30+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">3</div>
                  <div className="text-sm text-muted-foreground">Core Capabilities</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">AI-Ready</div>
                  <div className="text-sm text-muted-foreground">Foundation</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">Global</div>
                  <div className="text-sm text-muted-foreground">Trust</div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/contact/book-demo">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
                    Book a Demo
                  </Button>
                </Link>
                <Link href="/contact/talk-to-expert">
                  <Button size="lg" variant="outline" className="border-2">
                    Talk to an Expert
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars of ARIS Process Intelligence */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Three Pillars of Process Intelligence
              </h2>
              <p className="text-lg text-muted-foreground">
                ARIS transforms awards management operations through an integrated platform that unifies process design, mining, and AI-powered automation.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Process Core */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <GitBranch className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    Process Core
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Where ideas become operational realities
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Create a governed digital twin of your awards management operations. Design, document, test, monitor and control processes to align teams around consistent execution.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Increased compliance and control</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Improved visibility of workflows</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Better alignment across teams</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Process Mining */}
              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="p-8">
                  <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <BarChart3 className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    Process Mining
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Where operations are transformed
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Analyze event log data across systems to identify, diagnose, and fix process bottlenecks. Connect real execution data to continuously improve operations.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Improved efficiency</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Reduced operating costs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Bottleneck identification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Agentic AI */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    Agentic AI
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Where execution is reimagined
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Use task and process data to identify AI automation opportunities. Train AI agents from a strong process foundation to enable AI at scale with governance.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Increased ROI from AI</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Governed AI agents</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Scalable automation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Awards Management Applications */}
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Transform Awards Management Operations
              </h2>
              <p className="text-lg text-muted-foreground">
                ARIS brings process intelligence to every stage of the awards lifecycle, from application through compliance and reporting.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Application Process Optimization */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Workflow className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Application Process Optimization
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Map and optimize application workflows to reduce processing time and improve applicant experience.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Identify application bottlenecks</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Reduce review cycle times</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improve applicant satisfaction</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review & Selection Intelligence */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Review & Selection Intelligence
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Optimize reviewer workflows and selection processes to ensure fair, efficient, and compliant decisions.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Balance reviewer workloads</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Detect evaluation inconsistencies</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Ensure compliance standards</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Disbursement & Financial Operations */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Disbursement & Financial Operations
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Streamline payment processes and financial workflows to accelerate disbursements and reduce errors.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Accelerate payment cycles</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Reduce disbursement errors</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improve cash flow management</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance & Reporting Automation */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Compliance & Reporting Automation
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Automate compliance monitoring and reporting to maintain audit readiness and regulatory adherence.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Continuous compliance monitoring</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Automated audit trails</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Regulatory reporting efficiency</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Integration Benefits */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Integrated with CommunityForce
              </h2>
              <p className="text-lg text-muted-foreground">
                ARIS process intelligence capabilities seamlessly integrate with CommunityForce's awards management platform to deliver unprecedented operational excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Unified Platform
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Single integrated platform combining awards management with process intelligence—no separate tools or data silos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Network className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Digital Twin Foundation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create a governed digital twin of your entire awards operation for complete visibility and control.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <BarChart3 className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Real-Time Process Mining
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Analyze actual process execution in real-time to identify bottlenecks and optimization opportunities.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    AI-Ready Architecture
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Build the process foundation needed to deploy AI agents with confidence, governance, and scale.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Compliance Assurance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Maintain continuous compliance monitoring and audit readiness across all awards processes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <TrendingUp className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Continuous Improvement
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Move from reactive problem-solving to proactive process optimization with data-driven insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted by Global Leaders
              </h2>
              <p className="text-lg text-muted-foreground">
                ARIS powers process excellence for leading organizations worldwide
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 items-center justify-items-center max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-muted-foreground">Siemens</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-muted-foreground">Standard Bank</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-muted-foreground">Dubai Health Authority</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-muted-foreground">Volkswagen</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-muted-foreground">Tesco</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-muted-foreground">Philips</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold">
                Ready to Transform Your Awards Operations?
              </h2>
              <p className="text-lg opacity-90">
                See how ARIS process intelligence, integrated with CommunityForce, can optimize your grants, scholarships, and awards management operations.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <Card className="bg-white text-foreground">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-3">Schedule a Live Demo</h3>
                    <p className="text-muted-foreground mb-6">
                      See process intelligence in action with awards management scenarios
                    </p>
                    <Link href="/contact/book-demo">
                      <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white">
                        Book a Demo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="bg-white text-foreground">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-3">Talk to Our Team</h3>
                    <p className="text-muted-foreground mb-6">
                      Discuss your operational challenges and process optimization goals
                    </p>
                    <Link href="/contact/talk-to-expert">
                      <Button size="lg" variant="outline" className="w-full border-2">
                        Talk to an Expert
                      </Button>
                    </Link>
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
