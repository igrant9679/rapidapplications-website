/* Federal Modernism Design: LSI Media Digital Transformation Partner Solution Page */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Shield, 
  Zap,
  CheckCircle2,
  Brain,
  Building2,
  Workflow,
  FileCheck,
  Users,
  Lock,
  TrendingUp,
  Lightbulb,
  Megaphone,
  Palette
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function DigitalTransformation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-muted via-background to-muted py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/abstract-network.png')] opacity-5 bg-cover bg-center" />
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              {/* LSI Media Logo */}
              <div className="flex justify-center">
                <div className="bg-white px-8 py-4 rounded-lg shadow-md">
                  <img 
                    src="/images/lsimedia-logo.png" 
                    alt="LSI Media LLC" 
                    className="h-12 w-auto"
                  />
                </div>
              </div>
              
              <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>LSI MEDIA LLC • INTEGRATED WITH COMMUNITYFORCE</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Digital Transformation & Creative Excellence
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                LSI Media LLC delivers comprehensive digital transformation, AI automation, government services, digital marketing, and creative solutions that help organizations modernize operations and achieve their strategic goals.
              </p>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-primary">12+</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="text-mono text-2xl font-bold text-accent">100's</div>
                  <div className="text-sm text-muted-foreground">Projects Created</div>
                </div>
                <div className="bg-card border border-border rounded-lg p-4 col-span-2 md:col-span-1">
                  <div className="text-mono text-2xl font-bold text-primary">Federal</div>
                  <div className="text-sm text-muted-foreground">Compliance Ready</div>
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

        {/* Four Core Service Areas */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Comprehensive Digital Solutions
              </h2>
              <p className="text-lg text-muted-foreground">
                LSI Media delivers four integrated service areas that transform awards management operations: AI automation, government compliance, digital marketing technology, and creative excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* AI Automation & Transformation */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    AI Automation & Transformation
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Revolutionize operations through intelligent automation
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Transform awards management workflows with cutting-edge AI technology that streamlines processes, enhances efficiency, and enables data-driven decision making across the entire awards lifecycle.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">AI-powered workflow automation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Comprehensive AI audit & assessment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Marketing automation integration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Data-driven insights and analytics</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Creative excellence meets AI innovation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Government Services */}
              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="p-8">
                  <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Shield className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    Government Services
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Federal-grade solutions for public sector excellence
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Navigate complex regulatory environments with specialized solutions designed for federal agencies and government entities, ensuring compliance, security, and modernization at the highest standards.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Section 508 accessibility compliance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Enterprise architecture & digital transformation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Federal contracting expertise</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Business capability lifecycle management</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Secure modernization initiatives</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Digital Marketing Technology Integration */}
              <Card className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Megaphone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    Digital Marketing Technology Integration
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Social media and campaign management excellence
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Comprehensive social media and campaign management solutions that integrate cutting-edge digital marketing technologies, combining data analytics with creative strategies to optimize presence, execute targeted campaigns, and maximize engagement.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Social media platform optimization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Targeted campaign execution</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Marketing technology integration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Data analytics and performance tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Automated workflow creation</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Creative Services */}
              <Card className="border-2 hover:border-accent transition-colors">
                <CardContent className="p-8">
                  <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Palette className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-display text-2xl font-bold text-foreground mb-4">
                    Creative Services
                  </h3>
                  <p className="text-sm text-accent font-medium mb-4">
                    Websites, videos, and graphic design excellence
                  </p>
                  <p className="text-muted-foreground mb-6">
                    Full spectrum of creative services encompassing professional website design, video production, and graphic design solutions that develop visually compelling digital experiences aligned with brand objectives and modern design principles.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Custom website design and development</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Professional video production</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Graphic design and branding</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Multimedia content creation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Brand message communication</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Digital Transformation Applications */}
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Transform Your Organization's Operations
              </h2>
              <p className="text-lg text-muted-foreground">
                LSI Media brings AI automation, government-grade compliance, digital marketing expertise, and creative excellence to help organizations across all sectors modernize and optimize their operations.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Intelligent Application Processing */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Workflow className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Intelligent Application Processing
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Automate application intake, screening, and routing with AI-powered workflows that reduce manual effort and accelerate processing.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Automated eligibility screening</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Smart document classification</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Intelligent routing and assignment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance & Accessibility */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileCheck className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Compliance & Accessibility
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Ensure federal compliance and accessibility standards across all digital touchpoints and workflows.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Section 508 accessibility compliance</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Digital forms modernization</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Regulatory environment navigation</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Analytics & Insights */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Data Analytics & Insights
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Transform awards data into actionable insights with AI-powered analytics and comprehensive reporting.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>AI data analyst capabilities</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Predictive analytics and forecasting</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                          <span>Data-driven decision support</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Digital Transformation */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-3">
                        Enterprise Digital Transformation
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Modernize legacy systems and processes with enterprise-grade digital transformation strategies.
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Enterprise architecture modernization</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Legacy system integration</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                          <span>Certified data delivery</span>
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
                Partner with CommunityForce
              </h2>
              <p className="text-lg text-muted-foreground">
                LSI Media partners with CommunityForce to bring comprehensive digital transformation, AI automation, government services, digital marketing, and creative excellence to organizations seeking to modernize their operations and achieve strategic goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    AI-Powered Automation
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Intelligent workflow automation that reduces manual effort and accelerates organizational processes across all operational areas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Shield className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Federal Compliance
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Government-grade security and compliance that meets stringent federal requirements and accessibility standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Creative Excellence
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Merging AI innovation with creative strategies to deliver engaging, user-friendly digital experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Building2 className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Enterprise Architecture
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive enterprise architecture and digital transformation expertise for complex organizations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    User Experience Focus
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Digital marketing and design expertise that creates intuitive, accessible experiences for all users.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-6">
                  <Lock className="h-10 w-10 text-accent mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    Secure Modernization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Safe, secure digital transformation that protects sensitive data while enabling innovation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Proven Track Record */}
        <section className="py-20 bg-muted">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Proven Track Record
              </h2>
              <p className="text-lg text-muted-foreground">
                12+ years delivering AI amplified impact across commercial and government sectors
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Commercial Sector</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">AI-powered marketing automation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Digital transformation initiatives</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Creative digital solutions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">100's of successful projects</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Government Sector</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Federal agency digital transformation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Section 508 compliance expertise</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Enterprise architecture modernization</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Secure, compliant solutions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-accent text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold">
                Ready to Transform Your Organization?
              </h2>
              <p className="text-lg opacity-90">
                See how LSI Media's comprehensive digital transformation, AI automation, government services, digital marketing, and creative solutions can help your organization modernize operations and achieve strategic goals.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <Card className="bg-white text-foreground">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-bold mb-3">Schedule a Live Demo</h3>
                    <p className="text-muted-foreground mb-6">
                      See AI automation, digital marketing, and creative solutions in action with real-world transformation scenarios
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
                      Discuss your digital transformation goals and federal compliance requirements
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
