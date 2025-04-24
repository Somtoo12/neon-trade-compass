
export interface PropFirm {
  name: string;
  logo: string;
  website: string;
  profitSplit: string;
  evaluation: string;
  payout: string;
  tags: string[];
  promo?: string;
}

export const propFirms: PropFirm[] = [
  {
    name: "FXIFY",
    logo: "/placeholder.svg",
    website: "https://fxify.com",
    profitSplit: "90%",
    evaluation: "1-Step",
    payout: "7 Days",
    tags: ["Top Rated", "Fast Payout", "Refundable"],
    promo: "50% off all accounts this week! 🎉"
  },
  {
    name: "FTMO",
    logo: "/placeholder.svg",
    website: "https://ftmo.com",
    profitSplit: "80%",
    evaluation: "2-Step",
    payout: "30 Days",
    tags: ["Trusted", "Scaling"]
  },
  // Add more prop firms as needed...
];
