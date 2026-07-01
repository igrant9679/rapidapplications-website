/* Federal Modernism Design: Federal Projects Portfolio */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Shield,
  CheckCircle2,
  TrendingUp,
  Users,
  Award,
  FileText,
  BarChart3,
  Cpu,
  Building2,
  Target,
  Zap
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function FederalProjects() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>FEDERAL PROJECT PORTFOLIO • PROVEN PERFORMANCE</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Federal Government Project Portfolio
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Proven track record delivering complex programs for the U.S. Air Force and Department of Defense with $30M+ in federal contract value, 50,000+ users served, and 100% on-time, on-budget performance.
              </p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">$30M+</div>
                  <div className="text-sm text-muted-foreground">Contract Value</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">6</div>
                  <div className="text-sm text-muted-foreground">Major Projects</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">50K+</div>
                  <div className="text-sm text-muted-foreground">Users Served</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">100%</div>
                  <div className="text-sm text-muted-foreground">On-Time Delivery</div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/expert">Discuss Your Project</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/government-services">View All Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20 bg-background">
          <div className="container space-y-12">
            {/* Project 1: Digital Forms Modernization */}
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">Digital Forms Modernization</h3>
                          <p className="text-sm text-muted-foreground">Adobe AEM Forms Implementation</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Government</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Project Management</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Digital Modernization</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Modernized ARPC's digital form management processes through comprehensive Adobe Experience Manager (AEM) Forms implementation. Transformed legacy paper-based workflows into efficient digital processes, significantly improving processing speed and data accuracy for 5,000+ Air Force Reserve personnel.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Impact</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Reduced average form processing time from 14 days to 3 days (78% improvement)</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Eliminated paper storage costs saving approximately $50,000 annually</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improved data accuracy reducing error rates from 12% to under 2%</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enabled remote form access supporting distributed workforce operations</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Client</div>
                        <div className="font-semibold text-foreground">U.S. Air Force Reserve Personnel Center (ARPC)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="font-semibold text-foreground">Program Analyst | Project Manager</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">2018-2019 (18 months)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                        <div className="font-semibold text-primary">$1.2M</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Team Size</div>
                        <div className="font-semibold text-foreground">5 personnel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project 2: Learning Ecosystem Upgrade */}
            <Card className="border-accent/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">Learning Ecosystem Upgrade</h3>
                          <p className="text-sm text-muted-foreground">Digital Learning Experience Platform</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Government</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Program Management</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Learning Systems</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Led end-to-end delivery of a transformational Digital Learning Experience Platform upgrade for AETC, managing the complete program lifecycle from initial requirements gathering through successful deployment and transition. Coordinated a large multidisciplinary team including developers, architects, QA specialists, training personnel, and stakeholders across multiple Air Force locations.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Impact</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Deployed enterprise learning platform serving 45,000+ Air Force personnel across AETC</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Modernized training delivery improving course completion rates by 35%</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Reduced platform downtime from 8% to less than 0.5% through improved architecture</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enhanced user experience reflected in 92% satisfaction rating (up from 58%)</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Client</div>
                        <div className="font-semibold text-foreground">U.S. Air Force Education and Training Command (AETC)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="font-semibold text-foreground">Program Manager</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">2017-2018 (24 months)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                        <div className="font-semibold text-accent">$8.5M</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Team Size</div>
                        <div className="font-semibold text-foreground">22 personnel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project 3: Assessments-as-a-Service */}
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">Assessments-as-a-Service</h3>
                          <p className="text-sm text-muted-foreground">Enterprise Testing, Proctoring & Analytics</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Government</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Program Analysis</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Assessment Platforms</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Designed a centralized Assessments-as-a-Service approach serving multiple AETC units with diverse testing requirements. Led comprehensive stakeholder requirements gathering across 12+ organizations, conducted thorough vendor evaluation activities including market research, RFI development, proposal evaluation, and comparative analysis.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Impact</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Identified optimal cloud-based assessment solution meeting diverse stakeholder needs</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Projected $1.2M annual savings through consolidation of redundant testing systems</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Established foundation for enterprise assessment standardization across AETC</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improved assessment security through advanced proctoring capabilities</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Client</div>
                        <div className="font-semibold text-foreground">U.S. Air Force Education and Training Command (AETC)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="font-semibold text-foreground">Program Analyst</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">2017-2018 (18 months)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                        <div className="font-semibold text-primary">$2.3M</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Team Size</div>
                        <div className="font-semibold text-foreground">8 personnel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project 4: Enterprise Architecture */}
            <Card className="border-accent/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">Enterprise Architecture - Digital Transformation</h3>
                          <p className="text-sm text-muted-foreground">Certified Data Delivery</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Government</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Enterprise Architecture</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Data Integration</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Integrated data from multiple Air Force systems to deliver certified, authoritative data supporting the Defense Business System (DBS) Investment Review Process. Developed an agile Business Capability Assessment and Collaboration (BCAC) process streamlining demand assessment for new IT initiatives. Implemented data warehousing solutions aggregating information from multiple source systems.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Impact</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improved accuracy and consistency of Air Force investment data supporting $2B+ in annual IT decisions</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Identified $12M in potential cost savings through system consolidation opportunities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Reduced demand assessment cycle time from 120 days to 45 days through agile BCAC process</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Prevented estimated $8M in redundant system development through capability reuse identification</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Client</div>
                        <div className="font-semibold text-foreground">U.S. Air Force Headquarters (SAF/MG)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="font-semibold text-foreground">Program Analyst | Project Manager</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">2020-2021 (20 months)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                        <div className="font-semibold text-accent">$4.8M</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Team Size</div>
                        <div className="font-semibold text-foreground">12 personnel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project 5: Business Capability Lifecycle Management */}
            <Card className="border-primary/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">Business Capability Lifecycle Management</h3>
                          <p className="text-sm text-muted-foreground">Portfolio Management</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Government</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Portfolio Management</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Business Transformation</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Developed standard methods for strategic planning and project portfolio management enabling consistent, data-driven investment decisions across the Air Force enterprise. Implemented data integration and utilization technologies improving analysis and reporting capabilities for portfolio managers and decision-makers.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Impact</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Streamlined Air Force investment management functions improving decision cycle time by 40%</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enhanced strategic alignment of IT investments with Air Force priorities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Improved portfolio visibility enabling proactive risk management</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Strengthened governance framework ensuring compliance with federal standards</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Client</div>
                        <div className="font-semibold text-foreground">U.S. Air Force Headquarters (SAF/MG)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="font-semibold text-foreground">Program Analyst | Project Manager</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">2021-2022 (16 months)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                        <div className="font-semibold text-primary">$3.7M</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Team Size</div>
                        <div className="font-semibold text-foreground">10 personnel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project 6: AI Data Analyst */}
            <Card className="border-accent/20">
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Cpu className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">AI Data Analyst - Federal Project</h3>
                          <p className="text-sm text-muted-foreground">AI-Powered Analytics & Automation</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">Government</span>
                        <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">Data & Analytics</span>
                        <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">AI Automation</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground">
                      Applied advanced AI and machine learning techniques to analyze complex federal datasets, identify patterns, and deliver insights driving program improvements and operational efficiency gains. Developed predictive models forecasting program outcomes, resource requirements, and potential risks. Implemented AI workflow automation streamlining repetitive analytical tasks.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground">Key Impact</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Transformed raw data into strategic intelligence enabling data-driven decision-making</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Increased analytical productivity by 65% through AI automation</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Identified $3.2M in potential cost savings through efficiency analysis</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Reduced reporting cycle time from weeks to days through automated workflows</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Client</div>
                        <div className="font-semibold text-foreground">U.S. Federal Agency</div>
                        <div className="text-xs text-muted-foreground">(details subject to disclosure restrictions)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Role</div>
                        <div className="font-semibold text-foreground">AI Data Analyst</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="font-semibold text-foreground">2024-Present (Ongoing)</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Contract Value</div>
                        <div className="font-semibold text-accent">$2.1M</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Team Size</div>
                        <div className="font-semibold text-foreground">6 personnel</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Performance Summary */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Proven Performance Across All Projects
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Consistent delivery excellence with measurable results and sustained customer satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                <div className="text-mono text-3xl font-bold text-accent mb-2">Zero</div>
                <div className="text-sm text-muted-foreground">Security Incidents</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground">
                Ready to Partner on Your Next Federal Project?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how CommunityForce can support your agency's digital transformation, AI automation, and enterprise modernization initiatives with proven expertise and 100% on-time, on-budget delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/expert">Discuss Your Project</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/government-services">View All Services</Link>
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
