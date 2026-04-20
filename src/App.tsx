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
    title: 'START HERE',
    subtext: 'These are the ones people order on repeat.',
    items: [
      { 
        id: 'pop-jal', 
        name: 'Jalapeño Popper Pizza', 
        desc: 'Creamy heat. Serious kick. Loaded every time.', 
        prices: { '12"': 18.29, '14"': 23.29 },
        displayPrice: '$18.29+',
        image: 'https://picsum.photos/seed/poppizza/600/600', 
        label: 'Most Popular',
        type: 'pizza' 
      },
      { 
        id: 'pop-cbr', 
        name: 'Chicken Bacon Ranch', 
        desc: 'Savory, rich, and never disappoints.', 
        prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 },
        displayPrice: '$18.29+',
        label: 'Most Popular',
        bestValue: '18"',
        image: 'https://picsum.photos/seed/ranchpizza/600/600', 
        type: 'pizza' 
      },
      { 
        id: 'pop-jumbo', 
        name: '18" Jumbo Pizza', 
        desc: 'Feeds everyone. Best value on the menu.', 
        prices: { 'Starts at': 21.50 },
        displayPrice: 'From $21.50',
        label: 'Best Value',
        bestValue: true,
        image: 'https://picsum.photos/seed/jumbo18/600/600', 
        type: 'pizza' 
      }
    ]
  },
  {
    id: 'combos',
    title: 'MORE FOOD. BETTER VALUE.',
    subtext: 'Built to make the decision easy.',
    items: [
      { 
        id: 'combo-family', 
        name: 'Family Deal', 
        desc: '18" Jumbo + Cheezy Bread + 2 Liter Drink', 
        subDesc: 'Nobody goes home hungry.',
        basePrice: 34.99,
        image: 'https://picsum.photos/seed/famdeal/600/600',
        cta: 'Order This',
        type: 'combo'
      },
      { 
        id: 'combo-game', 
        name: 'Game Night Pack', 
        desc: '2 Large Pizzas + Wings (12 ct)', 
        subDesc: 'Built for a crowd. Gone fast.',
        basePrice: 45.99,
        image: 'https://picsum.photos/seed/gamenightp/600/600',
        cta: 'Order This',
        type: 'combo'
      },
      { 
        id: 'combo-quick', 
        name: 'Quick Meal', 
        desc: 'Medium Pizza + Drink', 
        subDesc: 'Fast, simple, hits the spot.',
        basePrice: 19.99,
        image: 'https://picsum.photos/seed/quickmealp/600/600',
        cta: 'Order This',
        type: 'combo'
      }
    ]
  },
  {
    id: 'specialty',
    title: 'SPECIALTY PIZZAS',
    subtext: 'Made to order. Built to impress.',
    items: [
      { id: 'sp1', name: 'Jalapeño Popper', desc: 'Creamy heat with a serious kick.', prices: { '8"': 10.29, '12"': 18.29, '14"': 23.29 }, displayPrice: '$10.29+', type: 'pizza' },
      { id: 'sp2', name: 'Chicken Bacon Ranch', desc: 'Loaded with bacon and creamy ranch flavor.', prices: { '8"': 10.29, '12"': 18.29, '14"': 23.29, '18"': 26.99 }, displayPrice: '$10.29+', type: 'pizza' },
      { id: 'sp3', name: 'Closed on Sunday', desc: 'Bold, hearty, and packed with toppings.', prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 }, displayPrice: '$18.29+', type: 'pizza' },
      { id: 'sp4', name: 'Meat Eater', desc: 'All the meat. No holding back.', prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 }, displayPrice: '$18.29+', type: 'pizza' },
      { id: 'sp5', name: 'Pepperoni', desc: 'Classic. Loaded. Always hits.', prices: { '12"': 16.50, '14"': 18.50, '18"': 21.50 }, displayPrice: '$16.50+', type: 'pizza' }
    ]
  },
  {
    id: 'byo',
    title: 'BUILD YOUR OWN',
    subtext: 'Pick your size. Pick your toppings. Make it yours.',
    items: [
      { 
        id: 'byo1', 
        name: 'Pick Your Size', 
        desc: 'Exactly how you want it. Every time.', 
        prices: { '8"': 7.25, '12"': 16.50, '14"': 18.50, '18"': 21.50 },
        bestValue: '18"',
        displayPrice: 'From $7.25',
        type: 'byo-pizza' 
      }
    ]
  },
  {
    id: 'sides-wings',
    title: 'SIDES AND WINGS',
    subtext: 'Hot, fresh, and ready to go.',
    items: [
      { id: 'side-cb', name: 'Cheezy Bread', desc: 'Hot, cheesy, and made to share.', prices: { '10"': 9.00, '12"': 14.00, '14"': 16.00 }, type: 'side' },
      { id: 'side-wn', name: 'Wings', desc: 'Crispy, hot, and full of flavor.', prices: { '8 ct': 11.99, '12 ct': 16.99, '18 ct': 23.99 }, type: 'side' },
      { id: 'side-cz', name: 'Calzones', desc: 'Packed, baked, and loaded inside.', prices: { '2-Topping Med': 12.00, '2-Topping Lrg': 15.00, 'Specialty Med': 14.00, 'Specialty Lrg': 18.00 }, type: 'side' }
    ]
  },
  {
    id: 'salads',
    title: 'SALADS',
    subtext: 'Fresh and built to fill you up.',
    items: [
      { id: 'sal-garden', name: 'Garden Salad', desc: 'Fresh and simple.', basePrice: 7.75, type: 'salad' },
      { id: 'sal-chicken', name: 'Chicken Salad', desc: 'Fresh greens with hearty chicken.', basePrice: 9.00, type: 'salad' },
      { id: 'sal-chef', name: 'Chef Salad', desc: 'Loaded and built to fill you up.', basePrice: 8.25, type: 'salad' },
      { id: 'sal-byo', name: 'Build Your Own Salad', desc: 'Make it exactly how you want it.', basePrice: 0.00, type: 'salad' }
    ]
  },
  {
    id: 'dessert',
    title: 'DESSERT',
    subtext: 'Warm, sweet, and finished just right.',
    items: [
      { id: 'des-cb', name: 'Cinna Bread', desc: 'Warm, sweet, and finished just right.', prices: { '10"': 9.00, '12"': 14.00, '14"': 16.00 }, type: 'dessert' }
    ]
  },
  {
    id: 'drinks',
    title: 'DRINKS AND EXTRAS',
    subtext: 'Ice cold and extras.',
    items: [
      { id: 'drk-2l', name: '2 Liter Drinks', desc: 'Pepsi products.', basePrice: 3.25, type: 'drink' },
      { id: 'ext-sauce', name: 'Dipping Sauces', desc: 'Ranch, Garlic Butter, Marinara, Jalapeño Ranch, Italian, BBQ.', basePrice: 0.75, type: 'extra' },
      { id: 'ext-jal', name: 'Side of Jalapeños', desc: 'Fresh slices.', basePrice: 1.99, type: 'extra' },
      { id: 'ext-pkg', name: 'Plates (2 Pack) | Cups (2 Pack)', desc: 'Everything you need.', basePrice: 0.50, type: 'extra' }
    ]
  }
];

