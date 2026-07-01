import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function BookDemo() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    message: ""
  });

  const submitMutation = trpc.contact.submitDemo.useMutation({
    onSuccess: () => {
      toast.success("Demo request submitted successfully! We'll contact you soon.");
      setFormData({ name: "", email: "", organization: "", phone: "", message: "" });
    },
    onError: (error) => {
      toast.error("Failed to submit request. Please try again or email sales@communityforce.com directly.");
      console.error(error);
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
                <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Calendar className="h-4 w-4" />
                  <span>SCHEDULE A PERSONALIZED DEMO</span>
                </div>
                
                <h1 className="text-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Book a Demo
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  See CommunityForce in action. Schedule a personalized demo with our team to explore how our platform can transform your awards management process.
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
                          <Label htmlFor="message">Tell us about your needs</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            placeholder="What type of programs do you manage? How many applications do you process annually? What are your biggest challenges?"
                          />
                        </div>

                        <Button 
                          type="submit" 
                          size="lg" 
                          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                          disabled={submitMutation.isPending}
                        >
                          {submitMutation.isPending ? "Submitting..." : "Request Demo"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                          By submitting this form, you agree to be contacted by CommunityForce regarding our products and services.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card className="border-2 border-accent/20">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-4">What to Expect</h3>
                      <ul className="space-y-3">
                        {[
                          "30-45 minute personalized demo",
                          "Live walkthrough of key features",
                          "Discussion of your specific needs",
                          "Q&A with product experts",
                          "Custom pricing information"
                        ].map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2">Need Immediate Assistance?</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Contact our sales team directly:
                      </p>
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong className="text-foreground">Email:</strong>{" "}
                          <a href="mailto:sales@communityforce.com" className="text-accent hover:underline">
                            sales@communityforce.com
                          </a>
                        </div>
                      </div>
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
