/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Phone,
  Star,
  Info,
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
  Truck,
  ChevronUp,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";

type FunnelStep =
  | "home"
  | "menu-browse"
  | "specials"
  | "about"
  | "contact"
  | "careers"
  | "locations"
  | "borger-location"
  | "fritch-location"
  | "privacy"
  | "terms"
  | "order-start"
  | "menu"
  | "product"
  | "upsell"
  | "cart"
  | "checkout"
  | "success";

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
    id: "popular",
    title: "START HERE",
    subtext: "These are the ones people order on repeat.",
    items: [
      {
        id: "pop-jal",
        name: "Jalapeño Popper Pizza",
        desc: "Creamy heat. Serious kick. Loaded every time.",
        prices: { '12"': 18.29, '14"': 23.29 },
        displayPrice: "$18.29+",
        image: "https://picsum.photos/seed/poppizza/600/600",
        label: "Most Popular",
        type: "pizza",
      },
      {
        id: "pop-cbr",
        name: "Chicken Bacon Ranch",
        desc: "Savory, rich, and never disappoints.",
        prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 },
        displayPrice: "$18.29+",
        label: "Most Popular",
        bestValue: '18"',
        image: "https://picsum.photos/seed/ranchpizza/600/600",
        type: "pizza",
      },
      {
        id: "pop-jumbo",
        name: '18" Jumbo Pizza',
        desc: "Feeds everyone. Best value on the menu.",
        prices: { "Starts at": 21.5 },
        displayPrice: "From $21.50",
        label: "Best Value",
        bestValue: true,
        image: "https://i.imgur.com/oz3N4dm.jpeg",
        type: "pizza",
      },
    ],
  },
  {
    id: "combos",
    title: "MORE FOOD. BETTER VALUE.",
    subtext: "Built to make the decision easy.",
    items: [
      {
        id: "combo-family",
        name: "Family Deal",
        desc: '18" Jumbo + Cheezy Bread + 2 Liter Drink',
        subDesc: "Nobody goes home hungry.",
        basePrice: 34.99,
        image: "https://picsum.photos/seed/famdeal/600/600",
        cta: "Order This",
        type: "combo",
      },
      {
        id: "combo-game",
        name: "Game Night Pack",
        desc: "2 Large Pizzas + Wings (12 ct)",
        subDesc: "Built for a crowd. Gone fast.",
        basePrice: 45.99,
        image: "https://picsum.photos/seed/gamenightp/600/600",
        cta: "Order This",
        type: "combo",
      },
      {
        id: "combo-quick",
        name: "Quick Meal",
        desc: "Medium Pizza + Drink",
        subDesc: "Fast, simple, hits the spot.",
        basePrice: 19.99,
        image: "https://picsum.photos/seed/quickmealp/600/600",
        cta: "Order This",
        type: "combo",
      },
    ],
  },
  {
    id: "specialty",
    title: "SPECIALTY PIZZAS",
    subtext: "Made to order. Built to impress.",
    items: [
      {
        id: "sp1",
        name: "Jalapeño Popper",
        desc: "Creamy heat with a serious kick.",
        prices: { '8"': 10.29, '12"': 18.29, '14"': 23.29 },
        displayPrice: "$10.29+",
        type: "pizza",
      },
      {
        id: "sp2",
        name: "Chicken Bacon Ranch",
        desc: "Loaded with bacon and creamy ranch flavor.",
        prices: { '8"': 10.29, '12"': 18.29, '14"': 23.29, '18"': 26.99 },
        displayPrice: "$10.29+",
        type: "pizza",
      },
      {
        id: "sp3",
        name: "Closed on Sunday",
        desc: "Bold, hearty, and packed with toppings.",
        prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 },
        displayPrice: "$18.29+",
        type: "pizza",
      },
      {
        id: "sp4",
        name: "Meat Eater",
        desc: "All the meat. No holding back.",
        prices: { '12"': 18.29, '14"': 23.29, '18"': 26.99 },
        displayPrice: "$18.29+",
        type: "pizza",
      },
      {
        id: "sp5",
        name: "Pepperoni",
        desc: "Classic. Loaded. Always hits.",
        prices: { '12"': 16.5, '14"': 18.5, '18"': 21.5 },
        displayPrice: "$16.50+",
        type: "pizza",
      },
    ],
  },
  {
    id: "byo",
    title: "BUILD YOUR OWN",
    subtext: "Pick your size. Pick your toppings. Make it yours.",
    items: [
      {
        id: "byo1",
        name: "Pick Your Size",
        desc: "Exactly how you want it. Every time.",
        prices: { '8"': 7.25, '12"': 16.5, '14"': 18.5, '18"': 21.5 },
        bestValue: '18"',
        displayPrice: "From $7.25",
        type: "byo-pizza",
      },
    ],
  },
  {
    id: "sides-wings",
    title: "SIDES AND WINGS",
    subtext: "Hot, fresh, and ready to go.",
    items: [
      {
        id: "side-cb",
        name: "Cheezy Bread",
        desc: "Hot, cheesy, and made to share.",
        prices: { '10"': 9.0, '12"': 14.0, '14"': 16.0 },
        type: "side",
      },
      {
        id: "side-wn",
        name: "Wings",
        desc: "Crispy, hot, and full of flavor.",
        prices: { "8 ct": 11.99, "12 ct": 16.99, "18 ct": 23.99 },
        type: "side",
      },
      {
        id: "side-cz",
        name: "Calzones",
        desc: "Packed, baked, and loaded inside.",
        prices: {
          "2-Topping Med": 12.0,
          "2-Topping Lrg": 15.0,
          "Specialty Med": 14.0,
          "Specialty Lrg": 18.0,
        },
        type: "side",
      },
    ],
  },
  {
    id: "salads",
    title: "SALADS",
    subtext: "Fresh and built to fill you up.",
    items: [
      {
        id: "sal-garden",
        name: "Garden Salad",
        desc: "Fresh and simple.",
        basePrice: 7.75,
        type: "salad",
      },
      {
        id: "sal-chicken",
        name: "Chicken Salad",
        desc: "Fresh greens with hearty chicken.",
        basePrice: 9.0,
        type: "salad",
      },
      {
        id: "sal-chef",
        name: "Chef Salad",
        desc: "Loaded and built to fill you up.",
        basePrice: 8.25,
        type: "salad",
      },
      {
        id: "sal-byo",
        name: "Build Your Own Salad",
        desc: "Make it exactly how you want it.",
        basePrice: 0.0,
        type: "salad",
      },
    ],
  },
  {
    id: "dessert",
    title: "DESSERT",
    subtext: "Warm, sweet, and finished just right.",
    items: [
      {
        id: "des-cb",
        name: "Cinna Bread",
        desc: "Warm, sweet, and finished just right.",
        prices: { '10"': 9.0, '12"': 14.0, '14"': 16.0 },
        type: "dessert",
      },
    ],
  },
  {
    id: "drinks",
    title: "DRINKS AND EXTRAS",
    subtext: "Ice cold and extras.",
    items: [
      {
        id: "drk-2l",
        name: "2 Liter Drinks",
        desc: "Pepsi products.",
        basePrice: 3.25,
        type: "drink",
      },
      {
        id: "ext-sauce",
        name: "Dipping Sauces",
        desc: "Ranch, Garlic Butter, Marinara, Jalapeño Ranch, Italian, BBQ.",
        basePrice: 0.75,
        type: "extra",
      },
      {
        id: "ext-jal",
        name: "Side of Jalapeños",
        desc: "Fresh slices.",
        basePrice: 1.99,
        type: "extra",
      },
      {
        id: "ext-pkg",
        name: "Plates (2 Pack) | Cups (2 Pack)",
        desc: "Everything you need.",
        basePrice: 0.5,
        type: "extra",
      },
    ],
  },
];

const LOCATIONS_DATA = {
  Borger: {
    name: "BORGER",
    address: "530 W 3rd St",
    city: "Borger, TX 79007",
    phone: "(806) 274-7200",
    phoneRaw: "8062747200",
    hours: "Monday through Saturday",
    time: "11:00 AM to 10:00 PM",
    sunday: "Sunday: Closed",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.062828282828!2d-101.389!3d35.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM5JzM2LjAiTiAxMDHCsDIzJzIwLjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    directionsUrl: "https://maps.google.com/?q=Jesse's+Pizza+Company+Borger"
  },
  Fritch: {
    name: "FRITCH",
    address: "424 E Broadway St",
    city: "Fritch, TX 79036",
    phone: "(806) 857-0098",
    phoneRaw: "8068570098",
    hours: "Monday through Saturday",
    time: "11:00 AM to 9:00 PM",
    sunday: "Sunday: Closed",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.062828282828!2d-101.6!3d35.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM4JzI0LjAiTiAxMDHCsDM2JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus",
    directionsUrl: "https://maps.google.com/?q=Jesse's+Pizza+Company+Fritch"
  }
};

