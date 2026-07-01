import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileCheck, Users, TrendingUp, Shield, BookOpen, FlaskConical, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ResearchManagement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-accent via-accent/90 to-accent/80 text-accent-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-accent-foreground/10 px-4 py-2 rounded-full text-sm font-medium">
                <FlaskConical className="h-4 w-4" />
                <span>IRB INTEGRATION • COMPLIANCE TRACKING • MULTI-PI SUPPORT</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Research Grant Management for Universities & Institutions
              </h1>
              
              <p className="text-lg md:text-xl text-accent-foreground/90 max-w-3xl mx-auto">
                Streamline research grant administration with IRB integration, compliance tracking, multi-PI collaboration tools, and comprehensive reporting for universities and research institutions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button size="lg" variant="secondary" asChild>
                  <a href="/contact/demo">Book a Demo</a>
                </Button>
                <Button size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent" asChild>
                  <a href="/contact/expert">Talk to an Expert</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Research Grant Lifecycle Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From proposal submission through grant closeout, RapidApplications provides specialized tools for managing research grants, ensuring compliance, and tracking research outcomes.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileCheck className="h-8 w-8" />,
                  title: "Proposal Management",
                  description: "Streamline internal proposal submissions, coordinate institutional review, manage budgets and justifications, and track proposal status through the submission process."
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "IRB & Ethics Compliance",
                  description: "Integrate with IRB systems, track ethics approvals, manage protocol amendments, and ensure ongoing compliance with research ethics requirements."
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Multi-PI Collaboration",
                  description: "Support collaborative research with multiple principal investigators, manage institutional roles and responsibilities, and coordinate multi-site research projects."
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Research Milestones",
                  description: "Track research progress, manage project milestones, coordinate deliverables, and monitor timeline adherence throughout the grant period."
                },
                {
                  icon: <BookOpen className="h-8 w-8" />,
                  title: "Publication Management",
                  description: "Track research outputs, manage publication submissions, monitor citation metrics, and maintain comprehensive research impact records."
                },
                {
                  icon: <FileText className="h-8 w-8" />,
                  title: "Grant Reporting",
                  description: "Automate progress reports, financial reporting, final reports, and renewal applications with comprehensive data collection and documentation."
                }
              ].map((feature, idx) => (
                <Card key={idx} className="border-2 hover:border-accent/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center text-accent mb-4">
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

        {/* Research Compliance Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built for Research Compliance & Integrity
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  RapidApplications understands the unique compliance requirements of research grant management, from IRB protocols to financial reporting, ensuring your institution maintains the highest standards of research integrity.
                </p>
                
                <div className="space-y-4">
                  {[
                    "IRB and ethics committee integration",
                    "Human subjects research compliance tracking",
                    "Animal care and use protocol management",
                    "Conflict of interest disclosure and management",
                    "Export control and technology transfer compliance",
                    "Financial conflict of interest reporting",
                    "Research misconduct prevention and reporting",
                    "Comprehensive audit trail and documentation"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="border-2 border-accent/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Multi-PI & Collaborative Research</h3>
                    <p className="text-muted-foreground mb-4">
                      Support complex research collaborations with multiple principal investigators across different institutions, departments, and disciplines.
                    </p>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Multiple PI role management",
                        "Institutional responsibility tracking",
                        "Budget allocation across institutions",
                        "Subaward management and monitoring",
                        "Collaborative milestone tracking"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-2 border-accent/20">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-4">Research Output Tracking</h3>
                    <p className="text-muted-foreground mb-4">
                      Demonstrate research impact by tracking publications, presentations, patents, and other research outputs throughout and beyond the grant period.
                    </p>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Publication and citation tracking",
                        "Conference presentation management",
                        "Patent and intellectual property tracking",
                        "Data sharing and repository integration",
                        "Impact metrics and reporting"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted By Leading Research Institutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Universities, medical centers, research institutes, and government labs rely on RapidApplications to manage their research grant portfolios.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Universities & Colleges",
                  description: "Manage institutional research grants, coordinate sponsored research programs, and support faculty research activities across all disciplines.",
                  examples: ["R1 Universities", "Medical Schools", "Engineering Schools"]
                },
                {
                  title: "Research Institutes & Centers",
                  description: "Administer research portfolios, manage multi-investigator projects, and coordinate collaborative research initiatives across institutions.",
                  examples: ["Medical Research Centers", "National Labs", "Think Tanks"]
                },
                {
                  title: "Healthcare & Clinical Research",
                  description: "Manage clinical trials, coordinate multi-site studies, ensure regulatory compliance, and track patient enrollment and outcomes.",
                  examples: ["Academic Medical Centers", "Hospital Systems", "Clinical Research Organizations"]
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
              <h3 className="text-2xl font-bold text-foreground mb-6">Ready to streamline your research grant management?</h3>
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
