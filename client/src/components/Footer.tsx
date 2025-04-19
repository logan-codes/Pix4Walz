import { Instagram, Facebook, Dot } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="pt-3 pb-3 bg-black w-full ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-2 ">
          <div className="flex items-center space-x-2 text-xl font-bold justify-between ">
            <p className="flex text-gray-300 font-light text-sm lg:text-2xl">
              Turning your digital memories into tangible treasures. Custom polaroids and posters made with love.
            </p>
            <div className="flex space-x-4 justify-start ">
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white mt-3 pt-3 text-start text-gray-300 text-sm ">
          <div className="flex items-center justify-center lg:justify-start flex-wrap"> 
            <p>&copy; {new Date().getFullYear()} Piz4Walz</p>
            <Dot size={10} className="mx-2 text-gray-300" />
            <Link to="/privacy-policy" className="text-gray-300 hover:text-white hover:underline ">
              Privacy Policy
            </Link>
            <Dot size={10} className="mx-2 text-gray-300" />
            <Link to="/terms-of-service" className="text-gray-300 hover:text-white hover:underline ">
              Terms of Service
            </Link>
            <Dot size={10} className="mx-2 text-gray-300" />
            <Link to="/contact" className="text-gray-300 hover:text-white hover:underline ">
              Refund Policy
            </Link>
            <Dot size={10} className="mx-2 text-gray-300" />
            <Link to="/contact" className="text-gray-300 hover:text-white hover:underline ">
              Shipping Policy
            </Link>
            <Dot size={10} className="mx-2 text-gray-300" />
            <Link to="/contact" className="text-gray-300 hover:text-white hover:underline ">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;