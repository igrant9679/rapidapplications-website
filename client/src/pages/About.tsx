/* Federal Modernism Design: Comprehensive About page showcasing company information */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  TrendingUp, 
  Shield, 
  Users, 
  Zap, 
  Target, 
  Heart, 
  Lightbulb,
  CheckCircle2,
  Building2,
  FileCheck,
  Lock,
  Cloud,
  BarChart3,
  Accessibility
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-20 md:py-32">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                <span>ABOUT COMMUNITYFORCE</span>
              </div>
              
              <h1 className="text-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Transforming Awards Management Through Innovation
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
                Since 2010, CommunityForce has been at the forefront of transforming how government agencies, nonprofits, and enterprises manage awards and grants through our advanced AI-enabled platform.
              </p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-display text-3xl md:text-4xl font-bold mb-6">
                  Who We Are
                </h2>
                <div className="space-y-4 text-lg text-muted-foreground">
                  <p>
                    CommunityForce is at the forefront of transforming how government agencies, nonprofits, and enterprises manage awards and grants through our advanced AI-enabled platform. Our solutions are designed to streamline application workflows, enhance compliance, and ensure security, thereby facilitating transparency and efficiency in program management.
                  </p>
                  <p>
                    Founded in 2010, we have processed over 165 million applications and facilitated more than $569 million in awards. Our platform is trusted by leading organizations including the U.S. Air Force, Cybersecurity and Infrastructure Security Agency (CISA), U.S. Office of Personnel Management (OPM), and Harvard University.
                  </p>
                  <p>
                    As an Economically Disadvantaged Small Business, we combine agility and innovation with enterprise-grade security and compliance, making us the ideal partner for organizations that demand both excellence and value.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "165M+", label: "Applications Processed", icon: <FileCheck className="h-5 w-5" /> },
                  { value: "$569M+", label: "Awarded", icon: <Award className="h-5 w-5" /> },
                  { value: "15+ Years", label: "Federal Experience", icon: <Shield className="h-5 w-5" /> },
                  { value: "200+", label: "Organizations Served", icon: <Users className="h-5 w-5" /> }
                ].map((stat, idx) => (
                  <Card key={idx} className="text-center border-2 border-primary hover:border-primary/70 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-2 text-primary">{stat.icon}</div>
                      <div className="text-mono text-3xl font-bold text-primary mb-2">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-3xl md:text-4xl font-bold mb-6">
                  Our Mission
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We empower organizations to effectively deploy their resources and drive impactful outcomes through automated, compliant, and scalable management solutions. Our mission is to simplify the management of awards and grants, making it easier for our clients to focus on their core objectives.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                {[
                  {
                    icon: <Target className="h-6 w-6" />,
                    title: "Mission-Driven",
                    description: "We empower organizations to efficiently manage awards programs that change lives and advance important causes."
                  },
                  {
                    icon: <Heart className="h-6 w-6" />,
                    title: "Customer-Focused",
                    description: "Your success is our success. We partner with you to understand your unique needs and deliver tailored solutions."
                  },
                  {
                    icon: <Lightbulb className="h-6 w-6" />,
                    title: "Innovation-Led",
                    description: "We continuously invest in AI and automation to help you work smarter, not harder, and stay ahead of evolving requirements."
                  }
                ].map((value, idx) => (
                  <Card key={idx} className="border-2 border-border hover:border-primary transition-colors">
                    <CardContent className="p-8 text-center">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <div className="text-primary">{value.icon}</div>
                      </div>
                      <h3 className="text-display text-xl font-bold mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Expertise and Core Values */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Our Expertise & Core Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Delivering comprehensive solutions that drive operational excellence and mission success.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="h-8 w-8" />,
                  title: "End-to-End Automation",
                  description: "We provide a seamless experience from pre-award to post-award workflows, allowing our partners to streamline processes efficiently.",
                  color: "primary"
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Compliance & Security",
                  description: "Our platform is FedRAMP-ready and Section 508 accessible, ensuring that all data is managed with the highest standards of security.",
                  color: "accent"
                },
                {
                  icon: <Building2 className="h-8 w-8" />,
                  title: "Seamless Integrations",
                  description: "We connect with systems like Salesforce, PeopleSoft, and MS 365, providing versatile tools for diverse user needs.",
                  color: "primary"
                }
              ].map((expertise, idx) => (
                <Card key={idx} className="border-2 border-border hover:border-primary transition-colors">
                  <CardContent className="p-8">
                    <div className={`h-16 w-16 rounded-lg bg-${expertise.color}/10 flex items-center justify-center mb-4`}>
                      <div className={`text-${expertise.color}`}>{expertise.icon}</div>
                    </div>
                    <h3 className="text-display text-xl font-bold mb-3">{expertise.title}</h3>
                    <p className="text-muted-foreground">{expertise.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Proven Success with Federal Agencies
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our partnerships with federal agencies demonstrate our effectiveness in delivering tailored solutions that drive operational excellence.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  organization: "U.S. Air Force",
                  description: "We implemented an automated financial forms solution, enhancing their cloud-based learning ecosystems and streamlining critical operational processes.",
                  icon: <Shield className="h-6 w-6" />
                },
                {
                  organization: "Cybersecurity and Infrastructure Security Agency (CISA)",
                  description: "Developed comprehensive strategies for records and information management, significantly improving operational efficiency and compliance.",
                  icon: <Lock className="h-6 w-6" />
                },
                {
                  organization: "U.S. Office of Personnel Management (OPM)",
                  description: "Designed an enterprise electronic records management system that automates digital records, ensuring compliance and accessibility.",
                  icon: <FileCheck className="h-6 w-6" />
                }
              ].map((caseStudy, idx) => (
                <Card key={idx} className="border-2 border-primary">
                  <CardContent className="p-8">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <div className="text-primary">{caseStudy.icon}</div>
                    </div>
                    <h3 className="text-display text-xl font-bold mb-3">{caseStudy.organization}</h3>
                    <p className="text-muted-foreground">{caseStudy.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Past Performance and Achievements */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Recognition & Achievements
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                With over 15 years of experience, we have been recognized for our significant growth and reliability.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Award className="h-8 w-8" />,
                  title: "Inc. 5000",
                  description: "Ranked #646 with 725% growth as one of the fastest-growing private companies in America",
                  color: "primary"
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "FedRAMP Ready",
                  description: "Federal security standards compliance for mission-critical applications",
                  color: "primary"
                },
                {
                  icon: <TrendingUp className="h-8 w-8" />,
                  title: "Small Business",
                  description: "Economically Disadvantaged Small Business certification",
                  color: "accent"
                },
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Trusted Partner",
                  description: "Trusted by federal agencies and leading nonprofits globally",
                  color: "accent"
                }
              ].map((achievement, idx) => (
                <Card key={idx} className="text-center border-2 border-border hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className={`h-16 w-16 rounded-lg bg-${achievement.color}/10 flex items-center justify-center mx-auto mb-4`}>
                      <div className={`text-${achievement.color}`}>{achievement.icon}</div>
                    </div>
                    <h3 className="text-display text-lg font-bold mb-2">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Certifications & Expertise
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Our team comprises certified experts delivering excellence across critical technology domains.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Cloud className="h-6 w-6" />,
                  title: "Cloud Migration",
                  description: "Enterprise cloud transformation expertise"
                },
                {
                  icon: <Target className="h-6 w-6" />,
                  title: "Program Management",
                  description: "Certified project and program management"
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "AI-Powered Analytics",
                  description: "Advanced AI and data analytics capabilities"
                },
                {
                  icon: <Accessibility className="h-6 w-6" />,
                  title: "Accessibility Compliance",
                  description: "Section 508 and WCAG compliance expertise"
                }
              ].map((cert, idx) => (
                <Card key={idx} className="border-2 border-accent hover:border-accent/70 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                      <div className="text-accent">{cert.icon}</div>
                    </div>
                    <h3 className="text-display font-bold mb-2">{cert.title}</h3>
                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* ISO Certifications Logo */}
            <div className="mt-16 flex justify-center">
              <Card className="border-2 border-primary hover:border-primary/70 transition-colors">
                <CardContent className="p-8">
                  <div className="text-center mb-4">
                    <h3 className="text-display text-xl font-bold mb-2">ISO Certified</h3>
                    <p className="text-sm text-muted-foreground">Quality Management & Information Security</p>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src="/images/ISOCerts.png" 
                      alt="ISO 9001 and ISO 27001 Certifications" 
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contract Vehicles and Partnerships */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-3xl md:text-4xl font-bold mb-6">
                  Contract Vehicles & Partnerships
                </h2>
                <p className="text-lg text-muted-foreground">
                  CommunityForce collaborates with various federal agencies through established contract vehicles, enhancing our reach and capabilities.
                </p>
              </div>
              
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-display text-lg font-bold mb-2">Department of Defense</h3>
                        <p className="text-muted-foreground">
                          We proudly serve organizations within the Department of Defense, delivering mission-critical solutions that meet the highest security and operational standards.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-accent/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lock className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-display text-lg font-bold mb-2">Department of Homeland Security</h3>
                        <p className="text-muted-foreground">
                          Our ongoing partnerships with major federal entities highlight our commitment to providing effective solutions for mission-critical applications.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-display text-lg font-bold mb-2">Federal Contract Vehicles</h3>
                        <p className="text-muted-foreground">
                          We maintain established contract vehicles that enable rapid deployment and seamless collaboration with federal agencies across multiple departments.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-muted via-background to-muted">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                Why Choose CommunityForce
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                CommunityForce is dedicated to excellence, growth, and impact. Our innovative approach not only supports small businesses but also catalyzes transformative successes across multiple sectors.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: "Proven Track Record",
                  description: "15+ years of experience with 165M+ applications processed and $569M+ awarded, trusted by leading federal agencies and organizations worldwide."
                },
                {
                  title: "Federal Compliance Expertise",
                  description: "FedRAMP-ready platform with Section 508 accessibility compliance, ensuring the highest standards of security and regulatory adherence."
                },
                {
                  title: "AI-Powered Innovation",
                  description: "Advanced AI and automation capabilities that streamline workflows, enhance efficiency, and enable data-driven decision making."
                },
                {
                  title: "Small Business Agility",
                  description: "Economically Disadvantaged Small Business combining enterprise-grade solutions with the flexibility and responsiveness of a dedicated partner."
                },
                {
                  title: "Comprehensive Integration",
                  description: "Seamless connections with existing systems like Salesforce, PeopleSoft, and MS 365, providing versatile tools for diverse organizational needs."
                },
                {
                  title: "Mission-Critical Reliability",
                  description: "Uniquely positioned to help organizations navigate the complexities of grant management and program delivery with proven operational excellence."
                }
              ].map((reason, idx) => (
                <Card key={idx} className="border-2 border-border hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-display font-bold mb-2">{reason.title}</h3>
                        <p className="text-sm text-muted-foreground">{reason.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-background">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-display text-3xl md:text-4xl font-bold mb-4">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground">
                  We'd love to hear from you and discuss how CommunityForce can support your mission.
                </p>
              </div>
              
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-display text-xl font-bold mb-4">Contact Information</h3>
                      <div className="space-y-3 text-muted-foreground">
                        <p>
                          <span className="font-semibold text-foreground">Phone:</span><br />
                          1-888-829-5003
                        </p>
                        <p>
                          <span className="font-semibold text-foreground">Address:</span><br />
                          44335 Premier Plaza, Suite 110<br />
                          Ashburn, VA 20147
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-display text-xl font-bold mb-4">Schedule a Conversation</h3>
                      <p className="text-muted-foreground mb-6">
                        Book a demo or speak with our team to learn how CommunityForce can help your organization.
                      </p>
                      <div className="space-y-3">
                        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                          <a href="https://calendly.com/d/cn55-wdb-c65?utm_source=Website&utm_medium=Demo&utm_campaign=Marketing" target="_blank" rel="noopener noreferrer">
                            Book a Demo
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                          <a href="https://calendly.com/communityforce/communityforce-discovery?utm_source=Website&utm_medium=Discovery%20Call&utm_campaign=Marketing" target="_blank" rel="noopener noreferrer">
                            Talk to an Expert
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
