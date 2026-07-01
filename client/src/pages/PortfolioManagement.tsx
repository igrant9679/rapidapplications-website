import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Network, 
  Brain, 
  Shield, 
  TrendingUp, 
  CheckCircle2,
  Zap,
  Lock,
  BarChart3,
  Cloud,
  Database,
  FileCheck,
  Users
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function PortfolioManagement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/95 to-accent py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Network className="h-4 w-4" />
                <span>MISSIONINSIGHTS • INTEGRATED WITH RAPIDAPPLICATIONS</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-primary-foreground">
                MissionInsights: AI-Powered Portfolio Lifecycle Management
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                MissionInsights, integrated with RapidApplications, delivers AI-powered, zero-discrepancy, fully auditable portfolio lifecycle management that transforms reactive administration into proactive, intelligent orchestration for federal agencies and enterprises.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/book-demo">Book a Demo</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <Link href="/talk-to-expert">Talk to an Expert</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Metrics */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="text-mono text-4xl font-bold text-primary">13</div>
                <div className="text-sm text-muted-foreground mt-2">Core Modules</div>
              </div>
              <div className="text-center">
                <div className="text-mono text-4xl font-bold text-accent">6</div>
                <div className="text-sm text-muted-foreground mt-2">Lifecycle Stages</div>
              </div>
              <div className="text-center">
                <div className="text-mono text-4xl font-bold text-primary">6</div>
                <div className="text-sm text-muted-foreground mt-2">AI Agents</div>
              </div>
              <div className="text-center">
                <div className="text-mono text-4xl font-bold text-accent">19X</div>
                <div className="text-sm text-muted-foreground mt-2">ROI</div>
              </div>
            </div>
          </div>
        </section>

        {/* Three Pillars */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Three Pillars of Excellence
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                MissionInsights transforms IT portfolio management with AI intelligence, zero-discrepancy operations, and complete auditability.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">AI Orchestration</h3>
                  <p className="text-muted-foreground mb-6">
                    Six specialized AI agents manage the complete portfolio lifecycle with predictive analytics, automated compliance, and proactive risk detection.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>&gt;90% Prediction Accuracy</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>&gt;95% Issue Detection Rate</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>&lt;48hr Root Cause Analysis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Zero Discrepancies</h3>
                  <p className="text-muted-foreground mb-6">
                    Blockchain-enabled audit trail ensures 100% data integrity with automated reconciliation and continuous compliance monitoring.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>&gt;99% Data Quality</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>100% Compliance Rate</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      <span>&lt;1 Hour Audit Evidence</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Federal-First Design</h3>
                  <p className="text-muted-foreground mb-6">
                    Purpose-built for federal agencies with FedRAMP High authorization, FISMA controls, and FITARA reporting built-in.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>FedRAMP High Authorized</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>FISMA Native Controls</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span>Continuous ATO Monitoring</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 13 Core Modules */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                13 Integrated Modules
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Complete coverage of IT portfolio management from strategy through retirement, all seamlessly integrated.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Network, title: "Enterprise Architecture", desc: "Standards, technical debt, integration maps" },
                { icon: BarChart3, title: "Business Portfolio", desc: "Strategic alignment and business value tracking" },
                { icon: FileCheck, title: "System Tech Assessment", desc: "Technology evaluation and capability analysis" },
                { icon: Shield, title: "Portfolio Governance", desc: "Investment oversight and decision frameworks" },
                { icon: Database, title: "System Portfolio", desc: "Application and system inventory management" },
                { icon: CheckCircle2, title: "Compliance Management", desc: "FISMA, FITARA, regulatory compliance automation" },
                { icon: Cloud, title: "Cloud Management", desc: "FinOps, cloud optimization, cost management" },
                { icon: TrendingUp, title: "Application Rationalization", desc: "Portfolio optimization and consolidation" },
                { icon: Lock, title: "Asset Lifecycle", desc: "Complete asset management from acquisition to retirement" },
                { icon: FileCheck, title: "Auditability Management", desc: "Blockchain audit trail and evidence collection" },
                { icon: BarChart3, title: "Budget Management", desc: "Cost tracking, forecasting, variance analysis" },
                { icon: Shield, title: "Cyber Security Assessment", desc: "ATO automation, security controls, risk management" },
                { icon: Database, title: "Data Governance", desc: "Data quality, lineage, compliance" }
              ].map((module, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <module.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{module.title}</h3>
                        <p className="text-sm text-muted-foreground">{module.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 6 AI Agents & Lifecycle Stages */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                6 AI Agents Orchestrating Complete Lifecycle
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Specialized AI agents manage each stage of the portfolio lifecycle with proactive intelligence and automated orchestration.
              </p>
            </div>

            <div className="space-y-8 max-w-5xl mx-auto">
              {[
                {
                  stage: "1. Initiation & Strategic Alignment",
                  agent: "Strategic Investment Advisor",
                  desc: "Mission analysis, stakeholder identification, investment justification, compliance validation",
                  metric: "Mission Alignment Score > 80%",
                  color: "primary"
                },
                {
                  stage: "2. Planning & Portfolio Inclusion",
                  agent: "Portfolio Optimization Engine",
                  desc: "Capability gap analysis, resource allocation, schedule generation, cost estimation with risk",
                  metric: "Resource Allocation Optimized",
                  color: "accent"
                },
                {
                  stage: "3. Acquisition & Execution",
                  agent: "Execution Orchestrator",
                  desc: "Task monitoring, risk detection, dependency management, automated stakeholder communication",
                  metric: "Milestone Adherence > 90%",
                  color: "primary"
                },
                {
                  stage: "4. Operations & Sustainment",
                  agent: "Asset Lifecycle Guardian",
                  desc: "Performance monitoring, predictive maintenance, value realization, continuous compliance",
                  metric: "Benefit Realization > 80%",
                  color: "accent"
                },
                {
                  stage: "5. Optimization & Evolution",
                  agent: "Portfolio Intelligence System",
                  desc: "Health trend analysis, consolidation opportunities, capability gap identification, strategic pivots",
                  metric: "Portfolio Optimization AI-Driven",
                  color: "primary"
                },
                {
                  stage: "6. Retirement & Transition",
                  agent: "Transition & Decommission Manager",
                  desc: "System retirement, data migration compliance, knowledge transfer, financial closure",
                  metric: "Knowledge Transfer Complete",
                  color: "accent"
                }
              ].map((item, idx) => (
                <Card key={idx} className={`border-l-4 border-l-${item.color}`}>
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{item.stage}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Brain className="h-4 w-4" />
                          <span className="font-medium">{item.agent}</span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-muted-foreground mb-4">{item.desc}</p>
                        <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                          <TrendingUp className="h-3 w-3" />
                          <span>{item.metric}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Competitive Advantages */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Superior to Legacy Solutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                MissionInsights delivers everything competitors promised, plus AI orchestration and superior federal compliance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">vs Alfabet</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">82% Cost Reduction</div>
                        <div className="text-sm text-muted-foreground">$14M vs $79.5M over 5 years</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">11.5X Better ROI</div>
                        <div className="text-sm text-muted-foreground">54X vs 4.7X return on investment</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">18 Months Faster</div>
                        <div className="text-sm text-muted-foreground">6 months vs 24 months implementation</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">2.5X More Capabilities</div>
                        <div className="text-sm text-muted-foreground">13 modules vs 5-6, plus AI orchestration</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6">vs ServiceNow</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">40-60% Faster Implementation</div>
                        <div className="text-sm text-muted-foreground">6-8 weeks vs 6+ months time-to-value</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">75% Less Admin Overhead</div>
                        <div className="text-sm text-muted-foreground">AI-assisted categorization and organization</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">No Developer Dependency</div>
                        <div className="text-sm text-muted-foreground">ANY business user can customize instantly</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <div className="font-semibold">$300M+ Savings Identified</div>
                        <div className="text-sm text-muted-foreground">AI insights reveal hidden optimization opportunities</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ROI & Success Metrics */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Proven Results & ROI
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                MissionInsights delivers measurable value with guaranteed metrics and proven federal agency success.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-mono text-5xl font-bold text-primary mb-2">19X</div>
                  <div className="text-lg font-semibold mb-2">ROI for Federal Agencies</div>
                  <div className="text-sm text-muted-foreground">$761M net benefits over 5 years</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-mono text-5xl font-bold text-accent mb-2">$425M</div>
                  <div className="text-lg font-semibold mb-2">Cost Avoidance</div>
                  <div className="text-sm text-muted-foreground">Cloud optimization & license consolidation</div>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-8">
                  <div className="text-mono text-5xl font-bold text-primary mb-2">&gt;90%</div>
                  <div className="text-lg font-semibold mb-2">AI Prediction Accuracy</div>
                  <div className="text-sm text-muted-foreground">With &lt;48hr root cause analysis</div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-6 text-center">5-Year Benefits Breakdown</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">$425M Cost Avoidance</div>
                          <div className="text-sm text-muted-foreground">Cloud optimization, license consolidation</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Zap className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold">$100M Productivity Gains</div>
                          <div className="text-sm text-muted-foreground">Automated compliance, faster decisions</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">$150M Revenue Enhancement</div>
                          <div className="text-sm text-muted-foreground">Accelerated capability delivery</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold">$100M Risk Mitigation</div>
                          <div className="text-sm text-muted-foreground">Cybersecurity, compliance automation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 6 Personas */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Role-Based Dashboards for Every Stakeholder
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                AI agents deliver personalized, proactive insights tailored to each stakeholder's needs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Users, title: "Executive Leadership", needs: "Portfolio health, ROI tracking, strategic alignment" },
                { icon: Users, title: "Program Managers", needs: "Task status, resource availability, schedule adherence" },
                { icon: Network, title: "Enterprise Architects", needs: "Standards compliance, technical debt, integration maps" },
                { icon: BarChart3, title: "Financial Managers", needs: "Budget burn rate, cost variance, forecast accuracy" },
                { icon: Shield, title: "Compliance Officers", needs: "Regulatory compliance, security controls, audit findings" },
                { icon: Users, title: "Operations Teams", needs: "Asset performance, incidents, maintenance schedules" }
              ].map((persona, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <persona.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{persona.title}</h3>
                        <p className="text-sm text-muted-foreground">{persona.needs}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/95 to-accent">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8 text-primary-foreground">
              <h2 className="text-display text-3xl md:text-4xl font-bold">
                Ready to Transform Your IT Portfolio Management?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                See how MissionInsights, integrated with RapidApplications, can deliver AI-powered intelligence, zero discrepancies, and proven ROI for your organization.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <Card className="bg-background text-foreground">
                  <CardContent className="p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Schedule a Live Demo</h3>
                    <p className="text-muted-foreground mb-6">
                      See the platform in action with federal agency scenarios
                    </p>
                    <Button className="w-full" asChild>
                      <Link href="/book-demo">Book a Demo</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-background text-foreground">
                  <CardContent className="p-8 text-center">
                    <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Talk to Our Team</h3>
                    <p className="text-muted-foreground mb-6">
                      Discuss your portfolio management challenges and requirements
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/talk-to-expert">Talk to an Expert</Link>
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
