import { useLenis } from '@/hooks/useLenis';
import { BookingProvider } from '@/context/BookingContext';
import Header from '@/components/Header';
import BookingModal from '@/components/BookingModal';
import Footer from '@/components/Footer';
import HeroSection from '@/sections/HeroSection';
import PhilosophySection from '@/sections/PhilosophySection';
import ServicesCarouselSection from '@/sections/ServicesCarouselSection';
import JourneySection from '@/sections/JourneySection';
import FoundersSection from '@/sections/FoundersSection';
import PricingSection from '@/sections/PricingSection';
import ResourcesSection from '@/sections/ResourcesSection';
import CTASection from '@/sections/CTASection';

function App() {
  useLenis();

  return (
    <BookingProvider>
      <div className="relative">
        <Header />
        <main>
          <HeroSection />
          <PhilosophySection />
          <ServicesCarouselSection />
          <JourneySection />
          <PricingSection />
          <FoundersSection />
          <ResourcesSection />
          <CTASection />
        </main>
        <Footer />
        <BookingModal />
      </div>
    </BookingProvider>
  );
}

export default App;
