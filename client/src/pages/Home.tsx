/* Federal Modernism Design: Systematic hierarchy, asymmetric layouts, trust through restraint */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  CheckCircle2, 
  Shield, 
  Award, 
  Users, 
  TrendingUp, 
  FileCheck,
  Zap,
  Lock,
  BarChart3,
  Globe,
  Play
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-muted via-background to-muted py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/abstract-network.png')] opacity-5 bg-cover bg-center" />
          <div className="container relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  <span>AI-POWERED PLATFORM • SINCE 2010</span>
                </div>
                
                <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  RapidApplications: Your Comprehensive Awards Management Platform
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                  Manage the complete awards lifecycle—from application through compliance—with integrated CRM, support, and campaign management in one unified platform.
                </p>
                
                <p className="text-base text-muted-foreground max-w-2xl">
                  Stop juggling multiple vendors for awards management, constituent engagement, and program promotion. RapidApplications delivers everything you need for scholarships, grants, fellowships, and research programs in a single, secure platform.
                </p>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-mono text-2xl font-bold text-primary">165M+</div>
                    <div className="text-sm text-muted-foreground">Applications Processed</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="text-mono text-2xl font-bold text-accent">$569M+</div>
                    <div className="text-sm text-muted-foreground">Awarded</div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4 col-span-2 md:col-span-1">
                    <div className="text-mono text-2xl font-bold text-primary">15+ Years</div>
                    <div className="text-sm text-muted-foreground">Federal Experience</div>
                  </div>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <a href="/contact/demo">Book a Demo</a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="/contact/expert">Talk to an Expert</a>
                  </Button>
                </div>
              </div>
              
              {/* Right: Dashboard Visual */}
              <div className="relative">
                <div 
                  className="relative rounded-lg overflow-hidden shadow-2xl border border-border cursor-pointer group"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <img 
                    src="/images/hero-dashboard.png" 
                    alt="RapidApplications Dashboard Interface" 
                    className="w-full h-auto transition-opacity group-hover:opacity-90"
                    loading="eager"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-accent/90 hover:bg-accent rounded-full p-6 transition-all group-hover:scale-110 shadow-2xl">
                      <Play className="h-12 w-12 text-accent-foreground fill-accent-foreground" />
                    </div>
                  </div>
                </div>
                {/* Floating Trust Badge */}
                <div className="absolute -bottom-6 -left-6 bg-card border-2 border-accent rounded-lg p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-8 w-8 text-accent" />
                    <div>
                      <div className="text-sm font-bold text-foreground">FedRAMP Ready</div>
                      <div className="text-xs text-muted-foreground">SOC 2 Certified</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Credibility Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted By Leading Organizations
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Federal agencies, universities, and foundations rely on RapidApplications for mission-critical awards management.
              </p>
            </div>
            
            {/* Client Logos */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center mb-12">
              <img src="/images/harvard-logo.png" alt="Harvard University" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="/images/usaf-logo.png" alt="U.S. Air Force" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="/images/cisa-logo.png" alt="CISA" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <img src="/images/opm-logo.jpg" alt="U.S. OPM" className="h-16 object-contain grayscale hover:grayscale-0 transition-all" />
              <div className="text-lg font-semibold text-muted-foreground">200+ Organizations</div>
            </div>
            
            {/* Certifications */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {[
                { icon: <Award className="h-6 w-6" />, text: "Inc. 5000", subtext: "725% Growth" },
                { icon: <Shield className="h-6 w-6" />, text: "FedRAMP", subtext: "Ready" },
                { icon: <CheckCircle2 className="h-6 w-6" />, text: "Section 508", subtext: "Accessible" },
                { icon: <Lock className="h-6 w-6" />, text: "PCI-DSS", subtext: "Compliant" },
                { icon: <FileCheck className="h-6 w-6" />, text: "FERPA", subtext: "Compliant" },
                { icon: <Globe className="h-6 w-6" />, text: "15+ Years", subtext: "Expertise" }
              ].map((cert, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg p-4 flex flex-col items-center text-center">
                  <div className="text-primary mb-2">{cert.icon}</div>
                  <div className="text-sm font-bold text-foreground">{cert.text}</div>
                  <div className="text-xs text-muted-foreground">{cert.subtext}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Complete Solution Section */}
        <section id="solutions" className="py-20 diagonal-divider bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Only AI-Powered Platform That Does It All
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Most platforms stop at application collection and review. RapidApplications manages your entire operation—from program design through post-award compliance, with built-in tools for constituent engagement and program promotion using AI-Powered tools.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {/* Core Awards Lifecycle */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <h3 className="text-display text-2xl font-bold text-primary mb-6">
                    Core AI-Powered Awards Lifecycle Management
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Pre-Award Management",
                        desc: "Design programs, collect applications, and screen eligibility with our powerful Process Builder and form creation tools.",
                        icon: <FileCheck className="h-6 w-6" />
                      },
                      {
                        title: "Award Management",
                        desc: "Multi-stage reviews, committee collaboration, scoring rubrics, and automated decision workflows.",
                        icon: <Award className="h-6 w-6" />
                      },
                      {
                        title: "Post-Award Management",
                        desc: "Ongoing monitoring, milestone tracking, progress reporting, and award closeout procedures.",
                        icon: <TrendingUp className="h-6 w-6" />
                      },
                      {
                        title: "Financial Management",
                        desc: "Budget approval, payment processing, disbursement tracking, and integration with QuickBooks, Peachtree, and bill.com.",
                        icon: <BarChart3 className="h-6 w-6" />
                      },
                      {
                        title: "Compliance & Reporting Management",
                        desc: "Regulatory compliance tracking, audit trails, impact measurement, and stakeholder reporting.",
                        icon: <Shield className="h-6 w-6" />
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Integrated Constituent Management */}
              <Card className="border-2 border-accent/20">
                <CardContent className="p-8">
                  <h3 className="text-display text-2xl font-bold text-accent mb-6">
                    Integrated Constituent Management
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "CRM & Engagement Management",
                        desc: "Manage donors, reviewers, volunteers, and alumni alongside applicants—all in one database.",
                        icon: <Users className="h-6 w-6" />
                      },
                      {
                        title: "Support Management",
                        desc: "Integrated ticketing system so applicants and grantees get help without leaving your ecosystem.",
                        icon: <CheckCircle2 className="h-6 w-6" />
                      },
                      {
                        title: "Campaign Management",
                        desc: "Email campaigns, program promotion, and social media tools without expensive third-party platforms.",
                        icon: <Zap className="h-6 w-6" />
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Visual Comparison */}
            <div className="relative">
              <img 
                src="/images/collaboration-review.png" 
                alt="Collaborative Review Process" 
                className="w-full rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Why RapidApplications Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Organizations Choose RapidApplications
              </h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
              {/* Cost Comparison */}
              <div>
                <h3 className="text-display text-2xl font-bold text-foreground mb-8">
                  Stop Paying For Multiple Systems
                </h3>
                
                <div className="space-y-6">
                  <Card className="border-2 border-destructive/30 bg-destructive/5">
                    <CardContent className="p-6">
                      <div className="text-sm font-bold text-destructive mb-4 uppercase tracking-wider">The Old Way</div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>Awards platform: $XX,XXX/year</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>HubSpot or Salesforce: $9,600+/year</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>Zendesk or support tool: $X,XXX/year</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>Mailchimp or marketing tool: $X,XXX/year</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>Integration and maintenance: $XX,XXX/year</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-destructive/20">
                        <div className="text-mono text-xl font-bold text-destructive">
                          Total: $40,000-$60,000+/year
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                      <div className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">The RapidApplications Way</div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>Complete platform with all capabilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>One vendor, one login, one source of truth</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>Seamless data flow across all modules</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                          <span>No integration headaches</span>
                        </li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-primary/20">
                        <div className="text-mono text-xl font-bold text-primary mb-2">
                          Total: $XX,XXX/year
                        </div>
                        <div className="text-sm font-bold text-accent">
                          Savings: $20,000-$40,000/year
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Feature Comparison Table */}
              <div>
                <h3 className="text-display text-2xl font-bold text-foreground mb-8">
                  Feature Comparison
                </h3>
                
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-semibold text-foreground">Capability</th>
                        <th className="text-center p-4 font-semibold text-primary">RapidApplications</th>
                        <th className="text-center p-4 font-semibold text-muted-foreground">Competitor</th>
                        <th className="text-center p-4 font-semibold text-muted-foreground">Multiple Tools</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { capability: "Pre-Award Management", cf: true, comp: true, multi: true },
                        { capability: "Award Management", cf: true, comp: true, multi: true },
                        { capability: "Post-Award Management", cf: true, comp: false, multi: true },
                        { capability: "Financial Management", cf: true, comp: false, multi: true },
                        { capability: "Compliance & Reporting", cf: true, comp: false, multi: true },
                        { capability: "CRM & Engagement", cf: true, comp: false, multi: false },
                        { capability: "Support Management", cf: true, comp: false, multi: false },
                        { capability: "Campaign Management", cf: true, comp: false, multi: false }
                      ].map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-4 text-foreground">{row.capability}</td>
                          <td className="p-4 text-center">
                            {row.cf ? <CheckCircle2 className="h-5 w-5 text-primary mx-auto" /> : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="p-4 text-center">
                            {row.comp ? <CheckCircle2 className="h-5 w-5 text-muted-foreground mx-auto" /> : <span className="text-muted-foreground">✗</span>}
                          </td>
                          <td className="p-4 text-center">
                            {row.multi ? <CheckCircle2 className="h-5 w-5 text-muted-foreground mx-auto" /> : <span className="text-muted-foreground">✗</span>}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-muted font-bold">
                        <td className="p-4 text-foreground">Total Vendors</td>
                        <td className="p-4 text-center text-primary text-mono">1</td>
                        <td className="p-4 text-center text-muted-foreground text-mono">1-2</td>
                        <td className="p-4 text-center text-muted-foreground text-mono">4-6</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
            {/* Security & Compliance Visual */}
            <div className="relative max-w-3xl mx-auto">
              <img 
                src="/images/compliance-security.png" 
                alt="Security and Compliance" 
                className="w-full rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section id="use-cases" className="py-20 diagonal-divider bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Built For Your Mission
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Whether you manage grants, scholarships, fellowships, or research programs, RapidApplications adapts to your specific needs.
              </p>
            </div>
            
            <Tabs defaultValue="grants" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-12">
                <TabsTrigger value="grants">Grants</TabsTrigger>
                <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                <TabsTrigger value="fellowships">Fellowships</TabsTrigger>
                <TabsTrigger value="research">Research</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grants" className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                      Grants Management
                    </h3>
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
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/solutions/grants">Learn More →</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scholarships" className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                      Scholarships Management
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      High-volume processing with multi-year renewals, GPA tracking, and donor stewardship reporting.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Process thousands of applications efficiently",
                        "Automated renewal workflows",
                        "GPA and academic progress tracking",
                        "Donor reporting and stewardship",
                        "Financial aid integration"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/solutions/scholarships">Learn More →</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="fellowships" className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                      Fellowship Management
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Cohort management, alumni tracking, and program outcomes measurement for research and professional programs.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Cohort-based program management",
                        "Alumni network and engagement",
                        "Outcomes and impact tracking",
                        "Mentorship program coordination",
                        "Career development monitoring"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/solutions/fellowships">Learn More →</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="research" className="space-y-8">
                <Card>
                  <CardContent className="p-8">
                    <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                      Research Management
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      IRB integration, compliance tracking, and multi-PI support for universities and research institutions.
                    </p>
                    <ul className="space-y-3 mb-6">
                      {[
                        "IRB and ethics compliance integration",
                        "Multi-PI and collaborative research support",
                        "Research milestone tracking",
                        "Publication and output management",
                        "Grant reporting and renewals"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" asChild>
                      <a href="/solutions/research">Learn More →</a>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Final CTA Section */}
        <section id="demo" className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold">
                Ready to Consolidate Your Operations?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                See how RapidApplications can replace 4-6 different tools, reduce costs by $20K-$40K annually, and give you complete visibility across your entire awards operation.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <Card className="bg-background text-foreground">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-display text-xl font-bold">Experience the Platform</h3>
                    <p className="text-sm text-muted-foreground">
                      Get a hands-on demo and see how all modules work together in real time
                    </p>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                      <a href="/contact/demo">Book a Demo</a>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-background text-foreground">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-display text-xl font-bold">Let's Talk Solutions</h3>
                    <p className="text-sm text-muted-foreground">
                      Speak with our team about your specific needs and see pricing options
                    </p>
                    <Button size="lg" variant="outline" className="w-full" asChild>
                      <a href="/contact/expert">Talk to an Expert</a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Video Modal */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-5xl p-0 bg-transparent border-0">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-card">
            <iframe 
              src="https://www.youtube.com/embed/spf7wnkZjXM?autoplay=1" 
              title="RapidApplications Overview Video" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
