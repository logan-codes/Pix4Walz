import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel'
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from '@/data/testimonials';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';

const Testimonials = () => {
  const plugin = useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: true,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  );

  return (
    <section className="w-full flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-4">
        What Our Customers Say?
      </h2>
      <Carousel 
      className="md:w-11/12 w-9/12" 
      orientation="horizontal" 
      opts={{
        loop: true,
      }}
      plugins={[plugin.current]}
      >
        <CarouselContent className="p-3">
          {testimonials.map((Testimonial, index) => (
            <CarouselItem key={index} className="flex flex-col basis-full sm:basis-1/2 lg:basis-1/3 items-center justify-center ">
              <Card className="bg-black">
                <CardContent className="p-6 bg-black">
                  <div className="flex items-center flex-col overflow-hidden justify-center gap-4">
                    <img 
                    src={Testimonial.Image} 
                    alt={Testimonial.Name} 
                    className="w-full h-full object-cover aspect-16/9 rounded-sm"
                    />

                    <div key={index} className="flex items-center flex-row">
                      {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1;
                        return (
                            <svg
                            key={index}
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                                ratingValue <= Testimonial.Rating ? 'gold' : 'gray'
                            }
                            viewBox="0 0 24 24"
                            className="w-4 h-4"
                            >
                              <path d="M12 17.27L18.18 21l-1.63-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.45 4.73L5.82 21z" />
                            </svg>
                        );
                      })}
                    </div>

                    <p className="text-sm text-white font-semibold">{Testimonial.Review}</p>
                    <h3 className="text-gray-300 font-bold">{Testimonial.Name}</h3>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="bg-white text-black hover:bg-black hover:text-white"/>
        <CarouselPrevious className="bg-white text-black hover:bg-black hover:text-white"/>
      </Carousel>
    </section>
  )
}

export default Testimonials
