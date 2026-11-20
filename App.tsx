import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  User,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "MIDNIGHT XOXO",
    notes: "Vanilla, Jasmine, Amber",
    price: "₹1,499",
    size: "50ml",
    color: "bg-lavender-200",
    image:
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "SOFT CHAOS",
    notes: "Musk, Peony, Sandalwood",
    price: "₹1,299",
    size: "50ml",
    color: "bg-pink-200",
    image:
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "BARE SKIN",
    notes: "Fig, Cedar, White Tea",
    price: "₹1,699",
    size: "100ml",
    color: "bg-stone-200",
    image:
      "https://images.unsplash.com/photo-1592914610354-fd354ea45e48?q=80&w=800&auto=format&fit=crop",
  },
];

const NavItem = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="relative group text-xs tracking-[0.15em] uppercase font-semibold"
  >
    {label}
    <span
      className={`absolute -bottom-1 left-0 h-[1px] bg-luv-black transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`}
    />
  </button>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const sections = ["HOME", "SHOP", "ABOUT", "CONTACT"];

  // --- GSAP HORIZONTAL SCROLL LOGIC ---
  useEffect(() => {
    let ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".section-panel");

      // Initialize horizontal scroll only on desktop
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": function () {
          gsap.to(containerRef.current, {
            x: () => -(containerRef.current!.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              pin: true,
              scrub: 1,
              start: "top top",
              end: () =>
                "+=" + (containerRef.current!.scrollWidth - window.innerWidth),
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                // Update active nav based on scroll progress
                const progress = self.progress;
                const sectionIndex = Math.round(
                  progress * (sections.length - 1),
                );
                setActiveSection(sectionIndex);
              },
            },
          });

          // Parallax effects for background elements during horizontal scroll
          panels.forEach((panel: any, i) => {
            const bgElements = panel.querySelectorAll(".parallax-bg");
            if (bgElements.length > 0) {
              gsap.to(bgElements, {
                x: () => -100 * (i + 1),
                ease: "none",
                scrollTrigger: {
                  trigger: containerRef.current,
                  scrub: 1,
                  start: "top top",
                  end: () =>
                    "+=" +
                    (containerRef.current!.scrollWidth - window.innerWidth),
                },
              });
            }
          });
        },
        // Mobile view - standard vertical scrolling
        "(max-width: 1023px)": function () {
          // Reset any transforms
          gsap.set(containerRef.current, { x: 0, clearProps: "all" });

          // Add simple fade-in on scroll for mobile sections
          panels.forEach((panel: any) => {
            gsap.from(panel.querySelectorAll(".animate-on-scroll"), {
              y: 30,
              opacity: 0,
              duration: 0.8,
              stagger: 0.1,
              scrollTrigger: {
                trigger: panel,
                start: "top 80%",
              },
            });
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- NAVIGATION FUNCTION ---
  const scrollToSection = (index: number) => {
    setActiveSection(index);
    if (window.innerWidth >= 1024 && containerRef.current) {
      const sectionWidth = window.innerWidth;
      const targetX = -(index * sectionWidth);

      gsap.to(window, {
        scrollTo: targetX,
        duration: 1,
        ease: "power2.inOut",
      });
    } else {
      // Mobile: scroll to DOM element
      const el = document.getElementById(sections[index].toLowerCase());
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // --- INITIAL LOAD ANIMATION (HOMEPAGE) ---
  useEffect(() => {
    const tl = gsap.timeline();
    tl.from(".hero-blur-bg", { opacity: 0, duration: 1.2, ease: "power2.out" })
      .from(
        ".hero-bottle",
        { y: 30, opacity: 0, duration: 1.2, ease: "power2.out" },
        "-=0.8",
      )
      .from(
        ".hero-title",
        { y: 20, opacity: 0, duration: 0.9, ease: "power3.out" },
        "-=0.8",
      )
      .from(
        ".hero-subtitle",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6",
      )
      .from(
        ".hero-cta",
        { y: 20, opacity: 0, duration: 0.8, ease: "power2.out" },
        "-=0.6",
      );
  }, []);

  const addToBag = () => {
    setCartCount((prev) => prev + 1);
    setIsCartOpen(true);
    setTimeout(() => setIsCartOpen(false), 3000); // Auto close after 3s
  };

  return (
    <div className="relative min-h-screen">
      {/* --- PERSISTENT HEADER --- */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-multiply">
        {/* Logo */}
        <div
          onClick={() => scrollToSection(0)}
          className="cursor-pointer group flex flex-col font-sans font-black text-2xl md:text-3xl leading-[0.8] tracking-tighter"
        >
          <span>
            luv
            <span className="text-xs align-top group-hover:text-luv-lavender transition-colors">
              ♥
            </span>
          </span>
          <span>note</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {sections.map((sec, i) => (
            <NavItem
              key={sec}
              label={sec}
              active={activeSection === i}
              onClick={() => scrollToSection(i)}
            />
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="hover:text-luv-lavender transition-colors"
          >
            <Search size={20} strokeWidth={2} />
          </button>
          <button className="hover:text-luv-lavender transition-colors hidden sm:block">
            <User size={20} strokeWidth={2} />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-luv-lavender transition-colors"
          >
            <ShoppingBag size={20} strokeWidth={2} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-luv-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* --- SEARCH OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] bg-luv-cream/95 backdrop-blur-md flex items-center justify-center">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-8 right-8 hover:rotate-90 transition-transform"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-2xl px-6">
            <input
              type="text"
              placeholder="Search fragrances..."
              className="w-full bg-transparent border-b-2 border-luv-black text-3xl md:text-5xl font-black uppercase tracking-tighter outline-none placeholder:text-luv-black/20 pb-4"
              autoFocus
            />
            <p className="mt-4 text-sm text-luv-black/50 uppercase tracking-widest">
              Press Enter to search
            </p>
          </div>
        </div>
      )}

      {/* --- CART OVERLAY --- */}
      <div
        className={`fixed inset-y-0 right-0 z-[100] w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold tracking-tight">
              YOUR BAG ({cartCount})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="hover:rotate-90 transition-transform"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cartCount === 0 ? (
              <p className="text-gray-500 text-sm text-center mt-10">
                Your bag is empty.
              </p>
            ) : (
              <div className="flex gap-4 mb-6">
                <div className="w-24 h-32 bg-luv-blush rounded-md overflow-hidden">
                  <img
                    src={PRODUCTS[0].image}
                    className="w-full h-full object-cover"
                    alt="product"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm">{PRODUCTS[0].name}</h3>
                  <p className="text-xs text-gray-500 mt-1">50ml</p>
                  <p className="font-semibold mt-2">₹1,499</p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-auto">
            <div className="flex justify-between font-bold mb-4">
              <span>Subtotal</span>
              <span>₹{cartCount > 0 ? "1,499" : "0"}</span>
            </div>
            <button className="w-full bg-luv-black text-white py-4 rounded-full font-bold text-sm hover:bg-opacity-80 transition-opacity">
              CHECKOUT
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN SCROLL CONTAINER --- */}
      <div
        ref={containerRef}
        className="horizontal-container flex-col lg:flex-row"
      >
        {/* 1. HOME SECTION */}
        <section
          id="home"
          className="section-panel flex flex-col justify-center items-center h-screen relative px-6"
        >
          {/* Background Ambient Glows & Typography */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Blurred Typography */}
            <div className="hero-blur-bg absolute top-[10%] left-[-8%] text-massive text-luv-lavender bg-blur-element -rotate-12 opacity-30 select-none">
              xoxo
            </div>
            <div className="hero-blur-bg absolute bottom-[10%] right-[-8%] text-massive text-luv-pink bg-blur-element rotate-12 opacity-30 select-none">
              xoxo
            </div>

            {/* Subtle radial backdrop for depth */}
            <div className="hero-bottle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[500px] h-[340px] md:h-[500px] bg-luv-lavender/30 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Central Content */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative">
              <h1 className="hero-title text-massive text-luv-black tracking-tighter drop-shadow-sm select-none">
                luvnote
              </h1>
              {/* Decorative Note Icon */}
              <div className="absolute -top-3 -right-6 md:-right-10 animate-float text-luv-black">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            </div>

            <p className="hero-subtitle text-lg md:text-2xl font-bold tracking-tight text-luv-black mt-4 mb-8">
              A Fragrance by Nobody.
            </p>

            <button
              onClick={() => scrollToSection(1)}
              className="hero-cta group bg-luv-black text-white px-8 py-4 rounded-full flex items-center gap-3 font-semibold text-sm shadow-md hover:bg-black hover:scale-105 active:scale-95 transition-all duration-300"
            >
              BUY NOW
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          {/* Bottom Elements */}
          <div className="absolute bottom-8 left-6 md:left-12 flex items-center gap-4 text-xs font-semibold tracking-widest uppercase">
            <div className="w-8 h-[1px] bg-luv-black"></div>
            SCENT IS PERSONAL.
          </div>

          <div className="absolute bottom-8 right-6 md:right-12 flex items-center gap-6">
            <span className="text-xs font-semibold tracking-widest">
              01 / 03
            </span>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-luv-black/5 rounded-full transition-colors">
                <ArrowLeft size={16} />
              </button>
              <button className="p-2 hover:bg-luv-black/5 rounded-full transition-colors">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* 2. SHOP SECTION */}
        <section
          id="shop"
          className="section-panel flex flex-col h-screen bg-lavender-50/20"
        >
          <div className="w-full h-full overflow-y-auto overflow-x-hidden p-6 md:p-24 pt-32">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter mb-4">
                FIND YOUR
                <br />
                FEELING.
              </h2>
              <p className="text-sm md:text-base text-luv-black/60 max-w-md mb-16 font-medium">
                Some things are better remembered through scent. Discover the
                collection.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {PRODUCTS.map((product) => (
                  <div key={product.id} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToBag();
                        }}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-luv-black hover:text-white"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <span className="font-semibold">{product.price}</span>
                    </div>
                    <p className="text-sm text-luv-black/50 mb-3">
                      {product.notes}
                    </p>
                    <span className="text-xs font-bold border border-luv-black/20 px-2 py-1 rounded-full">
                      {product.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ABOUT SECTION */}
        <section
          id="about"
          className="section-panel flex flex-col justify-center h-screen px-6 md:px-24 bg-luv-cream/30 overflow-hidden"
        >
          <div className="parallax-bg absolute top-20 right-10 text-massive text-luv-lavender/20 opacity-50 blur-sm select-none">
            FEEL
          </div>

          <div className="max-w-4xl relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter leading-[1.1] mb-12 animate-on-scroll">
              NOT JUST A<br />
              FRAGRANCE.
              <br />
              <span className="text-luv-lavender">A FEELING.</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 text-sm md:text-base text-luv-black/70 leading-relaxed font-medium">
              <p className="animate-on-scroll">
                Every scent holds a story. Some remind you of a person, some of
                a place, and some of a version of yourself you never want to
                forget.
              </p>
              <p className="animate-on-scroll">
                Luvnote is about all those little things that words cannot
                always explain. No rules. No identities. No perfect definitions.
              </p>
            </div>

            <div className="mt-16 flex items-center gap-6 animate-on-scroll">
              <div className="w-16 h-[1px] bg-luv-black"></div>
              <p className="font-display font-bold uppercase tracking-widest text-lg">
                A Fragrance by Nobody.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CONTACT SECTION */}
        <section
          id="contact"
          className="section-panel flex flex-col justify-center h-screen px-6 md:px-24 bg-luv-blush/50 overflow-hidden"
        >
          <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter leading-tight mb-6 animate-on-scroll">
                LET'S KEEP
                <br />
                IN TOUCH.
              </h2>
              <p className="text-luv-black/60 mb-10 text-sm md:text-base font-medium animate-on-scroll">
                Got something on your mind? We'd love to hear it.
              </p>

              <div className="flex gap-4 animate-on-scroll">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-luv-black/20 flex items-center justify-center hover:bg-luv-black hover:text-white transition-colors"
                >
                  <span className="text-xs font-bold">IG</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-luv-black/20 flex items-center justify-center hover:bg-luv-black hover:text-white transition-colors"
                >
                  <span className="text-xs font-bold">TW</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full border border-luv-black/20 flex items-center justify-center hover:bg-luv-black hover:text-white transition-colors"
                >
                  <span className="text-xs font-bold">PI</span>
                </a>
              </div>
            </div>

            <form
              className="flex flex-col gap-6 w-full max-w-md animate-on-scroll"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-luv-black/20 py-3 outline-none focus:border-luv-black transition-colors peer text-sm font-medium"
                  placeholder=" "
                />
                <label className="absolute left-0 top-3 text-luv-black/40 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs">
                  Name
                </label>
              </div>
              <div className="relative group">
                <input
                  type="email"
                  required
                  className="w-full bg-transparent border-b border-luv-black/20 py-3 outline-none focus:border-luv-black transition-colors peer text-sm font-medium"
                  placeholder=" "
                />
                <label className="absolute left-0 top-3 text-luv-black/40 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs">
                  Email
                </label>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  required
                  className="w-full bg-transparent border-b border-luv-black/20 py-3 outline-none focus:border-luv-black transition-colors peer text-sm font-medium"
                  placeholder=" "
                />
                <label className="absolute left-0 top-3 text-luv-black/40 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs">
                  Subject
                </label>
              </div>
              <div className="relative group">
                <textarea
                  required
                  rows={3}
                  className="w-full bg-transparent border-b border-luv-black/20 py-3 outline-none focus:border-luv-black transition-colors peer text-sm font-medium resize-none"
                  placeholder=" "
                ></textarea>
                <label className="absolute left-0 top-3 text-luv-black/40 text-sm transition-all peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs">
                  Message
                </label>
              </div>

              <button
                type="submit"
                className="mt-4 bg-luv-black text-white px-8 py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-opacity-80 transition-opacity w-full md:w-auto self-start"
              >
                SEND MESSAGE <ArrowUpRight size={18} />
              </button>
            </form>
          </div>

          <div className="absolute bottom-8 left-0 w-full px-6 md:px-24 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-luv-black/40 tracking-wider uppercase">
            <p>© 2024 LUVNOTE. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-luv-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-luv-black transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
