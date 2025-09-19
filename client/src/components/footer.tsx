import { GraduationCap, Facebook, Twitter, Youtube, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Language, useTranslation } from "@/lib/i18n";

interface FooterProps {
  language: Language;
}

export default function Footer({ language }: FooterProps) {
  const t = useTranslation(language);

  const footerLinks = {
    quickLinks: [
      { name: "Eligibility Wizard", href: "#eligibility" },
      { name: "DBT Simulator", href: "#dbt-simulator" },
      { name: "Help Centers", href: "#help-centers" },
      { name: "Learning Games", href: "#learning" }
    ],
    resources: [
      { name: "Video Tutorials", href: "#videos" },
      { name: "Parent Toolkit", href: "#toolkit" },
      { name: "FAQs", href: "#faq" },
      { name: "Success Stories", href: "#stories" }
    ],
    support: [
      { name: "Contact Us", href: "#contact" },
      { name: "Help Center", href: "#help" },
      { name: "Technical Support", href: "#support" },
      { name: "Feedback", href: "#feedback" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#privacy" },
      { name: "Terms of Service", href: "#terms" },
      { name: "Disclaimer", href: "#disclaimer" },
      { name: "Accessibility", href: "#accessibility" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com", color: "text-blue-600" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com", color: "text-blue-400" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com", color: "text-red-600" },
    { name: "WhatsApp", icon: MessageSquare, href: "https://wa.me", color: "text-green-600" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="text-2xl text-accent" size={32} />
              <h4 className="text-xl font-bold">{t('title')}</h4>
            </div>
            <p className="opacity-80 mb-6 text-sm">
              Empowering students to access their rightful scholarships through technology and education.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="text-accent hover:text-accent/80 p-2"
                  asChild
                  data-testid={`social-${social.name.toLowerCase()}`}
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon size={20} />
                  </a>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2 opacity-80">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-accent transition-colors text-sm"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h5 className="font-semibold mb-4">Resources</h5>
            <ul className="space-y-2 opacity-80">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-accent transition-colors text-sm"
                    data-testid={`footer-resource-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 opacity-80">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="hover:text-accent transition-colors text-sm"
                    data-testid={`footer-support-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Government Information */}
          <div>
            <h5 className="font-semibold mb-4">Official</h5>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm font-medium mb-1">Helpline</div>
                <div className="text-accent font-mono">1800-XXX-XXXX</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-sm font-medium mb-1">Email Support</div>
                <div className="text-accent text-sm">help@scholarshiphero.gov.in</div>
              </div>
              <div className="text-xs opacity-70">
                Ministry of Social Justice & Empowerment<br />
                Government of India
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left opacity-80 text-sm">
              <p>&copy; 2024 Scholarship Hero. All rights reserved.</p>
              <p className="mt-1">A Government of India Initiative under Digital India</p>
            </div>
            
            <div className="flex flex-wrap gap-4 text-xs opacity-70">
              {footerLinks.legal.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="hover:text-accent transition-colors"
                  data-testid={`footer-legal-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          
          {/* Accessibility Statement */}
          <div className="mt-6 text-center">
            <div className="bg-white/10 rounded-lg p-4 text-sm">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-accent">♿</span>
                <span className="font-medium">Accessibility Commitment</span>
              </div>
              <p className="opacity-80">
                This platform is designed to be accessible to all users, including those with disabilities. 
                We support screen readers, keyboard navigation, and high contrast modes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
