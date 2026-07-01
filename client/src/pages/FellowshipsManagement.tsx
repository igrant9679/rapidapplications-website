import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Users, TrendingUp, FileCheck, Award, Network, Target, Briefcase } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FellowshipsManagement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary-foreground/10 px-4 py-2 rounded-full text-sm font-medium">
                <Network className="h-4 w-4" />
                <span>COHORT MANAGEMENT • ALUMNI ENGAGEMENT • IMPACT TRACKING</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Fellowship Management Software for Research & Professional Programs
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Manage competitive fellowship programs from application through alumni engagement with cohort-based workflows, mentorship tracking, and comprehensive outcomes measurement.
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

        {/* Key Features Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Fellowship Lifecycle Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                From competitive selection through alumni engagement, RapidApplications provides specialized tools for managing research fellowships, professional development programs, and leadership initiatives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileCheck className="h-8 w-8" />,
                  title: "Application & Selection",
                  description: "Manage competitive application processes, expert review panels, interview scheduling, and selection committees with comprehensive evaluation tools."
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Cohort Management",
                  description: "Organize fellows into cohorts, track program participation, manage cohort activities, and facilitate peer networking and collaboration."
                },
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Program Administration",
                  description: "Track fellowship terms, manage stipends and benefits, coordinate training activities, and maintain comprehensive fellow records."
                },
                {
                  icon: <Target className="h-8 w-8" />,
                  title: "Mentorship Programs",
                  description: "Match fellows with mentors, track mentorship relationships, schedule check-ins, and measure mentorship program effectiveness."
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Outcomes & Impact",
                  description: "Track research outputs, publications, career progression, and long-term impact metrics to demonstrate program effectiveness."
                },
                {
                  icon: <Network className="h-8 w-8" />,
                  title: "Alumni Engagement",
                  description: "Maintain alumni database, coordinate networking events, track career achievements, and leverage alumni for program support and mentorship."
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

        {/* Cohort-Based Programs Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Purpose-Built for Cohort-Based Programs
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Unlike generic scholarship platforms, RapidApplications is designed specifically for fellowship programs that require cohort management, ongoing engagement, and long-term outcomes tracking.
                </p>
                
                <div className="space-y-4">
                  {[
                    "Cohort-based program structure and workflows",
                    "Multi-year fellowship tracking and management",
                    "Integrated mentorship program coordination",
                    "Research output and publication tracking",
                    "Career development milestone monitoring",
                    "Alumni network management and engagement",
                    "Program outcomes and impact measurement",
                    "Longitudinal data collection and analysis"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Research Fellowships</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage postdoctoral fellowships, research grants, and academic programs with publication tracking, IRB integration, and research milestone monitoring.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Target className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Professional Development</h3>
                        <p className="text-sm text-muted-foreground">
                          Coordinate leadership programs, executive fellowships, and professional development initiatives with competency tracking and career progression monitoring.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                        <Network className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Policy & Civic Engagement</h3>
                        <p className="text-sm text-muted-foreground">
                          Support policy fellowships, civic leadership programs, and government service initiatives with placement tracking and impact assessment.
                        </p>
                      </div>
                    </div>
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
                Trusted By Leading Fellowship Programs
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Universities, research institutions, foundations, and government agencies rely on RapidApplications to manage their competitive fellowship programs.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "Universities & Research Institutions",
                  description: "Manage postdoctoral fellowships, graduate research programs, and faculty development initiatives with integrated research tracking.",
                  examples: ["Postdoctoral Programs", "Graduate Fellowships", "Faculty Development"]
                },
                {
                  title: "Foundations & Nonprofits",
                  description: "Administer competitive fellowship programs, leadership initiatives, and professional development opportunities with comprehensive impact measurement.",
                  examples: ["Leadership Programs", "Policy Fellowships", "Social Impact Initiatives"]
                },
                {
                  title: "Government Agencies",
                  description: "Coordinate federal fellowship programs, intergovernmental exchanges, and public service initiatives with compliance tracking and reporting.",
                  examples: ["Federal Fellowships", "Public Service Programs", "International Exchanges"]
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
              <h3 className="text-2xl font-bold text-foreground mb-6">Ready to elevate your fellowship program?</h3>
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
