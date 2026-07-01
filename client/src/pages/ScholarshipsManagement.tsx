import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Award, Users, TrendingUp, FileCheck, BarChart3, Heart, GraduationCap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ScholarshipsManagement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-accent via-accent/90 to-accent/80 text-accent-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-accent-foreground/10 px-4 py-2 rounded-full text-sm font-medium">
                <GraduationCap className="h-4 w-4" />
                <span>PROCESS THOUSANDS OF APPLICATIONS EFFICIENTLY</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Scholarship Management Software That Scales
              </h1>
              
              <p className="text-lg md:text-xl text-accent-foreground/90 max-w-3xl mx-auto">
                Handle high-volume scholarship programs with automated workflows, multi-year renewals, GPA tracking, donor stewardship reporting, and integrated financial aid management.
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
                Everything You Need for Scholarship Programs
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From application collection through award disbursement and renewal management, RapidApplications streamlines every aspect of scholarship administration.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileCheck className="h-8 w-8" />,
                  title: "Application Management",
                  description: "Create custom application forms, collect supporting documents, automate eligibility screening, and handle thousands of applications with ease."
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Review & Selection",
                  description: "Multi-reviewer workflows, blind review options, customizable scoring rubrics, committee collaboration, and automated decision notifications."
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Award Management",
                  description: "Generate award letters, track acceptance status, manage award modifications, and maintain complete recipient records for reporting."
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Renewal Management",
                  description: "Automated renewal workflows, GPA tracking, academic progress monitoring, conditional renewals, and multi-year award tracking."
                },
                {
                  icon: <BarChart3 className="h-8 w-8" />,
                  title: "Financial Management",
                  description: "Disbursement tracking, payment processing, budget management, and integration with financial aid systems and accounting software."
                },
                {
                  icon: <Heart className="h-8 w-8" />,
                  title: "Donor Stewardship",
                  description: "Comprehensive donor reporting, impact stories, recipient profiles, thank-you letter management, and endowment tracking for donor relations."
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

        {/* High-Volume Processing Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Built for High-Volume Scholarship Programs
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Whether you manage 100 or 10,000 applications per cycle, RapidApplications provides the automation and efficiency tools you need to process applications quickly without sacrificing quality.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Process thousands of applications efficiently",
                    "Automated eligibility screening and filtering",
                    "Bulk operations for common tasks",
                    "Parallel review workflows for speed",
                    "Automated notifications and reminders",
                    "Document verification and validation",
                    "Real-time application status tracking",
                    "Comprehensive reporting and analytics"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card border-2 border-accent/20 rounded-lg p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Renewal Management Made Easy</h3>
                <p className="text-muted-foreground mb-6">
                  Manage multi-year scholarships with automated renewal workflows that track academic progress, verify continued eligibility, and streamline the renewal process for both administrators and recipients.
                </p>
                
                <div className="space-y-4">
                  {[
                    { label: "GPA Tracking", description: "Automatic GPA verification and monitoring" },
                    { label: "Progress Reports", description: "Collect and review academic progress updates" },
                    { label: "Conditional Renewals", description: "Set and enforce renewal criteria automatically" },
                    { label: "Multi-Year Awards", description: "Track awards across multiple academic years" }
                  ].map((item, idx) => (
                    <div key={idx} className="border-l-4 border-accent pl-4">
                      <div className="font-semibold text-foreground">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Trusted By Leading Institutions
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Universities, colleges, foundations, and organizations rely on RapidApplications to manage their scholarship programs efficiently and effectively.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Universities & Colleges",
                  description: "Manage institutional scholarships, departmental awards, and donor-funded programs with integrated financial aid system connections.",
                  examples: ["Harvard University", "State Universities", "Community Colleges"]
                },
                {
                  title: "Community Foundations",
                  description: "Administer multiple scholarship funds from different donors, track endowments, and provide comprehensive donor stewardship reporting.",
                  examples: ["Local Foundations", "Regional Foundations", "National Foundations"]
                },
                {
                  title: "Corporate & Private Foundations",
                  description: "Run employee scholarship programs, community investment initiatives, and strategic giving programs with impact measurement.",
                  examples: ["Corporate Foundations", "Family Foundations", "Private Foundations"]
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
              <h3 className="text-2xl font-bold text-foreground mb-6">Ready to streamline your scholarship program?</h3>
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
