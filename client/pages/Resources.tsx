import PlaceholderPage from "@/components/PlaceholderPage";

export default function Resources() {
  const comingSoonFeatures = [
    "MRV implementation guidelines",
    "Carbon registries integration docs",
    "Farmer training materials",
    "Technical specifications and protocols",
    "Data collection best practices",
    "Verification standards compliance",
    "API documentation and tutorials",
    "Webinars and training videos",
  ];

  return (
    <PlaceholderPage
      title="Resources & Documentation"
      description="Comprehensive resources to help you implement and scale MRV solutions. Access documentation, training materials, and technical guides for successful carbon project deployment."
      comingSoonFeatures={comingSoonFeatures}
    />
  );
}
