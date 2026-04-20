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

type FunnelStep = 'home' | 'menu-browse' | 'order-start' | 'menu' | 'product' | 'upsell' | 'cart' | 'checkout' | 'success';

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
    <div className="flex justify-between items-center max-w-md mx-auto mb-8 px-4 text-[10px] font-black uppercase tracking-widest text-warm-cream/40 overflow-hidden">
      {['Start', 'Menu', 'Custom', 'Add-ons', 'Cart', 'Pay'].map((step, i) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <div className={`w-8 h-1 transition-colors ${i <= current ? 'bg-hot-orange' : 'bg-white/10'}`} />
          <span className={i <= current ? 'text-hot-orange' : ''}>{step}</span>
        </div>
      ))}
    </div>
  );

  const FunnelHeader = ({ title, showBack = true, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => (
    <header className="px-6 py-8 border-b border-white/5 bg-charcoal sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="font-display text-4xl lg:text-5xl uppercase leading-none">{title}</h1>
        </div>
        {cart.length > 0 && view !== 'cart' && view !== 'checkout' && (
          <button onClick={() => setView('cart')} className="relative group p-2 bg-hot-orange text-charcoal rounded-sm font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            <span className="hidden sm:inline font-display">View Cart</span>
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-burnt-red text-white text-[10px] flex items-center justify-center rounded-full border-2 border-charcoal">
              {cart.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </button>
        )}
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-charcoal text-warm-cream selection:bg-hot-orange selection:text-charcoal font-sans">
      
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* NAVIGATION - Geometric Balance Style */}
            <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-burnt-red border-b border-black sticky top-0 z-50">
              <div className="flex items-center gap-2 md:gap-3">
                <Pizza className="text-black w-6 h-6 md:w-8 md:h-8" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl uppercase whitespace-nowrap text-black">
                  Jesse's Pizza Co.
                </span>
              </div>

              <div className="hidden md:flex items-center gap-10 font-bold text-sm uppercase tracking-[0.2em] text-black">
                <button onClick={() => setView('menu-browse')} className="hover:opacity-70 transition-opacity font-bold">MENU</button>
                <a href="#locations" className="hover:opacity-70 transition-opacity font-bold">Locations</a>
                <button onClick={startOrder} className="btn-orange px-8 py-2 text-sm shadow-sm transition-transform active:scale-95">
                  Order Now
                </button>
              </div>

              <button 
                className="md:hidden text-black p-2 hover:bg-black/10 rounded-sm transition-colors"
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
                  className="md:hidden absolute top-full left-0 right-0 bg-burnt-red border-b border-black p-6 flex flex-col gap-6 font-display text-2xl uppercase text-black"
                >
                  <button onClick={() => { setIsMenuOpen(false); setView('menu-browse'); }} className="text-left font-bold">MENU</button>
                  <a href="#locations" onClick={() => setIsMenuOpen(false)} className="font-bold">Locations</a>
                  <button onClick={() => { setIsMenuOpen(false); startOrder(); }} className="btn-orange py-4 font-bold">Order Online</button>
                </motion.div>
              )}
            </nav>

            <main>
              {/* SECTION 1: HERO */}
              <section className="bg-charcoal px-6 py-12 md:py-24 border-b border-white/5 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-24">
                  {/* Food Image - Mobile First */}
                  <div className="w-full md:w-1/2 order-1 md:order-2">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-hot-orange blur-[120px] opacity-10 rounded-full" />
                      <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=1200" 
                        alt="Hot Pizza" 
                        className="relative z-10 w-full aspect-square object-cover border-4 border-white/10 shadow-3xl grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </motion.div>
                  </div>

                  {/* Hero Text */}
                  <div className="w-full md:w-1/2 order-2 md:order-1 text-left">
                    <p className="text-hot-orange font-black uppercase tracking-[0.3em] mb-4 text-xs md:text-sm">Borger & Fritch, TX</p>
                    <h1 className="font-display text-6xl md:text-[8rem] lg:text-[11rem] mb-6 leading-[0.85] uppercase">
                      Pizza That’s Actually Worth Ordering
                    </h1>
                    <p className="text-lg md:text-2xl max-w-md opacity-80 font-medium text-warm-cream mb-10">
                      Big portions. Loaded toppings. Fast pickup. No guesswork.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button onClick={startOrder} className="btn-orange px-12 py-5 text-xl font-display">Order Online</button>
                      <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="border-2 border-warm-cream text-warm-cream px-12 py-5 text-xl font-display uppercase tracking-widest hover:bg-warm-cream hover:text-charcoal transition-all text-center">
                        View Menu
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: MENU PREVIEW */}
              <section id="menu" className="bg-[#1a1a1a] px-6 py-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <h2 className="font-display text-5xl md:text-8xl uppercase text-left text-warm-cream">What We’re Serving</h2>
                    <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="text-hot-orange font-black uppercase tracking-widest flex items-center gap-2 group">
                      View Full Menu <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'Pepperoni Pizza', desc: 'Classic. Loaded. Always hits.', img: 'https://picsum.photos/seed/pep/600/600' },
                      { name: 'Chicken Bacon Ranch', desc: 'Savory, creamy, and packed with flavor.', img: 'https://picsum.photos/seed/cbr/600/600' },
                      { name: 'Jalapeño Popper Pizza', desc: 'Spicy, creamy, and a local favorite.', img: 'https://picsum.photos/seed/jalpop2/600/600' },
                      { name: 'Build Your Own', desc: 'Exactly how you want it. Every time.', img: 'https://picsum.photos/seed/byo/600/600' }
                    ].map((item, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 group flex flex-col items-start text-left">
                        <div className="aspect-square w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="font-display text-2xl uppercase mb-2 tracking-tighter leading-none">{item.name}</h3>
                          <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-8 leading-snug flex-1 italic">{item.desc}</p>
                          <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="w-full bg-hot-orange py-4 text-charcoal font-display uppercase tracking-widest hover:bg-orange-600 transition-colors">
                            View Options
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: BEST SELLERS */}
              <section className="bg-charcoal px-6 py-20 border-b border-white/5">
                <div className="max-w-7xl mx-auto">
                  <h2 className="font-display text-5xl md:text-8xl uppercase mb-16 text-center">Most Ordered Local</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {[
                      { name: 'Jalapeño Popper Pizza', desc: 'Creamy heat with real kick.', img: 'https://picsum.photos/seed/pop1/800/800' },
                      { name: 'Chicken Bacon Ranch', desc: 'Rich, savory, and always satisfying.', img: 'https://picsum.photos/seed/pop2/800/800' },
                      { name: '18" Jumbo Pizza', desc: 'Big enough to feed everyone.', img: 'https://picsum.photos/seed/pop3/800/800' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="bg-white/5 border border-white/10 p-4 mb-8 w-full group overflow-hidden">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                            <div className="absolute top-4 left-4 bg-hot-orange text-charcoal font-black text-[10px] uppercase tracking-widest px-4 py-2">Customer Favorite</div>
                          </div>
                        </div>
                        <div className="text-center px-4">
                          <h3 className="font-display text-3xl md:text-4xl uppercase mb-3 tracking-tighter">{item.name}</h3>
                          <p className="text-gray-400 font-medium mb-8 text-lg">{item.desc}</p>
                          <button onClick={startOrder} className="btn-orange px-12 py-5 text-xl font-display w-full sm:w-auto">Order This</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 4: LOCATIONS */}
              <section id="locations" className="bg-[#111] px-6 py-24 border-b border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="font-display text-5xl md:text-8xl uppercase mb-20 leading-[0.9]">Order From Your Nearest Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    {/* Borger */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-1 w-24 bg-burnt-red mb-8" />
                      <h3 className="font-display text-3xl uppercase mb-4 tracking-wider">Jesse’s Pizza Company</h3>
                      <div className="text-xl font-bold uppercase tracking-widest text-gray-400 space-y-1 mb-10">
                        <p>530 W 3rd St</p>
                        <p>Borger, TX 79007</p>
                        <p className="text-warm-cream mt-4">(806) 274-7200</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <button onClick={startOrder} className="btn-orange py-5 text-xl font-display">Order Online</button>
                        <a href="tel:8062747200" className="border-2 border-white/20 py-5 text-xl font-display uppercase tracking-widest hover:bg-white/10 transition-colors">Call Now</a>
                      </div>
                    </div>

                    {/* Fritch */}
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-1 w-24 bg-burnt-red mb-8" />
                      <h3 className="font-display text-3xl uppercase mb-4 tracking-wider">Jesse’s Pizza Company</h3>
                      <div className="text-xl font-bold uppercase tracking-widest text-gray-400 space-y-1 mb-10">
                        <p>424 E Broadway St</p>
                        <p>Fritch, TX 79036</p>
                        <p className="text-warm-cream mt-4">(806) 857-0098</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <button onClick={startOrder} className="btn-orange py-5 text-xl font-display">Order Online</button>
                        <a href="tel:8068570098" className="border-2 border-white/20 py-5 text-xl font-display uppercase tracking-widest hover:bg-white/10 transition-colors">Call Now</a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 5: REVIEWS */}
              <section className="bg-charcoal px-6 py-24 border-b border-white/10">
                <div className="max-w-7xl mx-auto">
                  <h2 className="font-display text-5xl md:text-8xl uppercase mb-20 text-center">What Locals Are Saying</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                    {[
                      "“Best pizza in town. Always loaded.”",
                      "“Consistently good every single time.”",
                      "“Way better than the chains.”",
                      "“Fast, fresh, and worth it.”"
                    ].map((review, i) => (
                      <div key={i} className="flex items-start gap-6 group">
                        <div className="h-full w-2 bg-hot-orange group-hover:scale-y-110 transition-transform origin-top" />
                        <p className="font-display text-3xl md:text-5xl uppercase leading-tight italic grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: FINAL CTA */}
              <section className="bg-burnt-red py-24 md:py-40 px-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5),transparent)] opacity-50" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <h2 className="font-display text-7xl md:text-[12rem] uppercase leading-[0.8] mb-6">Ready to Order?</h2>
                  <p className="text-xl md:text-3xl font-black uppercase tracking-widest mb-16 opacity-80 text-black">
                    Skip the chains. Get pizza that actually delivers on flavor.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <button onClick={startOrder} className="bg-black text-white px-16 py-6 text-2xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-3xl">
                      Order Online
                    </button>
                    <a href="tel:8062747200" className="bg-transparent border-4 border-black text-black px-16 py-6 text-2xl font-display uppercase tracking-widest hover:bg-black/10 transition-all text-center">
                      Call Now
                    </a>
                  </div>
                </div>
              </section>
            </main>

            <footer className="bg-black py-4 px-8 border-t border-warm-cream/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
              <div>© 2026 Jesse's Pizza Co. • All Rights Reserved</div>
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
            <nav className="flex justify-between items-center px-4 md:px-8 py-4 bg-[#111] border-b border-white/10 sticky top-0 z-50">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => setView('home')}>
                <Pizza className="text-hot-orange w-6 h-6 md:w-8 md:h-8" />
                <span className="font-display text-xl sm:text-2xl md:text-3xl uppercase whitespace-nowrap text-warm-cream">
                  Jesse's Pizza Co.
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setView('home')} className="hidden sm:block text-warm-cream font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Back to Home</button>
                <button 
                  onClick={startOrder} 
                  className="btn-orange px-8 py-2 text-sm shadow-sm transition-transform active:scale-95"
                >
                  Order Now
                </button>
              </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6 lg:p-12">
              {/* HERO SECTION FOR MENU */}
              <div className="text-center mb-32 max-w-2xl mx-auto pt-10">
                <h1 className="font-display text-7xl md:text-8xl lg:text-[10rem] mb-4 leading-[0.8] uppercase">Pick Your Pizza. We’ll Handle the Rest.</h1>
                <p className="text-xl md:text-3xl text-gray-400 font-medium mb-16">Loaded toppings. Big portions. Built to actually satisfy.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={startOrder} className="btn-orange px-16 py-6 text-2xl font-display">Order Now</button>
                  <a href="tel:8062747200" className="border-4 border-warm-cream text-warm-cream px-16 py-6 text-2xl font-display uppercase tracking-widest hover:bg-warm-cream hover:text-charcoal transition-all text-center">
                    Call Now
                  </a>
                </div>
              </div>

              <div className="space-y-40">
                {MENU_CATEGORIES.map((category) => (
                  <section key={category.id}>
                    <div className="text-center mb-24 lg:mb-32">
                      <h2 className="font-display text-6xl md:text-8xl lg:text-[10rem] uppercase leading-[0.8] mb-6">{category.title}</h2>
                      <p className="text-sm font-black uppercase tracking-[0.4em] text-hot-orange opacity-80">{category.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                      {category.items.map(item => {
                        const isPop = category.id === 'popular';
                        const isCombo = category.id === 'combos';
                        return (
                          <div 
                            key={item.id}
                            className={`bg-[#151515] border-2 transition-all group flex flex-col relative ${isPop || item.bestValue ? 'border-hot-orange/30' : 'border-white/5'}`}
                          >
                            {item.bestValue && (
                              <div className="absolute -top-4 -right-4 bg-hot-orange text-charcoal font-black text-[10px] uppercase px-6 py-3 z-20 shadow-2xl skew-x-[-15deg]">
                                Best Value
                              </div>
                            )}
                            
                            {item.image && (
                              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" referrerPolicy="no-referrer" />
                                {isPop && <span className="absolute top-6 left-6 bg-burnt-red text-white font-black text-[11px] uppercase px-5 py-2 z-10 italic">Most Popular</span>}
                              </div>
                            )}
                            
                            <div className="p-10 lg:p-14 flex flex-col flex-1">
                              <div className="flex justify-between items-start mb-6">
                                <h3 className="font-display text-4xl lg:text-5xl uppercase leading-none">{item.name}</h3>
                                <span className="text-2xl font-black text-hot-orange">
                                  {item.displayPrice || (item.basePrice ? `$${item.basePrice.toFixed(2)}` : '')}
                                </span>
                              </div>
                              
                              <p className="text-base text-gray-500 font-bold mb-10 italic flex-1 leading-snug">
                                {item.desc}
                              </p>

                              {item.prices && (
                                <div className="space-y-4 mb-12 pt-8 border-t-2 border-white/5">
                                  {Object.entries(item.prices).map(([size, price]) => (
                                    <div key={size} className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                                      <span className="opacity-30">{size}</span>
                                      <span className={item.bestValue === size ? "text-hot-orange" : "text-warm-cream"}>
                                        ${(price as number).toFixed(2)} {item.bestValue === size && "(Best Value)"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <button onClick={() => { 
                                setSelectedProduct({ ...item, price: item.basePrice || Object.values(item.prices || {})[0] }); 
                                setView('order-start'); 
                              }} className={`w-full py-6 font-display text-2xl uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 ${isPop || isCombo || item.bestValue ? 'bg-hot-orange text-charcoal' : 'bg-white/5 border-2 border-white/10 hover:bg-white/10'}`}>
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
              <div className="bg-burnt-red text-charcoal py-40 md:py-60 px-6 mt-60 overflow-hidden text-center relative border-4 border-black">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.5),transparent)] opacity-20 pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                  <h2 className="font-display text-7xl md:text-[12rem] lg:text-[15rem] uppercase leading-[0.75] mb-8">Ready to Order?</h2>
                  <p className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mb-20 opacity-80 text-black">
                    Skip the chains. Get pizza that actually delivers.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={startOrder} className="bg-black text-white px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-gray-900 transition-all shadow-3xl">
                      Order Now
                    </button>
                    <a href="tel:8062747200" className="bg-transparent border-4 border-black text-black px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-black/10 transition-all text-center">
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <footer className="bg-black py-10 px-8 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.5em] opacity-40">
              © 2026 Jesse's Pizza Co. • Built for the Panhandle
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
              <div className="min-h-screen bg-charcoal">
                <FunnelHeader title="Start Your Order" onBack={backToHome} />
                <div className="max-w-4xl mx-auto p-6 pt-12">
                  <ProgressSteps current={0} />
                  <p className="text-center text-xl text-gray-400 mb-12">Choose how you want to get your food.</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <button 
                      onClick={() => setOrderType('pickup')}
                      className={`p-10 border-2 transition-all flex flex-col items-center gap-6 ${orderType === 'pickup' ? 'border-hot-orange bg-hot-orange/10 scale-105 shadow-xl shadow-hot-orange/10' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      <ShoppingBag size={48} className={orderType === 'pickup' ? 'text-hot-orange' : 'text-gray-500'} />
                      <span className="font-display text-4xl uppercase">Pickup</span>
                      {orderType === 'pickup' && <CheckCircle2 className="text-hot-orange" />}
                    </button>
                    <button 
                      onClick={() => setOrderType('delivery')}
                      className={`p-10 border-2 transition-all flex flex-col items-center gap-6 ${orderType === 'delivery' ? 'border-hot-orange bg-hot-orange/10 scale-105 shadow-xl shadow-hot-orange/10' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      <Truck size={48} className={orderType === 'delivery' ? 'text-hot-orange' : 'text-gray-500'} />
                      <span className="font-display text-4xl uppercase">Delivery</span>
                      {orderType === 'delivery' && <CheckCircle2 className="text-hot-orange" />}
                    </button>
                  </div>

                  <h2 className="font-display text-3xl uppercase mb-8 text-center bg-white/5 py-4">Select Location</h2>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {['Borger', 'Fritch'].map(loc => (
                      <button 
                        key={loc}
                        onClick={() => setLocation(loc as any)}
                        className={`py-6 border transition-all font-display text-2xl uppercase ${location === loc ? 'bg-warm-cream text-charcoal border-warm-cream' : 'border-white/10 text-gray-500 hover:border-white/40'}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>

                  <div className="mt-16 flex justify-center">
                    <button 
                      onClick={goToMenu} 
                      className="btn-orange px-16 py-6 text-2xl group flex items-center gap-4 transition-all hover:scale-105"
                    >
                      Browse Menu <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MENU */}
            {view === 'menu' && (
              <div className="min-h-screen bg-charcoal">
                <FunnelHeader title="Menu" onBack={startOrder} />
                <div className="max-w-7xl mx-auto p-6 pt-12">
                  <ProgressSteps current={1} />
                  
                  {/* HERO SECTION FOR MENU */}
                  <div className="text-center mb-24 max-w-2xl mx-auto">
                    <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-4 leading-none uppercase">Pick Your Pizza. We’ll Handle the Rest.</h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-medium mb-12">Loaded toppings. Big portions. Built to actually satisfy.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <button onClick={startOrder} className="btn-orange px-12 py-5 text-xl font-display">Order Now</button>
                      <a href="tel:8062747200" className="border-2 border-warm-cream text-warm-cream px-12 py-5 text-xl font-display uppercase tracking-widest hover:bg-warm-cream hover:text-charcoal transition-all text-center">
                        Call Now
                      </a>
                    </div>
                  </div>

                  <div className="space-y-32">
                    {MENU_CATEGORIES.map((category) => (
                      <section key={category.id}>
                        <div className="text-center mb-16 px-4">
                          <h2 className="font-display text-5xl md:text-8xl uppercase mb-3">{category.title}</h2>
                          <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40">{category.description}</p>
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
                                  }
                                }}
                                className={`bg-white/5 border-2 transition-all cursor-pointer group flex flex-col relative ${isPop || item.bestValue ? 'border-hot-orange/40 hover:border-hot-orange' : 'border-white/5 hover:border-warm-cream'}`}
                              >
                                {item.bestValue && (
                                  <div className="absolute -top-3 -right-3 bg-hot-orange text-charcoal font-black text-[10px] uppercase px-4 py-2 z-20 shadow-2xl skew-x-[-12deg]">
                                    Best Value
                                  </div>
                                )}
                                
                                {item.image && (
                                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0" />
                                    {isPop && <span className="absolute top-4 left-4 bg-burnt-red text-white font-black text-[10px] uppercase px-4 py-2 z-10 shadow-xl italic tracking-widest">Most Popular</span>}
                                  </div>
                                )}
                                
                                <div className="p-10 flex-1 flex flex-col">
                                  <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-display text-3xl md:text-4xl uppercase leading-none">{item.name}</h3>
                                    <span className="text-xl font-black text-hot-orange">
                                      {item.displayPrice || `$${item.basePrice?.toFixed(2)}`}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm text-gray-500 font-bold mb-8 italic flex-1 leading-snug">
                                    {item.desc}
                                  </p>

                                  {item.prices && (
                                    <div className="space-y-2 mb-10 pt-6 border-t border-white/10">
                                      {Object.entries(item.prices).map(([size, price]) => (
                                        <div key={size} className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                          <span className="opacity-40">{size}</span>
                                          <span className={item.bestValue === size ? "text-hot-orange" : "text-warm-cream"}>
                                            ${(price as number).toFixed(2)} {item.bestValue === size && "(Best Value)"}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  <button onClick={(e) => { e.stopPropagation(); if (item.type) { setSelectedProduct({ ...item, price: item.basePrice || Object.values(item.prices || {})[0] }); setView('product'); } else { addToCart({ ...item, price: item.basePrice, quantity: 1 }); setView('upsell'); } }} className={`w-full py-5 font-display text-xl uppercase tracking-widest transition-all ${isPop || isCombo || item.bestValue ? 'bg-hot-orange text-charcoal' : 'bg-warm-cream/10 border-2 border-warm-cream/20 hover:bg-warm-cream hover:text-charcoal'}`}>
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
                  <div className="bg-burnt-red text-charcoal py-32 px-6 mt-40 overflow-hidden text-center relative">
                    <div className="max-w-4xl mx-auto relative z-10">
                      <h2 className="font-display text-6xl md:text-[8rem] lg:text-[10rem] uppercase leading-[0.8] mb-6">Ready to Order?</h2>
                      <p className="text-xl md:text-2xl font-black uppercase tracking-widest mb-16 opacity-80 text-black">
                        Skip the chains. Get pizza that actually delivers.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button onClick={startOrder} className="bg-black text-white px-16 py-6 text-2xl font-display uppercase tracking-widest hover:scale-105 transition-all">
                          Order Now
                        </button>
                        <a href="tel:8062747200" className="bg-transparent border-4 border-black text-black px-16 py-6 text-2xl font-display uppercase tracking-widest hover:bg-black/10 transition-all text-center">
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
              <div className="min-h-screen bg-charcoal">
                <FunnelHeader title={selectedProduct.name} onBack={goToMenu} />
                <div className="max-w-4xl mx-auto p-6 pt-12">
                  <ProgressSteps current={2} />
                  
                  <div className="flex flex-col lg:flex-row gap-12 mb-20 text-left">
                    <div className="lg:w-1/2">
                      <div className="aspect-square bg-white/5 rounded-xl border border-white/10 flex items-center justify-center p-8 overflow-hidden relative">
                        <Pizza size={120} className="text-white/5 absolute -bottom-10 -right-10 rotate-12" />
                        <img 
                          src={selectedProduct.image || 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=600'} 
                          className="relative z-10 w-full h-full object-contain drop-shadow-2xl" 
                        />
                      </div>
                      <div className="mt-8 p-6 bg-white/5 border-l-4 border-hot-orange">
                        <p className="text-xl text-warm-cream font-medium italic">"{selectedProduct.desc}"</p>
                      </div>
                    </div>
                    
                    <div className="lg:w-1/2 space-y-10">
                      {/* SIZE SELECTION */}
                      {(['pizza', 'byo-pizza', 'side-sized'].includes(selectedProduct.type)) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2">Select Size</h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(selectedProduct.type === 'side-sized' ? ['Medium', 'Large'] : ['8"', '12"', '14"', '18"']).map(size => (
                              <button 
                                key={size}
                                onClick={() => setSelectedProduct({ ...selectedProduct, size })}
                                className={`py-4 border font-display text-lg ${selectedProduct.size === size ? 'bg-hot-orange text-charcoal border-hot-orange shadow-lg shadow-hot-orange/20' : 'border-white/10 hover:border-white/40'}`}
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
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2">Wing Count</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {['8 Count', '12 Count', '18 Count'].map(count => (
                              <button 
                                key={count}
                                onClick={() => setSelectedProduct({ ...selectedProduct, count })}
                                className={`py-4 border font-display text-lg ${selectedProduct.count === count ? 'bg-hot-orange text-charcoal border-hot-orange' : 'border-white/10 hover:border-white/40'}`}
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
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2">Crust Type</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {['Original', 'Cauliflower'].map(crust => (
                              <button 
                                key={crust}
                                onClick={() => setSelectedProduct({ ...selectedProduct, crust })}
                                className={`py-4 border font-display text-lg ${selectedProduct.crust === crust ? 'bg-hot-orange text-charcoal border-hot-orange' : 'border-white/10 hover:border-white/40'}`}
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
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2">
                            Toppings <span className="text-[10px] opacity-40 ml-2">(Max 5 recommended)</span>
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
                                  className={`py-3 px-4 border text-left flex justify-between items-center transition-all ${selected ? 'bg-burnt-red border-burnt-red' : 'border-white/10 hover:bg-white/5'}`}
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
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Item Total</p>
                              <span className="font-display text-5xl text-hot-orange">${selectedProduct.basePrice.toFixed(2)}</span>
                           </div>
                           <p className="text-[10px] font-black uppercase text-gray-500 mb-2 italic">Ready for heat? 🔥</p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            if (['pizza', 'byo-pizza'].includes(selectedProduct.type) && !selectedProduct.size) return alert('Choose a size!');
                            if (['pizza', 'byo-pizza'].includes(selectedProduct.type) && !selectedProduct.crust) return alert('Choose a crust!');
                            if (selectedProduct.type === 'wings' && !selectedProduct.count) return alert('Select wing count!');
                            
                            addToCart({ 
                              ...selectedProduct, 
                              id: `${selectedProduct.id}-${selectedProduct.size || ''}-${selectedProduct.crust || ''}-${selectedProduct.count || ''}-${(selectedProduct.toppings || []).join('-')}`, 
                              quantity: 1,
                              price: selectedProduct.basePrice 
                            });
                            setView('upsell');
                          }}
                          className="w-full bg-hot-orange text-charcoal py-6 text-2xl font-display uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-hot-orange/10 flex items-center justify-center gap-4"
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
              <div className="min-h-screen bg-charcoal flex items-center">
                <div className="max-w-4xl mx-auto p-6 w-full py-20 text-center">
                  <ProgressSteps current={3} />
                  <h1 className="font-display text-6xl md:text-8xl mb-4 leading-none uppercase italic text-hot-orange">Wait!</h1>
                  <h2 className="font-display text-4xl mb-12 uppercase">Add Something to Your Order?</h2>
                  
                  <div className="grid sm:grid-cols-3 gap-6 mb-16">
                    {[
                      { name: 'Breadsticks', desc: 'Crispy, warm, and perfect on the side.', price: 6.99, image: 'https://picsum.photos/seed/b1/300/300' },
                      { name: 'Wings', desc: 'Hot, crispy, and packed with flavor.', price: 12.99, image: 'https://picsum.photos/seed/w1/300/300' },
                      { name: 'Cold Drink', desc: '2L Bottle, ready and cold.', price: 3.50, image: 'https://picsum.photos/seed/d1/300/300' }
                    ].map(item => (
                      <div key={item.name} className="bg-white/5 border border-white/10 p-8 flex flex-col items-center group">
                        <img src={item.image} className="w-32 h-32 object-cover rounded-full mb-6 border-4 border-white/5 group-hover:border-hot-orange transition-all" />
                        <h3 className="font-display text-2xl uppercase mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-6 font-medium">{item.desc}</p>
                        <button 
                          onClick={() => {
                            addToCart({ ...item, id: item.name, quantity: 1 });
                            setView('cart');
                          }}
                          className="w-full bg-white text-charcoal py-3 font-display uppercase tracking-widest hover:bg-hot-orange hover:text-white transition-colors"
                        >
                          Add Product
                        </button>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setView('cart')} className="text-gray-500 font-display text-xl uppercase tracking-widest hover:text-warm-cream transition-colors underline underline-offset-8">
                    Nah, Just My Pizza Please
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CART */}
            {view === 'cart' && (
              <div className="min-h-screen bg-charcoal">
                <FunnelHeader title="Your Order" onBack={() => setView('menu')} />
                <div className="max-w-4xl mx-auto p-6 pt-12">
                  <ProgressSteps current={4} />
                  
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3 space-y-6">
                      {cart.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-white/10">
                          <ShoppingBag size={64} className="mx-auto mb-6 text-gray-600" />
                          <h2 className="font-display text-3xl uppercase mb-8">Your cart is empty.</h2>
                          <button onClick={goToMenu} className="btn-orange px-10 py-4">Go To Menu</button>
                        </div>
                      ) : (
                        cart.map((item, i) => (
                          <div key={i} className="flex gap-6 p-6 bg-white/5 border border-white/10 group relative">
                            <div className="w-24 h-24 bg-gray-800 shrink-0 overflow-hidden">
                              <img src={item.image || 'https://picsum.photos/seed/pizza-cart/200/200'} className="w-full h-full object-cover opacity-60" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-display text-2xl uppercase leading-none">{item.name}</h3>
                                <div className="flex items-center gap-4 bg-white/5 px-3 py-1 rounded-sm">
                                  <button onClick={() => updateQuantity(i, -1)} className="hover:text-hot-orange"><Minus size={16} /></button>
                                  <span className="font-display text-xl w-4 text-center">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(i, 1)} className="hover:text-hot-orange"><Plus size={16} /></button>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                {item.size} • {item.crust} {item.toppings && item.toppings.length > 0 && `• ${item.toppings.join(', ')}`}
                              </p>
                              <div className="mt-4 flex justify-between items-end">
                                <span className="font-black text-warm-cream opacity-50">${(item.price * item.quantity).toFixed(2)}</span>
                                <button onClick={() => updateQuantity(i, -item.quantity)} className="text-[10px] font-black uppercase text-burnt-red hover:underline tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Remove Item</button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {/* QUICK ADDS */}
                      {cart.length > 0 && (
                        <div className="bg-hot-orange/10 p-8 border border-hot-orange/20">
                          <h3 className="font-display text-xl uppercase mb-6 tracking-widest">Customers Also Add:</h3>
                          <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                            {[
                              { name: 'Extra Ranch', price: 0.99 },
                              { name: 'Cheese Bread', price: 7.99 },
                              { name: '2L Pepsi', price: 3.50 }
                            ].map(side => (
                              <button 
                                key={side.name}
                                onClick={() => addToCart({ ...side, id: side.name, quantity: 1, price: side.price })} 
                                className="shrink-0 bg-charcoal border border-white/10 px-6 py-4 flex flex-col items-center hover:border-hot-orange transition-all"
                              >
                                <span className="font-display uppercase text-sm mb-1">{side.name}</span>
                                <span className="font-black text-hot-orange text-xs">${side.price}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-1/3">
                      <div className="bg-warm-cream text-charcoal p-8 sticky top-32">
                        <h3 className="font-display text-3xl uppercase mb-8 border-b-2 border-black/10 pb-4">Summary</h3>
                        <div className="space-y-4 font-bold text-sm uppercase">
                          <div className="flex justify-between">
                            <span className="opacity-50">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-50">Tax (8.25%)</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          {orderType === 'delivery' && (
                             <div className="flex justify-between text-burnt-red">
                               <span>Delivery Fee</span>
                               <span>$4.99</span>
                             </div>
                          )}
                          <div className="flex justify-between items-center text-4xl pt-6 border-t-2 border-black/10 mt-6">
                            <span className="font-display tracking-widest">Total</span>
                            <span className="font-display">${total.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-4 opacity-50 italic">
                            <Clock size={16} />
                            <span>Estimated {orderType === 'pickup' ? '20-25' : '45-55'} Mins</span>
                          </div>
                        </div>
                        <button 
                          disabled={cart.length === 0}
                          onClick={() => setView('checkout')}
                          className="w-full btn-orange py-6 mt-12 text-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-2xl"
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
              <div className="min-h-screen bg-charcoal">
                <FunnelHeader title="Complete Your Order" onBack={() => setView('cart')} />
                <div className="max-w-4xl mx-auto p-6 pt-12">
                  <ProgressSteps current={5} />
                  
                  <div className="grid lg:grid-cols-2 gap-12">
                    <div className="space-y-12">
                      <section className="bg-white/5 p-8 border border-white/10">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3">
                          <User className="text-hot-orange" /> Personal Info
                        </h3>
                        <div className="space-y-4">
                          {[
                            { label: 'Full Name', placeholder: 'Enter your name' },
                            { label: 'Phone Number', placeholder: '(806) 000-0000' }
                          ].map(f => (
                            <div key={f.label}>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">{f.label}</label>
                              <input type="text" placeholder={f.placeholder} className="w-full bg-charcoal border border-white/10 px-4 py-3 focus:border-hot-orange outline-none transition-all font-bold placeholder:opacity-20" />
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="bg-white/5 p-8 border border-white/10">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3">
                          <CreditCard className="text-hot-orange" /> Payment Method
                        </h3>
                        <div className="space-y-2">
                           {['Credit Card', 'Apple Pay', 'Cash at Pickup'].map(p => (
                             <button key={p} className="w-full py-4 px-6 border border-white/10 text-left font-bold hover:bg-white/5 flex justify-between items-center group">
                               {p}
                               <div className="w-4 h-4 rounded-full border-2 border-white/20 group-hover:border-hot-orange" />
                             </button>
                           ))}
                        </div>
                      </section>
                    </div>

                    <div className="space-y-12">
                      <section className="bg-white/5 p-8 border border-white/10">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3">
                          <MapPin className="text-hot-orange" /> {orderType === 'pickup' ? 'Store Location' : 'Delivery Details'}
                        </h3>
                        {orderType === 'pickup' ? (
                          <div className="font-bold border-l-4 border-burnt-red pl-6">
                            <p className="text-2xl uppercase font-display leading-tight">{location} Store</p>
                            <p className="text-gray-500">Fast ready in ~20 mins.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                               <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Street Address</label>
                               <input type="text" className="w-full bg-charcoal border border-white/10 px-4 py-3 outline-none focus:border-hot-orange" />
                            </div>
                          </div>
                        )}
                      </section>

                      <div className="bg-hot-orange text-charcoal p-10 text-center relative overflow-hidden group">
                        <div className="relative z-10">
                          <h2 className="font-display text-5xl lg:text-7xl mb-2 leading-none">ORDER TOTAL</h2>
                          <div className="font-display text-6xl mb-10 tracking-widest">${total.toFixed(2)}</div>
                          <button 
                             onClick={() => setView('success')}
                             className="w-full bg-charcoal text-white py-6 text-3xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4"
                          >
                            Place Order <Flame fill="currentColor" />
                          </button>
                          <p className="mt-6 text-[10px] font-black uppercase tracking-widest opacity-60">Fast, easy, and ready when you are.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 translate-x-16 -translate-y-16 rotate-45" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 -translate-x-16 translate-y-16 rotate-45" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: SUCCESS PAGE (BONUS) */}
            {view === 'success' && (
              <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,rgba(198,40,40,0.1),transparent)]">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-2xl w-full bg-white/5 border border-white/10 p-12 text-center relative"
                >
                  <div className="w-32 h-32 bg-hot-orange mx-auto rounded-full flex items-center justify-center text-charcoal mb-10 shadow-2xl shadow-hot-orange/20">
                    <Check size={80} strokeWidth={4} />
                  </div>
                  <h1 className="font-display text-6xl md:text-8xl mb-4 leading-none uppercase italic">ORDER FIRE!</h1>
                  <h2 className="font-display text-3xl mb-8 uppercase text-hot-orange">We're on it.</h2>
                  <div className="bg-charcoal p-8 border border-white/10 mb-12 text-left">
                    <div className="flex justify-between mb-4 border-b border-white/5 pb-4">
                      <span className="opacity-50 uppercase font-black text-xs">Estimated Time</span>
                      <span className="font-display text-2xl">{orderType === 'pickup' ? '20' : '45'} MINS</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-50 uppercase font-black text-xs">Pickup Code</span>
                      <span className="font-display text-4xl text-burnt-red">JP-1998</span>
                    </div>
                  </div>
                  <button onClick={backToHome} className="btn-orange px-16 py-5 text-2xl w-full shadow-2xl">Return To Home</button>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-hot-orange via-burnt-red to-hot-orange" />
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STICKY MOBILE CTA (Only on home) */}
      {view === 'home' && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
          <button onClick={startOrder} className="w-full bg-hot-orange py-5 rounded-full font-display text-2xl uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 text-charcoal">
            Order Online Now <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
