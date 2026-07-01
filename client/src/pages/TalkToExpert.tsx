import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function TalkToExpert() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: ""
  });

  const submitMutation = trpc.contact.submitExpert.useMutation({
    onSuccess: () => {
      toast.success("Request submitted successfully! Our team will contact you soon.");
      setFormData({ name: "", email: "", organization: "", phone: "", message: "" });
    },
    onError: () => {
      toast.error("Failed to submit request. Please try again or email sales@communityforce.com directly.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-br from-muted via-background to-muted">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MessageSquare className="h-4 w-4" />
                  <span>SPEAK WITH OUR TEAM</span>
                </div>
                
                <h1 className="text-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Talk to an Expert
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Have questions about CommunityForce? Our team of awards management experts is here to help you find the right solution for your organization.
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="John Smith"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="john@organization.org"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="organization">Organization *</Label>
                            <Input
                              id="organization"
                              name="organization"
                              value={formData.organization}
                              onChange={handleChange}
                              required
                              placeholder="Your Organization"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">How can we help you? *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            placeholder="Tell us about your current challenges, what you're looking for, or any specific questions you have..."
                          />
                        </div>

                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? "Submitting..." : "Submit Request"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                          By submitting this form, you agree to be contacted by CommunityForce regarding our products and services.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-2 border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">How We Can Help</h3>
                      <ul className="space-y-3">
                        {[
                          "Answer product questions",
                          "Discuss pricing and packages",
                          "Provide implementation guidance",
                          "Share best practices",
                          "Connect you with references"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2">Direct Contact</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Prefer to reach out directly?
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong className="text-foreground">Email:</strong>{" "}
                          <a href="mailto:sales@communityforce.com" className="text-primary hover:underline">
                            sales@communityforce.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-muted/50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2">Response Time</h3>
                      <p className="text-sm text-muted-foreground">
                        Our team typically responds within 1 business day. For urgent inquiries, please email us directly.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
