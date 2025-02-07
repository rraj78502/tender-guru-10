
import { Vendor, VendorQualification } from "@/types/vendor";

export const defaultQualificationCriteria: VendorQualification[] = [
  {
    id: 1,
    criteria: "Financial Capacity",
    minimumRequirement: "Annual turnover > $1M",
    weight: 30,
  },
  {
    id: 2,
    criteria: "Technical Capability",
    minimumRequirement: "Min. 3 similar projects",
    weight: 40,
  },
  {
    id: 3,
    criteria: "Experience",
    minimumRequirement: "5+ years in industry",
    weight: 20,
  },
  {
    id: 4,
    criteria: "Certifications",
    minimumRequirement: "ISO 9001",
    weight: 10,
  },
];

export const calculateQualificationScore = (
  vendor: Vendor,
  criteria: VendorQualification[]
): number => {
  // This is a placeholder implementation
  // In a real application, this would evaluate vendor attributes against criteria
  return Math.floor(Math.random() * 100);
};

export const isVendorQualified = (score: number): boolean => {
  const QUALIFICATION_THRESHOLD = 70;
  return score >= QUALIFICATION_THRESHOLD;
};
