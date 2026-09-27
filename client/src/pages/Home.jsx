import Navbar from '../components/Navbar';
import SocialProof from '../components/home/SocialProof';
import InteractiveShowcase from '../components/home/InteractiveShowcase';
import BentoGridFeatures from '../components/home/BentoGridFeatures';
import WorkflowSteps from '../components/home/WorkflowSteps';
import PricingSection from '../components/home/PricingSection';
import Testimonials from '../components/home/Testimonials';
import FaqSection from '../components/home/FaqSection';
import CtaBanner from '../components/home/CtaBanner';
import Footer from '../components/home/Footer';
import Hero from '../components/home/Hero';

const Home = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <SocialProof />
      <InteractiveShowcase />
      <BentoGridFeatures />
      <WorkflowSteps />
      <PricingSection />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </main>
    <Footer />
  </>
);

export default Home;
