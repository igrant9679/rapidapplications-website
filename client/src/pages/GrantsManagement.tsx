import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, FileCheck, BarChart3, Users, TrendingUp, Award, Lock } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function GrantsManagement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary-foreground/10 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4" />
                <span>FEDERAL UNIFORM GUIDANCE COMPLIANT</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Grants Management Software Built for Federal Compliance
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Manage the complete grant lifecycle from pre-award through closeout with built-in 2 CFR 200 Uniform Guidance compliance, automated workflows, and comprehensive reporting.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" variant="secondary" asChild>
                  <a href="/contact/demo">Book a Demo</a>
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                  <a href="/contact/expert">Talk to an Expert</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Tour Video Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Grants Management Product Tour
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join us for a quick 20 minute overview of CommunityForce Grants Management, or jump to sections that most interest you!
                </p>
              </div>
              
              {/* Video Embed */}
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-border">
                <iframe 
                  src="https://www.youtube.com/embed/r4h-ZbAry48" 
                  title="CommunityForce Grants Management Overview" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Grant Lifecycle Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From opportunity identification through award closeout, CommunityForce provides the tools federal agencies, foundations, and nonprofits need to manage grants efficiently and compliantly.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileCheck className="h-8 w-8" />,
                  title: "Pre-Award Management",
                  description: "Design grant programs, create custom application forms with our Process Builder, screen eligibility automatically, and manage the entire application collection process."
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Review & Selection",
                  description: "Multi-stage review workflows, committee collaboration tools, customizable scoring rubrics, conflict-of-interest management, and automated decision notifications."
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Award Management",
                  description: "Generate award letters, track amendments and modifications, manage multi-year awards, and maintain complete documentation for audit trails."
                },
                {
                  icon: <BarChart3 className="h-8 w-8" />,
                  title: "Financial Management",
                  description: "Budget tracking, payment processing, disbursement management, and integration with QuickBooks, Peachtree, and bill.com for seamless financial operations."
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Post-Award Monitoring",
                  description: "Progress reporting, milestone tracking, performance measurement, site visit management, and ongoing compliance monitoring throughout the grant period."
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Compliance & Reporting",
                  description: "Built-in 2 CFR 200 Uniform Guidance compliance, automated audit trails, federal reporting templates, and comprehensive documentation management."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Federal Compliance Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built for Federal Uniform Guidance Compliance
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  CommunityForce is designed from the ground up to support federal grant management requirements, including 2 CFR 200 Uniform Guidance compliance, ensuring your organization meets all regulatory obligations.
                </p>
                
                <div className="space-y-4">
                  {[
                    "2 CFR 200 Uniform Guidance compliance built-in",
                    "Automated audit trail and documentation",
                    "Federal reporting templates and workflows",
                    "Cost allocation and indirect rate tracking",
                    "Conflict of interest management",
                    "Procurement and subaward monitoring",
                    "Time and effort reporting",
                    "Record retention and archiving"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <Shield className="h-8 w-8" />, title: "FedRAMP Ready", subtitle: "SOC 2 Certified" },
                  { icon: <Lock className="h-8 w-8" />, title: "Section 508", subtitle: "Accessible" },
                  { icon: <FileCheck className="h-8 w-8" />, title: "15+ Years", subtitle: "Federal Experience" },
                  { icon: <Award className="h-8 w-8" />, title: "Trusted By", subtitle: "Federal Agencies" }
                ].map((cert, idx) => (
                  <Card key={idx} className="border-2 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                        {cert.icon}
                      </div>
                      <div className="text-lg font-bold text-foreground">{cert.title}</div>
                      <div className="text-sm text-muted-foreground">{cert.subtitle}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted By Leading Organizations
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Federal agencies, state governments, foundations, and nonprofits rely on CommunityForce for mission-critical grant management.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Federal Agencies",
                  description: "Manage competitive grant programs, cooperative agreements, and financial assistance awards with full compliance and transparency.",
                  examples: ["CISA", "U.S. Air Force", "OPM"]
                },
                {
                  title: "State & Local Government",
                  description: "Distribute federal pass-through funds, manage state grant programs, and ensure subrecipient compliance and monitoring.",
                  examples: ["State DOTs", "Health Departments", "Education Agencies"]
                },
                {
                  title: "Foundations & Nonprofits",
                  description: "Streamline grantmaking operations, engage with grantees throughout the lifecycle, and measure program impact effectively.",
                  examples: ["Community Foundations", "Corporate Foundations", "Family Foundations"]
                }
              ].map((useCase, idx) => (
                <Card key={idx}>
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold text-foreground mb-3">{useCase.title}</h3>
                    <p className="text-muted-foreground mb-4">{useCase.description}</p>
                    <div className="text-sm text-muted-foreground">
                      <strong>Examples:</strong> {useCase.examples.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground mb-6">Ready to streamline your grant management?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <a href="/contact/demo">Book a Demo</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/contact/expert">Talk to an Expert</a>
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
