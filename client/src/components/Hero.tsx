import PolaroidFrame from './PolaroidFrames';
import PosterCard2 from './PosterCard2';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { polaroids } from '@/data/polaroid';
import { POSTERS } from '@/data/posters';

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-gray-400 to-white py-20 w-full">
        <div className="container mx-auto px-4 ">
          <div className="flex flex-col lg:flex-row items-center flex-1/6 lg:flex-nowrap overflow-hidden lg:overflow-visible max-w-full">
            <div className="lg:w-1/3 mb-10 lg:mb-0 text-left w-full">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold mb-6 text-left mx-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Custom Polaroids And Posters That Turn Moments Into <span className="bg-clip-text text-white">Masterpieces</span>
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-700 mb-8 text-left mx-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Custom polaroids, multi-piece displays, and posters made with care. Bring your favorite moments to life with our premium photo prints.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-start sm:mx-10 mx-0 gap-2"
              >
                <Button 
                size="lg" 
                variant="ghost"
                className="bg-white text-black hover:bg-black hover:text-white w-full sm:w-1/2"
                >
                Place Your Order <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button 
                size="lg" 
                variant="ghost"
                className="bg-black text-white hover:bg-white hover:text-black w-full sm:w-1/2"
                >
                Explore Our Collection <Search size={16} className="ml-2" />
                </Button>
                </motion.div>
            </div>

            <div className="lg:grid-cols-2 grid-cols-1 gap-4 hidden lg:grid">
              {POSTERS.slice(0,4).map((poster, index) => (
                  <motion.div
                  key={index}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                      duration: 0.6, 
                      delay: 0.3 + (index * 0.2)
                  }}
                  >
                  <PosterCard2
                      poster={poster}
                  />
                  </motion.div>
              ))}
            </div>
            
            <div className="lg:w-1/3 relative h-80 ">
              {polaroids.map((polaroid, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + (index * 0.2)
                  }}
                  style={{ 
                    left: `${5 + (index * 25)}%`, 
                    top: `${10 + (index % 2) * 15}%`,
                    zIndex: index
                  }}
                >
                  
                  <PolaroidFrame
                    imageUrl={polaroid.url}
                    caption={polaroid.caption}
                    rotation={polaroid.rotation}
                    className="w-48"
                  />
                </motion.div>
             ))}
            </div>
          </div>
        </div>
      </section>
  )
}

export default Hero
