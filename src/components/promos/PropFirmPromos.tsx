
import { propFirms } from "@/data/propFirms";
import PromoCard from "./PromoCard";

const PropFirmPromos = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 font-poppins bg-gradient-to-r from-neon-green via-neon-blue to-neon-purple bg-clip-text text-transparent">
          Latest Prop Firm Promotions
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Exclusive deals and promotions from top prop trading firms
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {propFirms.map((firm) => (
          <PromoCard key={firm.name} firm={firm} />
        ))}
      </div>
    </div>
  );
};

export default PropFirmPromos;
