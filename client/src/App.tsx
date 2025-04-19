import './App.css'
import HomePage from './pages/Homepage';
import PosterDetail from './pages/PosterDetail';
import CartPage from './pages/CartPage';
import Wishlist from './pages/Wishlist.tsx';
import RootLayout from './layouts/MainLayout.tsx';
import { CartProvider } from './context/CartContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<RootLayout/>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/poster/:id" element={<PosterDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App