const MobileMenu = ({ isOpen, onClose, setView, currentView }: { isOpen: boolean, onClose: () => void, setView: (v: FunnelStep) => void, currentView: FunnelStep }) => {
  const menuItems = [
    { label: 'HOME', id: 'home' as FunnelStep },
    { label: 'MENU', id: 'menu-browse' as FunnelStep },
    { label: 'ABOUT', id: 'about' as FunnelStep },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-brand-black z-[300] flex flex-col overflow-hidden"
        >
          <div className="flex-1 flex flex-col p-8 sm:p-12 relative z-10">
            <div className="flex justify-between items-center mb-16">
              <div className="font-display text-xl tracking-tight text-brand-neon">JP CO.</div>
              <button 
                onClick={onClose}
                className="group flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors border border-white/5"
              >
                <span className="font-black text-[10px] uppercase tracking-widest group-hover:text-brand-neon transition-colors">Close</span>
                <X size={18} className="text-brand-neon" />
              </button>
            </div>

            <nav className="flex flex-col gap-6">
              {menuItems.map((item, i) => (
                <motion.button
                  key={item.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => {
                    onClose();
                    setView(item.id);
                    window.scrollTo(0, 0);
                  }}
                  className="flex items-baseline gap-4 text-left group"
                >
                  <span className="font-mono text-[10px] text-brand-neon opacity-40 font-bold">0{i + 1}</span>
                  <span className={`font-display text-3xl sm:text-5xl uppercase leading-none transition-all ${currentView === item.id ? 'text-brand-neon' : 'text-brand-white group-hover:text-brand-neon'}`}>
                    {item.label}
                  </span>
                </motion.button>
              ))}
              <motion.a
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: menuItems.length * 0.1 }}
                href="#locations"
                onClick={onClose}
                className="flex items-baseline gap-4 text-left group"
              >
                <span className="font-mono text-[10px] text-brand-neon opacity-40 font-bold">0{menuItems.length + 1}</span>
                <span className="font-display text-3xl sm:text-5xl uppercase leading-none text-brand-white group-hover:text-brand-neon transition-all">
                  LOCATIONS
                </span>
              </motion.a>
            </nav>

            <div className="mt-auto pt-10 grid grid-cols-2 gap-8 border-t border-white/10">
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-brand-red mb-3">Socials</span>
                <div className="flex flex-col gap-1.5 font-bold text-xs">
                  <a href="#" className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100">Instagram</a>
                  <a href="#" className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100">Facebook</a>
                </div>
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-brand-neon mb-3">The Spot</span>
                <div className="font-bold text-xs leading-tight text-white/40">
                  Borger & Fritch, TX
                </div>
              </div>
            </div>
          </div>
          <div className="h-1 bg-brand-neon w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

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
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl uppercase leading-none text-brand-neon">{title}</h1>
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
    <div className="min-h-screen bg-brand-black text-brand-white selection:bg-brand-neon selection:text-brand-black font-sans overflow-x-hidden">
      
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
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0" onClick={() => setView('home')}>
                <Pizza className="text-brand-neon w-6 h-6 md:w-8 md:h-8 shrink-0" />
                <span className="font-display text-base sm:text-2xl md:text-3xl uppercase truncate text-brand-neon">
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

              <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                setView={setView}
                currentView={view}
              />
            </nav>

            <main>
              {/* SECTION 1: HERO */}
              <section className="bg-brand-black px-6 py-20 md:py-40 border-b border-white/5 overflow-hidden noise-overlay">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                  <p className="text-brand-neon font-black uppercase tracking-[0.4em] mb-6 text-xs md:text-sm">Borger & Fritch, TX</p>
                  <h1 className="font-display text-4xl md:text-7xl lg:text-8xl mb-8 leading-[0.85] uppercase text-brand-neon break-words">
                    TIRED OF PIZZA THAT DISAPPOINTS?
                  </h1>
                  <p className="text-xl md:text-3xl max-w-2xl mx-auto opacity-90 font-bold text-brand-white mb-16 leading-tight uppercase tracking-tight">
                    Jesse's doesn't do light toppings, frozen shortcuts, or food that makes you regret ordering. This is the real thing.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button onClick={startOrder} className="btn-primary px-20 py-8 text-3xl font-display uppercase tracking-widest shadow-[0_20px_50px_rgba(214,40,40,0.3)] hover:scale-105 active:scale-95 transition-all">
                      Order Now
                    </button>
                    <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="btn-secondary px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-white/10 transition-all">
                      See the Menu
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: TRUST STRIP */}
              <div className="bg-brand-neon py-8 px-6 relative z-20 shadow-2xl skew-y-[-1deg] -mt-8 mb-32 origin-left border-y-4 border-brand-black">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-around items-center gap-12 md:gap-4 skew-y-[1deg]">
                  {[
                    "Loaded Every Time",
                    "No Chain. No Shortcuts.",
                    "Borger's Go-To Since Day One",
                    "Fast Pickup. Real Flavor."
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-brand-black font-black uppercase tracking-[0.3em] text-xs md:text-sm lg:text-base italic">
                      <Pizza size={20} className="hidden sm:block" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 3: MOST POPULAR */}
              <section className="bg-brand-black px-6 py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                  <h2 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase mb-6 text-brand-neon">START HERE</h2>
                  <p className="text-xl md:text-2xl text-brand-white/60 font-black uppercase tracking-widest mb-24 italic">
                    These three keep people coming back. Order one and you'll know why.
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {[
                      { 
                        name: 'Jalapeño Popper Pizza', 
                        desc: 'Creamy heat. Real kick. Nobody leaves disappointed.', 
                        img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800' 
                      },
                      { 
                        name: 'Chicken Bacon Ranch', 
                        desc: 'Heavy. Savory. Loaded the way it should be.', 
                        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' 
                      },
                      { 
                        name: '18" Jumbo Pizza', 
                        desc: 'Feeds everyone. Best value on the menu.', 
                        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
                        label: 'Best Value'
                      }
                    ].map((item, i) => (
                      <div key={i} className="card-concrete group flex flex-col noise-overlay p-4">
                        <div className="relative aspect-square overflow-hidden mb-8 border-2 border-brand-black">
                          <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" referrerPolicy="no-referrer" />
                          {item.label && (
                             <div className="absolute top-6 left-6 bg-brand-neon text-brand-black font-black text-xs uppercase px-6 py-2 shadow-2xl skew-x-[-15deg] active:scale-110 transition-transform">
                                {item.label}
                             </div>
                          )}
                        </div>
                        <div className="text-left px-4 pb-4 flex-1 flex flex-col">
                          <h3 className="font-display text-3xl md:text-4xl uppercase mb-4 leading-none text-brand-white">{item.name}</h3>
                          <p className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-10 flex-1 italic">{item.desc}</p>
                          <button onClick={startOrder} className="btn-primary w-full py-5 text-xl font-display">Order This</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 4: COMBOS */}
              <section className="bg-brand-concrete px-6 py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                  <h2 className="font-display text-5xl md:text-8xl lg:text-9xl uppercase mb-6 text-brand-neon">MAKE IT EASY ON YOURSELF</h2>
                  <p className="text-xl md:text-2xl text-brand-white/40 font-black uppercase tracking-widest mb-24 italic">
                    More food. Better value. No overthinking it.
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {[
                      { name: 'Family Deal', desc: '18" Jumbo + Cheezy Bread + 2 Liter', sub: 'Nobody goes home hungry.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Game Night Pack', desc: '2 Large Pizzas + Wings (12 ct)', sub: 'Built for a crowd. Gone in minutes.', img: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=800' },
                      { name: 'Quick Meal', desc: 'Medium Pizza + Drink', sub: 'In and out. No hassle.', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800' }
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col text-left group">
                         <div className="relative aspect-[16/9] overflow-hidden mb-8 border border-white/5 bg-brand-black">
                            <img src={item.img} alt={item.name} className="w-full h-full object-cover grayscale opacity-30 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                         </div>
                         <h3 className="font-display text-3xl uppercase mb-2 text-brand-white">{item.name}</h3>
                         <p className="text-brand-neon font-black text-sm uppercase tracking-widest mb-2">{item.desc}</p>
                         <p className="text-gray-500 text-sm font-bold uppercase italic mb-8">{item.sub}</p>
                         <button onClick={startOrder} className="btn-primary w-full py-4 text-xs font-display">Order This</button>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 5: WHY JESSE'S */}
              <section className="bg-brand-black px-6 py-40 md:py-60 border-b border-white/5 noise-overlay overflow-hidden relative">
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 font-display text-[20rem] opacity-[0.02] pointer-events-none select-none text-brand-neon">JESSE'S</div>
                <div className="max-w-4xl mx-auto relative z-10">
                  <h2 className="font-display text-6xl md:text-8xl lg:text-9xl mb-16 leading-[0.8] uppercase text-brand-neon">WE DON'T DO MEDIOCRE</h2>
                  <div className="space-y-12 text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tight text-brand-white leading-tight">
                    <p>Chains cut corners because nobody's watching.</p>
                    <p className="text-brand-neon border-l-8 border-brand-neon pl-8 py-4 bg-brand-neon/5 italic">We cut corners because we don't cut corners.</p>
                    <p>Every pizza that leaves this kitchen is loaded, fresh, and built to actually satisfy.</p>
                    <p className="opacity-60">If that's what you want, you're in the right place.</p>
                    <p className="text-brand-red decoration-brand-red underline decoration-4 underline-offset-8">If not, the chains are down the street.</p>
                  </div>
                </div>
              </section>

              {/* SECTION 6: MENU PREVIEW */}
              <section className="bg-brand-black px-6 py-32 border-b border-white/10 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase mb-6 text-brand-neon">WHAT WE'RE SERVING</h2>
                    <p className="text-xl md:text-2xl text-brand-white/40 font-black uppercase tracking-widest italic">
                      Built from scratch. Made to order. Worth every bite.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-20">
                    {[
                      { name: 'Jalapeño Popper', desc: 'Creamy, spicy, loaded.' },
                      { name: 'Chicken Bacon Ranch', desc: 'Rich, savory, no regrets.' },
                      { name: 'Pepperoni', desc: 'Classic. Never light. Always hits.' },
                      { name: 'Build Your Own', desc: 'Exactly how you want it.' },
                      { name: 'Cheezy Bread', desc: 'Hot, cheesy, made to share.' },
                      { name: 'Wings', desc: 'Crispy. Hot. Full of flavor.' },
                      { name: 'Cinna Bread', desc: 'Warm, sweet, finished right.' }
                    ].map((item, i) => (
                      <div key={i} className="border-b-2 border-white/5 pb-8 hover:bg-white/5 px-4 transition-colors group">
                        <h3 className="font-display text-3xl md:text-4xl text-brand-white uppercase mb-2 group-hover:text-brand-neon transition-colors">{item.name}</h3>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-500 italic">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-24 flex justify-center">
                    <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="btn-secondary px-20 py-6 text-2xl font-display uppercase tracking-widest">
                      View Full Menu
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 7: LOCATIONS */}
              <section id="locations" className="bg-brand-black px-6 py-40 border-b border-white/10 relative noise-overlay">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                  <h2 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase mb-8 leading-none text-brand-neon">FIND YOUR LOCATION</h2>
                  <p className="text-xl md:text-3xl text-brand-white/40 font-black uppercase tracking-[0.2em] mb-32 italic">
                    Two spots. Same standard. Always worth the drive.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-24 text-left">
                    {/* Borger */}
                    <div className="card-concrete noise-overlay p-10 border-l-8 border-brand-neon">
                       <h3 className="font-display text-5xl uppercase mb-6 text-brand-white">Borger</h3>
                       <div className="text-lg font-black uppercase tracking-widest space-y-2 mb-12 text-gray-400">
                          <p>Jesse's Pizza Company</p>
                          <p>530 W 3rd St, Borger, TX 79007</p>
                          <a href="tel:8062747200" className="text-brand-neon block mt-8 text-3xl font-display">(806) 274-7200</a>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={startOrder} className="bg-brand-neon text-brand-black py-5 font-display text-sm uppercase tracking-widest hover:scale-105 transition-all">Order Online</button>
                          <a href="tel:8062747200" className="border-2 border-brand-neon text-brand-neon py-5 font-display text-sm uppercase tracking-widest text-center hover:bg-brand-neon/10 transition-all">Call Now</a>
                       </div>
                    </div>

                    {/* Fritch */}
                    <div className="card-concrete noise-overlay p-10 border-l-8 border-brand-red">
                       <h3 className="font-display text-5xl uppercase mb-6 text-brand-white">Fritch</h3>
                       <div className="text-lg font-black uppercase tracking-widest space-y-2 mb-12 text-gray-400">
                          <p>Jesse's Pizza Company</p>
                          <p>424 E Broadway St, Fritch, TX 79036</p>
                          <a href="tel:8068570098" className="text-brand-neon block mt-8 text-3xl font-display">(806) 857-0098</a>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={startOrder} className="bg-brand-neon text-brand-black py-5 font-display text-sm uppercase tracking-widest hover:scale-105 transition-all">Order Online</button>
                          <a href="tel:8068570098" className="border-2 border-brand-neon text-brand-neon py-5 font-display text-sm uppercase tracking-widest text-center hover:bg-brand-neon/10 transition-all">Call Now</a>
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 8: REVIEWS */}
              <section className="bg-brand-concrete px-6 py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-7xl mx-auto relative z-10 text-center">
                  <h2 className="font-display text-5xl md:text-8xl lg:text-9xl uppercase mb-6 text-brand-neon leading-none tracking-tighter">DON'T TAKE OUR WORD FOR IT</h2>
                  <p className="text-xl md:text-2xl text-brand-white/40 font-black uppercase tracking-widest mb-32 italic">
                    Borger and Fritch have been eating here long enough to know.
                  </p>
                  <div className="grid md:grid-cols-2 gap-16 text-left px-4">
                    {[
                      "Best pizza in Borger. Not even close.",
                      "Loaded every single time. Never disappointed.",
                      "Way better than any chain. Always fresh.",
                      "Once you try it the chains are done for you."
                    ].map((review, i) => (
                      <div key={i} className="flex gap-8 group">
                         <div className="w-2 bg-brand-neon shrink-0 group-hover:scale-y-110 transition-transform origin-top" />
                         <p className="font-display text-4xl md:text-6xl uppercase italic text-brand-white/80 group-hover:text-brand-neon leading-[0.9] transition-all">
                            "{review}"
                         </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 9: FINAL CTA */}
              <section className="bg-brand-black py-40 md:py-60 px-6 overflow-hidden relative border-y-4 border-brand-red noise-overlay">
                <div className="absolute inset-0 bg-brand-red/5 noise-overlay pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <h2 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.8] mb-12 text-brand-neon">YOU ALREADY KNOW WHAT YOU WANT.</h2>
                  <p className="text-xl md:text-3xl font-black uppercase tracking-[0.4em] mb-20 opacity-90 text-brand-white">
                    Stop thinking about it. Order now and have it ready when you get here.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={startOrder} className="btn-primary px-24 py-8 text-3xl font-display uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_50px_rgba(214,40,40,0.3)]">
                      Order Now
                    </button>
                    <a href="tel:8062747200" className="btn-secondary px-24 py-8 text-3xl font-display uppercase tracking-widest text-center hover:bg-white/10 transition-all">
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
            className="pb-32 bg-brand-black min-h-screen overflow-x-hidden"
          >
            {/* STICKY ORDER BUTTON FOR MOBILE */}
            <div className="fixed bottom-6 left-6 right-6 z-[100] md:hidden">
              <button 
                onClick={startOrder}
                className="w-full bg-brand-red text-brand-white py-6 font-display text-2xl uppercase tracking-widest shadow-[0_20px_50px_rgba(214,40,40,0.4)] active:scale-95 transition-all"
              >
                Order Now
              </button>
            </div>

            {/* STANDALONE MENU HEADER */}
            <nav className="flex justify-between items-center px-4 md:px-8 py-5 bg-brand-black border-b border-white/10 sticky top-0 z-50 noise-overlay">
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0" onClick={() => setView('home')}>
                <Pizza className="text-brand-neon w-6 h-6 md:w-8 md:h-8 shrink-0" />
                <span className="font-display text-base sm:text-2xl md:text-3xl uppercase truncate text-brand-neon">
                  Jesse's Pizza Co.
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">About</button>
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Back to Home</button>
                <button 
                  onClick={startOrder} 
                  className="btn-primary py-3 px-6 text-xs"
                >
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

              <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                setView={setView}
                currentView={view}
              />
            </nav>

            <div className="max-w-7xl mx-auto p-6 lg:p-12 relative z-10">
              {/* SECTION 1: HERO */}
              <div className="text-center mb-32 max-w-4xl mx-auto pt-10 px-4">
                <h1 className="font-display text-4xl md:text-8xl lg:text-9xl mb-8 leading-[0.8] uppercase text-brand-neon break-words">
                  THE MENU<br/>BUILT TO SATISFY
                </h1>
                <p className="text-xl md:text-3xl text-brand-white opacity-90 font-medium mb-16 uppercase tracking-wider leading-tight">
                  No skimpy portions. No shortcuts. Just pizza and sides<br className="hidden md:block" /> that actually deliver every time.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button onClick={startOrder} className="bg-brand-red text-brand-white px-16 py-6 text-2xl font-display uppercase tracking-widest hover:bg-red-700 transition-all">Order Now</button>
                  <a href="tel:8062747200" className="bg-transparent border-4 border-brand-neon text-brand-neon px-16 py-6 text-2xl font-display uppercase tracking-widest text-center hover:bg-brand-neon hover:text-brand-black transition-all">
                    Call Now
                  </a>
                </div>
              </div>

              <div className="space-y-48">
                {MENU_CATEGORIES.map((category) => {
                  const isPop = category.id === 'popular';
                  const isCombo = category.id === 'combos';
                  
                  return (
                    <section key={category.id} className={isPop ? "scroll-mt-32" : ""}>
                      <div className="mb-16 md:mb-24 px-4">
                        <h2 className="font-display text-4xl md:text-7xl lg:text-8xl uppercase leading-[0.8] mb-6 text-brand-neon break-words">
                          {category.title}
                        </h2>
                        {category.subtext && (
                          <p className="text-lg md:text-2xl font-black uppercase tracking-[0.2em] text-brand-white opacity-80 max-w-2xl">
                            {category.subtext}
                          </p>
                        )}
                      </div>
                      
                      <div className={`grid gap-8 lg:gap-12 ${isPop || isCombo ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                        {category.items.map(item => {
                          const isSpecialty = category.id === 'specialty';
                          const cardBg = isSpecialty ? 'bg-brand-concrete' : 'bg-brand-concrete/40';
                          
                          return (
                            <div 
                              key={item.id}
                              className={`group flex flex-col relative transition-all duration-300 hover:translate-y-[-8px] noise-overlay ${cardBg} ${isPop || item.bestValue === true ? 'ring-2 ring-brand-neon shadow-2xl' : ''}`}
                            >
                              {/* Labels */}
                              {item.label && (
                                <div className="absolute top-0 right-0 bg-brand-neon text-brand-black font-black text-xs uppercase px-6 py-3 z-20 skew-x-[-12deg] translate-x-2 translate-y-[-50%] shadow-xl">
                                  {item.label}
                                </div>
                              )}
                              
                              {item.image && (
                                <div className="relative aspect-[16/10] overflow-hidden bg-brand-black border-b border-white/5">
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 pointer-events-none" />
                                </div>
                              )}
                              
                              <div className="p-8 lg:p-12 flex flex-col flex-1 relative z-10">
                                <div className="flex justify-between items-start gap-4 mb-6">
                                  <h3 className="font-display text-3xl lg:text-4xl uppercase leading-none text-brand-white break-words">{item.name}</h3>
                                  {item.displayPrice && (
                                    <span className="text-xl lg:text-2xl font-black text-brand-neon whitespace-nowrap">
                                      {item.displayPrice}
                                    </span>
                                  )}
                                </div>
                                
                                <p className="text-lg text-brand-white opacity-80 font-medium mb-10 flex-1 leading-snug">
                                  {item.desc}
                                </p>

                                {item.subDesc && (
                                  <p className="text-sm font-black uppercase text-brand-neon mb-8 tracking-widest italic">
                                    — {item.subDesc}
                                  </p>
                                )}

                                {item.prices && (
                                  <div className="space-y-4 mb-10 pt-8 border-t-2 border-white/5">
                                    {Object.entries(item.prices).map(([size, price]) => (
                                      <div key={size} className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                        <span className="opacity-40 text-brand-white">{size}</span>
                                        <span className={item.bestValue === size ? "text-brand-neon scale-110" : "text-brand-white"}>
                                          ${typeof price === 'number' ? price.toFixed(2) : price} {item.bestValue === size && "(Best Value)"}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <button 
                                  onClick={() => { 
                                    setSelectedProduct({ ...item, price: item.basePrice || Object.values(item.prices || {})[0] }); 
                                    setView('order-start'); 
                                    window.scrollTo(0,0);
                                  }} 
                                  className="w-full bg-brand-red text-brand-white py-6 font-display text-2xl uppercase tracking-[0.2em] transition-all hover:bg-red-700 active:scale-95 shadow-xl"
                                >
                                  {item.cta || (item.type === 'byo-pizza' ? 'Start Building' : 'Order Now')}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* SECTION 10: FINAL CTA */}
              <section className="mt-60 mb-20 px-4">
                <div className="bg-brand-neon py-32 md:py-48 px-6 text-center relative overflow-hidden ring-8 ring-brand-neon ring-offset-8 ring-offset-brand-black">
                  <div className="absolute inset-0 bg-brand-black/5 opacity-10 pointer-events-none" />
                  <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className="font-display text-6xl md:text-8xl lg:text-9xl uppercase leading-[0.75] mb-8 text-brand-black">READY TO ORDER?</h2>
                    <p className="text-xl md:text-4xl font-black uppercase tracking-[0.1em] mb-16 opacity-80 text-brand-black leading-tight">
                      Skip the chains. Get pizza that<br className="hidden md:block" /> actually delivers on flavor.
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
              </section>
            </div>
            
            <footer className="bg-brand-black py-20 px-8 border-t border-white/5 flex flex-col items-center gap-12">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 text-xs font-black uppercase tracking-[0.4em]">
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Home</button>
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Browse Menu</button>
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">About Our Story</button>
                <a href="#locations" className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Locations</a>
              </div>
              <div className="text-[12px] font-black uppercase tracking-[0.3em] opacity-30 text-brand-white">
                © 2026 Jesse's Pizza Co. • Built for the Texas Panhandle
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
              <div className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0" onClick={() => setView('home')}>
                <Pizza className="text-brand-neon w-6 h-6 md:w-8 md:h-8 shrink-0" />
                <span className="font-display text-base sm:text-2xl md:text-3xl uppercase truncate text-brand-neon">
                  Jesse's Pizza Co.
                </span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Menu</button>
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="text-brand-white font-bold uppercase text-xs tracking-widest opacity-60 hover:opacity-100 transition-opacity">Back to Home</button>
                <button 
                  onClick={startOrder} 
                  className="btn-primary py-3 px-6 text-xs"
                >
                  Order Now
                </button>
              </div>

              <button 
                className="md:hidden text-brand-neon p-2 hover:bg-white/5 rounded-sm transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
              </button>

              <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                setView={setView}
                currentView={view}
              />
            </nav>

            {/* SECTION 1: HERO */}
            <section className="px-6 py-24 md:py-48 text-center bg-brand-black border-b border-white/5 noise-overlay relative">
              <div className="max-w-4xl mx-auto relative z-10">
                <h1 className="font-display text-4xl md:text-8xl lg:text-9xl mb-8 leading-[0.8] uppercase text-brand-neon break-words">
                  THIS ISN'T A CHAIN.<br/>THIS IS JESSE'S.
                </h1>
                <p className="text-xl md:text-3xl text-brand-white opacity-90 font-medium max-w-2xl mx-auto uppercase tracking-wide leading-tight">
                  Built from the ground up to do one thing better than anyone else in the area: make pizza people actually come back for.
                </p>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,240,0,0.03),transparent)] pointer-events-none" />
            </section>

            {/* SECTION 2: THE OWNER STORY */}
            <section className="px-6 py-32 md:py-48 bg-brand-black border-b border-white/5 noise-overlay">
              <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="font-display text-5xl md:text-7xl mb-16 uppercase tracking-tight text-brand-neon">HOW IT STARTED</h2>
                <div className="space-y-10 text-xl md:text-2xl text-brand-white leading-relaxed font-bold uppercase tracking-tight">
                  <p>Jesse didn't set out to build a pizza brand.</p>
                  <p className="text-brand-neon italic">He got tired of bad pizza.</p>
                  <p>Tired of paying for food that looked good in photos and let you down the moment you opened the box. Tired of places that cut corners thinking nobody noticed.</p>
                  <p className="text-brand-neon underline decoration-4 underline-offset-8">He noticed.</p>
                  <p>So he did something about it.</p>
                  <p className="opacity-40">No investors. No franchise playbook. No corporate rulebook.</p>
                  <p>Just a decision to make pizza the way it should be made: loaded toppings, fresh dough, consistent quality, every single order.</p>
                  <p className="pt-10 text-brand-neon">What happened next wasn't complicated.</p>
                  <p>People tried it. They came back. They told their friends. And Jesse's became the spot.</p>
                </div>
              </div>
            </section>

            {/* SECTION 3: THE STANDARD */}
            <section className="px-6 py-32 md:py-48 bg-brand-concrete border-b border-white/5 noise-overlay">
              <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="font-display text-5xl md:text-7xl mb-16 uppercase tracking-tight text-brand-neon">THE STANDARD HASN'T CHANGED</h2>
                <div className="grid md:grid-cols-2 gap-16 items-center">
                  <div className="space-y-8 text-xl md:text-2xl text-brand-white font-bold uppercase tracking-tight">
                    <p>Every pizza that leaves this kitchen gets the same treatment as the first one.</p>
                    <p className="text-brand-neon font-display text-4xl leading-none">If it's not something Jesse would eat himself, it doesn't go out.</p>
                    <p>That's it.</p>
                    <div className="space-y-4 opacity-60">
                      <p>No corporate checklist.</p>
                      <p>No cutting corners when it gets busy.</p>
                      <p>No skimping because nobody's watching.</p>
                    </div>
                    <p className="pt-8 border-t border-white/10">The standard is simple. And it doesn't move.</p>
                  </div>
                  <div className="aspect-[4/5] bg-brand-black overflow-hidden border border-white/5 shadow-2xl relative group">
                    <img src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" alt="Pizza quality" />
                    <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-brand-black to-transparent">
                      <span className="font-display text-2xl text-brand-neon">BUILT RIGHT</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: WHY IT MATTERS */}
            <section className="px-6 py-32 md:py-48 bg-brand-black border-b border-white/5 noise-overlay">
              <div className="max-w-3xl mx-auto text-center relative z-10">
                <h2 className="font-display text-5xl md:text-7xl mb-16 uppercase tracking-tight text-brand-neon">WHY WE'RE NOT LIKE THE REST</h2>
                <div className="space-y-10 text-xl md:text-2xl text-brand-white font-bold uppercase tracking-tight">
                  <p>Chains are built to be consistent across thousands of locations.</p>
                  <p className="text-brand-red">That means everything gets optimized for cost, not quality.</p>
                  <p className="opacity-50">Lighter toppings. Faster prep. Lower standards.</p>
                  <p className="text-brand-neon text-3xl md:text-5xl font-display leading-[0.9] mt-20">Jesse's is built for one thing: the people in Borger and Fritch who want pizza that actually delivers.</p>
                  <p className="pt-10">Not a national average. Not good enough.</p>
                  <p className="text-brand-neon text-4xl md:text-6xl font-display uppercase tracking-widest italic">Actually good.</p>
                </div>
              </div>
            </section>

            {/* SECTION 5: LOCATIONS */}
            <section className="px-6 py-32 md:py-48 bg-brand-concrete border-b border-white/5 noise-overlay">
              <div className="max-w-7xl mx-auto relative z-10">
                <h2 className="font-display text-5xl md:text-7xl mb-16 uppercase tracking-tight text-brand-neon text-center">TWO LOCATIONS. ONE STANDARD.</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Borger */}
                  <div className="bg-brand-black p-10 flex flex-col justify-between border-4 border-brand-concrete">
                    <div>
                      <h3 className="font-display text-4xl mb-6 text-brand-neon uppercase tracking-widest">Borger</h3>
                      <p className="text-2xl font-black text-brand-white uppercase mb-2">Jesse's Pizza Company</p>
                      <p className="text-brand-white/60 uppercase font-bold tracking-widest mb-6">530 W 3rd St, Borger, TX 79007</p>
                      <a href="tel:8062747200" className="text-3xl font-display text-brand-white hover:text-brand-neon transition-colors">(806) 274-7200</a>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-12">
                      <button onClick={startOrder} className="btn-primary flex-1 py-5 text-xl">Order Online</button>
                      <a href="tel:8062747200" className="bg-transparent border-4 border-white text-white px-8 py-5 text-xl font-display uppercase tracking-widest hover:bg-white/10 transition-all text-center">Call Now</a>
                    </div>
                  </div>
                  {/* Fritch */}
                  <div className="bg-brand-black p-10 flex flex-col justify-between border-4 border-brand-concrete">
                    <div>
                      <h3 className="font-display text-4xl mb-6 text-brand-neon uppercase tracking-widest">Fritch</h3>
                      <p className="text-2xl font-black text-brand-white uppercase mb-2">Jesse's Pizza Company</p>
                      <p className="text-brand-white/60 uppercase font-bold tracking-widest mb-6">424 E Broadway St, Fritch, TX 79036</p>
                      <a href="tel:8068570098" className="text-3xl font-display text-brand-white hover:text-brand-neon transition-colors">(806) 857-0098</a>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-12">
                      <button onClick={startOrder} className="btn-primary flex-1 py-5 text-xl">Order Online</button>
                      <a href="tel:8068570098" className="bg-transparent border-4 border-white text-white px-8 py-5 text-xl font-display uppercase tracking-widest hover:bg-white/10 transition-all text-center">Call Now</a>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: TEAM */}
            <section className="px-6 py-32 md:py-48 bg-brand-black border-b border-white/5 noise-overlay">
              <div className="max-w-7xl mx-auto relative z-10 text-center">
                <h2 className="font-display text-5xl md:text-7xl mb-6 uppercase tracking-tight text-brand-neon">THE PEOPLE BEHIND IT</h2>
                <p className="text-xl md:text-2xl text-brand-white/40 font-black uppercase tracking-widest mb-24 italic">Good pizza doesn't happen by accident. These are the people who make it happen every day.</p>
                <div className="grid md:grid-cols-2 gap-10 text-left">
                  {[
                    { name: "Marcus \"Marc\" Alvarez", role: "General Manager, Borger", bio: "Marc runs the Borger location from open to close. Speed, consistency, and quality all run through him. If your order is right, it's because Marc made sure of it." },
                    { name: "Tyler Jenkins", role: "General Manager, Fritch", bio: "Tyler keeps Fritch moving. From prep to pickup, nothing leaves the store unless it meets the standard." },
                    { name: "Ashley Romero", role: "Operations Manager", bio: "Ashley oversees both locations. Processes, quality control, and consistency all run through her. If both stores run tight, that's Ashley's work showing." },
                    { name: "Chris Dalton", role: "Kitchen Lead", bio: "Chris is behind the scenes on every order. He makes sure nothing leaves the kitchen unless it's built right." }
                  ].map((member, i) => (
                    <div key={i} className="bg-brand-concrete p-10 noise-overlay border border-white/5 relative group hover:border-brand-neon transition-colors">
                      <h3 className="font-display text-3xl mb-2 text-brand-neon uppercase tracking-widest">{member.name}</h3>
                      <p className="text-brand-white text-sm font-black uppercase tracking-widest mb-8 italic">{member.role}</p>
                      <p className="text-brand-white leading-relaxed text-lg opacity-80 uppercase font-medium">{member.bio}</p>
                      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Pizza size={80} className="text-brand-white rotate-12" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 7: TEAM PHOTOS */}
            <section className="bg-brand-black border-b border-white/5 noise-overlay overflow-hidden">
               <div className="relative group">
                  <div className="absolute top-12 left-12 z-20">
                     <h2 className="font-display text-4xl text-brand-neon uppercase tracking-tighter">OUR CREW</h2>
                  </div>
                  <div className="grid md:grid-cols-1 gap-0">
                    <div className="relative group overflow-hidden">
                      <div className="absolute top-8 right-8 z-20 px-6 py-3 bg-brand-neon text-brand-black font-black text-xs uppercase skew-x-[-12deg]">Borger Team</div>
                      <img src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1920" className="w-full h-[60vh] object-cover grayscale brightness-50 contrast-125 transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" alt="Borger Team" />
                      <div className="absolute inset-0 bg-brand-black/20 mix-blend-overlay" />
                    </div>
                    <div className="relative group overflow-hidden">
                      <div className="absolute top-8 right-8 z-20 px-6 py-3 bg-brand-neon text-brand-black font-black text-xs uppercase skew-x-[-12deg]">Fritch Team</div>
                      <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=1920" className="w-full h-[60vh] object-cover grayscale brightness-50 contrast-125 transition-all duration-700 group-hover:scale-105" referrerPolicy="no-referrer" alt="Fritch Team" />
                      <div className="absolute inset-0 bg-brand-black/20 mix-blend-overlay" />
                    </div>
                  </div>
               </div>
            </section>

            {/* SECTION 8: SOCIAL PROOF */}
            <section className="px-6 py-32 md:py-48 bg-brand-black border-b border-white/5 noise-overlay">
              <div className="max-w-5xl mx-auto relative z-10 text-center">
                <h2 className="font-display text-5xl md:text-7xl mb-24 uppercase tracking-tight text-brand-neon">WHAT LOCALS SAY</h2>
                <div className="space-y-20 font-display text-4xl md:text-6xl lg:text-7xl uppercase leading-none italic text-brand-white">
                  <p className="hover:text-brand-neon transition-colors cursor-default">“Best pizza in Borger. Not even close.”</p>
                  <p className="hover:text-brand-neon transition-colors cursor-default">“Loaded every single time. Never disappointed.”</p>
                  <p className="hover:text-brand-neon transition-colors cursor-default">“Once you try it the chains are done for you.”</p>
                  <p className="hover:text-brand-neon transition-colors cursor-default">“Consistently good. Every single visit.”</p>
                </div>
              </div>
            </section>

            {/* SECTION 9: FINAL CTA */}
            <section className="bg-brand-black py-40 md:py-60 px-6 overflow-hidden relative border-y-4 border-brand-red noise-overlay">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                  <h2 className="font-display text-7xl md:text-[12rem] uppercase leading-[0.8] mb-12 text-brand-neon italic">IF YOU KNOW, YOU KNOW.</h2>
                  <p className="text-xl md:text-3xl font-black uppercase tracking-[0.4em] mb-20 opacity-90 text-brand-white leading-tight">
                    If you haven't tried it yet, now's a good time to fix that.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button onClick={startOrder} className="bg-brand-red text-brand-white px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-brand-red/90 transition-all shadow-2xl">
                      Order Now
                    </button>
                    <a href="tel:8062747200" className="bg-transparent border-4 border-brand-neon text-brand-neon px-20 py-8 text-3xl font-display uppercase tracking-widest hover:bg-brand-neon hover:text-brand-black transition-all text-center">
                      Call Now
                    </a>
                  </div>
                </div>
                <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
                   <h2 className="font-display text-[30rem] leading-none uppercase">JESSE</h2>
                </div>
            </section>

            <footer className="bg-brand-black py-12 px-8 border-t border-white/5 flex flex-col items-center gap-8">
              <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.3em]">
                <button onClick={() => { setView('home'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Home</button>
                <button onClick={() => { setView('menu-browse'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white">Browse Menu</button>
                <button onClick={() => { setView('about'); window.scrollTo(0,0); }} className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white border-b border-brand-neon pb-1">About Our Story</button>
                <a href="#locations" className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100 text-brand-white" onClick={(e) => { e.preventDefault(); setView('home'); setTimeout(() => { document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }}>Locations</a>
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
                    <h1 className="font-display text-4xl md:text-7xl lg:text-8xl mb-4 leading-none uppercase text-brand-neon">Pick Your Pizza. We’ll Handle the Rest.</h1>
                    <p className="text-xl md:text-2xl text-brand-white/60 font-medium mb-12 uppercase tracking-wide">Loaded toppings. Big portions. Built to actually satisfy.</p>
                  </div>

                  <div className="space-y-40">
                    {MENU_CATEGORIES.map((category) => (
                      <section key={category.id}>
                        <div className="text-center mb-16 px-4">
                          <h2 className="font-display text-4xl md:text-8xl lg:text-9xl uppercase mb-3 text-brand-neon">{category.title}</h2>
                          <p className="text-sm font-black uppercase tracking-[0.3em] opacity-40 text-brand-white">{category.subtext}</p>
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
                      <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.8] mb-6">Ready to Order?</h2>
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
                  <h1 className="font-display text-6xl md:text-8xl mb-4 leading-none uppercase italic text-brand-neon">Wait!</h1>
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
                  <h1 className="font-display text-7xl md:text-9xl mb-6 leading-[0.8] uppercase italic text-brand-neon">ORDER FIRE!</h1>
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
      {view === 'home' && !isMenuOpen && (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
          <button onClick={startOrder} className="w-full bg-brand-red text-brand-white py-5 rounded-none font-display text-2xl uppercase tracking-widest shadow-[0_20px_50px_rgba(214,40,40,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-all">
            Order Now <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
