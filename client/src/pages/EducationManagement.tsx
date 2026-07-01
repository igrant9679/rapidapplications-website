import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Shield,
  Smartphone,
  CheckCircle2,
  FileCheck,
  Award,
  BarChart3,
  Calendar,
  DollarSign,
  Bell,
  UserCheck
} from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function EducationManagement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <GraduationCap className="h-4 w-4" />
                <span>EDUCIAN • INTEGRATED WITH RAPIDAPPLICATIONS</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Educian: Education Management for Modern Institutions
              </h1>
              
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                Educian, integrated with RapidApplications, manages the complete student journey from admissions through graduation. Streamline operations, engage parents, and improve student outcomes with our unified platform built specifically for K-12 schools and districts.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/book-demo">Book a Demo</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-background text-foreground hover:bg-background/90" asChild>
                  <Link href="/contact/talk-to-expert">Talk to an Expert</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* The Challenge Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                The Challenge: Disconnected Systems, Poor Outcomes
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Most educational institutions struggle with fragmented systems, manual processes, and disconnected stakeholders—leading to operational inefficiencies and poor student outcomes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Slow Enrollment Processes",
                  desc: "Manual application review takes 7-10 days, conversion rates of only 25-30%, and payment collection delays of 30-45 days cost institutions significant revenue.",
                  icon: <FileCheck className="h-8 w-8" />,
                  impact: "Lost Revenue"
                },
                {
                  title: "High Student Dropout Rates",
                  desc: "Chaotic onboarding, disconnected parents (70% disengaged), and lack of early intervention systems lead to 12-15% first-year dropout rates.",
                  icon: <Users className="h-8 w-8" />,
                  impact: "Student Attrition"
                },
                {
                  title: "Inefficient Operations",
                  desc: "Multiple disconnected systems (5-8 vendors), manual data entry, poor fee collection (80% rate, 45-day cycles), and 80+ hours monthly on reconciliation.",
                  icon: <BarChart3 className="h-8 w-8" />,
                  impact: "Operational Costs"
                }
              ].map((challenge, idx) => (
                <Card key={idx} className="border-2 border-destructive/20">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive mb-6">
                      {challenge.icon}
                    </div>
                    <h3 className="text-display text-xl font-bold text-foreground mb-3">
                      {challenge.title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {challenge.desc}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-semibold">
                      {challenge.impact}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Complete Student Lifecycle Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Complete Student Lifecycle Management
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                RapidApplications manages every stage of the student journey from first inquiry through graduation and alumni engagement—all in one unified platform.
              </p>
            </div>
            
            <div className="space-y-12">
              {/* Stage 1: Attract & Enroll */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          1
                        </div>
                        <h3 className="text-display text-2xl font-bold text-primary">
                          Attract & Enroll
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Streamline admissions from inquiry through enrollment with digital applications, automated workflows, and integrated payments.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Customizable online application forms",
                          "Automated document verification",
                          "Multi-stage approval workflows",
                          "Interview scheduling and tracking",
                          "Integrated payment gateways",
                          "Real-time application status tracking"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h4 className="font-semibold text-foreground mb-4">Measurable Results:</h4>
                      <div className="space-y-4">
                        {[
                          { metric: "Application Processing", before: "7-10 days", after: "2-3 days", improvement: "70% faster" },
                          { metric: "Conversion Rate", before: "25-30%", after: "40-45%", improvement: "+50%" },
                          { metric: "Document Errors", before: "15-20%", after: "<2%", improvement: "90% reduction" },
                          { metric: "Payment Collection", before: "30-45 days", after: "7-10 days", improvement: "75% faster" }
                        ].map((result, idx) => (
                          <div key={idx} className="border-l-4 border-primary pl-4">
                            <div className="text-sm font-semibold text-foreground">{result.metric}</div>
                            <div className="text-xs text-muted-foreground">
                              {result.before} → {result.after} ({result.improvement})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stage 2: Onboard & Engage */}
              <Card className="border-2 border-accent/20">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                          2
                        </div>
                        <h3 className="text-display text-2xl font-bold text-accent">
                          Onboard & Engage
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Create seamless onboarding experiences and maintain high parent engagement through mobile apps and real-time communication.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Streamlined enrollment workflow (3-5 days)",
                          "Automated section and class assignments",
                          "Instant timetable generation",
                          "Digital ID card creation",
                          "Parent engagement mobile app",
                          "Real-time attendance and grade alerts",
                          "Direct teacher messaging"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6">
                      <h4 className="font-semibold text-foreground mb-4">Measurable Results:</h4>
                      <div className="space-y-4">
                        {[
                          { metric: "Onboarding Time", before: "2-3 weeks", after: "3-5 days", improvement: "70% faster" },
                          { metric: "Assignment Errors", before: "10-15%", after: "<1%", improvement: "95% reduction" },
                          { metric: "Parent Engagement", before: "30%", after: "75%", improvement: "2.5x increase" },
                          { metric: "First-Year Dropout", before: "12-15%", after: "7-9%", improvement: "40% reduction" }
                        ].map((result, idx) => (
                          <div key={idx} className="border-l-4 border-accent pl-4">
                            <div className="text-sm font-semibold text-foreground">{result.metric}</div>
                            <div className="text-xs text-muted-foreground">
                              {result.before} → {result.after} ({result.improvement})
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stage 3: Deliver & Assess */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      3
                    </div>
                    <h3 className="text-display text-2xl font-bold text-primary">
                      Deliver & Assess
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Manage academic delivery, track attendance, conduct examinations, and generate comprehensive performance reports.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Academic Management",
                        items: ["Timetable creation", "Study materials sharing", "Assignment management", "Virtual classroom integration", "Academic calendar"]
                      },
                      {
                        title: "Attendance Tracking",
                        items: ["Real-time digital attendance", "Automated alerts", "Absence management", "Compliance reporting", "Pattern analysis"]
                      },
                      {
                        title: "Examination Management",
                        items: ["Multiple grading systems", "Automated report cards", "Admit card generation", "Exam analytics", "Grade aggregation"]
                      }
                    ].map((category, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-foreground mb-3">{category.title}</h4>
                        <ul className="space-y-2">
                          {category.items.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stage 4: Support & Retain */}
              <Card className="border-2 border-accent/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">
                      4
                    </div>
                    <h3 className="text-display text-2xl font-bold text-accent">
                      Support & Retain
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Identify at-risk students early, provide comprehensive support services, and maintain student health and safety.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Early Warning System",
                        desc: "Automated monitoring of attendance patterns, academic performance, and behavioral indicators to identify at-risk students before issues escalate.",
                        icon: <Bell className="h-6 w-6" />
                      },
                      {
                        title: "Concern Management",
                        desc: "Centralized ticketing system for parents, students, and staff with automatic routing, escalation rules, and resolution tracking.",
                        icon: <UserCheck className="h-6 w-6" />
                      },
                      {
                        title: "Health & Safety",
                        desc: "Complete medical histories, vaccination tracking, incident reporting, and emergency case documentation for student wellbeing.",
                        icon: <Shield className="h-6 w-6" />
                      },
                      {
                        title: "Support Services",
                        desc: "Transport management with GPS tracking, hostel operations, library management, and comprehensive student services.",
                        icon: <Users className="h-6 w-6" />
                      }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stage 5: Credential & Launch */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="grid lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                          5
                        </div>
                        <h3 className="text-display text-2xl font-bold text-primary">
                          Credential & Launch
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        Automate certificate generation, manage placement activities, and maintain alumni relationships for long-term engagement.
                      </p>
                      <ul className="space-y-3">
                        {[
                          "Automated certificate generation (transcripts, diplomas, bonafide)",
                          "Placement hub with company onboarding",
                          "Student eligibility screening",
                          "Campus drive management",
                          "Internship tracking",
                          "Alumni engagement and tracking"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 text-center">
                      <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-foreground mb-2">
                        Complete Lifecycle Coverage
                      </h4>
                      <p className="text-muted-foreground">
                        From first inquiry through alumni engagement, RapidApplications manages every touchpoint in the student journey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Operational Pillars Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Operational Excellence Built-In
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Beyond student lifecycle management, RapidApplications provides comprehensive financial and workforce management capabilities.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Financial Health */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <DollarSign className="h-10 w-10 text-primary" />
                    <h3 className="text-display text-2xl font-bold text-primary">
                      Financial Health
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Intelligent fee management, automated reconciliation, and real-time financial visibility.
                  </p>
                  <div className="space-y-4 mb-6">
                    {[
                      "Automated invoice generation",
                      "Multiple payment gateway integration",
                      "Real-time payment reconciliation",
                      "Automated collection reminders",
                      "Expense management and tracking",
                      "Budget monitoring and forecasting",
                      "Comprehensive financial dashboards"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="text-sm font-semibold text-primary mb-2">Measurable Impact:</div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Collection rate: 80% → 95% (+15 points)</li>
                      <li>• Collection time: 45 days → 15 days (67% faster)</li>
                      <li>• Reconciliation: 80 hrs/mo → 5 hrs/mo (94% reduction)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Workforce Excellence */}
              <Card className="border-2 border-accent/20">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Users className="h-10 w-10 text-accent" />
                    <h3 className="text-display text-2xl font-bold text-accent">
                      Workforce Excellence
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive HR management from recruitment through payroll and performance tracking.
                  </p>
                  <div className="space-y-4 mb-6">
                    {[
                      "Employee data and service management",
                      "Recruitment and onboarding",
                      "Attendance and leave management",
                      "Payroll processing and compliance",
                      "Performance review tracking",
                      "Training and development",
                      "Faculty workload management"
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-accent/5 rounded-lg p-4">
                    <div className="text-sm font-semibold text-accent mb-2">Key Benefits:</div>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Automated payroll with statutory compliance</li>
                      <li>• Biometric and face recognition integration</li>
                      <li>• Employee self-service portal</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why RapidApplications Section */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose Educian?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "One Unified Platform",
                  desc: "Single platform for all student lifecycle stages vs. 5-8 disconnected systems. One login per user, automatic data flow, one vendor relationship."
                },
                {
                  icon: <Smartphone className="h-8 w-8" />,
                  title: "Mobile-First Experience",
                  desc: "Native iOS and Android apps with full functionality. Real-time notifications and 70-80% parent engagement vs. 30-40% industry average."
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Modern Cloud Architecture",
                  desc: "Cloud-native platform with no servers needed. Continuous automatic updates, accessible anywhere, and modern intuitive UI/UX."
                },
                {
                  icon: <DollarSign className="h-8 w-8" />,
                  title: "Transparent Pricing",
                  desc: "Predictable subscription pricing with all modules included. Implementation and training included with no surprise costs."
                },
                {
                  icon: <GraduationCap className="h-8 w-8" />,
                  title: "Education Expertise",
                  desc: "Built exclusively for educational institutions with deep domain expertise and 100% focus on education sector needs."
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Measurable ROI",
                  desc: "Improved enrollment conversion, reduced dropout rates, faster fee collection, and increased operational efficiency with clear metrics."
                }
              ].map((benefit, idx) => (
                <Card key={idx}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold">
                Ready to Transform Your Institution?
              </h2>
              <p className="text-lg text-primary-foreground/90">
                See how Educian, integrated with RapidApplications, can streamline operations, improve student outcomes, and deliver measurable ROI for your educational institution.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <Card className="bg-background text-foreground">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Calendar className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-display text-xl font-bold">Schedule a Live Demo</h3>
                    <p className="text-sm text-muted-foreground">
                      See the platform in action with scenarios specific to your institution
                    </p>
                    <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                      <Link href="/contact/book-demo">Book a Demo</Link>
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="bg-background text-foreground">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-display text-xl font-bold">Talk to Our Team</h3>
                    <p className="text-sm text-muted-foreground">
                      Discuss your specific needs and see how we can help your institution
                    </p>
                    <Button size="lg" variant="outline" className="w-full" asChild>
                      <Link href="/contact/talk-to-expert">Talk to an Expert</Link>
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
