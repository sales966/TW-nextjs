export const mockLeads = [
  { id: "l_1", contactName: "Alice Smith", email: "alice@example.com", companyName: "TechCorp", country: "US", status: "NEW" },
  { id: "l_2", contactName: "Bob Johnson", email: "bob@example.com", companyName: null, country: "UK", status: "CONTACTED" },
];

export const mockQuotes = [
  { id: "q_1", leadId: "l_1", contactName: "Alice Smith", companyName: "TechCorp", email: "alice@example.com", boxType: "MAILER_BOX", quantity: 1500, status: "PENDING", length: 200, width: 150, height: 50, unit: "mm", material: "KRAFT", printing: "CMYK_OUT", country: "US" },
  { id: "q_2", leadId: "l_2", contactName: "Bob Johnson", companyName: "Personal", email: "bob@example.com", boxType: "RIGID_BOX", quantity: 500, status: "PROCESSING", length: 100, width: 100, height: 100, unit: "mm", material: "CCNB", printing: "NONE", country: "UK" }
];

export const mockProducts = [
  { id: "p_1", name: "Classic Mailer Box", slug: "classic-mailer-box", boxType: "MAILER_BOX", summary: "Durable e-commerce box", moq: 100, isActive: true },
  { id: "p_2", name: "Premium Rigid Box", slug: "premium-rigid-box", boxType: "RIGID_BOX", summary: "Luxury packaging", moq: 500, isActive: true },
];