const MobileMenu = ({
  isOpen,
  onClose,
  setView,
  currentView,
}: {
  isOpen: boolean;
  onClose: () => void;
  setView: (v: FunnelStep) => void;
  currentView: FunnelStep;
}) => {
  const menuItems = [
    { label: "MENU", id: "menu-browse" as FunnelStep },
    { label: "ABOUT", id: "about" as FunnelStep },
    { label: "LOCATIONS", id: "locations" as FunnelStep },
    { label: "CAREERS", id: "careers" as FunnelStep },
    { label: "SPECIALS", id: "specials" as FunnelStep },
    { label: "CONTACT", id: "contact" as FunnelStep },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-brand-black z-[300] flex flex-col overflow-y-auto"
        >
          <div className="flex-1 flex flex-col p-8 sm:p-12 relative z-10 pb-24">
            <div className="flex items-center mb-8">
              <div className="flex items-center gap-3 text-brand-neon">
                <Pizza size={32} />
                <span className="font-display text-3xl tracking-tight uppercase">
                  Jesse's Pizza Co.
                </span>
              </div>
              <button
                onClick={onClose}
                className="ml-auto group flex items-center gap-3 bg-white/5 px-5 py-2.5 rounded-full hover:bg-white/10 transition-colors border border-white/5"
              >
                <span className="font-black text-[10px] uppercase tracking-widest group-hover:text-brand-neon transition-colors">
                  Close
                </span>
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
                  <span className="font-mono text-[10px] text-brand-neon opacity-40 font-bold">
                    0{i + 1}
                  </span>
                  <span
                    className={`font-display text-3xl sm:text-5xl uppercase leading-none transition-all ${currentView === item.id ? "text-brand-neon" : "text-brand-white group-hover:text-brand-neon"}`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </nav>

            <div className="mt-auto pt-10 grid grid-cols-2 gap-8 border-t border-white/10">
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-brand-red mb-3">
                  Socials
                </span>
                <div className="flex flex-col gap-1.5 font-bold text-xs">
                  <a
                    href="#"
                    className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100"
                  >
                    Instagram
                  </a>
                  <a
                    href="#"
                    className="hover:text-brand-neon transition-colors opacity-60 hover:opacity-100"
                  >
                    Facebook
                  </a>
                </div>
              </div>
              <div>
                <span className="block text-[9px] font-black uppercase tracking-widest text-brand-neon mb-3">
                  The Spot
                </span>
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
  const [view, setView] = useState<FunnelStep>("home");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [location, setLocation] = useState<"Borger" | "Fritch">("Borger");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Totals calculations
  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cart],
  );
  const tax = subtotal * 0.0825;
  const deliveryFee = orderType === "delivery" ? 4.99 : 0;
  const total = subtotal + tax + deliveryFee;

  // Navigation handlers
  const startOrder = () =>
    (window.location.href = "https://jessespizzacompany.com/order");
  const goToMenu = () => setView("menu");
  const backToHome = () => setView("home");

  const marketingViews = [
    "home",
    "menu-browse",
    "specials",
    "about",
    "careers",
    "locations",
    "borger-location",
    "fritch-location",
    "contact",
    "privacy",
    "terms",
  ];
  const isMarketingView = marketingViews.includes(view);

  const LocationToggle = () => (
    <div className="flex bg-white/5 p-1 rounded-full border border-white/10">
      {["Borger", "Fritch"].map((loc) => (
        <button
          key={loc}
          onClick={() => setLocation(loc as "Borger" | "Fritch")}
          className={`px-6 py-2 rounded-full font-display text-sm tracking-widest uppercase transition-all ${location === loc ? "bg-brand-neon text-brand-black shadow-lg" : "text-brand-white/40 hover:text-brand-white"}`}
        >
          {loc}
        </button>
      ))}
    </div>
  );

  const PromoStrip = () => (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#B8F000] h-[72px] lg:h-[64px] flex items-center px-4 lg:px-10 border-t border-black/10">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-10">
        <span className="hidden lg:block font-sans text-[#0D0D0D] text-[15px] font-black uppercase tracking-[1px]">
          READY TO EAT THE BEST PIZZA IN THE TEXAS PANHANDLE?
        </span>
        <span className="lg:hidden font-sans text-[#0D0D0D] text-[13px] font-black uppercase tracking-[0.5px]">
          READY TO EAT THE BEST?
        </span>
        <button
          onClick={startOrder}
          className="bg-brand-red text-white px-8 py-3.5 lg:py-2.5 text-[15px] font-sans font-black uppercase tracking-[1px] hover:scale-105 transition-all active:scale-95 shadow-2xl border border-black/10"
        >
          ORDER NOW
        </button>
      </div>
    </div>
  );

  const MainNavigation = () => (
    <nav className="flex items-center px-4 lg:px-6 py-5 bg-brand-black border-b border-white/10 sticky top-0 z-50 overflow-hidden">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <div
        className="flex items-center gap-3 lg:gap-3 cursor-pointer min-w-0 relative z-10 shrink-0"
        onClick={() => {
          window.scrollTo(0, 0);
          setView("home");
        }}
      >
        <Pizza className="text-brand-neon w-8 h-8 lg:w-10 lg:h-10 shrink-0" />
        <span className="font-display text-2xl sm:text-2xl lg:text-3xl uppercase truncate text-brand-neon">
          Jesse's Pizza Co.
        </span>
      </div>

      <div className="hidden lg:flex ml-auto items-center gap-8 xl:gap-10 font-display text-lg uppercase tracking-wider text-brand-white relative z-10">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setView("menu-browse");
          }}
          className={`hover:text-brand-neon transition-colors tracking-widest ${view === "menu-browse" ? "text-brand-neon border-b border-brand-neon" : ""}`}
        >
          MENU
        </button>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setView("about");
          }}
          className={`hover:text-brand-neon transition-colors tracking-widest ${view === "about" ? "text-brand-neon border-b border-brand-neon" : ""}`}
        >
          ABOUT
        </button>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setView("locations");
          }}
          className={`hover:text-brand-neon transition-colors tracking-widest ${view === "locations" ? "text-brand-neon border-b border-brand-neon" : ""}`}
        >
          LOCATIONS
        </button>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setView("careers");
          }}
          className={`hover:text-brand-neon transition-colors tracking-widest ${view === "careers" ? "text-brand-neon border-b border-brand-neon" : ""}`}
        >
          CAREERS
        </button>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setView("specials");
          }}
          className={`hover:text-brand-neon transition-colors tracking-widest ${view === "specials" ? "text-brand-neon border-b border-brand-neon" : ""}`}
        >
          SPECIALS
        </button>
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setView("contact");
          }}
          className={`hover:text-brand-neon transition-colors tracking-widest ${view === "contact" ? "text-brand-neon border-b border-brand-neon" : ""}`}
        >
          CONTACT
        </button>

        <button
          onClick={startOrder}
          className="bg-brand-red text-brand-white font-display uppercase px-8 py-3 tracking-widest transition-all hover:bg-red-700 active:scale-95 rounded-md text-lg"
        >
          Order Now
        </button>
      </div>

      <button
        className="ml-auto lg:hidden text-brand-neon p-2 hover:bg-white/5 rounded-sm transition-colors relative z-10"
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
  );

  const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      const toggleVisibility = () => {
        if (window.scrollY > 500) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      };
      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
      <AnimatePresence>
        {isVisible && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-8 right-8 z-[100] bg-[#B8F000] text-[#0D0D0D] p-5 rounded-none shadow-[0_10px_30px_rgba(184,240,0,0.5)] hover:scale-110 active:scale-95 transition-all group border-2 border-black/10"
              aria-label="Scroll to top"
            >
              <div className="flex items-center justify-center">
                <ChevronUp
                  size={32}
                  strokeWidth={3.5}
                  className="group-hover:-translate-y-1 transition-transform"
                />
              </div>
            </motion.button>
        )}
      </AnimatePresence>
    );
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.crust === item.crust &&
          JSON.stringify(i.toppings) === JSON.stringify(item.toppings),
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, item];
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const ProgressSteps = ({ current }: { current: number }) => (
    <div className="flex justify-between items-center max-w-md mx-auto mb-8 px-4 text-[10px] font-black uppercase tracking-widest text-brand-neon/40 overflow-hidden">
      {["Start", "Menu", "Custom", "Add-ons", "Cart", "Pay"].map((step, i) => (
        <div key={step} className="flex flex-col items-center gap-2">
          <div
            className={`w-8 h-1 transition-colors ${i <= current ? "bg-brand-neon" : "bg-white/10"}`}
          />
          <span className={i <= current ? "text-brand-neon" : ""}>{step}</span>
        </div>
      ))}
    </div>
  );

  const Footer = () => (
    <footer className="bg-[#0D0D0D] relative overflow-hidden pb-[52px]">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#B8F000] opacity-50 z-20" />
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto pt-20 pb-16 px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-12 lg:gap-8">
          {/* COLUMN 1: BRAND */}
          <div className="max-w-[280px]">
            <div
              className="flex items-center gap-3 mb-8 cursor-pointer"
              onClick={() => {
                window.scrollTo(0, 0);
                setView("home");
              }}
            >
              <Pizza className="text-brand-neon w-10 h-10" />
              <span className="font-display text-3xl uppercase tracking-tighter text-[#F5F5F5]">
                Jesse's Pizza Co.
              </span>
            </div>
            <h3 className="font-display text-2xl font-normal uppercase tracking-tight text-[#F5F5F5] leading-[1.1] mb-8">
              FAMILY OWNED.
              <br />
              GRIT FUELED.
              <br />
              BORGER'S PIZZA.
              <br />
              DONE RIGHT.
            </h3>
            <button
              onClick={startOrder}
              className="w-full bg-[#D62828] text-white py-4 font-bold uppercase tracking-[2px] transition-all hover:bg-red-700 active:scale-95 shadow-xl"
            >
              ORDER NOW
            </button>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="flex flex-col">
            <h4 className="font-display text-[20px] font-bold tracking-[2px] uppercase text-[#B8F000] mb-8">
              QUICK LINKS
            </h4>
            <nav className="flex flex-col gap-[12px]">
              {[
                "home",
                "menu-browse",
                "about",
                "locations",
                "specials",
                "careers",
                "contact",
              ].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    setView(link as FunnelStep);
                  }}
                  className="text-[15px] font-semibold uppercase tracking-[1px] text-[#F5F5F5] hover:text-[#B8F000] text-left transition-colors"
                >
                  {link.replace("-", " ")}
                </button>
              ))}
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  setView("privacy");
                }}
                className="text-[15px] font-semibold uppercase tracking-[1px] text-[#F5F5F5] hover:text-[#B8F000] text-left transition-colors"
              >
                PRIVACY POLICY
              </button>
              <button
                onClick={() => {
                  window.scrollTo(0, 0);
                  setView("terms");
                }}
                className="text-[15px] font-semibold uppercase tracking-[1px] text-[#F5F5F5] hover:text-[#B8F000] text-left transition-colors"
              >
                TERMS OF SERVICE
              </button>
            </nav>
          </div>

          {/* COLUMN 3: LOCATIONS */}
          <div className="flex flex-col gap-8">
            <h4 className="font-display text-[20px] font-bold tracking-[2px] uppercase text-[#B8F000]">
              LOCATIONS
            </h4>

            <div className="flex flex-col gap-1">
              <span className={`font-display text-[16px] uppercase mb-2 ${location === "Borger" ? "text-brand-neon underline underline-offset-4" : "text-[#B8F000]"}`}>
                BORGER
              </span>
              <p className="text-[#F5F5F5] text-[15px] font-semibold uppercase tracking-[1px]">
                {LOCATIONS_DATA["Borger"].address}
              </p>
              <p className="text-[#F5F5F5] text-[15px] font-semibold uppercase tracking-[1px] mb-2">
                {LOCATIONS_DATA["Borger"].city}
              </p>
              <a
                href={`tel:${LOCATIONS_DATA["Borger"].phoneRaw}`}
                className="font-display text-[18px] text-[#B8F000] uppercase hover:brightness-110 transition-all"
              >
                {LOCATIONS_DATA["Borger"].phone}
              </a>
            </div>

            <div className="flex flex-col gap-1">
              <span className={`font-display text-[16px] uppercase mb-2 ${location === "Fritch" ? "text-brand-neon underline underline-offset-4" : "text-[#B8F000]"}`}>
                FRITCH
              </span>
              <p className="text-[#F5F5F5] text-[15px] font-semibold uppercase tracking-[1px]">
                {LOCATIONS_DATA["Fritch"].address}
              </p>
              <p className="text-[#F5F5F5] text-[15px] font-semibold uppercase tracking-[1px] mb-2">
                {LOCATIONS_DATA["Fritch"].city}
              </p>
              <a
                href={`tel:${LOCATIONS_DATA["Fritch"].phoneRaw}`}
                className="font-display text-[18px] text-[#B8F000] uppercase hover:brightness-110 transition-all"
              >
                {LOCATIONS_DATA["Fritch"].phone}
              </a>
            </div>
          </div>

          {/* COLUMN 4: KEEP IT LOADED */}
          <div className="flex flex-col gap-8">
            <h4 className="font-display text-[20px] font-bold tracking-[2px] uppercase text-[#B8F000]">
              KEEP IT LOADED
            </h4>

            <div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= 4 ? "#FFB800" : "none"}
                    className={s <= 4 ? "text-[#FFB800]" : "text-white/20"}
                  />
                ))}
              </div>
              <h5 className="font-display text-[18px] text-[#F5F5F5] uppercase">
                4.6 RATING
              </h5>
              <span className="text-[12px] font-bold text-white/40 uppercase tracking-widest">
                867 COMBINED REVIEWS
              </span>
            </div>

            <p className="font-display text-[16px] text-[#F5F5F5] uppercase leading-relaxed tracking-[1px]">
              BORGER'S MOST LOADED PIZZA.
              <br />
              NO SHORTCUTS.
              <br />
              NO SKIMPING.
              <br />
              PERIOD.
            </p>

            <div>
              <span className="font-display text-[14px] text-[#B8F000] uppercase tracking-[2px] block mb-4">
                FOLLOW US
              </span>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-[14px] font-bold uppercase tracking-[1px] text-[#F5F5F5] hover:text-[#B8F000] transition-colors"
                >
                  FACEBOOK
                </a>
                <a
                  href="#"
                  className="text-[14px] font-bold uppercase tracking-[1px] text-[#F5F5F5] hover:text-[#B8F000] transition-colors"
                >
                  INSTAGRAM
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-[#B8F000] opacity-20" />

      {/* SUB-FOOTER */}
      <div className="bg-[#2A2A2A] py-[20px] px-6 relative overflow-hidden">
        <div className="absolute inset-0 noise-overlay opacity-10 pointer-events-none" />
        <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row justify-between items-center gap-6 relative z-10">
          <div className="text-[12px] font-semibold uppercase tracking-[2px] text-[#666666] text-center lg:text-left">
            © 2026 JESSE'S PIZZA CO. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4 text-[12px] font-semibold uppercase tracking-[2px] text-[#666666]">
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setView("privacy");
              }}
              className="hover:text-[#F5F5F5] transition-colors"
            >
              PRIVACY POLICY
            </button>
            <span className="opacity-100">|</span>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setView("terms");
              }}
              className="hover:text-[#F5F5F5] transition-colors"
            >
              TERMS OF SERVICE
            </button>
          </div>
        </div>
      </div>
    </footer>
  );

  const FunnelHeader = ({
    title,
    showBack = true,
    onBack,
  }: {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
  }) => (
    <header className="px-6 py-8 border-b border-white/5 bg-brand-black sticky top-0 z-40 overflow-hidden">
      <div className="absolute inset-0 noise-overlay pointer-events-none" />
      <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-brand-neon"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl uppercase leading-none text-brand-neon">
            {title}
          </h1>
        </div>
        {cart.length > 0 && view !== "cart" && view !== "checkout" && (
          <button
            onClick={() => setView("cart")}
            className="relative group p-2 bg-brand-neon text-brand-black rounded-sm font-bold flex items-center gap-2"
          >
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
      {isMarketingView && <MainNavigation />}
      {isMarketingView && <ScrollToTop />}

      <AnimatePresence mode="wait">
        {view === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-brand-black"
          >
            <main className="bg-brand-black">
              {/* SECTION 1: HERO */}
              <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-brand-black px-6 pt-0 pb-20 noise-overlay overflow-visible">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Loaded Pizza Close-Up"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/60" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                  <div className="inline-flex items-center justify-center bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 whitespace-nowrap mb-3 gap-2 sm:gap-4 w-auto shadow-2xl relative overflow-hidden group self-center mt-0">
                    <div className="absolute inset-0 noise-overlay opacity-10 pointer-events-none" />
                    <span className="font-display text-2xl sm:text-4xl text-white leading-none pt-1">
                      4.6
                    </span>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-[22px] sm:h-[22px] fill-[#B8F000] text-[#B8F000] shrink-0"
                        />
                      ))}
                      <div className="relative">
                        <Star className="w-4 h-4 sm:w-[22px] sm:h-[22px] text-white/20 shrink-0" />
                        <div className="absolute inset-0 overflow-hidden w-[60%]">
                          <Star
                            className="w-4 h-4 sm:w-[22px] sm:h-[22px] fill-[#B8F000] text-[#B8F000] shrink-0"
                          />
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-[14px] font-black text-white leading-none uppercase tracking-[1px] sm:tracking-[2px]">
                      867 Combined Reviews
                    </span>
                  </div>

                  <span className="eyebrow">
                    Borger & Fritch, TX
                  </span>

                  <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] leading-[0.95] tracking-[-2px] sm:tracking-[0.05em] uppercase text-[#B8F000] flex flex-col items-center w-full break-normal text-center">
                    <span>BORGER'S</span>
                    <span>MOST LOADED</span>
                    <span>
                      PIZZA. <span className="text-[#D62828]">PERIOD.</span>
                    </span>
                  </h1>

                  <p className="text-[16px] lg:text-[22px] leading-[1.6] lg:leading-tight max-w-[320px] lg:max-w-[600px] mx-auto text-[#F5F5F5] font-sans text-center normal-case">
                    18 inches. Edge to edge toppings. Ready in 20 minutes. Two
                    locations. Zero shortcuts.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mt-4">
                    <button
                      onClick={startOrder}
                      className="bg-[#D62828] text-[#F5F5F5] w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-2xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Order Now
                    </button>
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0);
                        setView("menu-browse");
                      }}
                      className="bg-transparent border-2 border-[#B8F000] text-[#B8F000] w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-2xl font-display uppercase tracking-widest hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all"
                    >
                      View Full Menu
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: TRUST STRIP */}
              <section className="bg-brand-neon py-10 lg:py-14 border-y-4 border-brand-red/20 overflow-hidden relative z-20">
                <div className="max-w-[1400px] mx-auto px-6">
                  <div className="flex flex-wrap items-center justify-center gap-y-8 lg:gap-y-0">
                    <div className="w-full sm:w-1/2 lg:w-1/4 px-4 text-center border-brand-red/10 lg:border-r border-b lg:border-b-0 pb-8 lg:pb-0">
                      <span className="text-2xl lg:text-3xl font-black text-brand-red uppercase leading-none tracking-widest">
                        "LOADED EVERY TIME"
                      </span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/4 px-4 text-center border-brand-red/10 sm:border-r-0 lg:border-r border-b sm:border-b-0 lg:border-b-0 pb-8 sm:pb-0 lg:pb-0">
                      <span className="text-2xl lg:text-3xl font-black text-brand-red uppercase leading-none tracking-widest">
                        "NO CHAIN. NO SHORTCUTS."
                      </span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/4 px-4 text-center border-brand-red/10 border-r border-b sm:border-b-0 lg:border-b-0 pt-8 sm:pt-0 lg:pt-0">
                      <span className="text-2xl lg:text-3xl font-black text-brand-red uppercase leading-none tracking-widest">
                        "BORGER'S GO-TO SPOT"
                      </span>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/4 px-4 text-center pt-8 sm:pt-0 lg:pt-0">
                      <span className="text-2xl lg:text-3xl font-black text-brand-red uppercase leading-none tracking-widest">
                        "READY IN 20 MINS"
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: ENEMY SECTION */}
              <section className="bg-[#0D0D0D] px-6 py-[140px] noise-overlay relative">
                <div className="max-w-[1200px] mx-auto text-center flex flex-col gap-10">
                  <h2 className="font-display text-6xl lg:text-8xl text-[#B8F000] uppercase mb-16 leading-tight">
                    YOU ALREADY KNOW.
                  </h2>

                  <div className="flex flex-col gap-24">
                    <p className="text-[60px] lg:text-[80px] text-[#F5F5F5] font-display uppercase tracking-tight leading-none bg-[#0D0D0D]">
                      You've waited 45 minutes for it.
                    </p>
                    <p className="text-[60px] lg:text-[80px] text-[#F5F5F5] font-display uppercase tracking-tight leading-none bg-[#0D0D0D]">
                      Opened the box and felt let down.
                    </p>
                    <p className="text-[60px] lg:text-[80px] text-[#B8F000] font-display uppercase tracking-tight leading-none bg-[#0D0D0D]">
                      That ends here.
                    </p>
                  </div>

                  <p className="text-[18px] lg:text-[22px] max-w-[500px] mx-auto text-[#F5F5F5] leading-relaxed uppercase font-medium tracking-tight mt-20">
                    Jesse's is built for people who are done settling for pizza
                    that doesn't deliver.
                  </p>
                </div>
              </section>

              {/* SECTION 4: FULL BLEED IMAGE BREAK */}
              <section className="w-full relative h-[250px] lg:h-[400px]">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                  alt="Pizza Fresh from Oven"
                  className="w-full h-full object-cover grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 5: OFFER SECTION */}
              <section className="bg-[#2A2A2A] px-6 py-32 lg:py-[120px] noise-overlay relative">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-32">
                    <h2 className="font-display text-6xl lg:text-8xl text-[#B8F000] uppercase mb-12 leading-tight">
                      HERE'S WHAT YOU'RE GETTING.
                    </h2>
                    <p className="text-lg lg:text-xl text-[#F5F5F5] uppercase tracking-widest font-bold">
                      Not "great pizza." Here's what that actually means.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Card 1 */}
                    <div className="bg-[#0D0D0D] shadow-2xl relative overflow-hidden flex flex-col group border-none">
                      <div className="h-[240px] lg:h-[300px] relative overflow-hidden">
                        <img
                          src="https://i.imgur.com/oz3N4dm.jpeg"
                          alt="18 inch Jumbo Pizza"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-[#D62828] text-[#F5F5F5] font-black text-xs uppercase px-6 py-3 tracking-[0.2em] z-20">
                          BEST VALUE
                        </div>
                      </div>
                      <div className="p-10 flex flex-col gap-6 flex-1 bg-[#2A2A2A]">
                        <h3 className="font-display text-4xl text-[#B8F000] uppercase leading-none">
                          THE 18" JUMBO
                        </h3>
                        <p className="text-[18px] text-[#F5F5F5] uppercase font-bold tracking-normal leading-snug">
                          Loaded edge to edge. Feeds everyone.
                        </p>
                        <p className="text-[#F5F5F5] font-bold text-sm opacity-60">
                          From $21.50
                        </p>
                        <button
                          onClick={startOrder}
                          className="bg-[#D62828] text-[#F5F5F5] py-5 px-8 font-display text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-auto text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#0D0D0D] shadow-2xl relative overflow-hidden flex flex-col group border-none">
                      <div className="h-[240px] lg:h-[300px] relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=1000"
                          alt="Jalapeño Popper Pizza"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-[#D62828] text-[#F5F5F5] font-black text-xs uppercase px-6 py-3 tracking-[0.2em] z-20">
                          MOST POPULAR
                        </div>
                      </div>
                      <div className="p-10 flex flex-col gap-6 flex-1 bg-[#2A2A2A]">
                        <h3 className="font-display text-4xl text-[#B8F000] uppercase leading-none">
                          JALAPEÑO POPPER
                        </h3>
                        <p className="text-[18px] text-[#F5F5F5] uppercase font-bold tracking-normal leading-snug">
                          Creamy base. Fresh jalapeños. Always loaded.
                        </p>
                        <p className="text-[#F5F5F5] font-bold text-sm opacity-60">
                          12" — $18.29 | 14" — $23.29
                        </p>
                        <button
                          onClick={startOrder}
                          className="bg-[#D62828] text-[#F5F5F5] py-5 px-8 font-display text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-auto text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-[#0D0D0D] shadow-2xl relative overflow-hidden flex flex-col group border-none">
                      <div className="h-[240px] lg:h-[300px] relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000"
                          alt="Chicken Bacon Ranch Pizza"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-[#D62828] text-[#F5F5F5] font-black text-xs uppercase px-6 py-3 tracking-[0.2em] z-20">
                          MOST POPULAR
                        </div>
                      </div>
                      <div className="p-10 flex flex-col gap-6 flex-1 bg-[#2A2A2A]">
                        <h3 className="font-display text-4xl text-[#B8F000] uppercase leading-none">
                          CHICKEN BACON RANCH
                        </h3>
                        <p className="text-[18px] text-[#F5F5F5] uppercase font-bold tracking-normal leading-snug">
                          Bacon. Ranch. Chicken. Actually loaded.
                        </p>
                        <p className="text-[#F5F5F5] font-bold text-sm opacity-60">
                          12" — $18.29 | 14" — $23.29 | 18" — $26.99
                        </p>
                        <button
                          onClick={startOrder}
                          className="bg-[#D62828] text-[#F5F5F5] py-5 px-8 font-display text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-auto text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-[#0D0D0D] shadow-2xl relative overflow-hidden flex flex-col group border-none">
                      <div className="h-[240px] lg:h-[300px] relative overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=1000"
                          alt="Pizza Family Deal"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-[#D62828] text-[#F5F5F5] font-black text-xs uppercase px-6 py-3 tracking-[0.2em] z-20">
                          BEST VALUE
                        </div>
                      </div>
                      <div className="p-10 flex flex-col gap-6 flex-1 bg-[#2A2A2A]">
                        <h3 className="font-display text-4xl text-[#B8F000] uppercase leading-none">
                          THE FAMILY DEAL
                        </h3>
                        <p className="text-[18px] text-[#F5F5F5] uppercase font-bold tracking-normal leading-snug">
                          18" Jumbo + Cheezy Bread + 2 Liter.
                        </p>
                        <p className="text-[#F5F5F5] font-bold text-sm opacity-60">
                          $34.99
                        </p>
                        <button
                          onClick={startOrder}
                          className="bg-[#D62828] text-[#F5F5F5] py-5 px-8 font-display text-xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all mt-auto text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: SPECIFICITY STRIP */}
              <section className="bg-brand-neon py-16 overflow-hidden border-none text-brand-black">
                <div className="relative flex overflow-x-hidden">
                  <div className="flex w-fit animate-marquee py-2">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="flex items-center gap-12 px-6">
                        <span className="text-[20px] font-black uppercase tracking-widest flex items-center gap-6 whitespace-nowrap">
                          47 Jalapeño Poppers ordered last Friday alone.{" "}
                          <span className="text-brand-red text-5xl leading-none">
                            •
                          </span>
                        </span>
                        <span className="text-[20px] font-black uppercase tracking-widest flex items-center gap-6 whitespace-nowrap">
                          The Jumbo feeds five. Most people order two anyway.{" "}
                          <span className="text-brand-red text-5xl leading-none">
                            •
                          </span>
                        </span>
                        <span className="text-[20px] font-black uppercase tracking-widest flex items-center gap-6 whitespace-nowrap">
                          Same toppings on the 8" as the 18". No skimping.{" "}
                          <span className="text-brand-red text-5xl leading-none">
                            •
                          </span>
                        </span>
                        <span className="text-[20px] font-black uppercase tracking-widest flex items-center gap-6 whitespace-nowrap">
                          Ready in 20 minutes or we'll tell you before you
                          order.{" "}
                          <span className="text-brand-red text-5xl leading-none">
                            •
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 7: OBJECTION REMOVAL */}
              <section className="bg-[#0D0D0D] px-6 py-40 lg:py-[160px] noise-overlay relative">
                <div className="max-w-[600px] mx-auto text-center flex flex-col gap-16">
                  <h2 className="font-display text-6xl lg:text-8xl text-[#B8F000] uppercase leading-tight">
                    STILL NOT SURE?
                  </h2>

                  <div className="flex flex-col gap-8 text-[#F5F5F5] font-bold text-[20px] uppercase leading-tight">
                    <p>Order once.</p>
                    <p>
                      If it's not the best pizza you've had in Borger or Fritch,
                      call us and tell us.
                    </p>
                    <p>We'd rather hear it than lose you.</p>
                  </div>

                  <p className="text-[14px] text-[#F5F5F5] opacity-60 uppercase tracking-widest mt-8">
                    That's not a guarantee written by a lawyer.
                    <br />
                    That's just how we operate.
                  </p>

                  <button
                    onClick={startOrder}
                    className="bg-[#D62828] text-[#F5F5F5] px-16 py-8 text-2xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl mt-8"
                  >
                    Order Now and Find Out
                  </button>
                </div>
              </section>

              {/* SECTION 8: SOCIAL PROOF */}
              <section className="bg-[#2A2A2A] px-6 py-32 lg:py-[120px] noise-overlay relative">
                <div className="max-w-[1200px] mx-auto text-center">
                  <h2 className="font-display text-6xl lg:text-8xl text-[#B8F000] uppercase mb-12 leading-tight">
                    DON'T TAKE OUR WORD FOR IT.
                  </h2>
                  <p className="text-lg lg:text-xl text-[#F5F5F5] uppercase tracking-widest font-bold mb-32 italic">
                    Borger and Fritch have been eating here long enough to know.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[
                      "Best pizza in Borger. Not even close. I've tried everything else. This is the one.",
                      "Ordered the Jalapeño Popper on a Friday. Ordered it again Sunday. That's all I need to say.",
                      "Chains are done for me. Once you eat here you can't go back.",
                      "Loaded every single time. Never once been disappointed.",
                    ].map((review, i) => (
                      <div
                        key={i}
                        className="bg-[#0D0D0D] p-16 text-left relative overflow-hidden group"
                      >
                        <span className="text-[120px] text-[#B8F000] font-black leading-none absolute -top-4 -left-2 opacity-10">
                          "
                        </span>
                        <p className="text-[#F5F5F5] text-[24px] font-display uppercase leading-tight relative z-10 italic">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 9: FULL BLEED IMAGE BREAK */}
              <section className="w-full relative h-[220px] lg:h-[350px]">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
                  alt="Pizza Sliced Hot"
                  className="w-full h-full object-cover grayscale-[0.3]"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 10: LOCATIONS */}
              <section
                id="locations"
                className="bg-[#0D0D0D] px-6 py-32 lg:py-[120px] noise-overlay relative"
              >
                <div className="max-w-[1200px] mx-auto text-center">
                  <h2 className="font-display text-6xl lg:text-[5rem] text-[#B8F000] uppercase mb-32 leading-none">
                    PICK YOUR LOCATION.
                    <br />
                    ORDER IN 30 SECONDS.
                  </h2>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                    {/* Borger */}
                    <div className="bg-[#2A2A2A] p-12 flex flex-col gap-10 border-none shadow-2xl h-full">
                      <h3 className="font-display text-[48px] uppercase leading-none text-[#B8F000]">
                        BORGER
                      </h3>
                      <div className="text-[#F5F5F5] text-[18px] font-bold uppercase tracking-widest space-y-2">
                        <p>Jesse's Pizza Company</p>
                        <p>530 W 3rd St, Borger, TX 79007</p>
                        <a
                          href="tel:8062747200"
                          className="text-[32px] font-display mt-8 text-[#F5F5F5] block hover:text-[#B8F000] transition-colors"
                        >
                          (806) 274-7200
                        </a>
                        <p className="text-[#B8F000] text-sm italic">
                          Ready in 20 minutes.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <button
                          onClick={startOrder}
                          className="bg-[#D62828] text-[#F5F5F5] py-6 px-8 font-display text-xl uppercase tracking-widest hover:scale-[1.02] transition-all flex-1 text-center"
                        >
                          Order Online
                        </button>
                        <a
                          href="tel:8062747200"
                          className="bg-transparent border-2 border-[#B8F000] text-[#B8F000] py-6 px-8 font-display text-xl uppercase tracking-widest hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all text-center flex-1"
                        >
                          Call Now
                        </a>
                      </div>
                      {/* Map Placeholder */}
                      <div className="w-full h-[200px] bg-black/20 border border-white/5 relative overflow-hidden mt-6">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3221.055811340156!2d-101.39343992383566!3d35.666993933405786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8703da9600000001%3A0xe54e6006f658f278!2sJesse's%20Pizza%20Company!5e0!3m2!1sen!2sus!4v1713644265000!5m2!1sen!2sus"
                          className="absolute inset-0 w-full h-full grayscale opacity-60 pointer-events-none"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>

                    {/* Fritch */}
                    <div className="bg-[#2A2A2A] p-12 flex flex-col gap-10 border-none shadow-2xl h-full">
                      <h3 className="font-display text-[48px] uppercase leading-none text-[#B8F000]">
                        FRITCH
                      </h3>
                      <div className="text-[#F5F5F5] text-[18px] font-bold uppercase tracking-widest space-y-2">
                        <p>Jesse's Pizza Company</p>
                        <p>424 E Broadway St, Fritch, TX 79036</p>
                        <a
                          href="tel:8068570098"
                          className="text-[32px] font-display mt-8 text-[#F5F5F5] block hover:text-[#B8F000] transition-colors"
                        >
                          (806) 857-0098
                        </a>
                        <p className="text-[#B8F000] text-sm italic">
                          Ready in 20 minutes.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <button
                          onClick={startOrder}
                          className="bg-[#D62828] text-[#F5F5F5] py-6 px-8 font-display text-xl uppercase tracking-widest hover:scale-[1.02] transition-all flex-1 text-center"
                        >
                          Order Online
                        </button>
                        <a
                          href="tel:8068570098"
                          className="bg-transparent border-2 border-[#B8F000] text-[#B8F000] py-6 px-8 font-display text-xl uppercase tracking-widest hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all text-center flex-1"
                        >
                          Call Now
                        </a>
                      </div>
                      {/* Map Placeholder */}
                      <div className="w-full h-[200px] bg-black/20 border border-white/5 relative overflow-hidden mt-6">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12869.6010531!2d-101.60!3d35.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8703d0!2sJesse's%20Pizza%20Company!5e0!3m2!1sen!2sus!4v1713644265000!5m2!1sen!2sus"
                          className="absolute inset-0 w-full h-full grayscale opacity-60 pointer-events-none"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 11: FINAL CLOSE */}
              <section className="relative min-h-screen flex items-center justify-center bg-[#0D0D0D] px-6 py-32 noise-overlay">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Ending Food Shot"
                    className="w-full h-full object-cover opacity-40 grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0D0D0D]/60" />
                </div>

                <div className="max-w-[400px] lg:max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
                  <h1 className="font-display text-6xl lg:text-[8rem] xl:text-[10rem] mb-12 leading-[0.95] uppercase text-[#B8F000] flex flex-col items-center pt-20">
                    <span>YOU'RE GOING</span>
                    <span>TO EAT TONIGHT</span>
                    <span>ANYWAY.</span>
                  </h1>

                  <div className="flex flex-col gap-8 text-[#F5F5F5] text-[20px] font-bold uppercase leading-tight mb-24">
                    <p>
                      The only question is whether it's going to be worth it.
                    </p>
                    <p>
                      You already know what the chains are going to give you.
                    </p>
                    <p className="text-[#B8F000] font-black">So order.</p>
                  </div>

                  <button
                    onClick={startOrder}
                    className="bg-[#D62828] text-[#F5F5F5] px-24 py-10 text-4xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    Order Now
                  </button>
                </div>
              </section>
            </main>

            <Footer />
          </motion.div>
        ) : view === "menu-browse" ? (
          <motion.div
            key="menu-browse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-32 bg-brand-black min-h-screen overflow-x-hidden"
          >
            {/* STANDALONE MENU HEADER REMOVED FOR PERSISTENCE */}

            <main className="bg-brand-black">
              {/* SECTION 1: HERO */}
              <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-brand-black px-6 pt-0 pb-20 overflow-visible">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
                    alt="Menu Pizza"
                    className="w-full h-full object-cover opacity-30 grayscale"
                    referrerPolicy="no-referrer"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-brand-black/80" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                  <div className="inline-flex items-center justify-center bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 whitespace-nowrap mb-3 gap-2 sm:gap-4 w-auto shadow-2xl relative overflow-hidden group self-center mt-0">
                    <div className="absolute inset-0 noise-overlay opacity-10 pointer-events-none" />
                    <span className="font-display text-2xl sm:text-4xl text-white leading-none pt-1">
                      4.6
                    </span>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-[22px] sm:h-[22px] fill-[#B8F000] text-[#B8F000] shrink-0"
                        />
                      ))}
                      <div className="relative">
                        <Star className="w-4 h-4 sm:w-[22px] sm:h-[22px] text-white/20 shrink-0" />
                        <div className="absolute inset-0 overflow-hidden w-[60%]">
                          <Star
                            className="w-4 h-4 sm:w-[22px] sm:h-[22px] fill-[#B8F000] text-[#B8F000] shrink-0"
                          />
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-[14px] font-black text-white leading-none uppercase tracking-[1px] sm:tracking-[2px]">
                      867 Combined Reviews
                    </span>
                  </div>

                  <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] leading-[0.95] uppercase text-brand-neon flex flex-col items-center w-full break-normal text-center drop-shadow-[0_2px_40px_rgba(0,0,0,0.95)] mt-0">
                    <span>THE MENU.</span>
                    <span>NO SHORTCUTS.</span>
                    <span>NO SKIMPING.</span>
                  </h1>

                  <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[400px] mx-auto text-brand-white font-sans text-center normal-case">
                    Every item built the same way. Loaded, fresh, and worth
                    ordering again.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mt-4">
                    <button
                      onClick={startOrder}
                      className="bg-brand-red text-brand-white w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-23l font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl rounded-none border-none"
                    >
                      Order Now
                    </button>
                    <button
                      onClick={() => {
                        const el = document.getElementById("most-popular");
                        el?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="bg-transparent border-2 border-brand-neon text-brand-neon w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-2xl font-display uppercase tracking-widest hover:bg-brand-neon hover:text-brand-black transition-all rounded-none"
                    >
                      View Full Menu
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: MOST POPULAR */}
              <section id="most-popular" className="bg-brand-concrete px-5 py-24 lg:py-32 noise-overlay border-b border-white/5">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-6xl lg:text-[56px] mb-6 text-brand-neon uppercase font-bold tracking-[0.05em]">
                      START HERE.
                    </h2>
                    <p className="text-[16px] text-brand-white uppercase font-sans font-normal tracking-widest">
                      These are the ones people order on repeat. There is a reason for that.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      {
                        name: "JALAPEÑO POPPER",
                        desc: "Creamy heat. Serious kick. Loaded every time.",
                        price: '12" — $18.29 | 14" — $23.29',
                        badge: "MOST POPULAR",
                        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "CHICKEN BACON RANCH",
                        desc: "Bacon. Ranch. Chicken. Actually loaded.",
                        price: '12" — $18.29 | 14" — $23.29 | 18" — $26.99',
                        badge: "MOST POPULAR",
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "THE 18\" JUMBO",
                        desc: "Feeds everyone. Loaded edge to edge.",
                        price: "From $21.50",
                        badge: "BEST VALUE",
                        image: "https://i.imgur.com/oz3N4dm.jpeg",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-brand-black flex flex-col noise-overlay border-none relative group overflow-hidden"
                      >
                        <div className="relative h-[260px] w-full block overflow-hidden bg-[#2A2A2A]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                            loading="lazy"
                          />
                          <div className="absolute top-0 right-0 bg-brand-red text-brand-white font-black text-[12px] uppercase px-4 py-2 z-20 tracking-widest">
                            {item.badge}
                          </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-brand-neon font-display text-2xl mb-4 uppercase font-bold tracking-[0.05em]">
                            {item.name}
                          </h3>
                          <p className="text-brand-white text-[16px] font-sans font-normal uppercase leading-tight tracking-wider mb-6 flex-1">
                            {item.desc}
                          </p>
                          <p className="text-brand-white text-[16px] font-sans mb-8 font-normal tracking-wide">
                            {item.price}
                          </p>
                          <button
                            onClick={startOrder}
                            className="bg-brand-red text-brand-white w-full py-4 text-[15px] font-display uppercase tracking-widest hover:scale-105 transition-all text-center border-none"
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 3: COMBOS */}
              <section className="bg-brand-black px-5 py-24 lg:py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-5xl lg:text-[56px] mb-6 text-brand-neon uppercase font-bold tracking-[0.05em]">
                      MORE FOOD. BETTER VALUE.
                    </h2>
                    <p className="text-[16px] text-brand-white uppercase font-sans font-normal tracking-widest text-center">
                      Built so you don't have to do the math.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[
                      {
                        name: "FAMILY DEAL",
                        contents: ["18\" Jumbo Pizza", "Cheezy Bread", "2 Liter Drink"],
                        price: "$34.99",
                        value: "Nobody goes home hungry.",
                        cta: "Order This",
                      },
                      {
                        name: "GAME NIGHT PACK",
                        contents: ["2 Large Pizzas", "Wings (12 ct)"],
                        price: "$45.99",
                        value: "Built for a crowd. Gone fast.",
                        cta: "Order This",
                      },
                      {
                        name: "QUICK MEAL",
                        contents: ["Medium Pizza", "Drink"],
                        price: "$19.99",
                        value: "Fast. Simple. Hits the spot.",
                        cta: "Order This",
                      },
                    ].map((combo, i) => (
                      <div
                        key={i}
                        className="bg-brand-concrete p-10 flex flex-col noise-overlay h-full"
                      >
                        <h3 className="text-brand-neon font-display text-[32px] mb-8 uppercase font-bold tracking-[0.05em] leading-none">
                          {combo.name}
                        </h3>
                        <div className="flex-1 mb-8">
                          {combo.contents.map((item, idx) => (
                            <p key={idx} className="text-brand-white text-[18px] uppercase font-sans font-normal leading-loose tracking-wider">
                              {item}
                            </p>
                          ))}
                        </div>
                        <div className="mt-auto">
                          <p className="text-brand-white text-[28px] font-sans font-bold mb-4">
                            {combo.price}
                          </p>
                          <p className="text-brand-neon text-[16px] font-sans italic mb-8 uppercase tracking-widest">
                            {combo.value}
                          </p>
                          <button
                            onClick={startOrder}
                            className="bg-brand-red text-brand-white w-full py-4 text-[15px] font-display uppercase tracking-widest hover:scale-105 transition-all text-center border-none"
                          >
                            {combo.cta}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 4: FULL BLEED IMAGE BREAK */}
              <section className="w-full h-[250px] lg:h-[400px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                  alt="Specialty Pizza Close-Up"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </section>

              {/* SECTION 5: SPECIALTY PIZZAS */}
              <section className="bg-brand-concrete px-5 py-24 lg:py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-5xl lg:text-[56px] mb-6 text-brand-neon uppercase font-bold tracking-[0.05em]">
                      SPECIALTY PIZZAS.
                    </h2>
                    <p className="text-[16px] text-brand-white uppercase font-sans font-normal tracking-widest text-center">
                      Made to order. Built to impress.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[
                      {
                        name: "JALAPEÑO POPPER",
                        desc: "Creamy heat with a serious kick.",
                        pricing: "8\" $10.29 | 12\" $18.29 | 14\" $23.29",
                        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "CHICKEN BACON RANCH",
                        desc: "Loaded with bacon and creamy ranch.",
                        pricing: "8\" $10.29 | 12\" $18.29 | 14\" $23.29 | 18\" $26.99",
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "CLOSED ON SUNDAY",
                        desc: "Bold, hearty, and packed with toppings.",
                        pricing: "12\" $18.29 | 14\" $23.29 | 18\" $26.99",
                        image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "MEAT EATER",
                        desc: "All the meat. No holding back.",
                        pricing: "12\" $18.29 | 14\" $23.29 | 18\" $26.99",
                        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "PEPPERONI",
                        desc: "Classic. Loaded. Always hits.",
                        pricing: "12\" $16.50 | 14\" $18.50 | 18\" $21.50",
                        image: "https://i.imgur.com/oz3N4dm.jpeg",
                      },
                    ].map((pizza, i) => (
                      <div
                        key={i}
                        className="bg-brand-black flex flex-col noise-overlay overflow-hidden h-full group"
                      >
                        <div className="h-[220px] w-full block overflow-hidden bg-[#2A2A2A]">
                          <img
                            src={pizza.image}
                            alt={pizza.name}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-brand-neon font-display text-[22px] mb-4 uppercase font-bold tracking-[0.05em]">
                            {pizza.name}
                          </h3>
                          <p className="text-brand-white text-[16px] font-sans font-normal uppercase leading-tight tracking-wider mb-6 flex-1">
                            {pizza.desc}
                          </p>
                          <p className="text-brand-white text-[14px] font-sans mb-8 opacity-60 tracking-wide uppercase">
                            {pizza.pricing}
                          </p>
                          <button
                            onClick={startOrder}
                            className="bg-brand-red text-brand-white w-full py-4 text-[15px] font-display uppercase tracking-widest hover:scale-105 transition-all text-center border-none mt-auto"
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: BUILD YOUR OWN */}
              <section className="bg-brand-black px-0 py-0 border-b border-white/5 noise-overlay">
                <div className="flex flex-col lg:flex-row items-stretch min-h-[600px]">
                  <div className="w-full lg:w-1/2 h-[300px] lg:h-auto overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=2000"
                      alt="Build Your Own Pizza"
                      className="w-full h-full object-cover grayscale-[0.2]"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-center bg-brand-black">
                    <h2 className="font-display text-5xl lg:text-[56px] mb-6 text-brand-neon uppercase font-bold tracking-[0.05em]">
                      BUILD YOUR OWN.
                    </h2>
                    <p className="text-[18px] text-brand-white uppercase font-sans font-normal tracking-widest mb-12">
                      Pick your size. Add your toppings.
                      <br />
                      Exactly what you want. Every time.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                      {[
                        { size: '8"', price: "$7.25" },
                        { size: '12"', price: "$16.50" },
                        { size: '14"', price: "$18.50" },
                        { size: '18"', price: "$21.50", label: "BEST VALUE" },
                      ].map((item, i) => (
                        <div
                          key={i}
                          className={`p-6 flex flex-col justify-center border-2 bg-brand-concrete cursor-pointer transition-all hover:bg-brand-neon/10 ${item.label ? "border-brand-neon" : "border-white/10"}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-display text-2xl text-brand-white uppercase">{item.size}</span>
                            <span className="font-sans font-bold text-brand-neon">{item.price}</span>
                          </div>
                          {item.label && (
                            <span className="text-brand-red text-[10px] font-black uppercase tracking-widest">
                              {item.label}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={startOrder}
                      className="bg-brand-red text-brand-white w-full py-6 text-2xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl border-none"
                    >
                      Start Building
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 7: SIDES AND WINGS */}
              <section className="bg-brand-concrete px-5 py-24 lg:py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-5xl lg:text-[56px] mb-6 text-brand-neon uppercase font-bold tracking-[0.05em]">
                      SIDES AND WINGS.
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "CHEEZY BREAD",
                        desc: "Hot, cheesy, and made to share.",
                        pricing: "10\" $9.00 | 12\" $14.00 | 14\" $16.00",
                        image: "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "WINGS",
                        desc: "Crispy, hot, and full of flavor.",
                        pricing: "8 ct $11.99 | 12 ct $16.99 | 18 ct $23.99",
                        image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&q=80&w=600",
                      },
                      {
                        name: "CALZONES",
                        desc: "Packed, baked, and loaded inside.",
                        pricing: "2-Topping or Specialty | Medium or Large",
                        image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&q=80&w=600",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-brand-black flex flex-col noise-overlay overflow-hidden h-full group"
                      >
                        <div className="h-[220px] w-full block overflow-hidden bg-[#2A2A2A]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                          <h3 className="text-brand-neon font-display text-[22px] mb-4 uppercase font-bold tracking-[0.05em]">
                            {item.name}
                          </h3>
                          <p className="text-brand-white text-[16px] font-sans font-normal uppercase leading-tight tracking-wider mb-6 flex-1">
                            {item.desc}
                          </p>
                          <p className="text-brand-white text-[14px] font-sans mb-8 opacity-60 tracking-wide uppercase">
                            {item.pricing}
                          </p>
                          <button
                            onClick={startOrder}
                            className="bg-brand-red text-brand-white w-full py-4 text-[15px] font-display uppercase tracking-widest hover:scale-105 transition-all text-center border-none mt-auto"
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 8: FULL BLEED IMAGE BREAK */}
              <section className="w-full h-[220px] lg:h-[350px] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&q=80&w=2000"
                  alt="Wings Close-Up"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </section>

              {/* SECTION 9: SALADS AND DESSERT */}
              <section className="bg-brand-black px-5 py-24 lg:py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-0">
                  {/* SALADS */}
                  <div className="w-full lg:w-1/2 lg:pr-12 lg:border-r border-brand-neon">
                    <h2 className="text-brand-neon font-display text-[20px] font-bold uppercase mb-12 tracking-[0.1em]">
                      SALADS.
                    </h2>
                    <div className="space-y-10">
                      {[
                        { name: "Garden Salad", price: "$7.75", desc: "Fresh and simple." },
                        { name: "Chicken Salad", price: "$9.00", desc: "Fresh greens with hearty chicken." },
                        { name: "Chef Salad", price: "$8.25", desc: "Loaded and built to fill you up." },
                        { name: "Build Your Own Salad", price: "Varies", desc: "Make it exactly how you want it." },
                      ].map((salad, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="text-brand-white font-sans text-[18px] font-bold uppercase tracking-wider">{salad.name}</h3>
                            <span className="text-brand-white font-sans text-[16px]">{salad.price}</span>
                          </div>
                          <p className="text-brand-white/60 font-sans text-[14px] uppercase tracking-widest">{salad.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* DESSERT */}
                  <div className="w-full lg:w-1/2 lg:pl-12">
                    <h2 className="text-brand-neon font-display text-[20px] font-bold uppercase mb-12 tracking-[0.1em]">
                      DESSERT.
                    </h2>
                    <div className="bg-brand-concrete flex flex-col noise-overlay overflow-hidden group">
                      <div className="h-[220px] w-full block overflow-hidden bg-[#2A2A2A]">
                        <img
                          src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=600"
                          alt="Cinna Bread"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-8 flex flex-col">
                        <h3 className="text-brand-neon font-display text-[22px] mb-4 uppercase font-bold tracking-[0.05em]">
                          CINNA BREAD
                        </h3>
                        <p className="text-brand-white text-[16px] font-sans font-normal uppercase leading-tight tracking-wider mb-6">
                          Warm, sweet, and worth saving room for.
                        </p>
                        <p className="text-brand-white text-[14px] font-sans mb-8 opacity-60 tracking-wide uppercase">
                          10" $9.00 | 12" $14.00 | 14" $16.00
                        </p>
                        <button
                          onClick={startOrder}
                          className="bg-brand-red text-brand-white w-full py-4 text-[15px] font-display uppercase tracking-widest hover:scale-105 transition-all text-center border-none"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>


              {/* SECTION 10: DRINKS AND EXTRAS */}
              <section className="bg-brand-concrete px-5 py-24 lg:py-32 border-b border-white/5 noise-overlay">
                <div className="max-w-[1200px] mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-5xl lg:text-[56px] text-brand-neon uppercase font-bold tracking-[0.05em]">
                      DRINKS AND EXTRAS.
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* DRINKS */}
                    <div>
                      <h3 className="text-brand-white font-display text-[22px] font-bold uppercase mb-10 tracking-[0.1em] border-b border-white/10 pb-4">
                        DRINKS
                      </h3>
                      <div className="space-y-6">
                        {[
                          { name: "2-Liter Soda", list: "Pepsi, Diet Pepsi, Starry, Dr. Pepper, Orange, Mug, Mountain Dew" },
                          { name: "20 oz Soda", list: "Assorted Pepsi Products" },
                          { name: "Iced Tea", list: "Sweet or Unsweet" },
                          { name: "Water", list: "Bottled" },
                        ].map((item, i) => (
                          <div key={i}>
                            <h4 className="text-brand-neon font-sans text-[16px] font-bold uppercase tracking-wider mb-1">{item.name}</h4>
                            <p className="text-brand-white/80 font-sans text-[14px] uppercase tracking-widest leading-relaxed">{item.list}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* EXTRAS */}
                    <div>
                      <h3 className="text-brand-white font-display text-[22px] font-bold uppercase mb-10 tracking-[0.1em] border-b border-white/10 pb-4">
                        EXTRAS
                      </h3>
                      <div className="space-y-6">
                        {[
                          { name: "Dipping Sauce", list: "Ranch, Blue Cheese, Garlic Butter, Marinara, Buffalo" },
                          { name: "Extra Toppings", list: "Available for any pizza or calzone" },
                          { name: "Plates & Napkins", list: "Complimentary with any order" },
                        ].map((item, i) => (
                          <div key={i}>
                            <h4 className="text-brand-neon font-sans text-[16px] font-bold uppercase tracking-wider mb-1">{item.name}</h4>
                            <p className="text-brand-white/80 font-sans text-[14px] uppercase tracking-widest leading-relaxed">{item.list}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 11: FINAL CTA */}
              <section className="relative min-h-screen flex items-center justify-center bg-brand-black overflow-hidden relative border-t border-white/10">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=2000"
                    alt="Final Pizza Shot"
                    className="w-full h-full object-cover opacity-30 grayscale"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-brand-black/80" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 px-6">
                  <h2 className="font-display text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] uppercase text-brand-neon flex flex-col items-center tracking-[0.05em] drop-shadow-[0_2px_40px_rgba(0,0,0,0.95)]">
                    <span>YOU HUNGRY?</span>
                    <span>THEN ORDER.</span>
                  </h2>
                  <p className="text-lg lg:text-[18px] max-w-[400px] mx-auto text-brand-white mb-16 leading-tight uppercase font-sans font-normal tracking-widest text-center">
                    Borger and Fritch. Local favorite for a reason.
                    <br />
                    Get it hot, fresh, and delivered.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
                    <button
                      onClick={startOrder}
                      className="bg-brand-red text-brand-white px-16 py-8 text-3xl font-display uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl rounded-none border-none"
                    >
                      Order Now
                    </button>
                    <a
                      href="tel:8062747200"
                      className="bg-transparent border-4 border-brand-neon text-brand-neon px-16 py-8 text-3xl font-display uppercase tracking-widest hover:bg-brand-neon hover:text-brand-black transition-all text-center"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </section>
            </main>

            <Footer />
          </motion.div>
        ) : view === "about" ? (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-brand-black min-h-screen"
          >
            {/* SECTION 1: HERO */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-brand-black px-6 pt-0 pb-20 overflow-visible">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                  alt="Kitchen Action"
                  className="w-full h-full object-cover opacity-40 grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-black/60" />
              </div>

              <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                <span className="eyebrow">
                  OUR STORY
                </span>
                <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] uppercase text-brand-neon flex flex-col items-center w-full break-normal text-center mt-0">
                  <span>THIS ISN'T</span>
                  <span>A CHAIN. THIS IS</span>
                  <span>
                    <span className="text-brand-red">JESSE'S</span>.
                  </span>
                </h1>
                <p className="text-brand-white text-[16px] lg:text-[22px] leading-[1.6] max-w-[320px] lg:max-w-2xl mx-auto text-center font-sans normal-case">
                  Built from the ground up with one goal: make pizza people
                  actually come back for.
                </p>
              </div>
            </section>

            {/* SECTION 2: THE STORY — VISUAL TIMELINE */}
            <section className="bg-brand-concrete py-[120px] px-6 noise-overlay border-y border-white/5">
              <div className="max-w-[1200px] mx-auto">
                <span className="eyebrow">
                  THE BEGINNING
                </span>
                <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon text-center mb-24 uppercase max-w-[800px] mx-auto">
                  HOW IT STARTED.
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[
                    {
                      num: "01",
                      title: "Jesse got tired of bad pizza",
                      detail: "Light toppings. Rushed food. Not worth it.",
                    },
                    {
                      num: "02",
                      title: "So he decided to do it differently",
                      detail: "No investors. No franchise. Just a standard.",
                    },
                    {
                      num: "03",
                      title: "People tried it. They came back",
                      detail: "And Jesse's became the spot.",
                    },
                  ].map((panel, idx) => (
                    <div
                      key={idx}
                      className="bg-brand-black p-12 border-l-4 lg:border-l-0 lg:border-t-4 border-brand-neon relative group"
                    >
                      <span className="font-display text-6xl text-brand-neon mb-8 block">
                        {panel.num}
                      </span>
                      <h3 className="text-brand-neon text-[20px] font-[700] mb-4 leading-tight">
                        {panel.title}
                      </h3>
                      <p className="text-brand-white text-[15px] font-[400] truncate">
                        {panel.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 3: FULL BLEED IMAGE BREAK */}
            <section className="w-full relative h-[250px] lg:h-[400px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&q=80&w=2000"
                alt="Pizza Action"
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </section>

            {/* SECTION 4: THE STANDARD */}
            <section className="bg-brand-black py-[160px] px-6 noise-overlay">
              <div className="max-w-[1200px] mx-auto text-center">
                <span className="eyebrow">
                  OUR CODE
                </span>
                <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon mb-24 uppercase max-w-[800px] mx-auto">
                  THE STANDARD.
                </h2>

                <div className="space-y-12">
                  <div className="py-12 border-t border-brand-neon max-w-[580px] mx-auto">
                    <p className="text-brand-white text-[18px] lg:text-[20px] font-[700] leading-none tracking-[0px]">
                      If Jesse wouldn't eat it, it doesn't go out.
                    </p>
                  </div>
                  <div className="py-12 border-t border-brand-neon max-w-[580px] mx-auto">
                    <p className="text-brand-white text-[18px] lg:text-[20px] font-[700] leading-none tracking-[0px]">
                      No cutting corners when it gets busy.
                    </p>
                  </div>
                  <div className="py-12 border-t border-brand-neon max-w-[580px] mx-auto">
                    <p className="text-brand-white text-[18px] lg:text-[20px] font-[700] leading-none tracking-[0px]">
                      No skimping because nobody's watching.
                    </p>
                  </div>
                  <div className="py-12 border-t border-brand-neon max-w-[580px] mx-auto">
                    <p className="text-brand-neon text-[18px] lg:text-[20px] font-[700] leading-none tracking-[0px]">
                      The standard doesn't move.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 5: WHY JESSE'S EXISTS */}
            <section className="bg-brand-concrete py-[120px] px-6 noise-overlay border-y border-white/5">
              <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="lg:pr-20 lg:border-r-2 border-brand-neon">
                  <span className="eyebrow">
                    MISSION
                  </span>
                  <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon mb-8 uppercase max-w-[800px]">
                    WHY WE EXIST.
                  </h2>
                  <p className="text-brand-white text-[16px] lg:text-[18px] font-[400] leading-[1.7] tracking-[0px] max-w-[580px]">
                    For people who are done settling for pizza that doesn't
                    deliver.
                  </p>
                </div>

                <div className="space-y-12">
                  {[
                    "Loaded toppings. Not a suggestion of them.",
                    "Fresh dough. Every order. No shortcuts.",
                    "Consistent quality. Whether it's busy or not.",
                  ].map((point, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <span className="text-brand-neon text-3xl font-black">
                        →
                      </span>
                      <p className="text-brand-white text-[20px] lg:text-[24px] font-[700] leading-tight text-brand-neon">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 6: LOCATIONS */}
            <section className="bg-brand-black py-[120px] px-6 noise-overlay border-b border-white/5">
              <div className="max-w-[1200px] mx-auto">
                <span className="eyebrow">
                  FIND US
                </span>
                <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon text-center mb-24 uppercase max-w-[800px] mx-auto">
                  TWO LOCATIONS.
                  <br />
                  ONE STANDARD.
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {[
                    {
                      city: "Borger",
                      address: "530 W 3rd St, Borger, TX 79007",
                      phone: "(806) 274-7200",
                    },
                    {
                      city: "Fritch",
                      address: "424 E Broadway St, Fritch, TX 79036",
                      phone: "(806) 857-0098",
                    },
                  ].map((loc, idx) => (
                    <div
                      key={idx}
                      className="bg-brand-concrete p-12 noise-overlay border border-white/5"
                    >
                      <h3 className="text-brand-neon text-[20px] font-[700] mb-6">
                        {loc.city}
                      </h3>
                      <div className="mb-12">
                        <p className="text-brand-white text-[18px] lg:text-[20px] font-[700] mb-1 tracking-[0px]">
                          Jesse's Pizza Company
                        </p>
                        <p className="text-brand-white text-[15px] font-[400] opacity-60 mb-4">
                          {loc.address}
                        </p>
                        <a
                          href={`tel:${loc.phone.replace(/\D/g, "")}`}
                          className="text-brand-white text-[16px] lg:text-[18px] font-[400] leading-[1.7] tracking-[0px] hover:text-brand-neon transition-colors block underline decoration-2 underline-offset-4"
                        >
                          {loc.phone}
                        </a>
                      </div>
                      <span className="eyebrow">
                        Ready in 20 minutes
                      </span>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={startOrder}
                          className="bg-brand-red text-brand-white px-8 py-5 text-[15px] font-[700] uppercase tracking-[1px] flex-1 hover:brightness-110 active:scale-95 transition-all shadow-xl"
                        >
                          ORDER ONLINE
                        </button>
                        <a
                          href={`tel:${loc.phone.replace(/\D/g, "")}`}
                          className="border-2 border-brand-neon text-brand-neon px-8 py-5 text-[15px] font-[700] uppercase tracking-[1px] flex-1 text-center hover:bg-brand-neon hover:text-brand-black active:scale-95 transition-all"
                        >
                          CALL NOW
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 7: FULL BLEED IMAGE BREAK */}
            <section className="w-full relative h-[250px] lg:h-[400px] overflow-hidden border-b border-white/5">
              <img
                src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=2000"
                alt="Staff Working"
                className="w-full h-full object-cover grayscale opacity-80"
                referrerPolicy="no-referrer"
              />
            </section>

            {/* SECTION 8: TEAM */}
            <section className="bg-brand-concrete py-[120px] px-6 noise-overlay border-b border-white/5">
              <div className="max-w-[1200px] mx-auto">
                <div className="text-center mb-24">
                  <span className="eyebrow">
                    THE CREW
                  </span>
                  <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon mb-8 uppercase max-w-[800px] mx-auto">
                    THE PEOPLE BEHIND IT.
                  </h2>
                  <p className="text-brand-white text-[16px] lg:text-[18px] font-[400] leading-[1.7] tracking-[0px] opacity-80 italic text-center mx-auto max-w-[580px]">
                    Good pizza doesn't happen by accident.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {[
                    {
                      name: "Marc Alvarez",
                      role: "General Manager, Borger",
                      bio: "Makes sure every order leaves Borger right.",
                      img: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62",
                    },
                    {
                      name: "Tyler Jenkins",
                      role: "General Manager, Fritch",
                      bio: "Keeps Fritch running tight from open to close.",
                      img: "https://images.unsplash.com/photo-1556740758-90de374c12ad",
                    },
                    {
                      name: "Ashley Romero",
                      role: "Operations Manager",
                      bio: "Oversees both locations. Keeps the standard consistent.",
                      img: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
                    },
                    {
                      name: "Chris Dalton",
                      role: "Kitchen Lead",
                      bio: "Nothing leaves the kitchen unless it's built right.",
                      img: "https://images.unsplash.com/photo-1556157382-97dee2dcbfe6",
                    },
                  ].map((member, idx) => (
                    <div
                      key={idx}
                      className="bg-brand-black overflow-hidden flex flex-col group border border-white/5 transition-all hover:border-brand-neon"
                    >
                      <div className="relative h-[200px] overflow-hidden">
                        <img
                          src={`${member.img}?auto=format&fit=crop&q=80&w=600`}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 transition-all duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-black to-transparent opacity-80" />
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                          <h4 className="text-brand-neon text-[20px] font-[700] uppercase tracking-widest">
                            {member.name}
                          </h4>
                        </div>
                      </div>
                      <div className="p-8">
                        <p className="text-brand-white text-[15px] font-[500] mb-4 italic tracking-widest">
                          {member.role}
                        </p>
                        <p className="text-brand-white text-[15px] font-[400] opacity-60 leading-[1.7] truncate">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 9: TEAM PHOTOS */}
            <section className="bg-brand-black py-[120px] px-0 noise-overlay border-b border-white/5">
              <span className="eyebrow">
                GALLERY
              </span>
              <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon text-center mb-24 uppercase px-6 max-w-[800px] mx-auto">
                OUR CREW.
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
                <div className="relative h-[300px] lg:h-[500px] overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105"
                    alt="Borger Team"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-brand-black/80 py-4 px-6 text-center">
                    <span className="eyebrow">
                      BORGER TEAM
                    </span>
                  </div>
                </div>
                <div className="relative h-[300px] lg:h-[500px] overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=1200"
                    className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-105"
                    alt="Fritch Team"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-brand-black/80 py-4 px-6 text-center">
                    <span className="eyebrow">
                      FRITCH TEAM
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-brand-concrete py-[120px] px-6 noise-overlay border-b border-white/5">
              <div className="max-w-[1200px] mx-auto">
                <span className="eyebrow">
                  REVIEWS
                </span>
                <h2 className="font-display text-[36px] lg:text-[52px] font-[800] tracking-[-1px] leading-[1.0] text-brand-neon text-center mb-24 uppercase max-w-[800px] mx-auto">
                  WHAT LOCALS SAY.
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  {[
                    "Best pizza in Borger. Not even close. I've tried everything else. This is the one.",
                    "Ordered the Jalapeño Popper on a Friday. Ordered it again Sunday. That's all I need to say.",
                    "Once you eat here the chains are done for you.",
                    "Loaded every single time. Never once been disappointed.",
                  ].map((review, idx) => (
                    <div
                      key={idx}
                      className="bg-brand-black p-12 flex flex-col items-center text-center border-b-8 border-brand-neon noise-overlay"
                    >
                      <span className="font-display text-[60px] text-brand-neon leading-none mb-4 italic">
                        "
                      </span>
                      <p className="text-brand-white text-[16px] lg:text-[18px] font-[400] leading-[1.7] tracking-[0px]">
                        {review}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* SECTION 11: FINAL CTA */}
            <section className="relative h-screen flex items-center justify-center bg-brand-black overflow-hidden border-t-8 border-brand-red">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
                  alt="Final Pizza Shot"
                  className="w-full h-full object-cover opacity-40 grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-brand-black/60" />
              </div>

              <div className="w-full text-center relative z-10 px-6">
                <div className="flex justify-center gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-brand-neon text-brand-neon"
                    />
                  ))}
                </div>
                <span className="eyebrow">
                  NEXT STEPS
                </span>
                <h1 className="font-display text-[52px] lg:text-[80px] xl:text-[96px] font-[900] tracking-[-2px] leading-[0.9] text-brand-neon mb-12 uppercase text-center mx-auto italic">
                  IF YOU HAVEN'T
                  <br />
                  <span className="text-brand-red">TRIED IT</span> YET,
                  <br />
                  NOW'S THE TIME.
                </h1>
                <p className="text-brand-white text-[18px] font-[400] leading-[1.7] tracking-[0px] mb-16 max-w-[580px] mx-auto text-center">
                  Two locations. Ready in 20 minutes. Zero shortcuts.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-8 items-center">
                  <button
                    onClick={startOrder}
                    className="bg-brand-red text-brand-white px-20 py-8 text-[15px] font-[700] uppercase tracking-[1px] shadow-[0_20px_50px_rgba(214,40,40,0.3)] hover:scale-105 active:scale-95 transition-all min-w-[320px]"
                  >
                    ORDER NOW
                  </button>
                  <a
                    href="tel:8062747200"
                    className="border-4 border-brand-neon text-brand-neon px-20 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all text-center min-w-[320px]"
                  >
                    CALL NOW
                  </a>
                </div>
              </div>
            </section>

            <Footer />
          </motion.div>
        ) : view === "locations" ? (
          <motion.div
            key="locations"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-brand-black min-h-screen noise-overlay"
          >
            {/* Persistence: nav removed */}

            <main className="bg-brand-black">
              {/* SECTION 1: HERO */}
              <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-brand-black px-6 pt-0 pb-20 overflow-visible noise-overlay">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1593504049359-74330189a355?auto=format&fit=crop&q=80&w=2000"
                    alt="Loaded Pizza Close-Up"
                    className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/65" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                  <div className="inline-flex items-center justify-center bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 whitespace-nowrap mb-3 gap-2 sm:gap-4 w-auto shadow-2xl relative overflow-hidden group self-center mt-0">
                    <div className="absolute inset-0 noise-overlay opacity-10 pointer-events-none" />
                    <span className="font-display text-2xl sm:text-4xl text-white leading-none pt-1">
                      4.6
                    </span>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-[22px] sm:h-[22px] fill-[#B8F000] text-[#B8F000] shrink-0"
                        />
                      ))}
                      <div className="relative">
                        <Star className="w-4 h-4 sm:w-[22px] sm:h-[22px] text-white/20 shrink-0" />
                        <div className="absolute inset-0 overflow-hidden w-[60%]">
                          <Star
                            className="w-4 h-4 sm:w-[22px] sm:h-[22px] fill-[#B8F000] text-[#B8F000] shrink-0"
                          />
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-[14px] font-black text-white leading-none uppercase tracking-[1px] sm:tracking-[2px]">
                      867 Combined Reviews
                    </span>
                  </div>

                  <span className="eyebrow">
                    BORGER & FRITCH, TX
                  </span>
                  <h1 className="font-display text-[64px] lg:text-[128px] xl:text-[160px] leading-[0.95] tracking-[-2px] uppercase text-brand-neon mb-6 w-full text-center mt-0">
                    FIND YOUR
                    <br />
                    LOCATION.
                  </h1>
                  <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[600px] mx-auto text-brand-white font-sans text-center normal-case mb-4">
                    Two locations. One standard. Pick the one closest to you and
                    start your order.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto px-6 sm:px-0">
                    <button
                      onClick={() => {
                        setLocation("Borger");
                        startOrder();
                      }}
                      className="bg-brand-red text-brand-white w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Order Now — Borger
                    </button>
                    <button
                      onClick={() => {
                        setLocation("Fritch");
                        startOrder();
                      }}
                      className="border-2 border-brand-neon text-brand-neon w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all shadow-2xl text-center"
                    >
                      Order Now — Fritch
                    </button>
                  </div>
                </div>
              </section>

              {/* SECTION 2: LOCATION CARDS */}
              <section className="bg-brand-black px-6 py-24 noise-overlay">
                <div className="max-w-[1400px] mx-auto">
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* BORGER CARD */}
                    <div className="bg-brand-concrete p-8 lg:p-16 border border-white/5 noise-overlay relative flex flex-col h-full">
                      <div className="mb-12">
                        <h3 className="font-display text-[36px] text-brand-neon leading-[1.1] tracking-[-0.5px] uppercase mb-1">
                          BORGER
                        </h3>
                        <p className="text-[#F5F5F5] text-[16px] font-[400] mb-8">
                          Jesse's Pizza Company
                        </p>

                        <div className="space-y-6">
                          <p className="text-[#F5F5F5] text-[18px] font-[400] leading-relaxed">
                            530 W 3rd St
                            <br />
                            Borger, TX 79007
                          </p>

                          <a
                            href="tel:8062747200"
                            className="block text-[#F5F5F5] text-[24px] font-[700] hover:text-brand-neon transition-colors"
                          >
                            (806) 274-7200
                          </a>
                        </div>

                        <div className="mt-8">
                          <span className="eyebrow">
                            READY IN 20 MINUTES
                          </span>
                        </div>
                      </div>

                      <div className="h-[220px] w-full bg-brand-black/20 mb-12 relative overflow-hidden grayscale brightness-75 border border-white/5">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.062828282828!2d-101.389!3d35.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM5JzM2LjAiTiAxMDHCsDIzJzIwLjQiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                          title="Jesse's Pizza Borger Map"
                        ></iframe>
                      </div>

                      <div className="mt-auto space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <button
                            onClick={startOrder}
                            className="bg-brand-red text-brand-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                          >
                            Order Online
                          </button>
                          <a
                            href="tel:8062747200"
                            className="border-2 border-brand-neon text-brand-neon py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all text-center"
                          >
                            Call Now
                          </a>
                        </div>
                        <div className="text-center space-y-4">
                          <a
                            href="https://maps.google.com/?q=Jesse's+Pizza+Company+Borger"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[#F5F5F5] hover:text-brand-neon transition-colors uppercase text-[12px] font-bold tracking-widest"
                          >
                            Get Directions
                          </a>
                          <button
                            onClick={() => {
                              window.scrollTo(0, 0);
                              setView("borger-location");
                            }}
                            className="block text-[#F5F5F5]/60 hover:text-brand-white transition-colors text-[14px] mx-auto"
                          >
                            View full Borger location page →
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* FRITCH CARD */}
                    <div className="bg-brand-concrete p-8 lg:p-16 border border-white/5 noise-overlay relative flex flex-col h-full">
                      <div className="mb-12">
                        <h3 className="font-display text-[36px] text-brand-neon leading-[1.1] tracking-[-0.5px] uppercase mb-1">
                          FRITCH
                        </h3>
                        <p className="text-[#F5F5F5] text-[16px] font-[400] mb-8">
                          Jesse's Pizza Company
                        </p>

                        <div className="space-y-6">
                          <p className="text-[#F5F5F5] text-[18px] font-[400] leading-relaxed">
                            424 E Broadway St
                            <br />
                            Fritch, TX 79036
                          </p>

                          <a
                            href="tel:8068570098"
                            className="block text-[#F5F5F5] text-[24px] font-[700] hover:text-brand-neon transition-colors"
                          >
                            (806) 857-0098
                          </a>
                        </div>

                        <div className="mt-8">
                          <span className="eyebrow">
                            READY IN 20 MINUTES
                          </span>
                        </div>
                      </div>

                      <div className="h-[220px] w-full bg-brand-black/20 mb-12 relative overflow-hidden grayscale brightness-75 border border-white/5">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.062828282828!2d-101.6!3d35.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM4JzI0LjAiTiAxMDHCsDM2JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                          title="Jesse's Pizza Fritch Map"
                        ></iframe>
                      </div>

                      <div className="mt-auto space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <button
                            onClick={startOrder}
                            className="bg-brand-red text-brand-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                          >
                            Order Online
                          </button>
                          <a
                            href="tel:8068570098"
                            className="border-2 border-brand-neon text-brand-neon py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all text-center"
                          >
                            Call Now
                          </a>
                        </div>
                        <div className="text-center space-y-4">
                          <a
                            href="https://maps.google.com/?q=Jesse's+Pizza+Company+Fritch"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-[#F5F5F5] hover:text-brand-neon transition-colors uppercase text-[12px] font-bold tracking-widest"
                          >
                            Get Directions
                          </a>
                          <button
                            onClick={() => {
                              window.scrollTo(0, 0);
                              setView("fritch-location");
                            }}
                            className="block text-[#F5F5F5]/60 hover:text-brand-white transition-colors text-[14px] mx-auto"
                          >
                            View full Fritch location page →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 3: TRUST STRIP */}
              <section className="bg-brand-neon py-12 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 font-black text-brand-black text-[16px] uppercase">
                  <span>Same standard. Both locations.</span>
                  <div className="hidden lg:block w-2 h-2 rounded-full bg-brand-red" />
                  <span>Loaded every time. No exceptions.</span>
                  <div className="hidden lg:block w-2 h-2 rounded-full bg-brand-red" />
                  <span>Ready in 20 minutes or we'll tell you.</span>
                  <div className="hidden lg:block w-2 h-2 rounded-full bg-brand-red" />
                  <span>No shortcuts. No skimping. Ever.</span>
                </div>
              </section>

              {/* SECTION 4: IMAGE BREAK */}
              <section className="h-[250px] lg:h-[400px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000"
                  className="w-full h-full object-cover grayscale-[0.1]"
                  alt="Horizontal Loaded Pizza"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 5: MOST POPULAR */}
              <section className="bg-brand-concrete px-6 py-32 lg:py-48 noise-overlay">
                <div className="w-full">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-6 leading-[0.95] tracking-[-2px]">
                      WHILE YOU'RE HERE.
                    </h2>
                    <p className="text-[16px] lg:text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto text-center">
                      These are the pizzas both locations keep running out of
                      first.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {[
                      {
                        name: "JALAPEÑO POPPER",
                        desc: "Creamy heat. Serious kick. Loaded every time.",
                        price: '12" — $18.29 | 14" — $23.29',
                        image: "https://picsum.photos/seed/poppizza/800/600",
                        badge: "MOST POPULAR",
                      },
                      {
                        name: "CHICKEN BACON RANCH",
                        desc: "Bacon. Ranch. Chicken. Actually loaded.",
                        price: '12" — $18.29 | 14" — $23.29 | 18" — $26.99',
                        image: "https://picsum.photos/seed/ranchpizza/800/600",
                        badge: "MOST POPULAR",
                      },
                      {
                        name: 'THE 18" JUMBO',
                        desc: "Feeds everyone. Loaded edge to edge.",
                        price: "From $21.50",
                        image: "https://i.imgur.com/oz3N4dm.jpeg",
                        badge: "BEST VALUE",
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-brand-black border border-white/5 noise-overlay group relative h-full flex flex-col"
                      >
                        <div className="relative h-[240px] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-0 right-0 bg-brand-red text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest italic">
                            {item.badge}
                          </div>
                        </div>
                        <div className="p-8 flex-1 flex flex-col">
                          <h3 className="font-display text-[28px] lg:text-[36px] text-brand-neon uppercase leading-[1.1] tracking-[-0.5px] mb-4">
                            {item.name}
                          </h3>
                          <p className="text-[15px] text-[#F5F5F5] mb-4 line-clamp-1">
                            {item.desc}
                          </p>
                          <p className="text-[15px] font-[500] text-[#F5F5F5] mb-8">
                            {item.price}
                          </p>
                          <button
                            onClick={startOrder}
                            className="mt-auto bg-brand-red text-brand-white py-5 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: FINAL CTA */}
              <section className="relative h-screen flex items-center justify-center bg-brand-black overflow-hidden noise-overlay">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Loaded Pizza Close-Up"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/60" />
                </div>

                <div className="w-full mx-auto text-center relative z-10 px-6">
                  <h1 className="font-display text-[96px] lg:text-[128px] xl:text-[160px] leading-[0.95] tracking-[-2px] uppercase text-brand-neon mb-8">
                    READY TO
                    <br />
                    ORDER?
                  </h1>
                  <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[600px] mx-auto text-center mb-16">
                    Pick your location and have it ready in 20 minutes.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button
                      onClick={startOrder}
                      className="bg-brand-red text-brand-white px-16 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[280px]"
                    >
                      Order Now — Borger
                    </button>
                    <button
                      onClick={startOrder}
                      className="border-2 border-brand-neon text-brand-neon px-16 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all shadow-2xl min-w-[280px]"
                    >
                      Order Now — Fritch
                    </button>
                  </div>
                </div>
              </section>
            </main>

            <Footer />
          </motion.div>
        ) : view === "fritch-location" ? (
          <motion.div
            key="fritch-location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0D0D0D] min-h-screen noise-overlay"
          >
            <main className="bg-[#0D0D0D]">
              {/* SECTION 1: HERO */}
              <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[#0D0D0D] px-6 pt-0 pb-20 overflow-visible">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
                    alt="Fritch Pizza Close-up"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.2]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0D0D0D]/60" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                  <span className="eyebrow">
                    FRITCH, TX
                  </span>
                  <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] tracking-[-2px] sm:tracking-[0.05em] uppercase text-[#B8F000] flex flex-col items-center w-full break-normal text-center mt-0">
                    <span>FRITCH KNOWS</span>
                    <span>GOOD PIZZA.</span>
                    <span>
                      THIS IS IT. <span className="text-[#D62828]">PERIOD.</span>
                    </span>
                  </h1>
                  <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[600px] mx-auto text-[#F5F5F5] font-sans text-center normal-case">
                    Fresh. Loaded edge to edge. Ready in 20 minutes. No
                    shortcuts. No skimping. Ever.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mt-4">
                    <button
                      onClick={startOrder}
                      className="bg-[#D62828] text-white w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Order Now — Fritch
                    </button>
                    <a
                      href="tel:8068570098"
                      className="border-2 border-[#B8F000] text-[#B8F000] w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl text-center"
                    >
                      Call (806) 857-0098
                    </a>
                  </div>
                </div>
              </section>

              {/* SECTION 2: TRUST STRIP */}
              <section className="bg-[#B8F000] py-12 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 font-black text-[#0D0D0D] text-[16px] uppercase text-center lg:text-left">
                  <span>"Fritch's go-to pizza spot."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-[#D62828]" />
                  <span>"Loaded every single time."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-[#D62828]" />
                  <span>"Ready in 20 minutes or we'll tell you."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-[#D62828]" />
                  <span>"No chains. No shortcuts. Ever."</span>
                </div>
              </section>

              {/* SECTION 3: ENEMY SECTION */}
              <section className="bg-[#0D0D0D] px-6 py-[140px] noise-overlay">
                <div className="max-w-7xl mx-auto text-center">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-16 leading-[0.95] tracking-[-2px]">
                    YOU ALREADY
                    <br />
                    KNOW.
                  </h2>

                  <div className="space-y-[40px] mb-16">
                    <p className="text-[32px] font-bold text-[#F5F5F5] uppercase">
                      You've waited 45 minutes for it.
                    </p>
                    <p className="text-[32px] font-bold text-[#F5F5F5] uppercase">
                      Opened the box and felt let down.
                    </p>
                    <p className="text-[32px] font-bold text-[#B8F000] uppercase">
                      That ends here.
                    </p>
                  </div>

                  <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[500px] mx-auto text-center">
                    Jesse's Fritch location is built for people who are done
                    settling for pizza that doesn't deliver.
                  </p>
                </div>
              </section>

              {/* SECTION 4: FULL BLEED IMAGE BREAK */}
              <section className="relative h-[250px] lg:h-[400px] bg-[#0D0D0D] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1593504049359-7b7d92c72857?auto=format&fit=crop&q=80&w=2000"
                  alt="High Contrast Pizza"
                  className="w-full h-full object-cover grayscale-[0.2]"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 5: OFFER SECTION */}
              <section className="bg-[#2A2A2A] px-6 py-32 noise-overlay">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-6 leading-[0.95] tracking-[-2px]">
                      HERE'S EXACTLY
                      <br />
                      WHAT YOU'RE
                      <br />
                      GETTING.
                    </h2>
                    <p className="text-[18px] lg:text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto text-center">
                      Not "great pizza." Here's what that actually means.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'THE 18" JUMBO',
                        desc: "Loaded edge to edge. Feeds everyone.",
                        price: "From $21.50",
                        badge: "BEST VALUE",
                        img: "https://i.imgur.com/oz3N4dm.jpeg",
                      },
                      {
                        title: "WINGS",
                        desc: "Crispy, hot, and full of flavor.",
                        price: "8 ct $11.99 | 12 ct $16.99 | 18 ct $23.99",
                        badge: "MOST POPULAR",
                        img: "https://picsum.photos/seed/wingsfit/600/600",
                      },
                      {
                        title: "JALAPEÑO POPPER",
                        desc: "Creamy heat. Serious kick. Always loaded.",
                        price: '12" — $18.29 | 14" — $23.29',
                        badge: "MOST POPULAR",
                        img: "https://picsum.photos/seed/poppaf/600/600",
                      },
                      {
                        title: "WINGS + PIZZA DEAL",
                        desc: "Wings (12 ct) + Large Pizza.",
                        price: "$45.99",
                        badge: "BEST VALUE",
                        img: "https://picsum.photos/seed/famfit/600/600",
                      },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="bg-[#0D0D0D] border border-white/5 noise-overlay relative flex flex-col group overflow-hidden"
                      >
                        <div className="h-[240px] relative overflow-hidden">
                          <img
                            src={card.img}
                            alt={card.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-0 right-0 bg-[#D62828] text-white px-4 py-2 font-black text-[12px] tracking-widest uppercase">
                            {card.badge}
                          </div>
                        </div>
                        <div className="p-8 lg:p-12 flex-1 flex flex-col">
                          <h3 className="font-display text-[28px] lg:text-[36px] text-[#B8F000] leading-[1.1] tracking-[-0.5px] uppercase mb-4">
                            {card.title}
                          </h3>
                          <p className="text-[16px] lg:text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] mb-4">
                            {card.desc}
                          </p>
                          <p className="text-[#B8F000] font-bold text-[20px] mb-12 uppercase italic">
                            {card.price}
                          </p>
                          <button
                            onClick={startOrder}
                            className="mt-auto w-full bg-[#D62828] text-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all"
                          >
                            Order Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: SPECIFICITY STRIP */}
              <section className="bg-[#2A2A2A] py-12 px-6 overflow-hidden border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 font-bold text-[#B8F000] text-[16px] uppercase text-center lg:text-left">
                  <span>"Fritch's go-to pizza spot for a reason."</span>
                  <div className="hidden lg:block w-2 h-2 rounded-full bg-[#D62828]" />
                  <span>"The Jumbo feeds five. Most people order two."</span>
                  <div className="hidden lg:block w-2 h-2 rounded-full bg-[#D62828]" />
                  <span>
                    "Same toppings on the 8\" as the 18\". No skimping."
                  </span>
                  <div className="hidden lg:block w-2 h-2 rounded-full bg-[#D62828]" />
                  <span>"Ready in 20 minutes or we'll tell you first."</span>
                </div>
              </section>

              {/* SECTION 7: OBJECTION REMOVAL */}
              <section className="bg-[#0D0D0D] px-6 py-[160px] noise-overlay">
                <div className="max-w-[600px] mx-auto text-center">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-16 leading-[0.95] tracking-[-2px]">
                    STILL NOT
                    <br />
                    SURE?
                  </h2>

                  <div className="space-y-6 mb-16">
                    <p className="text-[20px] text-[#F5F5F5]">
                      Order once from our Fritch location.
                    </p>
                    <p className="text-[20px] text-[#F5F5F5]">
                      If it's not the best pizza you've had in town, call us and
                      tell us.
                    </p>
                    <p className="text-[20px] text-[#F5F5F5]">
                      We'd rather hear it than lose you.
                    </p>
                  </div>

                  <p className="text-[14px] text-[#F5F5F5] mb-16 opacity-60">
                    That's not a guarantee written by a lawyer. That's just how
                    we operate.
                  </p>

                  <button
                    onClick={startOrder}
                    className="bg-[#D62828] text-white px-16 py-8 text-[18px] font-[700] uppercase tracking-[2px] shadow-2xl hover:scale-105 active:scale-95 transition-all w-full lg:w-auto"
                  >
                    Order Now and Find Out
                  </button>
                </div>
              </section>

              {/* SECTION 8: FULL BLEED IMAGE BREAK */}
              <section className="relative h-[250px] lg:h-[400px] bg-[#0D0D0D] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&q=80&w=2000"
                  alt="Wings Close-up Action"
                  className="w-full h-full object-cover contrast-125"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 9: SOCIAL PROOF */}
              <section className="bg-[#2A2A2A] px-6 py-32 noise-overlay">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-6 leading-[0.95] tracking-[-2px]">
                      WHAT FRITCH
                      <br />
                      IS SAYING.
                    </h2>
                    <p className="text-[18px] lg:text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto text-center">
                      These aren't cherry picked. This is just what happens when
                      the food is good.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {[
                      "Best pizza around. Worth every drive from Sanford.",
                      "Wings always crispy. Pizza always loaded. Never had a bad order.",
                      "Chains are done for me. Once you eat here you can't go back.",
                      "Consistently good. Every single visit. That's all you can ask for.",
                    ].map((review, i) => (
                      <div
                        key={i}
                        className="bg-[#0D0D0D] p-12 lg:p-16 border border-white/5 noise-overlay relative flex flex-col items-center text-center"
                      >
                        <span className="font-display text-[#B8F000] text-[80px] leading-none mb-6">
                          "
                        </span>
                        <p className="text-[24px] text-[#F5F5F5] font-[400] leading-relaxed mb-6 italic">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 10: LOCATION INFO */}
              <section className="bg-[#0D0D0D] px-6 py-32 noise-overlay">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-6 leading-[0.95] tracking-[-2px]">
                      FIND US IN
                      <br />
                      FRITCH.
                    </h2>
                  </div>

                  <div className="max-w-[700px] mx-auto bg-[#2A2A2A] border border-white/5 noise-overlay overflow-hidden">
                    <div className="p-8 lg:p-12 space-y-8">
                      <div className="text-[#F5F5F5] text-center">
                        <h3 className="font-display text-[32px] text-white uppercase mb-4">
                          Jesse's Pizza Company
                        </h3>
                        <p className="text-[18px] opacity-80 mb-6">
                          424 E Broadway St
                          <br />
                          Fritch, TX 79036
                        </p>
                        <a
                          href="tel:8068570098"
                          className="block text-[24px] font-[700] text-white hover:text-[#B8F000] transition-colors mb-6"
                        >
                          (806) 857-0098
                        </a>
                        <p className="text-[#B8F000] text-[12px] font-black tracking-[0.6em] uppercase mb-10">
                          READY IN 20 MINUTES.
                        </p>
                      </div>

                      <div className="h-[280px] w-full bg-[#0D0D0D] relative overflow-hidden grayscale brightness-75">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.062828282828!2d-101.6!3d35.64!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM4JzI0LjAiTiAxMDHCsDM2JzAwLjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                          className="w-full h-full border-0 absolute inset-0"
                          allowFullScreen
                          loading="lazy"
                          title="Jesse's Pizza Fritch Map Location"
                        ></iframe>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={startOrder}
                          className="w-full bg-[#D62828] text-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Order Online
                        </button>
                        <a
                          href="tel:8068570098"
                          className="block w-full border-2 border-[#B8F000] text-[#B8F000] py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all text-center"
                        >
                          Call Now
                        </a>
                        <a
                          href="https://maps.google.com/?q=Jesse's+Pizza+Company+Fritch"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[#F5F5F5] hover:text-[#B8F000] transition-colors uppercase text-[12px] font-bold tracking-widest text-center"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>

                  <p className="mt-12 text-[#F5F5F5] opacity-60 text-[14px] text-center max-w-[600px] mx-auto uppercase tracking-widest leading-loose">
                    Serving Fritch, Sanford, Borger, Stinnett, and Lake Meredith
                    Area.
                  </p>
                </div>
              </section>

              {/* SECTION 11: FAQ */}
              <section className="bg-[#2A2A2A] px-6 py-32 noise-overlay border-t border-white/5">
                <div className="max-w-[800px] mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-8 leading-[0.95] tracking-[-2px]">
                      FRITCH PIZZA
                      <br />
                      QUESTIONS.
                      <br />
                      ANSWERED.
                    </h2>
                  </div>

                  <div className="space-y-16">
                    {[
                      {
                        q: "What is the best pizza in Fritch, TX?",
                        a: "If you want loaded toppings, big portions, and pizza worth ordering again, Jesse's on E Broadway St is Fritch's go-to spot.",
                      },
                      {
                        q: "How fast is pickup at the Fritch location?",
                        a: "Most orders ready in 20 minutes or less. Order online or call ahead.",
                      },
                      {
                        q: "What makes Jesse's different from chains?",
                        a: "We make pizza for the people in Fritch. Loaded toppings. Fresh dough. Consistent quality every single time.",
                      },
                      {
                        q: "Do you deliver in Fritch?",
                        a: "Check our online ordering system for current delivery availability in your area.",
                      },
                      {
                        q: "Where is Jesse's Pizza Company in Fritch?",
                        a: "424 E Broadway St, Fritch, TX 79036. Right on Broadway. Hard to miss.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="space-y-4">
                        <h3 className="font-display text-[#B8F000] text-[20px] uppercase leading-tight tracking-wide">
                          {item.q}
                        </h3>
                        <p className="text-[#F5F5F5] text-[16px] font-[400] leading-[1.7]">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 12: FINAL CLOSE */}
              <section className="relative h-screen flex items-center justify-center bg-[#0D0D0D] overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2002"
                    alt="Loaded Pizza Close-Up Final"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0D0D0D]/85" />
                </div>

                <div className="w-full mx-auto text-center relative z-10 px-6">
                  <h1 className="font-display text-[96px] lg:text-[128px] xl:text-[160px] leading-[0.95] tracking-[-2px] uppercase text-[#B8F000] mb-8">
                    YOU'RE GOING
                    <br />
                    TO EAT TONIGHT
                    <br />
                    ANYWAY.
                  </h1>
                  <p className="text-[20px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[600px] mx-auto text-center mb-16 px-4">
                    The only question is whether it's going to be worth it.
                    Order from our Fritch location. Pick it up in 20 minutes.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button
                      onClick={startOrder}
                      className="bg-[#D62828] text-white px-16 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[280px]"
                    >
                      Order Now — Fritch
                    </button>
                    <a
                      href="tel:8068570098"
                      className="border-2 border-[#B8F000] text-[#B8F000] px-16 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl min-w-[280px] text-center"
                    >
                      Call (806) 857-0098
                    </a>
                  </div>
                </div>
              </section>
            </main>

            <Footer />

            {/* MOBILE STICKY CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 bg-[#0D0D0D]/90 backdrop-blur-md border-t border-white/10 pointer-events-none">
              <button
                onClick={startOrder}
                className="w-full bg-[#D62828] text-white py-6 font-display text-2xl uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all pointer-events-auto"
              >
                ORDER NOW — FRITCH
              </button>
            </div>
          </motion.div>
        ) : view === "borger-location" ? (
          <motion.div
            key="borger-location"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-brand-black min-h-screen noise-overlay"
          >
            <main className="bg-brand-black">
              {/* SECTION 1: HERO */}
              <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-brand-black px-6 pt-0 pb-20 overflow-visible noise-overlay">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Borger Loaded Pizza"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.3]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/60" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                  <span className="eyebrow">
                    BORGER, TX
                  </span>
                  <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] tracking-[-2px] sm:tracking-[0.05em] uppercase text-brand-neon flex flex-col items-center w-full break-normal text-center mt-0">
                    <span>NAME A BETTER</span>
                    <span>PIZZA IN</span>
                    <span>BORGER.</span>
                    <span>
                      WE'LL <span className="text-brand-red">WAIT.</span>
                    </span>
                  </h1>
                  <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[600px] mx-auto text-brand-white font-sans text-center normal-case">
                    Fresh. Loaded edge to edge. Ready in 20 minutes. No
                    shortcuts. No skimping. Ever.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mt-4">
                    <button
                      onClick={startOrder}
                      className="bg-brand-red text-brand-white w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Order Now — Borger
                    </button>
                    <a
                      href="tel:8062747200"
                      className="border-2 border-brand-neon text-brand-neon w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all shadow-2xl text-center"
                    >
                      Call (806) 274-7200
                    </a>
                  </div>
                </div>
              </section>

              {/* SECTION 2: TRUST STRIP */}
              <section className="bg-brand-neon py-12 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 font-black text-brand-black text-[16px] uppercase text-center lg:text-left">
                  <span>"Borger's go-to pizza spot."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-brand-red shrink-0" />
                  <span>"Loaded every single time."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-brand-red shrink-0" />
                  <span>"Ready in 20 minutes or we'll tell you."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-brand-red shrink-0" />
                  <span>"No chains. No shortcuts. Ever."</span>
                </div>
              </section>

              {/* SECTION 3: ENEMY SECTION */}
              <section className="bg-brand-black px-6 py-32 lg:py-[140px] noise-overlay text-center">
                <div className="max-w-4xl mx-auto">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-20 leading-[0.95] tracking-[-2px]">
                    YOU ALREADY
                    <br />
                    KNOW.
                  </h2>

                  <div className="space-y-[40px] mb-20">
                    <p className="text-brand-white font-bold text-[28px] lg:text-[32px] uppercase">
                      You've waited 45 minutes for it.
                    </p>
                    <p className="text-brand-white font-bold text-[28px] lg:text-[32px] uppercase">
                      Opened the box and felt let down.
                    </p>
                    <p className="text-brand-neon font-bold text-[28px] lg:text-[32px] uppercase">
                      That ends here.
                    </p>
                  </div>

                  <p className="text-[18px] text-brand-white font-[400] leading-[1.7] max-w-[500px] mx-auto">
                    Jesse's Borger location is built for people who are done
                    settling for pizza that doesn't deliver.
                  </p>
                </div>
              </section>

              {/* SECTION 4: FULL BLEED IMAGE BREAK */}
              <section className="h-[250px] lg:h-[400px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                  className="w-full h-full object-cover"
                  alt="Fresh Loaded Pizza"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 5: OFFER SECTION */}
              <section className="bg-brand-concrete px-6 py-32 lg:py-48 noise-overlay">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-6 leading-[0.95] tracking-[0.05em]">
                      HERE'S EXACTLY
                      <br />
                      WHAT YOU'RE
                      <br />
                      GETTING.
                    </h2>
                    <p className="text-[16px] lg:text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto">
                      Not "great pizza." Here's what that actually means.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Card 1 */}
                    <div className="bg-brand-black border border-white/5 noise-overlay relative flex flex-col h-full group">
                      <div className="relative h-[240px] overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=800"
                          alt="18 inch Jumbo Pizza"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-brand-red text-brand-white text-[10px] font-black px-4 py-2 uppercase tracking-widest italic z-10">
                          BEST VALUE
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="font-display text-[28px] lg:text-[36px] text-brand-neon uppercase leading-[1.1] tracking-[0.05em] mb-4 relative z-10">
                          THE 18" JUMBO
                        </h3>
                        <p className="text-[16px] text-brand-white mb-2 font-sans font-black uppercase tracking-wider relative z-10">
                          Loaded edge to edge. Feeds everyone.
                        </p>
                        <p className="text-[16px] text-brand-white mb-8 font-display tracking-wide relative z-10">
                          From $21.50
                        </p>
                        <button
                          onClick={startOrder}
                          className="mt-auto bg-brand-red text-brand-white py-5 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-brand-black border border-white/5 noise-overlay relative flex flex-col h-full group">
                      <div className="relative h-[240px] overflow-hidden">
                        <img
                          src="https://picsum.photos/seed/poppizza/800/600"
                          alt="Jalapeño Popper Pizza"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-brand-red text-brand-white text-[10px] font-black px-4 py-2 uppercase tracking-widest italic z-10">
                          MOST POPULAR
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="font-display text-[28px] lg:text-[36px] text-brand-neon uppercase leading-[1.1] tracking-[0.05em] mb-4 relative z-10">
                          JALAPEÑO POPPER
                        </h3>
                        <p className="text-[16px] text-brand-white mb-2 font-sans font-black uppercase tracking-wider relative z-10">
                          Creamy heat. Serious kick. Always loaded.
                        </p>
                        <p className="text-[16px] text-brand-white mb-8 font-display tracking-wide relative z-10">
                          12" — $18.29 | 14" — $23.29
                        </p>
                        <button
                          onClick={startOrder}
                          className="mt-auto bg-brand-red text-brand-white py-5 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-brand-black border border-white/5 noise-overlay relative flex flex-col h-full group">
                      <div className="relative h-[240px] overflow-hidden">
                        <img
                          src="https://picsum.photos/seed/ranchpizza/800/600"
                          alt="Chicken Bacon Ranch Pizza"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-brand-red text-brand-white text-[10px] font-black px-4 py-2 uppercase tracking-widest italic z-10">
                          MOST POPULAR
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="font-display text-[28px] lg:text-[36px] text-brand-neon uppercase leading-[1.1] tracking-[0.05em] mb-4 relative z-10">
                          CHICKEN BACON RANCH
                        </h3>
                        <p className="text-[16px] text-brand-white mb-2 font-sans font-black uppercase tracking-wider relative z-10">
                          Bacon. Ranch. Chicken. Actually loaded.
                        </p>
                        <p className="text-[16px] text-brand-white mb-8 font-display tracking-wide relative z-10">
                          12" — $18.29 | 14" — $23.29 | 18" — $26.99
                        </p>
                        <button
                          onClick={startOrder}
                          className="mt-auto bg-brand-red text-brand-white py-5 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-brand-black border border-white/5 noise-overlay relative flex flex-col h-full group">
                      <div className="relative h-[240px] overflow-hidden">
                        <img
                          src="https://picsum.photos/seed/familypizza/800/600"
                          alt="Family Deal"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-0 right-0 bg-brand-red text-brand-white text-[10px] font-black px-4 py-2 uppercase tracking-widest italic z-10">
                          BEST VALUE
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="font-display text-[28px] lg:text-[36px] text-brand-neon uppercase leading-[1.1] tracking-[0.05em] mb-4 relative z-10">
                          THE FAMILY DEAL
                        </h3>
                        <p className="text-[16px] text-brand-white mb-2 font-sans font-black uppercase tracking-wider relative z-10">
                          18" Jumbo + Cheezy Bread + 2 Liter.
                        </p>
                        <p className="text-[16px] text-brand-white mb-8 font-display tracking-wide relative z-10">
                          $34.99
                        </p>
                        <button
                          onClick={startOrder}
                          className="mt-auto bg-brand-red text-brand-white py-5 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 6: SPECIFICITY STRIP */}
              <section className="bg-brand-concrete py-12 px-6 border-y border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 font-bold text-brand-neon text-[16px] uppercase text-center lg:text-left">
                  <span>"Borger's go-to pizza spot for a reason."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-brand-red shrink-0" />
                  <span>"The Jumbo feeds five. Most people order two."</span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-brand-red shrink-0" />
                  <span>
                    "Same toppings on the 8\" as the 18\". No skimping."
                  </span>
                  <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-brand-red shrink-0" />
                  <span>"Ready in 20 minutes or we'll tell you first."</span>
                </div>
              </section>

              {/* SECTION 7: OBJECTION REMOVAL */}
              <section className="bg-brand-black px-6 py-[160px] noise-overlay text-center">
                <div className="max-w-[600px] mx-auto">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-12 leading-[0.95] tracking-[0.05em]">
                    STILL NOT
                    <br />
                    SURE?
                  </h2>

                  <div className="space-y-4 mb-16 text-[20px] text-brand-white font-[400] leading-relaxed">
                    <p>Order once from our Borger location.</p>
                    <p>
                      If it's not the best pizza you've had in town, call us and
                      tell us.
                    </p>
                    <p>We'd rather hear it than lose you.</p>
                  </div>

                  <p className="text-[14px] text-brand-white opacity-60 mb-16">
                    That's not a guarantee written by a lawyer. That's just how
                    we operate.
                  </p>

                  <button
                    onClick={startOrder}
                    className="bg-brand-red text-brand-white px-12 py-7 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    Order Now and Find Out
                  </button>
                </div>
              </section>

              {/* SECTION 8: FULL BLEED IMAGE BREAK */}
              <section className="h-[250px] lg:h-[400px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2001"
                  className="w-full h-full object-cover grayscale-[0.2]"
                  alt="Kitchen Action Shot"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 9: SOCIAL PROOF */}
              <section className="bg-brand-concrete px-6 py-32 lg:py-48 noise-overlay">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-6 leading-[0.95] tracking-[0.05em]">
                      WHAT BORGER
                      <br />
                      IS SAYING.
                    </h2>
                    <p className="text-[16px] lg:text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto">
                      These are aren't cherry picked. This is just what happens
                      when the food is good.
                    </p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {[
                      "Best pizza in Borger. Not even close. I've tried everything else. This is the one.",
                      "Ordered the Jalapeño Popper on a Friday. Ordered it again Sunday. That's all I need to say.",
                      "Chains are done for me. Once you eat here you can't go back.",
                      "Loaded every single time. Never once been disappointed.",
                    ].map((review, i) => (
                      <div
                        key={i}
                        className="bg-brand-black p-12 border border-white/5 noise-overlay relative flex flex-col items-center text-center"
                      >
                        <span className="font-display text-brand-neon text-[80px] leading-none mb-6">
                          "
                        </span>
                        <p className="text-[24px] text-brand-white font-[400] leading-relaxed mb-6 italic">
                          {review}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 10: LOCATION INFO */}
              <section className="bg-brand-black px-6 py-32 lg:py-48 noise-overlay">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-20">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase leading-[0.95] tracking-[0.05em]">
                      FIND US IN
                      <br />
                      BORGER.
                    </h2>
                  </div>

                  <div className="max-w-[700px] mx-auto bg-brand-concrete border border-white/5 noise-overlay overflow-hidden">
                    <div className="p-8 lg:p-12 space-y-8">
                      <div className="text-brand-white text-center">
                        <h3 className="font-display text-[32px] text-brand-white uppercase mb-4">
                          Jesse's Pizza Company
                        </h3>
                        <p className="text-[18px] opacity-80 mb-6">
                          530 W 3rd St
                          <br />
                          Borger, TX 79007
                        </p>
                        <a
                          href="tel:8062747200"
                          className="block text-[24px] font-[700] text-brand-white hover:text-brand-neon transition-colors mb-6"
                        >
                          (806) 274-7200
                        </a>
                        <p className="text-brand-neon text-[12px] font-black tracking-[0.6em] uppercase mb-10">
                          READY IN 20 MINUTES.
                        </p>
                      </div>

                      <div className="h-[280px] w-full bg-brand-black relative overflow-hidden grayscale brightness-75">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3222.062828282828!2d-101.389!3d35.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDM5JzM2LjAiTiAxMDHCsDIzJzIwLjQiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                          className="w-full h-full border-0"
                          allowFullScreen
                          loading="lazy"
                          title="Jesse's Pizza Borger Map Location"
                        ></iframe>
                      </div>

                      <div className="space-y-4">
                        <button
                          onClick={startOrder}
                          className="w-full bg-brand-red text-brand-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Order Online
                        </button>
                        <a
                          href="tel:8062747200"
                          className="block w-full border-2 border-brand-neon text-brand-neon py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all text-center"
                        >
                          Call Now
                        </a>
                        <a
                          href="https://maps.google.com/?q=Jesse's+Pizza+Company+Borger"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[#F5F5F5] hover:text-brand-neon transition-colors uppercase text-[12px] font-bold tracking-widest text-center"
                        >
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 text-center text-[14px] text-brand-white opacity-60">
                    <p>
                      Serving Borger, Phillips, Sanford, Stinnett, and White
                      Deer.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 11: FAQ */}
              <section className="bg-brand-concrete px-6 py-32 lg:py-48 noise-overlay">
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-24">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase leading-[0.95] tracking-[-2px]">
                      BORGER PIZZA
                      <br />
                      QUESTIONS.
                      <br />
                      ANSWERED.
                    </h2>
                  </div>

                  <div className="space-y-16">
                    {[
                      {
                        q: "What is the best pizza in Borger, TX?",
                        a: "If you want loaded toppings, big portions, and pizza worth ordering again, Jesse's on W 3rd St is Borger's go-to spot.",
                      },
                      {
                        q: "How fast is pickup at the Borger location?",
                        a: "Most orders ready in 20 minutes or less. Order online or call ahead.",
                      },
                      {
                        q: "What makes Jesse's different from chains?",
                        a: "We make pizza for the people in Borger. Loaded toppings. Fresh dough. Consistent quality every single time.",
                      },
                      {
                        q: "Do you deliver in Borger?",
                        a: "Check our online ordering system for current delivery availability in your area.",
                      },
                      {
                        q: "Where is Jesse's Pizza Company in Borger?",
                        a: "530 W 3rd St, Borger, TX 79007. Worth the drive from anywhere in town.",
                      },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col gap-4">
                        <h3 className="font-display text-brand-neon text-[20px] uppercase leading-tight tracking-wide">
                          {item.q}
                        </h3>
                        <p className="text-[#F5F5F5] text-[16px] leading-[1.7]">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 12: FINAL CLOSE */}
              <section className="relative h-screen flex items-center justify-center bg-brand-black overflow-hidden noise-overlay">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2002"
                    alt="Loaded Pizza Close-Up Final"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/85" />
                </div>

                <div className="w-full mx-auto text-center relative z-10 px-6">
                  <h1 className="font-display text-[96px] lg:text-[128px] xl:text-[160px] leading-[0.95] tracking-[-2px] uppercase text-brand-neon mb-8">
                    YOU'RE GOING
                    <br />
                    TO EAT TONIGHT
                    <br />
                    ANYWAY.
                  </h1>
                  <p className="text-[20px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[600px] mx-auto text-center mb-16 px-4">
                    The only question is whether it's going to be worth it.
                    Order from our Borger location. Pick it up in 20 minutes.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-8">
                    <button
                      onClick={startOrder}
                      className="bg-brand-red text-brand-white px-16 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[280px]"
                    >
                      Order Now — Borger
                    </button>
                    <a
                      href="tel:8062747200"
                      className="border-2 border-brand-neon text-brand-neon px-16 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-brand-neon hover:text-brand-black transition-all shadow-2xl min-w-[280px] text-center"
                    >
                      Call (806) 274-7200
                    </a>
                  </div>
                </div>
              </section>
            </main>

            <Footer />

            {/* MOBILE STICKY CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 bg-brand-black/90 backdrop-blur-md border-t border-white/10 pointer-events-none">
              <button
                onClick={startOrder}
                className="w-full bg-brand-red text-brand-white py-6 font-display text-2xl uppercase tracking-[0.1em] hover:scale-[1.02] active:scale-95 transition-all pointer-events-auto"
              >
                ORDER NOW — BORGER
              </button>
            </div>
          </motion.div>
        ) : view === "careers" ? (
          <motion.div
            key="careers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-brand-black min-h-screen noise-overlay pb-32"
          >
            {/* Persistence: nav removed */}

            {/* SECTION 1: HERO */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-0 pb-20 bg-brand-black noise-overlay border-b border-white/5 overflow-visible">
              <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                <span className="eyebrow">
                  BORGER & FRITCH, TX
                </span>
                <h1 className="font-display text-[64px] sm:text-[96px] lg:text-[128px] xl:text-[160px] mb-12 leading-[0.95] tracking-[0.05em] uppercase text-brand-neon flex flex-col w-full break-normal text-center mt-0">
                  <span>COME WORK</span>
                  <span>WHERE THE PIZZA</span>
                  <span>
                    ACTUALLY <span className="text-brand-red">HITS</span>.
                  </span>
                </h1>

                <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[640px] mx-auto text-brand-white font-sans text-center normal-case">
                  Jesse's Pizza Company is looking for people who show up, work
                  hard, and take pride in what goes out the door. No corporate
                  nonsense. Just real work at a real local spot.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mt-4">
                  <a
                    href="#apply"
                    className="bg-brand-red text-brand-white w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl text-center"
                  >
                    Apply Now — Borger
                  </a>
                  <a
                    href="#apply"
                    className="bg-brand-red text-brand-white w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl text-center"
                  >
                    Apply Now — Fritch
                  </a>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none flex items-center justify-center">
                <h2 className="font-display text-[20rem] sm:text-[40rem] leading-none uppercase shadow-none [text-shadow:none] tracking-normal">
                  WORK
                </h2>
              </div>
            </section>

            {/* NEW: SOCIAL PROOF BAR */}
            <section className="bg-[#111111] border-y border-[#B8F000]/30 py-12 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="font-display text-[48px] text-[#B8F000] leading-none mb-2">2</span>
                  <span className="eyebrow mt-2">
                    LOCATIONS HIRING NOW
                  </span>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="font-display text-[48px] text-[#B8F000] leading-none mb-2">4</span>
                  <span className="eyebrow mt-2">
                    OPEN POSITIONS
                  </span>
                </div>
                <div className="flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="font-display text-[48px] text-[#B8F000] leading-none mb-2">DAY 1</span>
                  <span className="eyebrow mt-2">
                    BENEFITS START
                  </span>
                </div>
              </div>
            </section>

            {/* SECTION 2: WHY WORK HERE */}
            <section className="bg-[#0D0D0D] px-6 py-32 lg:py-48 border-t border-[#B8F000] noise-overlay">
              <div className="w-full">
                <div className="text-center mb-24">
                  <span className="eyebrow">
                    CULTURE
                  </span>
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-8 leading-[0.95] tracking-[0.05em] shadow-none [text-shadow:none]">
                    WHAT YOU'RE SIGNING UP{" "}
                    <span className="text-brand-red">FOR</span>.
                  </h2>
                  <p className="text-[16px] lg:text-[18px] text-brand-white font-[400] leading-[1.7] max-w-[640px] mx-auto text-center">
                    No sugarcoating. Here's what working at Jesse's actually
                    means.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                  {[
                    {
                      title: "Real Work.",
                      body: "This isn't a place that runs itself. We move fast, we stay consistent, and we hold a standard. If that's the kind of environment you thrive in, you'll fit right in.",
                      quote: "\"Show up. We'll handle the rest.\"",
                    },
                    {
                      title: "Local Pride.",
                      body: "You're not working for a franchise. You're part of a team that Borger and Fritch actually care about. That means something.",
                      quote: "\"Borger and Fritch actually notice.\"",
                    },
                    {
                      title: "Room to Grow.",
                      body: "We promote from inside. Marc and Tyler both started where most of our team members start. If you're good at what you do, we notice.",
                      quote: "\"Marc started where you're starting.\"",
                    },
                    {
                      title: "Pure Management.",
                      body: "No games. No politics. You know where you stand. You know what's expected. That's it.",
                      quote: "\"No surprises. Ever.\"",
                    },
                  ].map((point, i) => {
                    const isLongTitle = point.title.split(" ").length > 2;
                    return (
                      <div
                        key={i}
                        className="bg-[#2A2A2A] p-12 border-l-[3px] border-[#B8F000] border-y border-r border-white/5 noise-overlay group hover:border-[#B8F000] transition-colors flex flex-col"
                      >
                        <h3
                          className={`font-display mb-6 text-brand-neon uppercase tracking-[0.05em] leading-[1.1] ${isLongTitle ? "text-[28px]" : "text-[28px] lg:text-[36px]"}`}
                        >
                          {point.title}
                        </h3>
                        <p className="text-[16px] lg:text-[18px] text-brand-white font-[400] leading-[1.7] max-w-[640px] flex-1 mb-8">
                          {point.body}
                        </p>
                        <p className="text-[#B8F000] font-bold italic tracking-wide text-lg">
                          {point.quote}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 3: OPEN POSITIONS */}
            <section className="bg-[#111111] px-6 py-32 lg:py-48 noise-overlay border-b border-white/5">
              <div className="w-full">
                <div className="text-center mb-24">
                  <span className="eyebrow">
                    OPPORTUNITY
                  </span>
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-8 leading-[0.95] tracking-[0.05em] shadow-none [text-shadow:none]">
                    WE'RE <span className="text-brand-red">HIRING</span>.
                  </h2>
                  <p className="text-[16px] lg:text-[18px] text-brand-white font-[400] leading-[1.7] max-w-[640px] mx-auto text-center mb-12">
                    Both locations. Multiple positions. If you're reliable and
                    ready to work, we want to hear from you.
                  </p>
                  
                  {/* URGENCY BAR */}
                  <div className="bg-[#D62828] py-4 w-full">
                    <p className="text-white font-display text-[20px] lg:text-[24px] uppercase tracking-[4px] text-center">
                      POSITIONS FILLING FAST — APPLY TODAY
                    </p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                  {[
                    {
                      title: "Pizza Maker",
                      subtitle: "Borger and Fritch",
                      details:
                        "Full time and part time available. You'll be making the product this town runs on. Attention to detail matters here.",
                      location: "both",
                    },
                    {
                      title: "Counter Specialist",
                      subtitle: "Borger and Fritch",
                      details:
                        "Full time and part time available. You're the first thing customers see. Be good at it.",
                      location: "both",
                    },
                    {
                      title: "Kitchen Prep",
                      subtitle: "Borger and Fritch",
                      details:
                        "Full time and part time available. The kitchen runs because of prep. If you're fast, clean, and consistent, this is your spot.",
                      location: "both",
                    },
                    {
                      title: "Delivery Driver",
                      subtitle: "Borger and Fritch",
                      details:
                        "Part time available. Reliable vehicle required. You're the last impression before the customer opens the box. Make it count.",
                      location: "both",
                    },
                  ].map((pos, i) => {
                    const isLongTitle = pos.title.split(" ").length > 2;
                    let borderClass = "";
                    if (pos.location === "borger") borderClass = "border-t-[3px] border-[#B8F000]";
                    else if (pos.location === "fritch") borderClass = "border-t-[3px] border-[#D62828]";
                    else borderClass = "border-t-[3px] border-image-[linear-gradient(to_right,#B8F000,#D62828)] border-brand-neon"; // Simplified for CSS

                    return (
                      <div
                        key={i}
                        style={pos.location === "both" ? { borderTop: '3px solid', borderImageSource: 'linear-gradient(to right, #B8F000, #D62828)', borderImageSlice: 1 } : {}}
                        className={`bg-[#2A2A2A] p-12 border-x border-b border-white/5 noise-overlay flex flex-col justify-between ${pos.location !== "both" ? borderClass : ""}`}
                      >
                        <div>
                          <h3
                            className={`font-display mb-2 text-brand-neon uppercase tracking-[0.05em] leading-[1.1] ${isLongTitle ? "text-[28px]" : "text-[28px] lg:text-[36px]"}`}
                          >
                            {pos.title}
                          </h3>
                          <p className="text-brand-neon text-[13px] font-[600] tracking-[8px] uppercase mb-8">
                            {pos.subtitle}
                          </p>
                          <p className="text-[16px] lg:text-[18px] text-brand-white font-[400] leading-[1.7] mb-12">
                            {pos.details}
                          </p>
                        </div>
                        <a
                          href="#apply"
                          className="bg-brand-red text-brand-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                        >
                          Apply Now
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 4: WHAT WE LOOK FOR */}
            <section className="bg-[#0A0A0A] px-6 py-32 lg:py-48 noise-overlay border-b border-white/5">
              <div className="w-full">
                <div className="text-center mb-16">
                  <span className="eyebrow">
                    STANDARDS
                  </span>
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-brand-neon uppercase mb-12 leading-[0.95] tracking-[0.05em] shadow-none [text-shadow:none]">
                    WHAT WE ACTUALLY CARE{" "}
                    <span className="text-brand-red">ABOUT</span>.
                  </h2>
                </div>
                <div className="max-w-4xl mx-auto space-y-0">
                  {[
                    "Show up on time. Every time.",
                    "Take the job seriously without being told to.",
                    "Care about what goes out the door.",
                    "Work well with the people around them.",
                    "Want to be part of something the community actually respects.",
                  ].map((statement, idx) => {
                    const num = `0${idx + 1}`;
                    const isLast = idx === 4;
                    return (
                      <div key={idx} className="group">
                        <div className="flex items-baseline py-8">
                          <span className="text-[#B8F000] font-sans text-[16px] font-bold mr-8 shrink-0">
                            {num}
                          </span>
                          <p className={`text-[28px] font-bold leading-tight ${isLast ? "text-[#B8F000]" : "text-white"}`}>
                            {statement}
                          </p>
                        </div>
                        <div className="h-[1px] w-full bg-[#B8F000]/30" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 5: THE FINAL CLOSE (MERGED APPLICATION & FINAL CTA) */}
            <section
              id="apply"
              className="relative min-h-screen lg:min-h-[140vh] bg-brand-black flex flex-col justify-center overflow-hidden"
            >
              {/* Background Image */}
               <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Pizza Kitchen"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-brand-black/60" />
                </div>

              <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 w-full items-center">
                
                {/* Left Side: Content */}
                <div className="flex flex-col text-center lg:text-left">
                  <span className="eyebrow mb-6">
                    JOIN THE CREW
                  </span>
                  <h2 className="font-display text-[80px] lg:text-[140px] uppercase leading-[0.9] text-brand-neon mb-12">
                    ONE LAST<br />THING.
                  </h2>
                  <p className="text-white text-[18px] lg:text-[22px] leading-relaxed mb-12 max-w-md mx-auto lg:mx-0">
                    If you made it this far you're probably the kind of person we want. Fill out the form and we'll be in touch.
                  </p>
                  
                  <div className="space-y-4">
                     <div className="flex flex-col">
                        <span className="eyebrow mb-1">BORGER</span>
                        <a href="tel:8062747200" className="text-white font-display text-[32px] lg:text-[48px] hover:text-[#B8F000] transition-colors">(806) 274-7200</a>
                     </div>
                     <div className="flex flex-col">
                        <span className="eyebrow mb-1">FRITCH</span>
                        <a href="tel:8068570098" className="text-white font-display text-[32px] lg:text-[48px] hover:text-[#B8F000] transition-colors">(806) 857-0098</a>
                     </div>
                  </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-[#1A1A1A] p-8 lg:p-12 border-l-[4px] border-[#B8F000] shadow-2xl noise-overlay w-full">
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Application submitted!");
                    }}
                  >
                    <div className="grid grid-cols-1 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-brand-white text-xs font-black uppercase tracking-[0.2em]">
                          Full Name (Required)
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Your Name"
                          className="bg-brand-black border border-white/10 p-4 text-brand-white outline-none focus:border-brand-neon transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-brand-white text-xs font-black uppercase tracking-[0.2em]">
                          Phone Number (Required)
                        </label>
                        <input
                          required
                          type="tel"
                          placeholder="806-555-5555"
                          className="bg-brand-black border border-white/10 p-4 text-brand-white outline-none focus:border-brand-neon transition-colors"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-brand-white text-xs font-black uppercase tracking-[0.2em]">
                          Email (Required)
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="name@email.com"
                          className="bg-brand-black border border-white/10 p-4 text-brand-white outline-none focus:border-brand-neon transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-brand-white text-xs font-black uppercase tracking-[0.2em]">
                          Location
                        </label>
                        <select className="bg-brand-black border border-white/10 p-4 text-brand-white outline-none focus:border-brand-neon transition-colors appearance-none">
                          <option>Borger</option>
                          <option>Fritch</option>
                          <option>Either</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-brand-white text-xs font-black uppercase tracking-[0.2em]">
                          Position
                        </label>
                        <select className="bg-brand-black border border-white/10 p-4 text-brand-white outline-none focus:border-brand-neon transition-colors appearance-none">
                          <option>Pizza Maker</option>
                          <option>Counter</option>
                          <option>Prep</option>
                          <option>Driver</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-brand-white text-xs font-black uppercase tracking-[0.2em]">
                        Your Story
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell us about yourself..."
                        className="bg-brand-black border border-white/10 p-4 text-brand-white outline-none focus:border-brand-neon transition-colors resize-none"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-red text-brand-white py-5 text-xl font-display uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl"
                    >
                      Submit Application
                    </button>
                  </form>
                </div>

              </div>
            </section>

            <Footer />
          </motion.div>
        ) : view === "specials" ? (
          <motion.div
            key="specials"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0D0D0D] min-h-screen"
          >
            {/* SECTION 1: HERO */}
            <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[#0D0D0D] px-6 pt-0 pb-20 overflow-visible noise-overlay">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                  alt="Loaded Pizza Close-up"
                  className="w-full h-full object-cover opacity-40 grayscale-[0.3]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0D0D0D]/60" />
              </div>

              <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                <span className="eyebrow">
                  {location.toUpperCase()}, TX
                </span>
                <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] tracking-[-2px] uppercase text-[#B8F000] flex flex-col items-center w-full break-normal text-center mt-0">
                  <span>REAL DEALS.</span>
                  <span>NO STRINGS.</span>
                  <span>
                    <span className="text-[#D62828]">JUST.</span> ORDER.
                  </span>
                </h1>

                <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[500px] mx-auto text-[#F5F5F5] font-sans text-center normal-case mt-0">
                  Location specific specials running every week. Find your
                  location and order before it's gone.
                </p>

                <div className="mb-4 mt-0">
                  <LocationToggle />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0">
                  <button
                    onClick={startOrder}
                    className="bg-[#D62828] text-white w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                  >
                    Order Now — {location}
                  </button>
                  <a
                    href={`tel:${LOCATIONS_DATA[location].phoneRaw}`}
                    className="border-2 border-[#B8F000] text-[#B8F000] w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl text-center"
                  >
                    Call {location}
                  </a>
                </div>
              </div>
            </section>

            {/* SECTION 2: TRUST STRIP */}
            <section className="bg-[#B8F000] py-12 px-6 overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-4 font-black text-[#0D0D0D] text-[16px] uppercase text-center lg:text-left">
                <span>"Real specials. Not watered down deals."</span>
                <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-[#D62828]" />
                <span>"Location specific. Check yours below."</span>
                <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-[#D62828]" />
                <span>"Same loaded standard. Better price."</span>
                <div className="hidden lg:block w-2.5 h-2.5 rounded-full bg-[#D62828]" />
                <span>"Every week. No exceptions."</span>
              </div>
            </section>

            {/* NEW: WEEKLY DAY INDICATOR STRIP */}
            <section className="bg-[#1A1A1A] py-6 px-6 border-b border-white/5">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-7 gap-2">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map(
                    (day, i) => {
                      const todayIndex =
                        new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                      const isActive = i === todayIndex;
                      return (
                        <div key={day} className="flex flex-col items-center">
                          <div
                            className={`w-full h-12 lg:h-16 flex items-center justify-center font-black text-sm lg:text-lg rounded-sm transition-all ${
                              isActive
                                ? "bg-[#B8F000] text-[#0D0D0D]"
                                : "bg-[#2A2A2A] text-[#666666]"
                            }`}
                          >
                            {day}
                          </div>
                          {isActive && (
                            <span className="text-[#B8F000] text-[9px] lg:text-[11px] font-black uppercase tracking-tighter mt-2 whitespace-nowrap">
                              TODAY'S DEALS
                            </span>
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </section>

            {/* SECTION 3: BORGER SPECIALS */}
            <section
              id="borger-specials"
              className="bg-[#0D0D0D] px-6 py-32 lg:py-48 noise-overlay"
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-32">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-4 leading-[0.95] tracking-[-2px]">
                    BORGER
                    <br />
                    SPECIALS.
                  </h2>
                  <span className="eyebrow">
                    530 W 3RD ST — BORGER, TX 79007
                  </span>
                  <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto text-center mt-8">
                    These deals run every week at our Borger location. Order
                    online or call to take advantage.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#2A2A2A] p-10 flex flex-col noise-overlay min-h-[500px] border border-white/5">
                    <span className="eyebrow text-[#D62828] tracking-[2px] mb-4">
                      TODAY ONLY — MONDAYS
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-6">
                      MONDAY
                    </span>
                    <h3 className="text-brand-white font-black text-[20px] mb-2 uppercase">
                      Monday Pizza Deal
                    </h3>
                    <p className="text-brand-white text-[16px] mb-4">
                      Large 1 Topping Pizza
                    </p>
                    <p className="text-brand-white text-[16px] font-bold mb-2 italic">
                      Discounted Monday pricing
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Call for today's pricing
                    </span>
                    <p className="text-brand-white text-[16px] leading-[1.7] flex-1 mb-12">
                      One of Borger's most popular weekly deals. Call or order
                      online for current pricing.
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={startOrder}
                        className="w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 mb-6"
                      >
                        Order Now — Borger
                      </button>
                      <span className="eyebrow text-center">
                        BORGER ONLY
                      </span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#2A2A2A] p-10 flex flex-col noise-overlay min-h-[500px] border border-white/5">
                    <span className="eyebrow text-[#D62828] tracking-[2px] mb-4">
                      TODAY ONLY — MONDAYS
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-6">
                      MONDAY
                    </span>
                    <h3 className="text-brand-white font-black text-[20px] mb-2 uppercase">
                      Free Dine-In Drink
                    </h3>
                    <p className="text-brand-white text-[16px] mb-4">
                      Free fountain drink with dine-in order
                    </p>
                    <p className="text-brand-white text-[16px] font-bold mb-2 italic">
                      Free with qualifying order
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-brand-white text-[16px] leading-[1.7] flex-1 mb-12">
                      Dine in on Monday and your drink is on us.
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={startOrder}
                        className="w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 mb-6"
                      >
                        Order Now — Borger
                      </button>
                      <span className="eyebrow text-center">
                        BORGER ONLY
                      </span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#2A2A2A] p-10 flex flex-col noise-overlay min-h-[500px] border border-white/5">
                    <span className="eyebrow tracking-[2px] mb-4">
                      AVAILABLE EVERY DAY
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-6">
                      DAILY
                    </span>
                    <h3 className="text-brand-white font-black text-[20px] mb-2 uppercase">
                      Family Deal
                    </h3>
                    <p className="text-brand-white text-[16px] mb-4">
                      18" Jumbo + Cheezy Bread + 2 Liter
                    </p>
                    <p className="text-brand-white text-[16px] font-bold mb-2 italic">
                      $34.99
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-brand-white text-[16px] leading-[1.7] flex-1 mb-12">
                      Best value on the menu. Available every day, not just
                      Mondays.
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={startOrder}
                        className="w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 mb-6"
                      >
                        Order Now — Borger
                      </button>
                      <span className="eyebrow text-center">
                        BORGER AND FRITCH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: FULL BLEED IMAGE BREAK */}
            <section className="relative h-[250px] lg:h-[400px] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=2000"
                alt="Loaded Specialty Pizza"
                className="w-full h-full object-cover grayscale-[0.2] brightness-90 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </section>

            {/* SECTION 5: FRITCH SPECIALS */}
            <section
              id="fritch-specials"
              className="bg-[#111111] px-6 py-32 lg:py-48 noise-overlay"
            >
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-32">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-4 leading-[0.95] tracking-[-2px]">
                    FRITCH
                    <br />
                    SPECIALS.
                  </h2>
                  <span className="eyebrow">
                    424 E BROADWAY ST — FRITCH, TX 79036
                  </span>
                  <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto text-center mt-8">
                    These deals run every week at our Fritch location. Order
                    online or call to take advantage.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#0D0D0D] p-10 flex flex-col noise-overlay min-h-[500px] border border-white/5">
                    <span className="eyebrow text-[#D62828] tracking-[2px] mb-4">
                      TODAY ONLY — TUESDAYS
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-6">
                      TUESDAY
                    </span>
                    <h3 className="text-brand-white font-black text-[20px] mb-2 uppercase">
                      Jumbo Tuesday
                    </h3>
                    <p className="text-brand-white text-[16px] mb-4">
                      18" Jumbo 1 Topping Pizza
                    </p>
                    <p className="text-brand-white text-[16px] font-bold mb-2 italic">
                      Tuesday special pricing
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Call for today's pricing
                    </span>
                    <p className="text-brand-white text-[16px] leading-[1.7] flex-1 mb-12">
                      Fritch's most popular weekly deal. The Jumbo at a price
                      that makes it even harder to say no. Call or order online
                      for current pricing.
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={startOrder}
                        className="w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 mb-6"
                      >
                        Order Now — Fritch
                      </button>
                      <span className="eyebrow text-center">
                        FRITCH ONLY
                      </span>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#0D0D0D] p-10 flex flex-col noise-overlay min-h-[500px] border border-white/5">
                    <span className="eyebrow tracking-[2px] mb-4">
                      AVAILABLE EVERY DAY
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-6">
                      WEEKLY
                    </span>
                    <h3 className="text-brand-white font-black text-[20px] mb-2 uppercase">
                      Family Wings Deal
                    </h3>
                    <p className="text-brand-white text-[16px] mb-4">
                      Wings + 2 Liter Drink
                    </p>
                    <p className="text-brand-white text-[16px] font-bold mb-2 italic">
                      Weekly special pricing
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-brand-white text-[16px] leading-[1.7] flex-1 mb-12">
                      Fritch's go-to wings combo. Hot, crispy, and ready when
                      you are. Call or order online for current pricing.
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={startOrder}
                        className="w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 mb-6"
                      >
                        Order Now — Fritch
                      </button>
                      <span className="eyebrow text-center">
                        FRITCH ONLY
                      </span>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#0D0D0D] p-10 flex flex-col noise-overlay min-h-[500px] border border-white/5">
                    <span className="eyebrow tracking-[2px] mb-4">
                      AVAILABLE EVERY DAY
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-6">
                      DAILY
                    </span>
                    <h3 className="text-brand-white font-black text-[20px] mb-2 uppercase">
                      Game Night Pack
                    </h3>
                    <p className="text-brand-white text-[16px] mb-4">
                      2 Large Pizzas + Wings (12 ct)
                    </p>
                    <p className="text-brand-white text-[16px] font-bold mb-2 italic">
                      $45.99
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-brand-white text-[16px] leading-[1.7] flex-1 mb-12">
                      Built for a crowd. Available every day at both locations.
                    </p>
                    <div className="mt-auto">
                      <button
                        onClick={startOrder}
                        className="w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 mb-6"
                      >
                        Order Now — Fritch
                      </button>
                      <span className="eyebrow text-center">
                        BORGER AND FRITCH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: FULL BLEED IMAGE BREAK */}
            <section className="relative h-[250px] lg:h-[400px] w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1608039755401-742074f0548d?auto=format&fit=crop&q=80&w=2000"
                alt="Wings Close-up"
                className="w-full h-full object-cover contrast-125 grayscale-[0.3]"
                referrerPolicy="no-referrer"
              />
            </section>

            {/* SECTION 7: EVERYDAY VALUE */}
            <section className="bg-[#0D0D0D] px-6 py-20 lg:py-32 noise-overlay mt-0 pt-[80px]">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-32">
                  <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-4 leading-[0.95] tracking-[-2px]">
                    EVERYDAY
                    <br />
                    VALUE.
                  </h2>
                  <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[640px] mx-auto text-center mt-8">
                    No specific day required. These are available every day at
                    both Borger and Fritch.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-[#2A2A2A] p-10 flex flex-col noise-overlay min-h-[500px]">
                    <span className="eyebrow">
                      AVAILABLE EVERY DAY
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-8">
                      FAMILY DEAL
                    </span>
                    <div className="text-[#F5F5F5] text-[16px] space-y-2 mb-4 leading-relaxed">
                      <p>18" Jumbo Pizza</p>
                      <p>Cheezy Bread</p>
                      <p>2 Liter Drink</p>
                    </div>
                    <p className="text-[#F5F5F5] text-2xl font-black mb-2">
                      $34.99
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-[#B8F000] text-[14px] italic mb-12">
                      Nobody goes home hungry.
                    </p>
                    <button
                      onClick={startOrder}
                      className="mt-auto w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Order Now
                    </button>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-[#2A2A2A] p-10 flex flex-col noise-overlay min-h-[500px]">
                    <span className="eyebrow">
                      AVAILABLE EVERY DAY
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-8">
                      GAME NIGHT PACK
                    </span>
                    <div className="text-[#F5F5F5] text-[16px] space-y-2 mb-4 leading-relaxed">
                      <p>2 Large Pizzas</p>
                      <p>Wings (12 ct)</p>
                    </div>
                    <p className="text-[#F5F5F5] text-2xl font-black mb-2">
                      $45.99
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-[#B8F000] text-[14px] italic mb-12">
                      Built for a crowd. Gone fast.
                    </p>
                    <button
                      onClick={startOrder}
                      className="mt-auto w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Order Now
                    </button>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-[#2A2A2A] p-10 flex flex-col noise-overlay min-h-[500px]">
                    <span className="eyebrow">
                      AVAILABLE EVERY DAY
                    </span>
                    <span className="font-display text-[#B8F000] text-[36px] uppercase leading-none mb-8">
                      QUICK MEAL
                    </span>
                    <div className="text-[#F5F5F5] text-[16px] space-y-2 mb-4 leading-relaxed">
                      <p>Medium Pizza</p>
                      <p>Drink</p>
                    </div>
                    <p className="text-[#F5F5F5] text-2xl font-black mb-2">
                      $19.99
                    </p>
                    <span className="text-[#B8F000] text-[13px] font-bold mb-8 block">
                      Save vs. ordering separately
                    </span>
                    <p className="text-[#B8F000] text-[14px] italic mb-12">
                      Fast. Simple. Hits the spot.
                    </p>
                    <button
                      onClick={startOrder}
                      className="mt-auto w-full bg-[#D62828] text-white py-6 font-display text-xl uppercase tracking-widest hover:brightness-110 transition-all"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 8: NEVER MISS A DEAL */}
            <section className="bg-[#1A1A1A] px-6 py-32 lg:py-48 noise-overlay border-t border-white/5 text-center">
              <div className="max-w-[600px] mx-auto">
                <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-8 leading-[0.95] tracking-[-2px]">
                  NEVER MISS
                  <br />A DEAL.
                </h2>
                <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] mb-16">
                  The best way to stay on top of our latest specials is to
                  follow us on social media or call your nearest location
                  directly.
                </p>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-16">
                  <div>
                    <span className="text-[#F5F5F5] block mb-2 uppercase text-xs tracking-widest opacity-60">
                      BORGER
                    </span>
                    <a
                      href="tel:8062747200"
                      className="text-[#B8F000] text-2xl font-black hover:brightness-110 pointer-events-auto transition-all"
                    >
                      (806) 274-7200
                    </a>
                  </div>
                  <div className="hidden lg:block w-px h-12 bg-white/10" />
                  <div>
                    <span className="text-[#F5F5F5] block mb-2 uppercase text-xs tracking-widest opacity-60">
                      FRITCH
                    </span>
                    <a
                      href="tel:8068570098"
                      className="text-[#B8F000] text-2xl font-black hover:brightness-110 pointer-events-auto transition-all"
                    >
                      (806) 857-0098
                    </a>
                  </div>
                </div>

                <p className="text-[#F5F5F5] text-[16px] mb-8">
                  Follow Jesse's Pizza Company on Facebook for the latest deals,
                  updates, and specials.
                </p>
                <button className="bg-[#D62828] text-white px-12 py-7 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl mx-auto block">
                  Find Us on Facebook
                </button>
              </div>
            </section>

            {/* SECTION 9: FINAL CTA */}
            <section className="relative h-screen flex items-center justify-center bg-[#0D0D0D] overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img
                  src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                  alt="Final Pizza Shot"
                  className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0D0D0D]/85" />
              </div>

              <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 px-6">
                <h1 className="font-display text-[96px] lg:text-[128px] xl:text-[160px] leading-[0.95] tracking-[-2px] uppercase text-[#B8F000] mb-8">
                  TODAY'S A<br />
                  GOOD DAY
                  <br />
                  TO ORDER.
                </h1>

                <p className="text-[20px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[600px] mx-auto mb-16 px-4">
                  Check your location's specials above. Pick your deal. Order in
                  60 seconds.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-8 w-full sm:w-auto">
                  <button
                    onClick={startOrder}
                    className="bg-[#D62828] text-white px-12 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[280px]"
                  >
                    Order Now — {location}
                  </button>
                  <a
                    href={`tel:${LOCATIONS_DATA[location].phoneRaw}`}
                    className="border-2 border-[#B8F000] text-[#B8F000] px-12 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl min-w-[280px] text-center"
                  >
                    Call {location}
                  </a>
                </div>
              </div>
            </section>

            <Footer />
          </motion.div>
        ) : view === "contact" ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0D0D0D] min-h-screen noise-overlay"
          >
            <main>
              {/* SECTION 1: HERO */}
              <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[#0D0D0D] px-6 pt-0 pb-20 overflow-visible noise-overlay">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Close-up Pizza Hero"
                    className="w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0D0D0D]/60" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                  <span className="eyebrow">
                    BORGER & FRITCH, TX
                  </span>

                  <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] tracking-[-2px] sm:tracking-[0.05em] uppercase text-[#B8F000] flex flex-col items-center w-full break-normal text-center mt-0">
                    {location.toUpperCase()}
                    <br />
                    <span className="text-[#D62828] uppercase">CONTACT.</span>
                  </h1>

                  <p className="text-[16px] lg:text-[18px] leading-[1.6] max-w-[320px] lg:max-w-[500px] mx-auto text-[#F5F5F5] font-sans text-center normal-case mt-0">
                    Fastest way to reach us is a phone call. Or send a message
                    below.
                  </p>

                  <div className="mb-4 mt-0">
                    <LocationToggle />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 w-full sm:w-auto px-6 sm:px-0 mt-4">
                    <button
                      onClick={startOrder}
                      className="bg-[#D62828] text-white w-full sm:w-auto px-12 h-[52px] sm:h-auto text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                    >
                      Order Now — {location}
                    </button>
                    <a
                      href={`tel:${LOCATIONS_DATA[location].phoneRaw}`}
                      className="border-2 border-[#B8F000] text-[#B8F000] w-full sm:w-auto px-12 h-[52px] sm:h-auto flex items-center justify-center text-[18px] sm:text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl text-center"
                    >
                      Call {location}
                    </a>
                  </div>
                </div>
              </section>

              {/* SECTION 2: LOCATION AND HOURS */}
              <section className="bg-[#0D0D0D] px-6 py-32 lg:py-48 noise-overlay">
                <div className="max-w-4xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                      {/* SELECTED LOCATION CARD */}
                      <div className="bg-[#2A2A2A] p-8 lg:p-12 border border-white/5 noise-overlay relative flex flex-col h-full shadow-2xl">
                        <h3 className="font-display text-[36px] text-[#B8F000] leading-[1.1] tracking-[-0.5px] uppercase mb-4">
                          {location.toUpperCase()}
                        </h3>
                        <div className="mb-8 space-y-2">
                          <p className="text-[#F5F5F5] text-[18px] font-[400] leading-relaxed">
                            Jesse's Pizza Company
                            <br />
                            {LOCATIONS_DATA[location].address}
                            <br />
                            {LOCATIONS_DATA[location].city}
                          </p>
                          <a
                            href={`tel:${LOCATIONS_DATA[location].phoneRaw}`}
                            className="block text-[#F5F5F5] text-[24px] font-[700] hover:text-[#B8F000] transition-colors"
                          >
                            {LOCATIONS_DATA[location].phone}
                          </a>
                          <p className="eyebrow">
                            READY IN 20 MINUTES
                          </p>
                        </div>
                        <div className="h-[250px] w-full mb-8 relative overflow-hidden grayscale brightness-75 border border-white/10 text-brand-white">
                          <iframe
                            src={LOCATIONS_DATA[location].mapEmbed}
                            className="w-full h-full border-0 absolute inset-0"
                            allowFullScreen
                            loading="lazy"
                            title={`Jesse's Pizza ${location} Map`}
                          ></iframe>
                        </div>
                        <div className="mt-auto space-y-4">
                          <div className="h-px bg-[#B8F000]/20 w-full mb-4" />
                          <button
                            onClick={startOrder}
                            className="w-full bg-[#D62828] text-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all text-center"
                          >
                            Order Online
                          </button>
                          <a
                            href={`tel:${LOCATIONS_DATA[location].phoneRaw}`}
                            className="block w-full border-2 border-[#B8F000] text-[#B8F000] py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all text-center"
                          >
                            Call Now
                          </a>
                          <a
                            href={LOCATIONS_DATA[location].directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-center text-[#F5F5F5] hover:text-[#B8F000] transition-colors uppercase text-[12px] font-bold tracking-widest py-2"
                          >
                            Get Directions
                          </a>
                        </div>
                      </div>

                      {/* HOURS CARD */}
                      <div className="bg-[#2A2A2A] p-8 lg:p-12 border border-white/5 noise-overlay relative flex flex-col h-full text-center lg:text-left">
                        <h3 className="font-display text-[36px] text-[#B8F000] leading-[1.1] tracking-[-0.5px] uppercase mb-8">
                          HOURS OF OPERATION
                        </h3>
                        <div className="space-y-8">
                          <div>
                            <span className="eyebrow">
                              {LOCATIONS_DATA[location].hours}
                            </span>
                            <p className="text-[#F5F5F5] text-[32px] font-display uppercase leading-tight">
                              {LOCATIONS_DATA[location].time}
                            </p>
                          </div>
                          <div>
                            <span className="eyebrow text-[#D62828]">
                              SUNDAY
                            </span>
                            <p className="text-[#F5F5F5] text-[32px] font-display uppercase leading-tight">
                              CLOSED
                            </p>
                          </div>
                        </div>

                        <div className="mt-12 p-6 bg-white/5 border border-white/10 italic text-[14px] text-brand-white/60 leading-relaxed uppercase tracking-widest text-center">
                          "If we're open, we're making the best pizza in the
                          country. No early closures. No shortcuts."
                        </div>
                      </div>
                    </div>
                  </div>
              </section>

              {/* SECTION 4: FULL BLEED IMAGE BREAK */}
              <section className="h-[250px] lg:h-[400px] w-full overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&q=80&w=2000"
                  alt="High Contrast Pizza Detail"
                  className="w-full h-full object-cover grayscale-[0.1] contrast-125"
                  referrerPolicy="no-referrer"
                />
              </section>

              {/* SECTION 5: CONTACT FORM */}
              <section className="bg-[#0D0D0D] px-6 py-32 lg:py-48 noise-overlay">
                <div className="max-w-[640px] mx-auto">
                  <div className="text-center mb-16">
                    <h2 className="font-display text-[80px] lg:text-[112px] xl:text-[140px] text-[#B8F000] uppercase mb-8 leading-[0.95] tracking-[0.05em]">
                      SEND US A<br />
                      MESSAGE.
                    </h2>
                    <p className="text-[18px] text-[#F5F5F5] font-[400] leading-[1.7] text-center">
                      Not the fastest way to reach us. But if you need to send
                      us something, we'll get back to you.
                    </p>
                  </div>

                  <div className="bg-[#2A2A2A] p-8 lg:p-12 border border-white/5 noise-overlay">
                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        alert("Message sent!");
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-white text-[14px] uppercase font-bold tracking-wider">
                          Name (required)
                        </label>
                        <input
                          required
                          type="text"
                          className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 text-[#F5F5F5] placeholder-[#666666] outline-none focus:border-[#B8F000] transition-colors"
                          placeholder="Full name"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-[14px] uppercase font-bold tracking-wider">
                          Email (required)
                        </label>
                        <input
                          required
                          type="email"
                          className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 text-[#F5F5F5] placeholder-[#666666] outline-none focus:border-[#B8F000] transition-colors"
                          placeholder="Email address"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-[14px] uppercase font-bold tracking-wider">
                          Phone (optional)
                        </label>
                        <input
                          type="tel"
                          className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 text-[#F5F5F5] placeholder-[#666666] outline-none focus:border-[#B8F000] transition-colors"
                          placeholder="Phone number"
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-[14px] uppercase font-bold tracking-wider">
                          Location
                        </label>
                        <select className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 text-[#F5F5F5] outline-none focus:border-[#B8F000] transition-colors appearance-none cursor-pointer">
                          <option>Borger</option>
                          <option>Fritch</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-white text-[14px] uppercase font-bold tracking-wider">
                          Message (required)
                        </label>
                        <textarea
                          required
                          rows={5}
                          className="bg-[#1A1A1A] border border-[#2A2A2A] p-4 text-[#F5F5F5] placeholder-[#666666] outline-none focus:border-[#B8F000] transition-colors resize-none"
                          placeholder="Your message..."
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#D62828] text-white py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-[1.02] active:scale-95 transition-all mt-6 shadow-2xl"
                      >
                        SEND MESSAGE
                      </button>
                    </form>
                  </div>
                </div>
              </section>

              {/* SECTION 6: FINAL CTA */}
              <section className="relative h-screen flex items-center justify-center bg-[#0D0D0D] overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=2000"
                    alt="Loaded Pizza Texture"
                    className="w-full h-full object-cover opacity-40 grayscale-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[#0D0D0D]/60" />
                </div>

                <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 px-6">
                  <h1 className="font-display text-[96px] lg:text-[128px] xl:text-[160px] leading-[0.95] tracking-[-2px] uppercase text-[#B8F000] mb-8">
                    READY TO
                    <br />
                    ORDER?
                  </h1>

                  <p className="text-[20px] text-[#F5F5F5] font-[400] leading-[1.7] max-w-[600px] mx-auto mb-16 px-4">
                    Skip the form. Skip the wait. Order online and pick it up in
                    20 minutes.
                  </p>

                  <div className="flex flex-col sm:flex-row justify-center gap-8 w-full sm:w-auto">
                    <button
                      onClick={startOrder}
                      className="bg-[#D62828] text-white px-12 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[280px]"
                    >
                      Order Now — Borger
                    </button>
                    <button
                      onClick={startOrder}
                      className="border-2 border-[#B8F000] text-[#B8F000] px-12 py-8 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl min-w-[280px]"
                    >
                      Order Now — Fritch
                    </button>
                  </div>
                </div>
              </section>
            </main>

            <Footer />
          </motion.div>
        ) : view === "terms" ? (
          <motion.div
            key="terms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0D0D0D] min-h-screen"
          >
            {/* SECTION 1: HERO HEADER */}
            <header className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[#0D0D0D] px-6 pt-0 pb-20 text-center border-b border-white/5 overflow-visible">
              <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
              <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                <span className="eyebrow text-[#F5F5F5] text-center whitespace-nowrap mt-0">
                  Jesse's Pizza Company
                </span>
                <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] tracking-[-2px] sm:tracking-[0.05em] uppercase text-[#B8F000] flex flex-col items-center w-full break-normal text-center mt-0">
                  Terms of
                  <br />
                  Service.
                </h1>
                <p className="text-[#F5F5F5] text-[16px] leading-[1.6] max-w-[320px] mx-auto text-center font-sans opacity-60 mt-0">
                  Last updated: April 2026
                </p>
              </div>
            </header>

            <main className="px-6 py-20">
              {/* SECTION 2: TERMS CONTENT */}
              <div className="max-w-[800px] mx-auto bg-[#2A2A2A] p-8 lg:p-12 border border-white/5 noise-overlay">
                <div className="space-y-12">
                  <section>
                    <h2 className="font-display text-[22px] lg:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Acceptance of Terms
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        By accessing or using the Jesse's Pizza Company website
                        at jessespizzacompany.com, placing an online order, or
                        interacting with our services, you agree to be bound by
                        these Terms of Service.
                      </p>
                      <p>
                        If you do not agree to these terms, please do not use
                        our website or services.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Use of Website
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        You agree to use this website only for lawful purposes
                        and in a manner that does not infringe the rights of
                        others.
                      </p>
                      <p>You may not:</p>
                      <div className="space-y-2 py-2">
                        <p>• Use the website for any fraudulent purpose</p>
                        <p>
                          • Attempt to gain unauthorized access to any part of
                          our systems
                        </p>
                        <p>• Transmit harmful or malicious code</p>
                        <p>• Scrape or copy content without permission</p>
                        <p>• Misrepresent your identity or affiliation</p>
                      </div>
                      <p className="pt-4">
                        We reserve the right to restrict or terminate access to
                        the website for any violation of these terms.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Online Ordering
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        When you place an order through our website or third
                        party ordering platforms, you agree to:
                      </p>
                      <div className="space-y-4 py-4">
                        <p>• Provide accurate and complete information</p>
                        <p>• Pay all charges associated with your order</p>
                        <p>• Pick up your order within a reasonable time</p>
                        <p>
                          • Contact us directly if you have issues with your
                          order
                        </p>
                      </div>
                      <p>
                        All orders are subject to availability. We reserve the
                        right to refuse or cancel any order at our discretion.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Pricing and Payment
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        All prices displayed on our website are in US dollars
                        and subject to change without notice.
                      </p>
                      <p>
                        We accept major credit cards and other payment methods
                        as displayed at checkout.
                      </p>
                      <p>
                        All payments are processed through secure third party
                        payment processors. Jesse's Pizza Company does not store
                        full payment card information.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Refunds and Cancellations
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-6">
                      <p>
                        If you are unsatisfied with your order, contact us
                        directly at your nearest location.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
                        <div className="p-4 bg-[#0D0D0D]/50 border border-white/5">
                          <span className="text-[#B8F000] font-black text-xs block mb-1 uppercase tracking-widest">
                            Borger
                          </span>
                          <a
                            href="tel:8062747200"
                            className="text-[#F5F5F5] font-bold"
                          >
                            (806) 274-7200
                          </a>
                        </div>
                        <div className="p-4 bg-[#0D0D0D]/50 border border-white/5">
                          <span className="text-[#B8F000] font-black text-xs block mb-1 uppercase tracking-widest">
                            Fritch
                          </span>
                          <a
                            href="tel:8068570098"
                            className="text-[#F5F5F5] font-bold"
                          >
                            (806) 857-0098
                          </a>
                        </div>
                      </div>
                      <p>
                        We will work with you to make it right. Refunds and
                        credits are handled on a case by case basis at our
                        discretion.
                      </p>
                      <p className="font-black text-[#B8F000]">
                        We'd rather fix the problem than lose a customer.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Intellectual Property
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        All content on this website including text, images,
                        logos, graphics, and design is the property of Jesse's
                        Pizza Company and may not be reproduced, distributed, or
                        used without written permission.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Third Party Links and Services
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        Our website may contain links to third party websites or
                        use third party services for ordering and payment
                        processing.
                      </p>
                      <p>
                        We are not responsible for the content, privacy
                        practices, or terms of any third party websites or
                        services.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Disclaimer of Warranties
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        This website and its content are provided on an as is
                        basis without warranties of any kind, either express or
                        implied.
                      </p>
                      <p>
                        We do not warrant that the website will be
                        uninterrupted, error free, or free of viruses or other
                        harmful components.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Limitation of Liability
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        To the fullest extent permitted by law, Jesse's Pizza
                        Company shall not be liable for any indirect,
                        incidental, special, or consequential damages arising
                        from your use of this website or our services.
                      </p>
                      <p>
                        Our total liability to you for any claim arising from
                        your use of this website shall not exceed the amount you
                        paid for the order in question.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Governing Law
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        These Terms of Service are governed by the laws of the
                        State of Texas.
                      </p>
                      <p>
                        Any disputes arising from these terms or your use of our
                        website shall be resolved in the courts of Texas.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Changes to these Terms
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        We may update these Terms of Service from time to time.
                      </p>
                      <p>
                        We will notify you of significant changes by updating
                        the date at the top of this page.
                      </p>
                      <p>
                        Continued use of our website after changes constitutes
                        acceptance of the updated terms.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Contact Us
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-8">
                      <p>
                        If you have questions about these Terms of Service,
                        contact us directly:
                      </p>

                      <div className="space-y-1 block">
                        <span className="font-display text-[#B8F000] text-xl block uppercase">
                          Jesse's Pizza Company
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <span className="text-brand-neon font-black text-xs tracking-widest block mb-2 uppercase">
                            Borger Location
                          </span>
                          <p className="opacity-80">
                            530 W 3rd St, Borger, TX 79007
                          </p>
                          <a
                            href="tel:8062747200"
                            className="text-brand-neon font-bold mt-1 block hover:brightness-110 transition-all"
                          >
                            (806) 274-7200
                          </a>
                        </div>
                        <div>
                          <span className="text-brand-neon font-black text-xs tracking-widest block mb-2 uppercase">
                            Fritch Location
                          </span>
                          <p className="opacity-80">
                            424 E Broadway St, Fritch, TX 79036
                          </p>
                          <a
                            href="tel:8068570098"
                            className="text-brand-neon font-bold mt-1 block hover:brightness-110 transition-all"
                          >
                            (806) 857-0098
                          </a>
                        </div>
                      </div>

                      <p className="pt-4">
                        Website:{" "}
                        <span className="text-brand-neon font-bold">
                          jessespizzacompany.com
                        </span>
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </main>

            {/* SECTION 3: FINAL CTA */}
            <section className="bg-[#0D0D0D] py-20 px-6 text-center border-t border-white/5 noise-overlay">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-[64px] md:text-[80px] text-[#B8F000] uppercase mb-8 leading-none">
                  Questions?
                </h2>
                <p className="text-[18px] text-[#F5F5F5] mb-12 max-w-[500px] mx-auto text-center">
                  Reach out to us directly. We're a real local business and
                  we'll give you a real answer.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setView("contact");
                    }}
                    className="bg-[#D62828] text-white px-12 py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[240px]"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={startOrder}
                    className="border-2 border-[#B8F000] text-[#B8F000] px-12 py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl min-w-[240px]"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </section>

            <Footer />
          </motion.div>
        ) : view === "privacy" ? (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#0D0D0D] min-h-screen"
          >
            {/* SECTION 1: HERO HEADER */}
            <header className="relative min-h-[100svh] flex flex-col items-center justify-center bg-[#0D0D0D] px-6 pt-0 pb-20 text-center border-b border-white/5 overflow-visible">
              <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />
              <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center relative z-10 w-full gap-4 pt-0 mt-0">
                <span className="eyebrow text-[#F5F5F5] text-center whitespace-nowrap mt-0">
                  Jesse's Pizza Company
                </span>
                <h1 className="font-display text-[64px] sm:text-8xl lg:text-[8rem] xl:text-[10rem] mb-10 leading-[0.95] tracking-[-2px] sm:tracking-[0.05em] uppercase text-[#B8F000] flex flex-col items-center w-full break-normal text-center mt-0">
                  Privacy Policy.
                </h1>
                <p className="text-[#F5F5F5] text-[16px] leading-[1.6] max-w-[320px] mx-auto text-center font-sans opacity-60 mt-0">
                  Last updated: April 2026
                </p>
              </div>
            </header>

            <main className="px-6 py-20">
              {/* SECTION 2: POLICY CONTENT */}
              <div className="max-w-[800px] mx-auto bg-[#2A2A2A] p-8 md:p-12 border border-white/5 noise-overlay">
                <div className="space-y-12">
                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Introduction
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        Jesse's Pizza Company operates the website
                        jessespizzacompany.com and is committed to protecting
                        your personal information.
                      </p>
                      <p>
                        This Privacy Policy explains what information we
                        collect, how we use it, and your rights regarding that
                        information.
                      </p>
                      <p>
                        By using our website or placing an order, you agree to
                        the terms of this Privacy Policy.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Information We Collect
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        We may collect the following information when you use
                        our website or order online:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Name</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Email address</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Phone number</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Delivery address</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Payment information</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Order history</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>Device and browser information</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#B8F000]" />
                          <span>IP address</span>
                        </div>
                      </div>
                      <p className="pt-4">
                        We collect this information when you:
                      </p>
                      <div className="space-y-2 py-2">
                        <p>• Place an order online</p>
                        <p>• Contact us through our website</p>
                        <p>• Sign up for promotions or updates</p>
                        <p>• Browse our website</p>
                      </div>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      How We Use Your Information
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>We use your information to:</p>
                      <div className="space-y-4 py-4">
                        <p>• Process and fulfill your orders</p>
                        <p>• Send order confirmations and updates</p>
                        <p>• Respond to your questions or messages</p>
                        <p>• Improve our website and ordering experience</p>
                        <p>• Send promotional offers if you have opted in</p>
                        <p>• Comply with legal obligations</p>
                      </div>
                      <p className="font-black text-[#B8F000] pt-4">
                        We do not sell your personal information to third
                        parties. Ever.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Payment Information
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        All payment transactions are processed through secure
                        third party payment processors.
                      </p>
                      <p>
                        Jesse's Pizza Company does not store your full credit
                        card information on our servers.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Cookies and Tracking
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        Our website uses cookies to improve your browsing
                        experience.
                      </p>
                      <p>
                        Cookies are small files stored on your device that help
                        us remember your preferences and understand how you use
                        our site.
                      </p>
                      <p>
                        You can disable cookies in your browser settings at any
                        time. Some features of our website may not function
                        properly without cookies.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Third Party Services
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>We may use third party services including:</p>
                      <div className="space-y-4 py-4">
                        <p>• Google Analytics for website traffic analysis</p>
                        <p>• Online ordering platforms to process orders</p>
                        <p>• Payment processors to handle transactions</p>
                        <p>• Email marketing platforms for promotions</p>
                      </div>
                      <p>
                        These services have their own privacy policies and we
                        encourage you to review them.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Data Retention
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        We retain your personal information for as long as
                        necessary to fulfill orders, comply with legal
                        obligations, and improve our services.
                      </p>
                      <p>
                        You may request deletion of your personal information at
                        any time by contacting us.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Your Rights
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>You have the right to:</p>
                      <div className="space-y-4 py-4">
                        <p>
                          • Access the personal information we hold about you
                        </p>
                        <p>• Request correction of inaccurate information</p>
                        <p>• Request deletion of your personal information</p>
                        <p>• Opt out of marketing communications at any time</p>
                        <p>• File a complaint with relevant authorities</p>
                      </div>
                      <p>
                        To exercise any of these rights contact us at:
                        jessespizzacompany.com or call your nearest location.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Children's Privacy
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        Our website is not directed at children under the age of
                        13.
                      </p>
                      <p>
                        We do not knowingly collect personal information from
                        children under 13.
                      </p>
                      <p>
                        If you believe we have collected information from a
                        child under 13, please contact us and we will delete it
                        promptly.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Changes to this Policy
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-4">
                      <p>
                        We may update this Privacy Policy from time to time.
                      </p>
                      <p>
                        We will notify you of significant changes by updating
                        the date at the top of this page.
                      </p>
                      <p>
                        Continued use of our website after changes constitutes
                        acceptance of the updated policy.
                      </p>
                    </div>
                  </section>

                  <div className="h-px bg-[#B8F000]/10 w-full" />

                  <section>
                    <h2 className="font-display text-[22px] md:text-[28px] text-[#B8F000] uppercase mb-6 leading-none">
                      Contact Us
                    </h2>
                    <div className="text-[#F5F5F5] text-[16px] leading-[1.8] space-y-8">
                      <p>
                        If you have questions about this Privacy Policy or how
                        we handle your information, contact us:
                      </p>

                      <div className="space-y-1 block">
                        <span className="font-display text-[#B8F000] text-xl block uppercase">
                          Jesse's Pizza Company
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                          <span className="text-brand-neon font-black text-xs tracking-widest block mb-2 uppercase">
                            Borger Location
                          </span>
                          <p className="opacity-80">
                            530 W 3rd St, Borger, TX 79007
                          </p>
                          <a
                            href="tel:8062747200"
                            className="text-brand-neon font-bold mt-1 block hover:brightness-110 transition-all"
                          >
                            (806) 274-7200
                          </a>
                        </div>
                        <div>
                          <span className="text-brand-neon font-black text-xs tracking-widest block mb-2 uppercase">
                            Fritch Location
                          </span>
                          <p className="opacity-80">
                            424 E Broadway St, Fritch, TX 79036
                          </p>
                          <a
                            href="tel:8068570098"
                            className="text-brand-neon font-bold mt-1 block hover:brightness-110 transition-all"
                          >
                            (806) 857-0098
                          </a>
                        </div>
                      </div>

                      <p className="pt-4">
                        Website:{" "}
                        <span className="text-brand-neon font-bold">
                          jessespizzacompany.com
                        </span>
                      </p>
                    </div>
                  </section>
                </div>
              </div>
            </main>

            {/* SECTION 3: FINAL CTA */}
            <section className="bg-[#0D0D0D] py-20 px-6 text-center border-t border-white/5 noise-overlay">
              <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-[64px] md:text-[80px] text-[#B8F000] uppercase mb-8 leading-none">
                  Questions?
                </h2>
                <p className="text-[18px] text-[#F5F5F5] mb-12 max-w-[500px] mx-auto text-center">
                  Reach out to us directly. We're a real local business and
                  we'll give you a real answer.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      window.scrollTo(0, 0);
                      setView("contact");
                    }}
                    className="bg-[#D62828] text-white px-12 py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:scale-105 active:scale-95 transition-all shadow-2xl min-w-[240px]"
                  >
                    Contact Us
                  </button>
                  <button
                    onClick={startOrder}
                    className="border-2 border-[#B8F000] text-[#B8F000] px-12 py-6 text-[15px] font-[700] uppercase tracking-[1px] hover:bg-[#B8F000] hover:text-[#0D0D0D] transition-all shadow-2xl min-w-[240px]"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </section>

            <Footer />
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
            {view === "order-start" && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title="Start Your Order" onBack={backToHome} />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={0} />
                  <p className="text-center text-xl text-brand-white/60 mb-12 uppercase font-bold tracking-widest leading-relaxed text-brand-white">
                    Choose how you want to get your food.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-16">
                    <button
                      onClick={() => setOrderType("pickup")}
                      className={`p-10 border-2 transition-all flex flex-col items-center gap-6 ${orderType === "pickup" ? "border-brand-neon bg-brand-neon/10 scale-105 shadow-xl shadow-brand-neon/10" : "border-white/10 opacity-50 hover:opacity-100"}`}
                    >
                      <ShoppingBag
                        size={48}
                        className={
                          orderType === "pickup"
                            ? "text-brand-neon"
                            : "text-gray-500"
                        }
                      />
                      <span className="font-display text-4xl uppercase text-brand-white">
                        Pickup
                      </span>
                      {orderType === "pickup" && (
                        <CheckCircle2 className="text-brand-neon" />
                      )}
                    </button>
                    <button
                      onClick={() => setOrderType("delivery")}
                      className={`p-10 border-2 transition-all flex flex-col items-center gap-6 ${orderType === "delivery" ? "border-brand-neon bg-brand-neon/10 scale-105 shadow-xl shadow-brand-neon/10" : "border-white/10 opacity-50 hover:opacity-100"}`}
                    >
                      <Truck
                        size={48}
                        className={
                          orderType === "delivery"
                            ? "text-brand-neon"
                            : "text-gray-500"
                        }
                      />
                      <span className="font-display text-4xl uppercase text-brand-white">
                        Delivery
                      </span>
                      {orderType === "delivery" && (
                        <CheckCircle2 className="text-brand-neon" />
                      )}
                    </button>
                  </div>

                  <h2 className="font-display text-3xl uppercase mb-8 text-center bg-white/5 py-4 text-brand-neon">
                    Select Location
                  </h2>
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {["Borger", "Fritch"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc as any)}
                        className={`py-6 border transition-all font-display text-2xl uppercase ${location === loc ? "bg-brand-neon text-brand-black border-brand-neon" : "border-white/10 text-brand-white/40 hover:border-white/40"}`}
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
                      Browse Menu{" "}
                      <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: MENU */}
            {view === "menu" && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title="Menu" onBack={startOrder} />
                <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={1} />

                  {/* HERO SECTION FOR MENU */}
                  <div className="text-center mb-20 max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-7xl lg:text-8xl mb-4 leading-none uppercase text-brand-neon">
                      Pick Your Pizza. We’ll Handle the Rest.
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-white/60 font-medium mb-12 uppercase tracking-wide">
                      Loaded toppings. Big portions. Built to actually satisfy.
                    </p>
                  </div>

                  <div className="space-y-40">
                    {MENU_CATEGORIES.map((category) => (
                      <section key={category.id}>
                        <div className="text-center mb-16 px-4">
                          <h2 className="font-display text-4xl md:text-8xl lg:text-9xl uppercase mb-3 text-brand-neon">
                            {category.title}
                          </h2>
                          <p className="eyebrow opacity-40 text-brand-white">
                            {category.subtext}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                          {category.items.map((item) => {
                            const isPop = category.id === "popular";
                            const isCombo = category.id === "combos";
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  if (item.type) {
                                    setSelectedProduct({
                                      ...item,
                                      price:
                                        item.basePrice ||
                                        Object.values(item.prices || {})[0],
                                    });
                                    setView("product");
                                  } else {
                                    addToCart({
                                      ...item,
                                      price: item.basePrice,
                                      quantity: 1,
                                    });
                                    setView("upsell");
                                  }
                                }}
                                className={`card-concrete transition-all cursor-pointer group flex flex-col relative noise-overlay ${isPop || item.bestValue ? "ring-2 ring-brand-neon/20" : ""}`}
                              >
                                {item.bestValue && (
                                  <div className="absolute -top-3 -right-3 bg-brand-neon text-brand-black font-black text-[10px] uppercase px-4 py-2 z-20 shadow-2xl skew-x-[-12deg]">
                                    Best Value
                                  </div>
                                )}

                                {item.image && (
                                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-black">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-100 grayscale-[50%] group-hover:grayscale-0"
                                      referrerPolicy="no-referrer"
                                    />
                                    {isPop && (
                                      <span className="absolute top-4 left-4 bg-brand-red text-brand-white font-black text-[10px] uppercase px-4 py-2 z-10 shadow-xl italic tracking-widest">
                                        Most Popular
                                      </span>
                                    )}
                                  </div>
                                )}

                                <div className="p-10 flex-1 flex flex-col relative z-10">
                                  <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-display text-3xl md:text-4xl uppercase leading-none text-brand-white">
                                      {item.name}
                                    </h3>
                                    <span className="text-xl font-black text-brand-neon">
                                      {item.displayPrice ||
                                        `$${item.basePrice?.toFixed(2)}`}
                                    </span>
                                  </div>

                                  <p className="text-sm text-gray-400 font-bold mb-8 italic flex-1 leading-snug">
                                    {item.desc}
                                  </p>

                                  {item.prices && (
                                    <div className="space-y-2 mb-10 pt-6 border-t border-white/5">
                                      {Object.entries(item.prices).map(
                                        ([size, price]) => (
                                          <div
                                            key={size}
                                            className="flex justify-between items-center text-xs font-black uppercase tracking-widest"
                                          >
                                            <span className="opacity-40 text-brand-white">
                                              {size}
                                            </span>
                                            <span
                                              className={
                                                item.bestValue === size
                                                  ? "text-brand-neon"
                                                  : "text-brand-white"
                                              }
                                            >
                                              ${(price as number).toFixed(2)}{" "}
                                              {item.bestValue === size &&
                                                "(Best Value)"}
                                            </span>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  )}

                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (item.type) {
                                        setSelectedProduct({
                                          ...item,
                                          price:
                                            item.basePrice ||
                                            Object.values(item.prices || {})[0],
                                        });
                                        setView("product");
                                      } else {
                                        addToCart({
                                          ...item,
                                          price: item.basePrice,
                                          quantity: 1,
                                        });
                                        setView("upsell");
                                      }
                                    }}
                                    className={`w-full py-5 font-display text-xl uppercase tracking-widest transition-all ${isPop || isCombo || item.bestValue ? "btn-primary" : "btn-secondary"}`}
                                  >
                                    {item.type === "byo-pizza"
                                      ? "Start Building"
                                      : "Order Now"}
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
                      <h2 className="font-display text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.95] mb-6">
                        Ready to Order?
                      </h2>
                      <p className="text-xl md:text-2xl font-black uppercase tracking-widest mb-16 opacity-80">
                        Skip the chains. Get pizza that actually delivers.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <button
                          onClick={startOrder}
                          className="bg-brand-black text-brand-white px-16 py-6 text-2xl font-display uppercase tracking-widest hover:scale-105 transition-all"
                        >
                          Order Now
                        </button>
                        <a
                          href="tel:8062747200"
                          className="bg-transparent border-4 border-brand-black text-brand-black px-16 py-6 text-2xl font-display uppercase tracking-widest hover:bg-black/10 transition-all text-center"
                        >
                          Call Now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRODUCT PAGE */}
            {view === "product" && selectedProduct && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader title={selectedProduct.name} onBack={goToMenu} />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={2} />

                  <div className="flex flex-col lg:flex-row gap-12 mb-20 text-left">
                    <div className="lg:w-1/2">
                      <div className="aspect-square bg-white/5 border border-white/10 flex items-center justify-center p-8 overflow-hidden relative">
                        <Pizza
                          size={120}
                          className="text-white/5 absolute -bottom-10 -right-10 rotate-12"
                        />
                        <img
                          src={
                            selectedProduct.image ||
                            "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=600"
                          }
                          className="relative z-10 w-full h-full object-contain grayscale opacity-50 drop-shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="mt-8 p-6 bg-white/5 border-l-4 border-brand-neon">
                        <p className="text-xl text-brand-white font-medium italic opacity-90 leading-relaxed">
                          "{selectedProduct.desc}"
                        </p>
                      </div>
                    </div>

                    <div className="lg:w-1/2 space-y-10">
                      {/* SIZE SELECTION */}
                      {["pizza", "byo-pizza", "side-sized"].includes(
                        selectedProduct.type,
                      ) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">
                            Select Size
                          </h3>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(selectedProduct.type === "side-sized"
                              ? ["Medium", "Large"]
                              : ['8"', '12"', '14"', '18"']
                            ).map((size) => (
                              <button
                                key={size}
                                onClick={() =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    size,
                                  })
                                }
                                className={`py-4 border font-display text-lg ${selectedProduct.size === size ? "bg-brand-neon text-brand-black border-brand-neon shadow-lg shadow-brand-neon/20" : "border-white/10 hover:border-white/40 text-brand-white"}`}
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* WING COUNT */}
                      {selectedProduct.type === "wings" && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">
                            Wing Count
                          </h3>
                          <div className="grid grid-cols-3 gap-2">
                            {["8 Count", "12 Count", "18 Count"].map(
                              (count) => (
                                <button
                                  key={count}
                                  onClick={() =>
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      count,
                                    })
                                  }
                                  className={`py-4 border font-display text-lg ${selectedProduct.count === count ? "bg-brand-neon text-brand-black border-brand-neon" : "border-white/10 hover:border-white/40 text-brand-white"}`}
                                >
                                  {count}
                                </button>
                              ),
                            )}
                          </div>
                        </section>
                      )}

                      {/* CRUST SELECTION */}
                      {["pizza", "byo-pizza"].includes(
                        selectedProduct.type,
                      ) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">
                            Crust Type
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {["Original", "Cauliflower"].map((crust) => (
                              <button
                                key={crust}
                                onClick={() =>
                                  setSelectedProduct({
                                    ...selectedProduct,
                                    crust,
                                  })
                                }
                                className={`py-4 border font-display text-lg ${selectedProduct.crust === crust ? "bg-brand-neon text-brand-black border-brand-neon" : "border-white/10 hover:border-white/40 text-brand-white"}`}
                              >
                                {crust}
                              </button>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* TOPPINGS */}
                      {["pizza", "byo-pizza", "calzone"].includes(
                        selectedProduct.type,
                      ) && (
                        <section>
                          <h3 className="font-display text-2xl uppercase mb-4 tracking-widest border-b border-white/10 pb-2 text-brand-neon">
                            Toppings{" "}
                            <span className="text-[10px] opacity-40 ml-2 text-brand-white">
                              (Max 5 recommended)
                            </span>
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "Pepperoni",
                              "Sausage",
                              "Bacon",
                              "Ham",
                              "Mushroom",
                              "Onion",
                              "Bell Pepper",
                              "Fresh Jalapeño",
                            ].map((top) => {
                              const selected =
                                selectedProduct.toppings?.includes(top);
                              return (
                                <button
                                  key={top}
                                  onClick={() => {
                                    const current =
                                      selectedProduct.toppings || [];
                                    const next = selected
                                      ? current.filter((t: any) => t !== top)
                                      : [...current, top];
                                    setSelectedProduct({
                                      ...selectedProduct,
                                      toppings: next,
                                    });
                                  }}
                                  className={`py-3 px-4 border text-left flex justify-between items-center transition-all ${selected ? "bg-brand-red border-brand-red text-brand-white" : "border-white/10 hover:bg-white/5 text-brand-white"}`}
                                >
                                  <span className="text-sm font-bold uppercase tracking-tight">
                                    {top}
                                  </span>
                                  {selected ? (
                                    <Check size={16} />
                                  ) : (
                                    <Plus size={16} className="opacity-40" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      <div className="pt-6 border-t border-white/10">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1 text-brand-white">
                              Item Total
                            </p>
                            <span className="font-display text-5xl text-brand-neon">
                              ${selectedProduct.basePrice.toFixed(2)}
                            </span>
                          </div>
                          <p className="text-[10px] font-black uppercase text-brand-neon mb-2 italic">
                            Ready for heat? 🔥
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            if (
                              ["pizza", "byo-pizza"].includes(
                                selectedProduct.type,
                              ) &&
                              !selectedProduct.size
                            )
                              return;
                            if (
                              ["pizza", "byo-pizza"].includes(
                                selectedProduct.type,
                              ) &&
                              !selectedProduct.crust
                            )
                              return;
                            if (
                              selectedProduct.type === "wings" &&
                              !selectedProduct.count
                            )
                              return;

                            addToCart({
                              ...selectedProduct,
                              id: `${selectedProduct.id}-${selectedProduct.size || ""}-${selectedProduct.crust || ""}-${selectedProduct.count || ""}-${(selectedProduct.toppings || []).join("-")}`,
                              quantity: 1,
                              price: selectedProduct.basePrice,
                            });
                            setView("upsell");
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
            {view === "upsell" && (
              <div className="min-h-screen bg-brand-black noise-overlay flex items-center">
                <div className="max-w-4xl mx-auto p-6 md:p-12 w-full py-20 text-center relative z-10">
                  <ProgressSteps current={3} />
                  <h1 className="font-display text-6xl md:text-8xl mb-4 leading-none uppercase italic text-brand-neon">
                    Wait!
                  </h1>
                  <p className="text-2xl md:text-4xl uppercase font-black tracking-widest mb-20 text-brand-white">
                    Add Something to Your Order?
                  </p>

                  <div className="grid sm:grid-cols-3 gap-6 mb-20">
                    {[
                      {
                        name: "Breadsticks",
                        desc: "Crispy, warm, and perfect on the side.",
                        price: 6.99,
                        image:
                          "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&q=80&w=800",
                      },
                      {
                        name: "Wings",
                        desc: "Hot, crispy, and packed with flavor.",
                        price: 12.99,
                        image:
                          "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&q=80&w=800",
                      },
                      {
                        name: "Cold Drink",
                        desc: "2L Bottle, ready and cold.",
                        price: 3.5,
                        image:
                          "https://images.unsplash.com/photo-1629203851022-ae73151f9897?auto=format&fit=crop&q=80&w=800",
                      },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="card-concrete p-8 flex flex-col items-center group noise-overlay"
                      >
                        <img
                          src={item.image}
                          className="w-full aspect-square object-cover mb-8 grayscale group-hover:grayscale-0 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <h3 className="font-display text-2xl uppercase mb-2 text-brand-white">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-8 font-bold uppercase tracking-wider">
                          {item.desc}
                        </p>
                        <button
                          onClick={() => {
                            addToCart({
                              ...item,
                              id: item.name,
                              quantity: 1,
                              price: item.price,
                            });
                            setView("cart");
                          }}
                          className="btn-primary w-full py-4 text-sm"
                        >
                          Add for ${item.price}
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setView("cart")}
                    className="text-gray-500 font-display text-xl uppercase tracking-widest hover:text-brand-neon transition-colors underline underline-offset-8"
                  >
                    Nah, Just My Pizza Please
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: CART */}
            {view === "cart" && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader
                  title="Your Order"
                  onBack={() => setView("menu")}
                />
                <div className="max-w-4xl mx-auto p-6 md:p-12 relative z-10">
                  <ProgressSteps current={4} />

                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-2/3 space-y-6 text-brand-white">
                      {cart.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-white/10 noise-overlay">
                          <ShoppingBag
                            size={64}
                            className="mx-auto mb-6 text-gray-600"
                          />
                          <h2 className="font-display text-4xl uppercase mb-12">
                            Your cart is empty.
                          </h2>
                          <button
                            onClick={goToMenu}
                            className="btn-primary px-16 py-5"
                          >
                            Go To Menu
                          </button>
                        </div>
                      ) : (
                        cart.map((item, i) => (
                          <div
                            key={i}
                            className="flex gap-8 p-8 bg-white/5 border border-white/5 group relative noise-overlay"
                          >
                            <div className="w-24 h-24 bg-brand-black shrink-0 overflow-hidden border border-white/5">
                              <img
                                src={
                                  item.image ||
                                  "https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&q=80&w=200"
                                }
                                className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 transition-all duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-display text-3xl uppercase leading-none">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-4 bg-white/5 px-4 py-2 border border-white/10">
                                  <button
                                    onClick={() => updateQuantity(i, -1)}
                                    className="hover:text-brand-neon transition-colors"
                                  >
                                    <Minus size={18} />
                                  </button>
                                  <span className="font-display text-2xl w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(i, 1)}
                                    className="hover:text-brand-neon transition-colors"
                                  >
                                    <Plus size={18} />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black italic">
                                {item.size && `${item.size} • `}
                                {item.crust && `${item.crust} crust `}
                                {item.toppings &&
                                  item.toppings.length > 0 &&
                                  `• ${item.toppings.join(", ")}`}
                              </p>
                              <div className="mt-6 flex justify-between items-end">
                                <span className="font-display text-3xl text-brand-neon">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(i, -item.quantity)
                                  }
                                  className="text-[10px] font-black uppercase text-brand-red hover:underline tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  Remove Item
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}

                      {/* QUICK ADDS */}
                      {cart.length > 0 && (
                        <div className="bg-brand-neon/5 p-10 border-2 border-brand-neon/20 noise-overlay">
                          <h3 className="font-display text-2xl uppercase mb-8 tracking-widest text-brand-neon">
                            Customers Also Add:
                          </h3>
                          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
                            {[
                              { name: "Extra Ranch", price: 0.99 },
                              { name: "Cheese Bread", price: 7.99 },
                              { name: "2L Pepsi", price: 3.5 },
                            ].map((side) => (
                              <button
                                key={side.name}
                                onClick={() =>
                                  addToCart({
                                    ...side,
                                    id: side.name,
                                    quantity: 1,
                                    price: side.price,
                                  } as any)
                                }
                                className="shrink-0 bg-brand-black border border-white/10 px-8 py-5 flex flex-col items-center hover:border-brand-neon transition-all group"
                              >
                                <span className="font-display uppercase text-sm mb-2 group-hover:text-brand-neon transition-colors">
                                  {side.name}
                                </span>
                                <span className="font-black text-brand-neon text-xs">
                                  ${side.price}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="lg:w-1/3">
                      <div className="bg-brand-black border-2 border-brand-neon p-10 sticky top-32 noise-overlay">
                        <h3 className="font-display text-4xl uppercase mb-10 border-b-2 border-brand-neon/20 pb-6 text-brand-neon">
                          Order Summary
                        </h3>
                        <div className="space-y-6 font-bold text-xs uppercase tracking-widest">
                          <div className="flex justify-between">
                            <span className="opacity-40">Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-40">Tax (8.25%)</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          {orderType === "delivery" && (
                            <div className="flex justify-between text-brand-red">
                              <span>Delivery Fee</span>
                              <span>$4.99</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-5xl pt-10 border-t-2 border-brand-neon/20 mt-10">
                            <span className="font-display tracking-[0.1em]">
                              Total
                            </span>
                            <span className="font-display text-brand-neon">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 pt-6 opacity-40 italic text-[10px]">
                            <Clock size={16} />
                            <span>
                              Estimated{" "}
                              {orderType === "pickup" ? "20-25" : "45-55"} Mins
                            </span>
                          </div>
                        </div>
                        <button
                          disabled={cart.length === 0}
                          onClick={() => setView("checkout")}
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
            {view === "checkout" && (
              <div className="min-h-screen bg-brand-black noise-overlay">
                <FunnelHeader
                  title="Complete Your Order"
                  onBack={() => setView("cart")}
                />
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
                            {
                              label: "Full Name",
                              placeholder: "JESSE DOGGETT",
                            },
                            {
                              label: "Phone Number",
                              placeholder: "(806) 555-0123",
                            },
                          ].map((f) => (
                            <div key={f.label} className="group">
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-white/40 mb-2 group-focus-within:text-brand-neon transition-colors">
                                {f.label}
                              </label>
                              <input
                                type="text"
                                placeholder={f.placeholder}
                                className="w-full bg-brand-black border border-white/10 px-6 py-4 font-bold text-brand-white focus:border-brand-neon outline-none transition-all uppercase placeholder:opacity-20 placeholder:text-brand-white"
                              />
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="bg-white/5 p-8 border border-white/5 noise-overlay">
                        <h3 className="font-display text-2xl uppercase mb-6 flex items-center gap-3 text-brand-neon">
                          <CreditCard size={24} /> Payment Method
                        </h3>
                        <div className="space-y-3">
                          {["Credit Card", "Apple Pay", "Cash"].map((p) => (
                            <button
                              key={p}
                              className="w-full py-5 px-6 border border-white/10 text-left font-black uppercase tracking-widest text-xs hover:bg-brand-neon/10 hover:border-brand-neon transition-all flex justify-between items-center group text-brand-white"
                            >
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
                          <MapPin size={24} />{" "}
                          {orderType === "pickup"
                            ? "Store Location"
                            : "Delivery Details"}
                        </h3>
                        {orderType === "pickup" ? (
                          <div className="font-bold border-l-4 border-brand-red pl-6 py-2">
                            <p className="text-3xl uppercase font-display leading-tight text-brand-white">
                              {location} Main
                            </p>
                            <p className="text-brand-white/40 text-xs font-black uppercase tracking-widest mt-2 italic">
                              Ready ~20 mins.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-widest text-brand-white/40 mb-2">
                                Street Address
                              </label>
                              <input
                                type="text"
                                className="w-full bg-brand-black border border-white/10 px-6 py-4 outline-none focus:border-brand-neon font-bold text-brand-white"
                              />
                            </div>
                          </div>
                        )}
                      </section>

                      <div className="bg-brand-neon text-brand-black p-10 text-center relative overflow-hidden group noise-overlay">
                        <div className="relative z-10">
                          <h2 className="font-display text-5xl lg:text-7xl mb-2 leading-none uppercase">
                            Order Total
                          </h2>
                          <div className="font-display text-7xl lg:text-8xl mb-12 tracking-tighter">
                            ${total.toFixed(2)}
                          </div>
                          <button
                            onClick={() => setView("success")}
                            className="w-full bg-brand-black text-brand-white py-7 text-3xl font-display uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-4"
                          >
                            Place Order
                          </button>
                          <p className="mt-8 text-[10px] font-black uppercase tracking-widest opacity-60">
                            Ready when you are. No shortcuts.
                          </p>
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
            {view === "success" && (
              <div className="min-h-screen bg-brand-black noise-overlay flex items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="max-w-3xl w-full card-concrete p-12 md:p-20 text-center relative overflow-hidden noise-overlay"
                >
                  <div className="w-32 h-32 bg-brand-neon mx-auto rounded-full flex items-center justify-center text-brand-black mb-12 shadow-[0_0_50px_rgba(184,240,0,0.3)]">
                    <Check size={80} strokeWidth={4} />
                  </div>
                  <h1 className="font-display text-7xl md:text-9xl mb-6 leading-[0.95] uppercase italic text-brand-neon">
                    ORDER FIRE!
                  </h1>
                  <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] mb-12 text-brand-white opacity-80">
                    We're on it.
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4 bg-white/5 p-8 border border-white/5 mb-16 text-left relative z-10">
                    <div className="border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-neon mb-2 block">
                        Est. Time
                      </span>
                      <span className="font-display text-5xl text-brand-white leading-none">
                        {orderType === "pickup" ? "20" : "45"} MINS
                      </span>
                    </div>
                    <div className="pt-6 md:pt-0 md:pl-6">
                      <span className="text-[10px] uppercase font-black tracking-widest text-brand-red mb-2 block">
                        Pickup Code
                      </span>
                      <span className="font-display text-5xl text-brand-white leading-none tracking-tighter uppercase italic">
                        JP-{Math.floor(Math.random() * 9000 + 1000)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={backToHome}
                    className="btn-primary px-20 py-7 text-2xl w-full shadow-2xl"
                  >
                    Return To Home
                  </button>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-neon via-brand-red to-brand-neon" />
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isMarketingView && !isMenuOpen && <PromoStrip />}
    </div>
  );
}
