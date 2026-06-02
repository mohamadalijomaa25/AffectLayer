import AboutProject from "@/components/AboutProject";
import EthicsSection from "@/components/EthicsSection";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <AboutProject />
      <EthicsSection />
    </div>
  );
};

export default AboutPage;
