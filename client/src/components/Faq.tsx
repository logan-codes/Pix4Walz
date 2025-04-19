import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordian'
import { Package, Palette, Timer } from 'lucide-react'

const Faq = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
      <div className="flex flex-row text-center items-center justify-center w-full h-full">
        <Accordion type="single" collapsible className="w-full px-5 mx-auto ">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                <Package
                size={16}
                /> 
                <p className="ml-2">
                  Is it possible to order in bulk?
                </p>
              </div> 
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-left">
                Yes, we offer bulk ordering options for custom polaroids and posters. Please contact our customer service for more details on pricing and minimum order quantities.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                <Palette
                size={16}
                />
                <p className="ml-2">
                  How do I order custom polaroids/posters?
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-left">
                You can order custom polaroids/posters by clicking the "Place Your Order" button on our homepage. Follow the instructions to upload your images and select your desired sizes.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex items-center justify-start w-full">
                <Timer
                size={16}
                />
                <p className="ml-2">
                  How long does it take for delivery?
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-left">
                Delivery times vary based on your location. Typically, it takes 3-5 business days for domestic orders and 7-14 days for international orders.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <img 
        src="https://imgs.search.brave.com/hSs2vg8Fn5b8Kdcsf619CkOuoswlY-3m9UpSZC-0BQw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYXEtaWNvbi1m/cmVxdWVudGx5LWlu/Zm9ybWF0aW9uLXF1/ZXN0aW9uXzM0MjAz/Ni0yNTIuanBnP3Nl/bXQ9YWlzX2h5YnJp/ZA" 
        alt="FAQ" 
        className="w-1/3 h-full hidden sm:block" 
        />
      </div>
    </div>
  )
}

export default Faq
