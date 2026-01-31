import { FileText, Shield, BookOpen, AlertTriangle, Users, Lock, Heart, Briefcase } from "lucide-react";

export interface RequirementTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  suggestedFrequency: "one-time" | "annual";
}

export const requirementTemplates: RequirementTemplate[] = [
  {
    id: "nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Acknowledgment of confidentiality obligations for handling sensitive company information, trade secrets, and proprietary data.",
    category: "Legal",
    icon: Lock,
    suggestedFrequency: "one-time",
  },
  {
    id: "code-of-conduct",
    title: "Code of Conduct",
    description: "Acknowledgment of company values, ethical guidelines, and expected professional behavior standards.",
    category: "Policy",
    icon: BookOpen,
    suggestedFrequency: "annual",
  },
  {
    id: "employee-handbook",
    title: "Employee Handbook",
    description: "Confirmation of receipt and understanding of the employee handbook covering policies, benefits, and procedures.",
    category: "HR",
    icon: Briefcase,
    suggestedFrequency: "annual",
  },
  {
    id: "data-privacy",
    title: "Data Privacy Policy",
    description: "Acknowledgment of data handling practices, GDPR/CCPA compliance requirements, and privacy obligations.",
    category: "Compliance",
    icon: Shield,
    suggestedFrequency: "annual",
  },
  {
    id: "security-awareness",
    title: "Security Awareness Training",
    description: "Confirmation of completing cybersecurity training covering phishing, password security, and safe computing practices.",
    category: "Security",
    icon: AlertTriangle,
    suggestedFrequency: "annual",
  },
  {
    id: "anti-harassment",
    title: "Anti-Harassment Policy",
    description: "Acknowledgment of workplace harassment prevention policies and reporting procedures.",
    category: "HR",
    icon: Users,
    suggestedFrequency: "annual",
  },
  {
    id: "health-safety",
    title: "Health & Safety Policy",
    description: "Acknowledgment of workplace health and safety guidelines, emergency procedures, and reporting requirements.",
    category: "Compliance",
    icon: Heart,
    suggestedFrequency: "annual",
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use Policy",
    description: "Agreement to acceptable use guidelines for company technology, internet access, and digital resources.",
    category: "IT",
    icon: FileText,
    suggestedFrequency: "annual",
  },
];

export function getTemplateById(id: string): RequirementTemplate | undefined {
  return requirementTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(): Record<string, RequirementTemplate[]> {
  return requirementTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, RequirementTemplate[]>);
}
