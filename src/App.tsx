/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  Phone, 
  Star, 
  CheckCircle2, 
  ChevronRight, 
  Pizza, 
  Flame, 
  Clock, 
  Menu as MenuIcon, 
  X,
  ArrowLeft,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  CreditCard,
  User,
  Truck
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

type FunnelStep = 'home' | 'menu-browse' | 'about' | 'order-start' | 'menu' | 'product' | 'upsell' | 'cart' | 'checkout' | 'success';

type CartItem = {
  id: string;
  name: string;
  image?: string;
  size?: string;
  crust?: string;
  toppings?: string[];
  price: number;
  quantity: number;
};

// MENU CONSTANTS - High Converting Priced Menu
const MENU_CATEGORIES = [
  {
    id: 'popular',
    title: 'Start Here',
    description: 'These are the pizzas everyone keeps coming back for.',
    items: [
      { 
        id: 'pop-jal', 
        name: 'Jalapeño Popper Pizza', 
        desc: 'Creamy, spicy, and loaded with flavor.', 
        prices: { '12"': 18.29, '14"': 23.29 },
        displayPrice: '$18.29+',
        image: 'https://picsum.photos/seed/jalpop/600/600', 
        type: 'pizza' 
      },
      { 
        id: 'pop-cbr', 
        name: 'Chicken Bacon Ranch', 
        desc: 'Savory, rich, and always satisfying.', 
        prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 },
        displayPrice: '$18.29+',
        bestValue: '18"',
        image: 'https://picsum.photos/seed/cbr1/600/600', 
        type: 'pizza' 
      },
      { 
        id: 'pop-jumbo', 
        name: '18" Jumbo Pizza', 
        desc: 'Big, loaded, and built to feed everyone.', 
        prices: { '1-Topping': 21.50, 'Specialty': 25.99 },
        displayPrice: '$21.50+',
        bestValue: true,
        image: 'https://picsum.photos/seed/jumbo/600/600', 
        type: 'pizza' 
      }
    ]
  },
  {
    id: 'combos',
    title: 'Make It Easy',
    description: 'Better value than ordering separately.',
    items: [
      { 
        id: 'combo-family', 
        name: 'Family Deal', 
        desc: '18" Jumbo Pizza + Cheezy Bread + 2 Liter Drink. Enough for everyone.', 
        basePrice: 34.99,
        image: 'https://picsum.photos/seed/family/600/600',
        type: 'combo'
      },
      { 
        id: 'combo-game', 
        name: 'Game Night Pack', 
        desc: '2 Large Pizzas + Wings (12 ct). Built for sharing.', 
        basePrice: 45.99,
        image: 'https://picsum.photos/seed/gamenight/600/600',
        type: 'combo'
      },
      { 
        id: 'combo-quick', 
        name: 'Quick Meal', 
        desc: '12" Pizza + Drink. Fast, simple, and hits the spot.', 
        basePrice: 19.99,
        image: 'https://picsum.photos/seed/quick/600/600',
        type: 'combo'
      }
    ]
  },
  {
    id: 'specialty',
    title: 'Specialty Pizzas',
    description: 'Built heavy. Built right.',
    items: [
      { id: 'sp1', name: 'Jalapeño Popper', desc: 'Creamy, spicy, and loaded with flavor.', prices: { '8"': 10.29, '12"': 18.29, '14"': 23.29 }, displayPrice: '$10.29+', type: 'pizza' },
      { id: 'sp2', name: 'Chicken Bacon Ranch', desc: 'Ranch base, tender chicken, crispy bacon.', prices: { '8"': 10.29, '12"': 18.29, '14"': 23.29, '18"': 26.99 }, displayPrice: '$10.29+', type: 'pizza' },
      { id: 'sp3', name: 'Closed on Sunday', desc: 'Loaded with premium chicken and secret sauce.', prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 }, displayPrice: '$18.29+', type: 'pizza' },
      { id: 'sp4', name: 'Meat Eater', desc: 'Pepperoni, sausage, bacon, and ham.', prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 }, displayPrice: '$18.29+', type: 'pizza' },
      { id: 'sp5', name: 'Classic Pepperoni', desc: 'Double layer of premium pepperoni.', prices: { '12"': 16.50, '14"': 18.50, '18"': 21.50 }, displayPrice: '$16.50+', type: 'pizza' }
    ]
  },
  {
    id: 'byo',
    title: 'Build Your Own',
    description: 'Pick your size. Add your toppings. Make it yours.',
    items: [
      { 
        id: 'byo1', 
        name: 'Build Your Own Pizza', 
        desc: 'Exactly how you want it. Every time.', 
        prices: { '8"': 7.25, '12"': 16.50, '14"': 18.50, '18"': 21.50 },
        bestValue: '18"',
        displayPrice: '$7.25+',
        type: 'byo-pizza' 
      }
    ]
  },
  {
    id: 'sides-wings',
    title: 'Sides & Wings',
    description: 'Hot, fresh, and ready to go.',
    items: [
      { id: 'side1', name: 'Cheezy Bread', desc: 'Mozzarella and garlic butter.', prices: { '10"': 9.00, '12"': 14.00, '14"': 16.00 }, displayPrice: '$9.00+', type: 'side-sized' },
      { id: 'wing1', name: 'Wings', desc: 'Classic bone-in wings.', prices: { '8 ct': 11.99, '12 ct': 16.99, '18 ct': 23.99 }, displayPrice: '$11.99+', type: 'wings' }
    ]
  },
  {
    id: 'salads',
    title: 'Salads',
    description: 'Guilt-free green.',
    items: [
      { id: 'sal1', name: 'Garden Salad', desc: 'Fresh local veggies.', basePrice: 7.75, type: 'salad' },
      { id: 'sal2', name: 'Chicken Salad', desc: 'Loaded with premium chicken.', basePrice: 9.00, type: 'salad' },
      { id: 'sal3', name: 'Chef Salad', desc: 'A meat-lover\'s garden.', basePrice: 8.25, type: 'salad' }
    ]
  },
  {
    id: 'dessert',
    title: 'Dessert',
    description: 'The final move.',
    items: [
      { id: 'des1', name: 'Cinna Bread', desc: 'Cinnamon, sugar, and icing.', prices: { '10"': 9.00, '12"': 14.00, '14"': 16.00 }, displayPrice: '$9.00+', type: 'side-sized' }
    ]
  },
  {
    id: 'drinks',
    title: 'Drinks & Extras',
    description: 'Ice cold and extras.',
    items: [
      { id: 'drk1', name: '2 Liter Drinks', desc: 'Pepsi products.', basePrice: 3.25, type: 'drink' },
      { id: 'ext1', name: 'Ranch', desc: 'The gold stuff.', basePrice: 0.75, type: 'extra' },
      { id: 'ext3', name: 'Marinara', desc: 'House red sauce.', basePrice: 0.75, type: 'extra' },
      { id: 'ext2', name: 'Garlic Butter', desc: 'Liquid gold.', basePrice: 0.75, type: 'extra' },
      { id: 'ext4', name: 'Jalapeños', desc: 'Fresh slices.', basePrice: 1.99, type: 'extra' }
    ]
  }
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [view, setView] = useState<FunnelStep>('home');
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup');
  const [location, setLocation] = useState<'Borger' | 'Fritch'>('Borger');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Totals calculations
  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);
  const tax = subtotal * 0.0825;
  const deliveryFee = orderType === 'delivery' ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  // Navigation handlers
  const startOrder = () => setView('order-start');
  const goToMenu = () => setView('menu');
  const backToHome = () => setView('home');

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.size === item.size && i.crust === item.crust && JSON.stringify(i.toppings) === JSON.stringify(item.toppings));
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => prev.map((item, i) => i === index ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(i => i.quantity > 0));
  };

  const ProgressSteps = ({ current }: { current: number }) => (
    <div className="flex justify-between items-center max-w-md mx-auto mb-8 px-4 text-[10px] font-black uppercase tracking-widest text-brand-neon/40 overflow-hidden">
      {['Start', 'Menu', 'Custom', 'Add-ons', 'Cart', 'Pay'].map((step, i) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <div className={`w-8 h-1 transition-colors ${i <= current ? 'bg-brand-neon' : 'bg-white/10'}`} />
          <span className={i <= current ? 'text-brand-neon' : ''}>{step}</span>
        </div>
      ))}
    </div>
  );

  const FunnelHeader = ({ title, showBack = true, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
    <header className="px-6 py-8 border-b border-white/5 bg-brand-black sticky top-0 z-40 noise-overlay">
      <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-brand-neon">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="font-display text-4xl lg:text-5xl uppercase leading-none text-brand-neon">{title}</h1>
        </div>
        {cart.length > 0 && view !== 'cart' && view !== 'checkout' && (
          <button onClick={() => setView('cart')} className="relative group p-2 bg-brand-neon text-brand-black rounded-sm font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="hidden sm:inline font-display">View Cart</span>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-red text-brand-white text-[10px] flex items-center justify-center rounded-full border-2 border-brand-black">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </button>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-neon selection:text-brand-black font-sans">
      
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* NAVIGATION - Geometric Balance Style */}
            <nav className="flex justify-between items-center px-4 md:px-8 py-5 bg-brand-black border-b border-white/10 sticky top-0 z-50 noise-overlay">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setView('home')}>
                <Pizza className="text-brand-neon w-6 h-6 md:w-8 md:h-8" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl uppercase whitespace-nowrap text-brand-neon font-black">
                  Jesse's Pizza Co.
                </span>
              </div>

              <div className="hidden md:flex items-center gap-10 font-bold text-sm uppercase tracking-[0.2em] text-brand-white">
                <button onClick={() => setView('menu-browse')} className="hover:text-brand-neon transition-colors font-bold tracking-widest">MENU</button>
                <button onClick={() => setView('about')} className="hover:text-brand-neon transition-colors font-bold tracking-widest">ABOUT</button>
                <a href="#locations" className="hover:text-brand-neon transition-colors font-bold tracking-widest">Locations</a>
                <button onClick={startOrder} className="btn-primary py-3">
                  Order Now
                </button>
              </div>

              <button 
                className="md:hidden text-brand-neon p-2 hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>

              {/* MOBILE MENU */}
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="md:hidden absolute top-full left-0 right-0 bg-brand-black border-b border-brand-neon/20 p-6 flex flex-col gap-6 font-display text-2xl uppercase text-brand-white noise-overlay"
                >
                  <button onClick={() => { setIsMenuOpen(false); setView('menu-browse'); }} className="text-left font-bold text-brand-neon">MENU</button>
                  <button onClick={() => { setIsMenuOpen(false); setView('about'); }} className="text-left font-bold">ABOUT</button>
                  <a href="#locations" onClick={() => setIsMenuOpen(false)} className="font-bold">Locations</a>
                  <button onClick={() => { setIsMenuOpen(false); startOrder(); }} className="btn-primary py-4 font-bold">Order Online</button>
                </motion.div>
              )}
            </nav>

            <main>
              {/* SECTION 1: HERO */}
              <section className="bg-brand-black px-6 py-12 md:py-24 border-b border-white/5 overflow-hidden noise-overlay">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24 relative z-10">
                  {/* Food Image - Mobile First */}
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-brand-neon blur-[120px] opacity-10 rounded-full" />
                      <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200" 
                        alt="Hot Pizza" 
                        className="relative z-10 w-full aspect-square object-cover border-4 border-white/5 shadow-3xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </div>

                  {/* Hero Text */}
                  <div className="w-full md:w-1/2 order-2 md:order-1 text-left">
                    <p className="text-brand-neon font-black uppercase tracking-[0.4em] mb-4 text-xs md:text-sm">Borger & Fritch, TX</p>
                    <h1 className="font-display text-6xl md:text-[8rem] lg:text-[11rem] mb-6 leading-[0.8] uppercase text-brand-neon">
                      Pizza Done Right.
                    </h1>
                    <p className="text-lg md:text-2xl max-w-md opacity-90 font-medium text-brand-white mb-12 leading-relaxed">
                      Big portions. Loaded toppings. Fast pickup. <span className="text-brand-neon font-bold">No shortcuts.</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <button onClick={startOrder} className="btn-primary px-16 py-6 text-2xl font-display">Order Now</button>
                      <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="btn-secondary px-16 py-6 text-2xl font-display">
                        View Menu
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: TRUST STRIP */}
              <div className="bg-brand-neon py-6 px-6 relative z-20 shadow-2xl skew-y-[-1deg] -mt-8 mb-20 origin-left">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 skew-y-[1deg]">
                  {[
                    { icon: <Clock size={20} />, text: "Fast Pickup Guaranteed" },
                    { icon: <Check size={20} />, text: "Loaded with Toppings" },
                    { icon: <MapPin size={20} />, text: "Borger & Fritch Local" },
                    { icon: <Flame size={20} />, text: "Built for Real People" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-brand-black font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 2: MENU PREVIEW */}
              <section id="menu" className="bg-brand-black px-6 py-20 border-b border-white/5 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <h2 className="font-display text-5xl md:text-8xl uppercase text-left text-brand-neon">What We’re Serving</h2>
                    <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="text-brand-white font-black uppercase tracking-widest flex items-center gap-2 group hover:text-brand-neon transition-colors">
                      View Full Menu <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'Pepperoni Pizza', desc: 'Classic. Loaded. Always hits.', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Chicken Bacon Ranch', desc: 'Savory, creamy, and packed with flavor.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Jalapeño Popper Pizza', desc: 'Spicy, creamy, and a local favorite.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Build Your Own', desc: 'Exactly how you want it. Every time.', img: 'https://images.unsplash.com/photo-1593504049359-74330189a355?auto=format&fit=crop&q=80&w=800' }
                    ].map((item, i) => (
                      <div key={i} className="card-concrete group flex flex-col items-start text-left noise-overlay">
                        <div className="aspect-square w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-8 flex flex-col flex-1 relative z-10 w-full">
                          <h3 className="font-display text-2xl uppercase mb-2 tracking-tighter leading-none text-brand-white">{item.name}</h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-8 leading-snug flex-1 italic">{item.desc}</p>
                          <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="btn-secondary w-full py-4 text-xs">
                            View Options
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: MOST POPULAR (Combos / Best Sellers) */}
              <section className="bg-brand-concrete px-6 py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10">
                  <h2 className="font-display text-5xl md:text-8xl uppercase mb-20 text-center text-brand-neon">Most Ordered Local</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {[
                      { name: 'Jalapeño Popper Pizza', desc: 'Creamy heat with real kick.', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Chicken Bacon Ranch', desc: 'Rich, savory, and always satisfying.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' },
                      { name: '18" Jumbo Pizza', desc: 'Big enough to feed everyone.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center group">
                        <div className="bg-brand-black border border-white/5 p-4 mb-10 w-full overflow-hidden shadow-2xl relative">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
                            <div className="absolute top-4 left-4 bg-brand-neon text-brand-black font-black text-[10px] uppercase tracking-widest px-4 py-2">Customer Favorite</div>
                          </div>
                        </div>
                        <div className="text-center px-4 w-full">
                          <h3 className="font-display text-3xl md:text-4xl uppercase mb-4 tracking-tighter text-brand-white">{item.name}</h3>
                          <p className="text-gray-400 font-medium mb-10 text-lg leading-relaxed">{item.desc}</p>
                          <button onClick={startOrder} className="btn-primary w-full py-6 text-xl">Order This</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 4: LOCATIONS */}
              <section id="locations" className="bg-brand-black px-6 py-32 border-b border-white/10 noise-overlay">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                  <h2 className="font-display text-5xl md:text-8xl uppercase mb-24 leading-[0.85] text-brand-neon">Nearest Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 w-full">
                    {/* Borger */}
                    <div className="flex flex-col items-start text-left">
                      <div className="w-20 h-2 bg-brand-neon mb-10" />
                      <h3 className="font-display text-4xl uppercase mb-6 tracking-tight text-brand-white">Borger</h3>
                      <div className="text-xl font-bold uppercase tracking-widest text-gray-400 space-y-2 mb-12">
                        <p>530 W 3rd St</p>
                        <p>Borger, TX 79007</p>
                        <p className="text-brand-neon mt-4 font-black">(806) 274-7200</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <button onClick={startOrder} className="btn-primary py-6 text-xl">Order Online</button>
                        <a href="tel:8062747200" className="btn-secondary py-6 text-xl text-center">Call Now</a>
                      </div>
                    </div>

                    {/* Fritch */}
                    <div className="flex flex-col items-start text-left">
                      <div className="w-20 h-2 bg-brand-neon mb-10" />
                      <h3 className="font-display text-4xl uppercase mb-6 tracking-tight text-brand-white">Fritch</h3>
                      <div className="text-xl font-bold uppercase tracking-widest text-gray-400 space-y-2 mb-12">
                        <p>424 E Broadway St</p>
                        <p>Fritch, TX 79036</p>
                        <p className="text-brand-neon mt-4 font-black">(806) 857-0098</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <button onClick={startOrder} className="btn-primary py-6 text-xl">Order Online</button>
                        <a href="tel:8068570098" className="btn-secondary py-6 text-xl text-center">Call Now</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: REVIEWS */}
              <section className="bg-brand-concrete px-6 py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10">
                  <h2 className="font-display text-5xl md:text-8xl uppercase mb-24 text-center text-brand-neon">Real Talk</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 px-4">
                    {[
                      "“Best pizza in town. Always loaded.”",
                      "“Consistently good every single time.”",
                      "“Way better than the chains.”",
                      "“Fast, fresh, and worth it.”"
                    ].map((review, i) => (
                      <div key={i} className="flex items-start gap-8 group">
                        <div className="h-full w-2 bg-brand-neon group-hover:scale-y-110 transition-transform origin-top shadow-[0_0_20px_rgba(184,240,0,0.4)]" />
                        <p className="font-display text-3xl md:text-6xl uppercase leading-[0.9] italic text-brand-white transition-all opacity-90 group-hover:opacity-100 group-hover:text-brand-neon">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: FINAL CTA */}
              <section className="bg-brand-black py-40 md:py-60 px-6 overflow-hidden relative noise-overlay">
                <div className="absolute inset-0 bg-brand-neon/5 opacity-30 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <h2 className="font-display text-7xl md:text-[14rem] uppercase leading-[0.75] mb-12 text-brand-neon">Ready to Order?</h2>
                  <p className="text-xl md:text-3xl font-black uppercase tracking-[0.4em] mb-20 opacity-90 text-brand-white">
                    Skip the chains. Get pizza that actually delivers.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={startOrder} className="btn-primary px-20 py-8 text-3xl font-display">
                      Order Now
                    </button>
                    <a href="tel:8062747200" className="btn-secondary px-20 py-8 text-3xl font-display text-center">
                      Call Now
                    </a>
                  </div>
                </div>
              </section>
            </main>

            <footer className="bg-black py-12 px-8 border-t border-white/5 flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em]">
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-hot-orange transition-colors opacity-60 hover:opacity-100">Home</button>
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="hover:text-hot-orange transition-colors opacity-60 hover:opacity-100">Browse Menu</button>
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hover:text-hot-orange transition-colors opacity-60 hover:opacity-100">About Our Story</button>
                <a href="#locations" className="hover:text-hot-orange transition-colors opacity-60 hover:opacity-100">Locations</a>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
                © 2026 Jesse's Pizza Co. • All Rights Reserved
              </div>
            </footer>
          </motion.div>
        ) : view === 'menu-browse' ? (
          <motion.div 
            key="menu-browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-32"
          >
            {/* STANDALONE MENU HEADER */}
            <nav className="flex justify-between items-center px-4 md:px-8 py-5 bg-brand-black border-b border-white/10 sticky top-0 z-50 noise-overlay">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setView('home')}>
                <Pizza className="text-brand-neon w-6 h-6 md:w-8 md:h-8" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl uppercase whitespace-nowrap text-brand-neon font-black">
                  Jesse's Pizza Co.
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hidden sm:block text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">About</button>
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hidden sm:block text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Back to Home</button>
                <button 
                  onClick={startOrder} 
                  className="btn-primary py-3 px-6 text-xs"
                >
                  Order Now
                </button>
              </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 lg:p-12 relative z-10">
              {/* HERO SECTION FOR MENU */}
              <div className="text-center mb-32 max-w-4xl mx-auto pt-10">
                <h1 className="font-display text-7xl md:text-8xl lg:text-[12rem] mb-8 leading-[0.8] uppercase text-brand-neon">Pick Your Pizza. <br/>We’ll Handle the Rest.</h1>
                <p className="text-xl md:text-3xl text-brand-white opacity-80 font-medium mb-16 uppercase tracking-wider">Loaded toppings. Big portions. Built to satisfy.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={startOrder} className="btn-primary px-16 py-6 text-2xl font-display">Order Now</button>
                  <a href="tel:8062747200" className="btn-secondary px-16 py-6 text-2xl font-display text-center">
                    Call Now
                  </a>
                </div>
              </div>

              <div className="space-y-40">
                {MENU_CATEGORIES.map((category) => (
                  <section key={category.id}>
                    <div className="text-center mb-24 lg:mb-32">
                      <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] uppercase leading-[0.8] mb-6 text-brand-neon">{category.title}</h2>
                      <p className="text-sm font-black uppercase tracking-[0.4em] text-brand-white opacity-60">{category.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                      {category.items.map(item => {
                        const isPop = category.id === 'popular';
                        const isCombo = category.id === 'combos';
                        return (
                          <div 
                            key={item.id}
                            className={`card-concrete transition-all group flex flex-col relative noise-overlay ${isPop || item.bestValue ? 'ring-2 ring-brand-neon/20' : ''}`}
                          >
                            {item.bestValue && (
                              <div className="absolute -top-4 -right-4 bg-brand-neon text-brand-black font-black text-[10px] uppercase px-6 py-3 z-20 shadow-2xl skew-x-[-15deg]">
                                Best Value
                              </div>
                            )}
                            
                            {item.image && (
                              <div className="relative aspect-[4/3] overflow-hidden bg-brand-black">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                                {isPop && <span className="absolute top-6 left-6 bg-brand-red text-brand-white font-black text-[11px] uppercase px-5 py-2 z-10 italic">Most Popular</span>}
                              </div>
                            )}
                            
                            <div className="p-10 lg:p-14 flex flex-col flex-1 relative z-10">
                              <div className="flex justify-between items-start mb-6">
                                <h3 className="font-display text-4xl lg:text-5xl uppercase leading-none text-brand-white">{item.name}</h3>
                                <span className="text-2xl font-black text-brand-neon">
                                  {item.displayPrice || (item.basePrice ? `$${item.basePrice.toFixed(2)}` : '')}
                                </span>
                              </div>
                              
                              <p className="text-base text-gray-400 font-bold mb-10 italic flex-1 leading-snug">
                                {item.desc}
                              </p>

                              {item.prices && (
                                <div className="space-y-4 mb-12 pt-8 border-t-2 border-white/5">
                                  {Object.entries(item.prices).map(([size, price]) => (
                                    <div key={size} className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                                      <span className="opacity-30 text-brand-white">{size}</span>
                                      <span className={item.bestValue === size ? "text-brand-neon" : "text-brand-white"}>
                                        ${(price as number).toFixed(2)} {item.bestValue === size && "(Best Value)"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <button onClick={() => { 
                                setSelectedProduct({ ...item, price: item.basePrice || Object.values(item.prices || {})[0] }); 
                                setView('order-start'); 
                              }} className={`w-full py-6 font-display text-2xl uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 ${isPop || isCombo || item.bestValue ? 'bg-brand-red text-brand-white' : 'btn-secondary'}`}>
                                {item.type === 'byo-pizza' ? 'Start Building' : 'Order Now'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>

              {/* FINAL CTA ON MENU */}
              <div className="bg-brand-neon py-40 md:py-60 px-6 mt-60 overflow-hidden text-center relative skew-y-[-1deg]">
                <div className="absolute inset-0 bg-brand-black/5 opacity-10 pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10 skew-y-[1deg]">
                  <h2 className="font-display text-7xl md:text-[14rem] lg:text-[16rem] uppercase leading-[0.75] mb-8 text-brand-black">Ready to Order?</h2>
                  <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mb-20 opacity-80 text-brand-black">
                    Skip the chains. Get pizza that actually delivers.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={startOrder} className="bg-brand-black text-brand-white px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-gray-900 transition-all shadow-3xl">
                      Order Now
                    </button>
                    <a href="tel:8062747200" className="bg-transparent border-4 border-brand-black text-brand-black px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-black/10 transition-all text-center">
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <footer className="bg-brand-black py-12 px-8 border-t border-white/5 flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em]">
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Home</button>
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Browse Menu</button>
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">About Our Story</button>
                <a href="#locations" className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Locations</a>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 text-brand-white">
                © 2026 Jesse's Pizza Co. • Built for the Panhandle
              </div>
            </footer>
          </motion.div>
        ) : view === 'about' ? (
          <motion.div 
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-32 bg-brand-black min-h-screen noise-overlay"
          >
            {/* Nav */}
            <nav className="flex justify-between items-center px-4 md:px-8 py-5 bg-brand-black border-b border-white/10 sticky top-0 z-50 noise-overlay">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setView('home')}>
                <Pizza className="text-brand-neon w-6 h-6 md:w-8 md:h-8" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl uppercase whitespace-nowrap text-brand-neon font-black">
                  Jesse's Pizza Co.
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="hidden sm:block text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Menu</button>
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hidden sm:block text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Back to Home</button>
                <button 
                  onClick={startOrder} 
                  className="btn-primary py-3 px-6 text-xs"
                >
                  Order Now
                </button>
              </div>
            </nav>

            {/* SECTION 1: HERO */}
            <section className="px-6 py-24 md:py-40 text-center border-b border-white/5 bg-[radial-gradient(circle_at_top,rgba(184,240,0,0.05),transparent)]">
              <div className="max-w-4xl mx-auto">
                <h1 className="font-display text-7xl md:text-8xl lg:text-[10rem] mb-8 leading-[0.85] uppercase text-brand-neon">
                  Not a Chain. <br/>Not Average. <br/>Just Pizza Done Right.
                </h1>
                <p className="text-xl md:text-3xl text-brand-white opacity-80 font-medium max-w-2xl mx-auto leading-relaxed uppercase tracking-wide">
                  Jesse’s Pizza Company serves Borger and Fritch with one goal: make pizza people actually want to come back for.
                </p>
              </div>
            </section>

            {/* SECTION 2: THE PROBLEM */}
            <section className="px-6 py-32 md:py-48 border-b border-white/5 noise-overlay">
              <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="font-display text-5xl md:text-7xl mb-12 uppercase tracking-tighter text-brand-neon">Why Jesse’s Exists</h2>
                <div className="space-y-8 text-xl md:text-2xl text-brand-white opacity-90 leading-relaxed font-medium">
                  <p>Most people have had pizza that looks good… until you take a bite.</p>
                  <p className="text-brand-neon font-black italic">Light toppings. Bland flavor. Feels rushed.</p>
                  <p>You eat it because it’s there, not because it’s good.</p>
                  <p className="border-l-4 border-brand-neon pl-8 py-4 bg-white/5 uppercase font-bold tracking-widest text-brand-neon">That’s exactly what we don’t do.</p>
                  <p>Jesse’s Pizza Company exists to give people a better option.</p>
                  <p>Pizza that’s actually loaded. Actually satisfying. Actually worth ordering again.</p>
                </div>
              </div>
            </section>

            {/* SECTION 3: THE DIFFERENCE */}
            <section className="px-6 py-32 md:py-48 bg-brand-concrete border-b border-white/5 noise-overlay">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-16 md:items-center relative z-10">
                <div className="flex-1">
                  <h2 className="font-display text-5xl md:text-7xl mb-12 uppercase tracking-tighter text-brand-neon">What Makes Us Different</h2>
                  <div className="space-y-8 text-xl text-gray-400 leading-relaxed">
                    <p className="text-brand-white font-bold uppercase tracking-widest">We’re not trying to be fancy.</p>
                    <p>We’re focused on doing the basics better than most:</p>
                    <ul className="space-y-6">
                      <li className="flex items-center gap-4 text-brand-white font-bold italic">
                        <CheckCircle2 className="text-brand-neon" /> Generous toppings, not skimpy portions
                      </li>
                      <li className="flex items-center gap-4 text-brand-white font-bold italic">
                        <CheckCircle2 className="text-brand-neon" /> Consistent quality every time
                      </li>
                      <li className="flex items-center gap-4 text-brand-white font-bold italic">
                        <CheckCircle2 className="text-brand-neon" /> Simple menu, done right
                      </li>
                    </ul>
                    <p className="pt-8 opacity-60 border-t border-white/10 uppercase tracking-widest text-sm text-brand-white">
                      If it’s not something we’d eat ourselves, it doesn’t go out.
                    </p>
                  </div>
                </div>
                <div className="flex-1 relative aspect-square bg-brand-black overflow-hidden border border-white/5 shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=800" alt="Pizza Detail" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent opacity-60" />
                </div>
              </div>
            </section>

            {/* SECTION 4: THE BRAND STORY */}
            <section className="px-6 py-32 md:py-48 border-b border-white/5 noise-overlay">
              <div className="max-w-3xl mx-auto text-center relative z-10">
                <h2 className="font-display text-5xl md:text-7xl mb-12 uppercase tracking-tighter text-brand-neon">Our Story</h2>
                <div className="space-y-8 text-xl md:text-2xl text-gray-400 leading-relaxed font-medium">
                  <p>Jesse’s Pizza Company is built around a simple idea:</p>
                  <p className="text-brand-white text-3xl md:text-5xl font-display uppercase leading-tight italic">
                    Serve good food, do it consistently, and take care of the people who walk through the door.
                  </p>
                  <p>We’re part of the Borger and Fritch communities, and that matters.</p>
                  <p>This isn’t a place trying to be something it’s not.</p>
                  <p>It’s a local pizza spot focused on doing things right and keeping customers coming back.</p>
                </div>
              </div>
            </section>

            {/* SECTION 5: LOCAL ROOTS */}
            <section id="locations-about" className="px-6 py-32 md:py-48 bg-brand-neon text-brand-black border-b border-black">
              <div className="max-w-7xl mx-auto">
                <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] mb-16 uppercase leading-[0.8] tracking-tighter text-brand-black">Proudly Serving <br/>Borger & Fritch</h2>
                <div className="grid md:grid-cols-2 gap-12">
                   <div className="border-4 border-brand-black p-10 flex flex-col justify-between h-full bg-brand-white/10">
                      <div>
                        <h3 className="font-display text-5xl mb-4 uppercase">Borger</h3>
                        <p className="text-2xl font-black uppercase mb-2">530 W 3rd St</p>
                        <a href="tel:8062747200" className="text-4xl font-display">(806) 274-7200</a>
                      </div>
                      <button onClick={startOrder} className="mt-12 bg-brand-black text-brand-white py-6 text-2xl font-display uppercase tracking-widest hover:bg-gray-900 transition-all font-bold">Order Pickup</button>
                   </div>
                   <div className="border-4 border-brand-black p-10 flex flex-col justify-between h-full bg-brand-white/10">
                      <div>
                        <h3 className="font-display text-5xl mb-4 uppercase">Fritch</h3>
                        <p className="text-2xl font-black uppercase mb-2">424 E Broadway St</p>
                        <a href="tel:8068570098" className="text-4xl font-display">(806) 857-0098</a>
                      </div>
                      <button onClick={startOrder} className="mt-12 bg-brand-black text-brand-white py-6 text-2xl font-display uppercase tracking-widest hover:bg-gray-900 transition-all font-bold">Order Pickup</button>
                   </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: SOCIAL PROOF */}
            <section className="px-6 py-32 border-b border-white/5 bg-brand-concrete noise-overlay">
              <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="font-display text-3xl mb-16 uppercase tracking-widest opacity-40 text-brand-white">What Locals Say</h2>
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="text-3xl md:text-4xl font-display uppercase italic border-l-4 border-brand-neon pl-8 py-4 text-brand-white">“Best pizza in town.”</div>
                  <div className="text-3xl md:text-4xl font-display uppercase italic border-l-4 border-brand-neon pl-8 py-4 text-brand-white">“Always loaded.”</div>
                  <div className="text-3xl md:text-4xl font-display uppercase italic border-l-4 border-brand-neon pl-8 py-4 text-brand-white">“Consistently good every time.”</div>
                </div>
              </div>
            </section>

            {/* SECTION 7: OUR APPROACH */}
            <section className="px-6 py-32 bg-brand-black border-b border-white/5 noise-overlay">
              <div className="max-w-4xl mx-auto text-left relative z-10">
                <h2 className="font-display text-2xl mb-12 uppercase tracking-[0.4em] text-brand-neon">Our Approach</h2>
                <div className="space-y-6">
                   <div className="border-b border-white/10 pb-8 hover:bg-white/5 transition-colors group px-4">
                      <h3 className="font-display text-5xl group-hover:pl-4 transition-all text-brand-white">Make food people actually enjoy</h3>
                   </div>
                   <div className="border-b border-white/10 pb-8 hover:bg-white/5 transition-colors group px-4">
                      <h3 className="font-display text-5xl group-hover:pl-4 transition-all text-brand-white">Keep it consistent</h3>
                   </div>
                   <div className="border-b border-white/10 pb-8 hover:bg-white/5 transition-colors group px-4">
                      <h3 className="font-display text-5xl group-hover:pl-4 transition-all text-brand-white">Don’t cut corners</h3>
                   </div>
                </div>
                <p className="mt-12 text-2xl font-black uppercase text-gray-500 italic">No gimmicks. No shortcuts. Just solid pizza.</p>
              </div>
            </section>

            {/* SECTION 8: FINAL HIT */}
            <section className="px-6 py-60 text-center relative overflow-hidden bg-brand-black noise-overlay">
               <div className="max-w-5xl mx-auto relative z-10">
                  <h2 className="font-display text-8xl md:text-[15rem] leading-none uppercase mb-12 tracking-tighter text-brand-neon">If You Know, <br/>You Know.</h2>
                  <div className="space-y-8 text-2xl md:text-4xl font-black uppercase tracking-tight text-brand-white opacity-90">
                    <p>If you’ve had great pizza, you know the difference.</p>
                    <p className="text-brand-white underline decoration-brand-neon decoration-8 underline-offset-8">If you haven’t yet, now’s a good time to fix that.</p>
                  </div>
               </div>
            </section>

            {/* SECTION 9: CTA */}
            <div className="bg-brand-red py-40 md:py-60 px-6 text-center relative border-y-4 border-brand-black">
                <div className="max-w-4xl mx-auto">
                  <h2 className="font-display text-7xl md:text-[12rem] uppercase leading-[0.75] mb-8 text-brand-white">Ready to Order?</h2>
                  <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mb-20 opacity-90 text-brand-white">
                    Skip the chains. Get pizza that actually delivers.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={startOrder} className="bg-brand-black text-brand-white px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-gray-900 transition-all font-bold">
                      Order Now
                    </button>
                    <a href="tel:8062747200" className="bg-transparent border-4 border-brand-black text-brand-black px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-brand-black/10 transition-all text-center">
                      Call Now
                    </a>
                  </div>
                </div>
            </div>

            <footer className="bg-brand-black py-12 px-8 border-t border-white/5 flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em]">
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Home</button>
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Browse Menu</button>
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">About Our Story</button>
                <a href="#locations" className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Locations</a>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20 text-brand-white">
                © 2026 Jesse's Pizza Co. • Locally Owned & Operated
              </div>
            </footer>
          </motion.div>
        ) : (

          <motion.div 
            key="funnel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-32"
          >
            {/* ORDER FUNNEL STEPS */}
            
            {/* STEP 1: ORDER START */}
            {view === 'order-start' && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title="Start Your Order" onBack={backToHome} />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={0} />
                  <p className="text-center text-xl text-brand-white/60 mb-12 uppercase font-bold tracking-widest leading-relaxed text-brand-white">Choose how you want to get your food.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <button 
                      onClick={() => setOrderType('pickup')}
                      className={`p-10 border-2 transition-all flex flex-col items-center gap-6 ${orderType === 'pickup' ? 'border-brand-neon bg-brand-neon/10 scale-105 shadow-xl shadow-brand-neon/10' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      <ShoppingBag size={48} className={orderType === 'pickup' ? 'text-brand-neon' : 'text-gray-500'} />
                      <span className="font-display text-4xl uppercase text-brand-white">Pickup</span>
                      {orderType === 'pickup' && <CheckCircle2 className="text-brand-neon" />}
                    </button>
                    <button 
                      onClick={() => setOrderType('delivery')}
                      className={`p-10 border-2 transition-all flex flex-col items-center gap-6 ${orderType === 'delivery' ? 'border-brand-neon bg-brand-neon/10 scale-105 shadow-xl shadow-brand-neon/10' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      <Truck size={48} className={orderType === 'delivery' ? 'text-brand-neon' : 'text-gray-500'} />
                      <span className="font-display text-4xl uppercase text-brand-white">Delivery</span>
                      {orderType === 'delivery' && <CheckCircle2 className="text-brand-neon" />}
                    </button>
                  </div>

                  <h2 className="font-display text-3xl uppercase mb-8 text-center bg-white/5 py-4 text-brand-neon">Select Location</h2>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {['Borger', 'Fritch'].map(loc => (
                      <button 
                        key={loc}
                        onClick={() => setLocation(loc as any)}
                        className={`py-6 border transition-all font-display text-2xl uppercase ${location === loc ? 'bg-brand-neon text-brand-black border-brand-neon' : 'border-white/10 text-brand-white/40 hover:border-white/40'}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>

                  <div className="mt-16 flex justify-center">
                    <button 
                      onClick={goToMenu} 
                      className="btn-primary px-16 py-6 text-2xl group flex items-center gap-4 transition-all hover:scale-105"
                    >
                      Browse Menu <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MENU */}
            {view === 'menu' && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title="Menu" onBack={startOrder} />
                <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={1} />
                  
                  {/* HERO SECTION FOR MENU */}
                  <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h1 className="font-display text-6xl md:text-8xl lg:text-[10rem] mb-4 leading-none uppercase text-brand-neon">Pick Your Pizza. We’ll Handle the Rest.</h1>
                    <p className="text-xl md:text-2xl text-brand-white/60 font-medium mb-12 uppercase tracking-wide">Loaded toppings. Big portions. Built to actually satisfy.</p>
                  </div>

                  <div className="space-y-40">
                    {MENU_CATEGORIES.map((category) => (
                      <section key={category.id}>
                        <div className="text-center mb-16 px-4">
                          <h2 className="font-display text-5xl md:text-8xl lg:text-9xl uppercase mb-3 text-brand-neon">{category.title}</h2>
                          <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40 text-brand-white">{category.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                          {category.items.map(item => {
                            const isPop = category.id === 'popular';
                            const isCombo = category.id === 'combos';
                            return (
                              <div 
                                key={item.id}
                                onClick={() => { 
                                  if (item.type) {
                                    setSelectedProduct({ ...item, price: item.basePrice || Object.values(item.prices || {})[0] }); 
                                    setView('product'); 
                                  } else {
                                    addToCart({ ...item, price: item.basePrice, quantity: 1 });
                                    setView('upsell');
                                  }
                                }}
                                className={`card-concrete transition-all cursor-pointer group flex flex-col relative noise-overlay ${isPop || item.bestValue ? 'ring-2 ring-brand-neon/20' : ''}`}
                              >
                                {item.bestValue && (
                                  <div className="absolute -top-3 -right-3 bg-brand-neon text-brand-black font-black text-[10px] uppercase px-4 py-2 z-20 shadow-2xl skew-x-[-12deg]">
                                    Best Value
                                  </div>
                                )}
                                
                                {item.image && (
                                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-black">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0" referrerPolicy="no-referrer" />
                                    {isPop && <span className="absolute top-4 left-4 bg-brand-red text-brand-white font-black text-[10px] uppercase px-4 py-2 z-10 shadow-xl italic tracking-widest">Most Popular</span>}
                                  </div>
                                )}
                                
                                <div className="p-10 flex-1 flex flex-col relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-display text-3xl md:text-4xl uppercase leading-none text-brand-white">{item.name}</h3>
                                    <span className="text-xl font-black text-brand-neon">
                                      {item.displayPrice || `$${item.basePrice?.toFixed(2)}`}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-400 font-bold mb-8 italic flex-1 leading-snug">
                                    {item.desc}
                                  </p>

                                  {item.prices && (
                                    <div className="space-y-2 mb-10 pt-6 border-t border-white/5">
                                      {Object.entries(item.prices).map(([size, price]) => (
                                        <div key={size} className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                          <span className="opacity-40 text-brand-white">{size}</span>
                                          <span className={item.bestValue === size ? "text-brand-neon" : "text-brand-white"}>
                                            ${(price as number).toFixed(2)} {item.bestValue === size && "(Best Value)"}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <button onClick={(e) => { e.stopPropagation(); if (item.type) { setSelectedProduct({ ...item, price: item.basePrice || Object.values(item.prices || {})[0] }); setView('product'); } else { addToCart({ ...item, price: item.basePrice, quantity: 1 }); setView('upsell'); } }} className={`w-full py-5 font-display text-xl uppercase tracking-widest transition-all ${isPop || isCombo || item.bestValue ? 'btn-primary' : 'btn-secondary'}`}>
                                    {item.type === 'byo-pizza' ? 'Start Building' : 'Order Now'}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ))}
                  </div>

                  {/* FINAL CTA ON MENU */}
                  <div className="bg-brand-red text-brand-white py-32 px-6 mt-40 overflow-hidden text-center relative noise-overlay">
                    <div className="max-w-4xl mx-auto relative z-10">
                      <h2 className="font-display text-6xl md:text-[8rem] lg:text-[10rem] uppercase leading-[0.8] mb-6">Ready to Order?</h2>
                      <p className="text-xl md:text-2xl font-black uppercase tracking-widest mb-16 opacity-80">
                        Skip the chains. Get pizza that actually delivers.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button onClick={startOrder} className="bg-brand-black text-brand-white px-16 py-6 text-2xl font-display uppercase tracking-widest hover:scale-105 transition-all">
                          Order Now
                        </button>
                        <a href="tel:8062747200" className="bg-transparent border-4 border-brand-black text-brand-black px-16 py-6 text-2xl font-display uppercase tracking-widest hover:bg-black/10 transition-all text-center">
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRODUCT PAGE */}
            {view === 'product' && selectedProduct && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title={selectedProduct.name} onBack={goToMenu} />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={2} />
                  
                  <div className="flex flex-col lg:flex-row gap-12 mb-20 text-left">
                    <div className="lg:w-1/2">
                      <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-8 overflow-hidden relative">
                        <Pizza size={120} className="text-white/5 absolute -bottom-10 -right-10 rotate-12" />
                        <img 
                          src={selectedProduct.image || 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=600'} 
                          className="relative z-10 w-full h-full object-contain grayscale opacity-50 drop-shadow-2xl" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-8 p-6 bg-white/5 border-l-4 border-brand-neon">
                        <p className="text-xl text-brand-white font-medium italic opacity-90 leading-relaxed">"{selectedProduct.desc}"</p>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2 space-y-10">
                      {/* SIZE SELECTION */}
                      {(['pizza', 'byo-pizza', 'side-sized'].includes(selectedProduct.type)) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">Select Size</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(selectedProduct.type === 'side-sized' ? ['Medium', 'Large'] : ['8"', '12"', '14"', '18"']).map(size => (
                              <button 
                                key={size}
                                onClick={() => setSelectedProduct({ ...selectedProduct, size })}
                                className={`py-4 border font-display text-lg ${selectedProduct.size === size ? 'bg-brand-neon text-brand-black border-brand-neon shadow-lg shadow-brand-neon/20' : 'border-white/10 hover:border-white/40 text-brand-white'}`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* WING COUNT */}
                      {selectedProduct.type === 'wings' && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">Wing Count</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {['8 Count', '12 Count', '18 Count'].map(count => (
                              <button 
                                key={count}
                                onClick={() => setSelectedProduct({ ...selectedProduct, count })}
                                className={`py-4 border font-display text-lg ${selectedProduct.count === count ? 'bg-brand-neon text-brand-black border-brand-neon' : 'border-white/10 hover:border-white/40 text-brand-white'}`}
                              >
                                {count}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* CRUST SELECTION */}
                      {['pizza', 'byo-pizza'].includes(selectedProduct.type) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">Crust Type</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {['Original', 'Cauliflower'].map(crust => (
                              <button 
                                key={crust}
                                onClick={() => setSelectedProduct({ ...selectedProduct, crust })}
                                className={`py-4 border font-display text-lg ${selectedProduct.crust === crust ? 'bg-brand-neon text-brand-black border-brand-neon' : 'border-white/10 hover:border-white/40 text-brand-white'}`}
                              >
                                {crust}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* TOPPINGS */}
                      {(['pizza', 'byo-pizza', 'calzone'].includes(selectedProduct.type)) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">
                            Toppings <span className="text-[10px] opacity-40 ml-2 text-brand-white">(Max 5 recommended)</span>
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {['Pepperoni', 'Sausage', 'Bacon', 'Ham', 'Mushroom', 'Onion', 'Bell Pepper', 'Fresh Jalapeño'].map(top => {
                              const selected = selectedProduct.toppings?.includes(top);
                              return (
                                <button 
                                  key={top}
                                  onClick={() => {
                                    const current = selectedProduct.toppings || [];
                                    const next = selected ? current.filter((t: any) => t !== top) : [...current, top];
                                    setSelectedProduct({ ...selectedProduct, toppings: next });
                                  }}
                                  className={`py-3 px-4 border text-left flex justify-between items-center transition-all ${selected ? 'bg-brand-red border-brand-red text-brand-white' : 'border-white/10 hover:bg-white/5 text-brand-white'}`}
                                >
                                  <span className="text-sm font-bold uppercase tracking-tight">{top}</span>
                                  {selected ? <Check size={16} /> : <Plus size={16} className="opacity-40" />}
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end mb-6">
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1 text-brand-white">Item Total</p>
                              <span className="font-display text-5xl text-brand-neon">${selectedProduct.basePrice.toFixed(2)}</span>
                           </div>
                           <p className="text-[10px] font-black uppercase text-brand-neon mb-2 italic">Ready for heat? 🔥</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (['pizza', 'byo-pizza'].includes(selectedProduct.type) && !selectedProduct.size) return;
                            if (['pizza', 'byo-pizza'].includes(selectedProduct.type) && !selectedProduct.crust) return;
                            if (selectedProduct.type === 'wings' && !selectedProduct.count) return;
                            
                            addToCart({ 
                              ...selectedProduct, 
                              id: `${selectedProduct.id}-${selectedProduct.size || ''}-${selectedProduct.crust || ''}-${selectedProduct.count || ''}-${(selectedProduct.toppings || []).join('-')}`, 
                              quantity: 1,
                              price: selectedProduct.basePrice 
                            });
                            setView('upsell');
                          }}
                          className="w-full bg-brand-neon text-brand-black py-6 text-2xl font-display uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-neon/10 flex items-center justify-center gap-4"
                        >
                          Add to Order <ShoppingBag />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: UPSELL */}
            {view === 'upsell' && (
              <div className="min-h-screen bg-brand-black noise-overlay flex items-center">
                <div className="max-w-4xl mx-auto p-6 md:p-12 w-full py-20 text-center relative z-10">
                  <ProgressSteps current={3} />
                  <h1 className="font-display text-6xl md:text-9xl mb-4 leading-none uppercase italic text-brand-neon">Wait!</h1>
                  <p className="text-2xl md:text-4xl uppercase font-black tracking-widest mb-20 text-brand-white">Add Something to Your Order?</p>
                  
                  <div className="grid sm:grid-cols-3 gap-6 mb-20">
                    {[
                      { name: 'Breadsticks', desc: 'Crispy, warm, and perfect on the side.', price: 6.99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Wings', desc: 'Hot, crispy, and packed with flavor.', price: 12.99, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Cold Drink', desc: '2L Bottle, ready and cold.', price: 3.50, image: 'https://images.unsplash.com/photo-1629203851022-ae73151f9897?auto=format&fit=crop&q=80&w=800' }
                    ].map(item => (
                      <div key={item.name} className="card-concrete p-8 flex flex-col items-center group noise-overlay">
                        <img src={item.image} className="w-full aspect-square object-cover mb-8 grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                        <h3 className="font-display text-2xl uppercase mb-2 text-brand-white">{item.name}</h3>
                        <p className="text-xs text-gray-500 mb-8 font-bold uppercase tracking-wider">{item.desc}</p>
                        <button 
                          onClick={() => {
                            addToCart({ ...item, id: item.name, quantity: 1, price: item.price });
                            setView('cart');
                          }}
                          className="btn-primary w-full py-4 text-sm"
                        >
                          Add for ${item.price}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setView('cart')} className="text-gray-500 font-display text-xl uppercase tracking-widest hover:text-brand-neon transition-colors underline underline-offset-8">
                    Nah, Just My Pizza Please
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CART */}
            {view === 'cart' && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title="Your Order" onBack={() => setView('menu')} />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={4} />
                  
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3 space-y-6 text-brand-white">
                      {cart.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-white/10 noise-overlay">
                          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-600" />
                          <h2 className="font-display text-4xl uppercase mb-12">Your cart is empty.</h2>
                          <button onClick={goToMenu} className="btn-primary px-16 py-5">Go To Menu</button>
                        </div>
                      ) : (
                        cart.map((item, i) => (
                          <div key={i} className="flex gap-8 p-8 bg-white/5 border border-white/5 group relative noise-overlay">
                            <div className="w-24 h-24 bg-brand-black shrink-0 overflow-hidden border border-white/5">
                              <img src={item.image || 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=200'} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-display text-3xl uppercase leading-none">{item.name}</h3>
                                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 border border-white/10">
                                  <button onClick={() => updateQuantity(i, -1)} className="hover:text-brand-neon transition-colors"><Minus size={18} /></button>
                                  <span className="font-display text-2xl w-6 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(i, 1)} className="hover:text-brand-neon transition-colors"><Plus size={18} /></button>
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black italic">
                                {item.size && `${item.size} • `}{item.crust && `${item.crust} crust `}{item.toppings && item.toppings.length > 0 && `• ${item.toppings.join(', ')}`}
                              </p>
                              <div className="mt-6 flex justify-between items-end">
                                <span className="font-display text-3xl text-brand-neon">${(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => updateQuantity(i, -item.quantity)} className="text-[10px] font-black uppercase text-brand-red hover:underline tracking-widest opacity-0 group-hover:opacity-100 transition-all">Remove Item</button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {/* QUICK ADDS */}
                      {cart.length > 0 && (
                        <div className="bg-brand-neon/5 p-10 border-2 border-brand-neon/20 noise-overlay">
                          <h3 className="font-display text-2xl uppercase mb-8 tracking-widest text-brand-neon">Customers Also Add:</h3>
                          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
                            {[
                              { name: 'Extra Ranch', price: 0.99 },
                              { name: 'Cheese Bread', price: 7.99 },
                              { name: '2L Pepsi', price: 3.50 }
                            ].map(side => (
                              <button 
                                key={side.name}
                                onClick={() => addToCart({ ...side, id: side.name, quantity: 1, price: side.price } as any)} 
                                className="shrink-0 bg-brand-black border border-white/10 px-8 py-5 flex flex-col items-center hover:border-brand-neon transition-all group"
                              >
                                <span className="font-display uppercase text-sm mb-2 group-hover:text-brand-neon transition-colors">{side.name}</span>
                                <span className="font-black text-brand-neon text-xs">${side.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-1/3">
                      <div className="bg-brand-black border-2 border-brand-neon p-10 sticky top-32 noise-overlay">
                        <h3 className="font-display text-4xl uppercase mb-10 border-b-2 border-brand-neon/20 pb-6 text-brand-neon">Order Summary</h3>
                        <div className="space-y-6 font-bold text-xs uppercase tracking-widest">
                          <div className="flex justify-between">
                            <span className="opacity-40">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-40">Tax (8.25%)</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          {orderType === 'delivery' && (
                             <div className="flex justify-between text-brand-red">
                               <span>Delivery Fee</span>
                               <span>$4.99</span>
                             </div>
                          )}
                          <div className="flex justify-between items-center text-5xl pt-10 border-t-2 border-brand-neon/20 mt-10">
                            <span className="font-display tracking-[0.1em]">Total</span>
                            <span className="font-display text-brand-neon">${total.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-3 pt-6 opacity-40 italic text-[10px]">
                            <Clock size={16} />
                            <span>Estimated {orderType === 'pickup' ? '20-25' : '45-55'} Mins</span>
                          </div>
                        </div>
                        <button 
                          disabled={cart.length === 0}
                          onClick={() => setView('checkout')}
                          className="w-full btn-primary py-7 mt-12 text-2xl shadow-[0_20px_50px_rgba(214,40,40,0.3)]"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: CHECKOUT */}
            {view === 'checkout' && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title="Complete Your Order" onBack={() => setView('cart')} />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={5} />
                  
                  <div className="grid lg:grid-cols-2 gap-12 text-left">
                    <div className="space-y-12">
                      <section className="bg-white/5 p-8 border border-white/5 noise-overlay">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3 text-brand-neon">
                          <User size={24} /> Contact Info
                        </h3>
                        <div className="space-y-6">
                          {[
                            { label: 'Full Name', placeholder: 'JESSE DOGGETT' },
                            { label: 'Phone Number', placeholder: '(806) 555-0123' }
                          ].map(f => (
                            <div key={f.label} className="group">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-white/40 mb-2 group-focus-within:text-brand-neon transition-colors">{f.label}</label>
                              <input type="text" placeholder={f.placeholder} className="w-full bg-brand-black border border-white/10 px-6 py-4 font-bold text-brand-white focus:border-brand-neon outline-none transition-all uppercase placeholder:opacity-20 placeholder:text-brand-white" />
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="bg-white/5 p-8 border border-white/5 noise-overlay">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3 text-brand-neon">
                          <CreditCard size={24} /> Payment Method
                        </h3>
                        <div className="space-y-3">
                           {['Credit Card', 'Apple Pay', 'Cash'].map(p => (
                             <button key={p} className="w-full py-5 px-6 border border-white/10 text-left font-black uppercase tracking-widest text-xs hover:bg-brand-neon/10 hover:border-brand-neon transition-all flex justify-between items-center group text-brand-white">
                               {p}
                               <div className="w-4 h-4 rounded-full border-2 border-white/20 group-hover:border-brand-neon" />
                             </button>
                           ))}
                        </div>
                      </section>
                    </div>

                    <div className="space-y-12">
                      <section className="bg-white/5 p-8 border border-white/5 noise-overlay">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3 text-brand-neon">
                          <MapPin size={24} /> {orderType === 'pickup' ? 'Store Location' : 'Delivery Details'}
                        </h3>
                        {orderType === 'pickup' ? (
                          <div className="font-bold border-l-4 border-brand-red pl-6 py-2">
                            <p className="text-3xl uppercase font-display leading-tight text-brand-white">{location} Main</p>
                            <p className="text-brand-white/40 text-xs font-black uppercase tracking-widest mt-2 italic">Ready ~20 mins.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                               <label className="block text-[10px] font-black uppercase tracking-widest text-brand-white/40 mb-2">Street Address</label>
                               <input type="text" className="w-full bg-brand-black border border-white/10 px-6 py-4 outline-none focus:border-brand-neon font-bold text-brand-white" />
                            </div>
                          </div>
                        )}
                      </section>

                      <div className="bg-brand-neon text-brand-black p-10 text-center relative overflow-hidden group noise-overlay">
                        <div className="relative z-10">
                          <h2 className="font-display text-5xl lg:text-7xl mb-2 leading-none uppercase">Order Total</h2>
                          <div className="font-display text-7xl lg:text-8xl mb-12 tracking-tighter">${total.toFixed(2)}</div>
                          <button 
                             onClick={() => setView('success')}
                             className="w-full bg-brand-black text-brand-white py-7 text-3xl font-display uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4"
                          >
                            Place Order
                          </button>
                          <p className="mt-8 text-[10px] font-black uppercase tracking-widest opacity-60">Ready when you are. No shortcuts.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 translate-x-16 -translate-y-16 rotate-45" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 -translate-x-16 translate-y-16 rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: SUCCESS PAGE */}
            {view === 'success' && (
              <div className="min-h-screen bg-brand-black noise-overlay flex items-center justify-center p-6">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-3xl w-full card-concrete p-12 md:p-20 text-center relative overflow-hidden noise-overlay"
                >
                  <div className="w-32 h-32 bg-brand-neon mx-auto rounded-full flex items-center justify-center text-brand-black mb-12 shadow-[0_0_50px_rgba(184,240,0,0.3)]">
                    <Check size={80} strokeWidth={4} />
                  </div>
                  <h1 className="font-display text-8xl md:text-[12rem] mb-6 leading-[0.8] uppercase italic text-brand-neon">ORDER FIRE!</h1>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mb-12 text-brand-white opacity-80">We're on it.</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 bg-white/5 p-8 border border-white/5 mb-16 text-left relative z-10">
                    <div className="border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-neon mb-2 block">Est. Time</span>
                      <span className="font-display text-5xl text-brand-white leading-none">{orderType === 'pickup' ? '20' : '45'} MINS</span>
                    </div>
                    <div className="pt-6 md:pt-0 md:pl-6">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-red mb-2 block">Pickup Code</span>
                      <span className="font-display text-5xl text-brand-white leading-none tracking-tighter uppercase italic">JP-{Math.floor(Math.random() * 9000 + 1000)}</span>
                    </div>
                  </div>

                  <button onClick={backToHome} className="btn-primary px-20 py-7 text-2xl w-full shadow-2xl">Return To Home</button>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-neon via-brand-red to-brand-neon" />
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY MOBILE CTA (Only on home) */}
      {view === 'home' && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
          <button onClick={startOrder} className="w-full bg-brand-red text-brand-white py-5 rounded-none font-display text-2xl uppercase tracking-widest shadow-[0_20px_50px_rgba(214,40,40,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all">
            Order Now <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
