import HeroSection from '@/components/Home/HeroSection';
import CategoriesSection from '@/components/Home/Categories';
import BestSelling from '@/components/Home/BestSelling';


export default function HomePage(){
  return (
    <div>
        <HeroSection />
        <BestSelling />
        <CategoriesSection />
    </div>
  )
}