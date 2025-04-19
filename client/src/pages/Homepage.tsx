import Hero from '@/components/Hero';
import Wcu from '@/components/Wcu';
import PosterGrid from '@/components/PosterGrid';
import Faq from '@/components/Faq';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/Cta';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero/>
      <PosterGrid/>
      <Wcu/>
      <Testimonials/>
      <Faq/>
      <CTA/>
    </div>
  );
};

export default HomePage;
