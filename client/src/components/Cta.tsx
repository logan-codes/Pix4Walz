import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react";

const Cta = () => {
  return (
    <section className="py-16 bg-gradient-to-t from-black to-white text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Preserve Your Memories?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Turn your favorite digital photos into beautiful physical prints today.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-gray-800 hover:bg-black hover:text-white"
          >
            Place Your Order <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </section>
  )
}

export default Cta
