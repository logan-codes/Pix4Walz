import HeroSection from '@/components/Home/HeroSection';
import CategoriesSection from '@/components/Home/Categories';
import BestSelling from '@/components/Home/BestSelling';
import LoginPopover from '@/components/LoginPopover';


export default function HomePage(){
  return (
    <div>
        <LoginPopover />
        <HeroSection />
        <BestSelling />
        <CategoriesSection />
    </div>
  )
}