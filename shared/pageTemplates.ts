export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: "blank",
    name: "Blank Page",
    description: "Start with an empty page",
    content: "",
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "Hero section with features and CTA",
    content: `# Welcome to Our Platform

## Transform Your Awards Management

Manage the complete awards lifecycle—from application through compliance—with integrated CRM, support, and campaign management in one unified platform.

### Key Features

**Comprehensive Management**
Handle scholarships, grants, fellowships, and research programs with ease.

**Integrated CRM**
Built-in constituent relationship management keeps everything connected.

**Secure & Compliant**
Enterprise-grade security with full compliance tracking.

### Ready to Get Started?

[Book a Demo](#) [Contact Sales](#)

---

## Trusted by Organizations Nationwide

Join hundreds of organizations managing millions in awards through our platform.`,
  },
  {
    id: "about",
    name: "About Page",
    description: "Company information and mission",
    content: `# About Us

## Our Mission

We're dedicated to transforming how organizations manage their awards programs, making the process more efficient, transparent, and impactful.

### Our Story

Founded in 2010, we've grown from a small team with a vision to a trusted platform serving organizations nationwide. Our platform has processed over 165 million applications and awarded more than $569 million.

### Our Values

**Excellence**
We strive for excellence in everything we do, from our platform features to customer support.

**Innovation**
Continuous improvement and innovation drive our product development.

**Integrity**
We operate with transparency and maintain the highest ethical standards.

**Impact**
We measure success by the positive impact we create for our customers and their communities.

### Our Team

Our team brings together expertise in technology, education, and nonprofit management to create solutions that truly understand your needs.

---

## Get in Touch

Ready to learn more? [Contact us](#) to schedule a demo or discuss your specific needs.`,
  },
  {
    id: "contact",
    name: "Contact Page",
    description: "Contact information and form",
    content: `# Contact Us

## Let's Connect

Whether you have questions about our platform, need support, or want to schedule a demo, we're here to help.

### Get in Touch

**Sales Inquiries**
Interested in learning more about our platform? Our sales team is ready to answer your questions and provide a personalized demo.

[Book a Demo](#) [Talk to an Expert](#)

**Customer Support**
Need help with your account or have technical questions? Our support team is available to assist you.

Email: support@example.com
Phone: 1-800-XXX-XXXX

**General Inquiries**
For all other questions, please reach out to our general inbox.

Email: info@example.com

### Office Locations

**Headquarters**
123 Main Street
Suite 100
City, State 12345

**Regional Office**
456 Business Ave
Floor 5
City, State 67890

### Business Hours

Monday - Friday: 9:00 AM - 6:00 PM EST
Saturday - Sunday: Closed

---

*We typically respond to all inquiries within 24 business hours.*`,
  },
  {
    id: "features",
    name: "Features Page",
    description: "Product features and benefits",
    content: `# Platform Features

## Everything You Need for Awards Management

Our comprehensive platform provides all the tools you need to manage your awards programs efficiently and effectively.

### Core Features

**Application Management**
Streamline the entire application process with customizable forms, automated workflows, and intelligent routing.

**Review & Evaluation**
Built-in review tools with scoring rubrics, blind review options, and collaborative decision-making features.

**Award Distribution**
Manage award disbursements, track payments, and maintain compliance documentation.

**Reporting & Analytics**
Comprehensive reporting tools with real-time dashboards and customizable analytics.

### Advanced Capabilities

**CRM Integration**
Keep track of all constituent interactions with integrated relationship management.

**Communication Tools**
Automated email campaigns, notifications, and personalized messaging.

**Compliance Tracking**
Maintain audit trails, track requirements, and ensure regulatory compliance.

**API Access**
Integrate with your existing systems through our robust API.

### Security & Reliability

**Enterprise Security**
Bank-level encryption, SOC 2 compliance, and regular security audits.

**99.9% Uptime**
Reliable infrastructure with automatic backups and disaster recovery.

**Data Privacy**
GDPR and FERPA compliant with comprehensive data protection measures.

---

## Ready to Experience These Features?

[Schedule a Demo](#) to see our platform in action.`,
  },
  {
    id: "pricing",
    name: "Pricing Page",
    description: "Pricing tiers and plans",
    content: `# Pricing

## Choose the Plan That's Right for You

Flexible pricing options designed to scale with your organization's needs.

### Starter Plan

**Perfect for small organizations**

- Up to 500 applications per year
- Basic reporting and analytics
- Email support
- Standard integrations

**Contact us for pricing**

### Professional Plan

**Ideal for growing programs**

- Up to 2,500 applications per year
- Advanced reporting and analytics
- Priority email and phone support
- Custom integrations
- Dedicated account manager

**Contact us for pricing**

### Enterprise Plan

**For large-scale programs**

- Unlimited applications
- Custom reporting and analytics
- 24/7 priority support
- Full API access
- White-label options
- Dedicated success team

**Contact us for pricing**

### All Plans Include

- Secure cloud hosting
- Regular platform updates
- Data migration assistance
- Training and onboarding
- 99.9% uptime SLA

---

## Questions About Pricing?

[Contact Sales](#) to discuss your specific needs and get a custom quote.`,
  },
];

export function getTemplateById(id: string): PageTemplate | undefined {
  return PAGE_TEMPLATES.find((t) => t.id === id);
}

export function getTemplateContent(id: string): string {
  const template = getTemplateById(id);
  return template ? template.content : "";
}
