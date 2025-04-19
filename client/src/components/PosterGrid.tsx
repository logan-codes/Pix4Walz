
import { useState } from 'react';
import PosterCard from './PosterCard1.tsx';
import { Button } from '@/components/ui/button';
import { POSTERS } from '@/data/posters.ts';
import { motion } from 'framer-motion';

// Filter options
const CATEGORIES = ['All', 'Action','Romance', 'Drama', 'Sci-Fi', 'Thriller', 'Comedy', 'Horror'];

const PosterGrid = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const filteredPosters = selectedCategory === 'All' 
    ? POSTERS 
    : POSTERS.filter(poster => poster.category === selectedCategory);
  
  return (
    <section className="py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Posters</h2>
          <Button variant="link" asChild>
            <a href="#">View all</a>
          </Button>
        </motion.div>

        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex pb-4 mb-8 gap-2 no-scrollbar w-full flex-wrap">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="rounded-full whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200"
              size="sm"
            >
              {category}
            </Button>
          ))}
        </motion.div>
        
        <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {filteredPosters.slice(0,10).map(poster => (
            <PosterCard key={poster.id} poster={poster} />
          ))}
        </motion.div>
        
        <div className="mt-12 text-center">
          <Button variant="outline">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PosterGrid;
