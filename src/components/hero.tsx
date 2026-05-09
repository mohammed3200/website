
import { 
  StrategicPlan, 
  News, 
  Faq, 
  HomeHero,
  HomeCollaborators,
} from "@/components";

export const Hero = () => {
  return (
    <>
      <HomeHero />
      
      <section className="py-10">
        <div className="container mx-auto space-y-16 sm:space-y-24">
          <News />
          <StrategicPlan />
        </div>
      </section>

      <HomeCollaborators />

      <section className="py-16">
        <div className="container mx-auto">
          <Faq />
        </div>
      </section>
    </>
  );
};

