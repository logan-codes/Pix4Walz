
import React from 'react';
import { ImageOff } from 'lucide-react';

interface PolaroidFrameProps {
  imageUrl?: string;
  caption?: string;
  className?: string;
  rotation?: number;
  onClick?: () => void;
}

const PolaroidFrame: React.FC<PolaroidFrameProps> = ({ 
  imageUrl, 
  caption = "Beautiful moment",
  className = "",
  rotation = 0,
  onClick
}) => {
  const transform = `rotate(${rotation}deg)`;
  
  return (
    <div 
      className={`bg-white p-2 pb-10 shadow-md relative cursor-pointer transition-transform hover:shadow-lg ${className}`}
      style={{ transform }}
      onClick={onClick}
    >
      <div className="w-full aspect-square bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={caption} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageOff size={40} />
          </div>
        )}
      </div>
      <div className="mt-2 text-center text-gray-800 font-handwriting">
        {caption}
      </div>
    </div>
  );
};

export default PolaroidFrame;
