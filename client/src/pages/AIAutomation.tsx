/* Federal Modernism Design: AI Automation Services Detail */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Cpu,
  CheckCircle2,
  Zap,
  TrendingUp,
  Shield,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  Users,
  Target,
  Award
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function AIAutomation() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20 md:py-32">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Cpu className="h-4 w-4" />
                <span>AI AUTOMATION AGENCY • GOVERNMENT & ENTERPRISE</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                AI Automation Services for Federal Agencies
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive artificial intelligence and automation solutions tailored to government and enterprise requirements. Since 2018, RapidApplications has been at the forefront of AI automation for business and government applications, delivering measurable ROI through intelligent process optimization.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/expert">Request AI Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/government-services">View All Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Three Service Pillars */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Comprehensive AI Automation Services
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                End-to-end AI automation support from strategic planning through implementation and ongoing optimization, ensuring sustained value delivery.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* AI Audit & Strategy */}
              <Card className="border-primary">
                <CardContent className="p-8 space-y-6">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">AI Audit & Strategy</h3>
                    <p className="text-muted-foreground mb-6">
                      Uncover hidden opportunities in your operations with a comprehensive AI audit. We analyze workflows, identify automation potential, and deliver a strategic roadmap with measurable ROI projections so you know where AI will drive value before you invest.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground text-sm">What's Included</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive process mapping and bottleneck identification</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>AI opportunity matrix analyzing impact versus effort</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Prioritized implementation roadmap with phased approach</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Detailed ROI calculations for top opportunities</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Risk assessment and mitigation strategies</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Technology evaluation and vendor comparisons</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Stakeholder engagement and resource planning</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Compliance analysis for federal security standards</span>
                      </li>
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact/expert">Request AI Audit</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* AI Implementation & Automation */}
              <Card className="border-accent">
                <CardContent className="p-8 space-y-6">
                  <div className="h-16 w-16 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-accent" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">AI Implementation & Automation</h3>
                    <p className="text-muted-foreground mb-6">
                      Transform opportunity into reality. We build and deploy custom AI automation solutions tailored to your needs—from intelligent document processing to conversational AI systems—all designed to integrate seamlessly with your existing infrastructure.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground text-sm">What We Deliver</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Custom AI development tailored to agency requirements</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>System integration with existing federal IT infrastructure</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Intelligent document processing and data extraction</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Conversational AI and intelligent chatbots</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Workflow automation and process optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Model training and optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Security controls meeting federal standards</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-accent mr-2 mt-0.5 flex-shrink-0" />
                        <span>Comprehensive documentation and training</span>
                      </li>
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact/expert">Discuss Implementation</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* AI Advisory, Optimization & Governance */}
              <Card className="border-primary">
                <CardContent className="p-8 space-y-6">
                  <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">AI Advisory, Optimization & Governance</h3>
                    <p className="text-muted-foreground mb-6">
                      Your AI transformation doesn't end at deployment. We provide ongoing guidance, performance monitoring, and continuous optimization—plus enablement and governance support—to keep adoption high and results compounding over time.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground text-sm">Ongoing Support</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Performance monitoring and analytics</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Continuous improvement recommendations</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Model retraining and optimization</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Change management and user enablement</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Strategic advisory on emerging AI technologies</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Governance framework development</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Risk management and compliance monitoring</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span>Knowledge transfer and capability building</span>
                      </li>
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact/expert">Learn About Advisory</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Technology Stack & Capabilities
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Leveraging cutting-edge AI technologies and cloud platforms to deliver intelligent automation solutions that meet federal security and compliance requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">AI & Machine Learning</h3>
                  <p className="text-sm text-muted-foreground">
                    TensorFlow, PyTorch, scikit-learn, Hugging Face transformers for custom model development and training.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Natural Language Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    GPT models, BERT, custom language models for conversational AI and document understanding.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Robotic Process Automation</h3>
                  <p className="text-sm text-muted-foreground">
                    AI and robotic process automation integration for intelligent workflow orchestration.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Document Intelligence</h3>
                  <p className="text-sm text-muted-foreground">
                    Computer vision, OCR, form recognition for automated document processing and data extraction.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Cloud Platforms</h3>
                  <p className="text-sm text-muted-foreground">
                    AWS, Azure, Google Cloud with FedRAMP authorized services for secure federal deployments.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Data Engineering</h3>
                  <p className="text-sm text-muted-foreground">
                    Apache Spark, Kafka, data warehousing solutions for AI training and inference workloads.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Automation Use Cases */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                AI Automation Use Cases
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Real-world applications of AI automation delivering measurable efficiency gains and operational improvements for federal agencies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Intelligent Document Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        Automate extraction, classification, and routing of documents including forms, contracts, and reports. Reduce manual processing time by 78% while improving accuracy from 88% to 98%.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Conversational AI & Chatbots</h3>
                      <p className="text-sm text-muted-foreground">
                        Deploy intelligent chatbots for citizen services and internal operations. Handle routine inquiries 24/7, reducing help desk workload by 60% while improving response times.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Settings className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Workflow Automation</h3>
                      <p className="text-sm text-muted-foreground">
                        Intelligent routing, approvals, notifications, and automated reporting. Reduce approval cycle times from 120 days to 45 days through AI-powered process optimization.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-2">Predictive Analytics</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered data analysis identifying trends, anomalies, and optimization opportunities. Support $2B+ in annual IT investment decisions with certified, authoritative data.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose RapidApplications */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose RapidApplications for AI Automation
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Unique combination of federal contracting experience and commercial AI innovation delivering proven results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Proven Federal Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    10+ years delivering complex programs for U.S. Air Force and DoD with 100% on-time, on-budget performance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Cpu className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">AI Pioneer Since 2018</h3>
                  <p className="text-sm text-muted-foreground">
                    7 years pioneering AI-driven automation solutions with deep expertise in machine learning and intelligent process optimization.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Security Cleared Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Team members with active Secret and Top Secret clearances, experienced on classified programs with zero security incidents.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Compliance Focus</h3>
                  <p className="text-sm text-muted-foreground">
                    Deep expertise in NIST 800-53, FISMA, FedRAMP, Section 508, and federal data governance requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Measurable ROI</h3>
                  <p className="text-sm text-muted-foreground">
                    Proven track record delivering 60-78% efficiency improvements, $12M+ in identified cost savings, and sustained operational gains.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-bold text-foreground">Long-term Partnership</h3>
                  <p className="text-sm text-muted-foreground">
                    Sustained customer relationships with ongoing advisory, optimization, and governance support ensuring continued value delivery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h2 className="text-display text-3xl md:text-4xl font-bold text-foreground">
                Ready to Explore AI Automation for Your Agency?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover how RapidApplications can help your agency modernize operations, reduce manual processes, and achieve measurable efficiency gains through intelligent automation tailored to federal requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/contact/expert">Request AI Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/government-services/federal-projects">View Federal Projects</Link>
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
