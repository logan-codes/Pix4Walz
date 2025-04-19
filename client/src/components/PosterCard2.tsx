import { Poster } from "../context/CartContext";

interface PosterCard2Props {
    poster: Poster;
}

const PosterCard2 = ({ poster }: PosterCard2Props) => {
    const transform = `translateY(${poster.os}px)`; 
    return (
        <div className="aspect-[3/4] bg-card rounded-md overflow-hidden shadow-lg h-80 md:flex hidden" style={{transform}}>
            <img 
                src={poster.image} 
                alt={poster.title} 
                className="w-full h-full object-cover"
            />
        </div>
    )
}

export default PosterCard2
