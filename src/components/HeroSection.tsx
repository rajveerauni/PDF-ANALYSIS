'use client';

import { motion } from 'framer-motion';
import { btnHover, btnTap, btnSpring } from '@/lib/variants';

interface HeroSectionProps {
  onInitiate: () => void;
}

export default function HeroSection({ onInitiate }: HeroSectionProps) {
  return (
    <section className="relative px-6 py-16 md:py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      {/* Left copy */}
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="text-5xl md:text-7xl font-bold font-headline uppercase tracking-[0.05em] leading-none">
          Pixelated <br />
          <span className="text-primary-container">Intelligence</span>
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-lg leading-relaxed">
          Unlocking deep insights from your documents through neural pixel processing.
          Architecture-grade document analysis for the new digital frontier.
        </p>
        <motion.button
          onClick={onInitiate}
          className="bg-primary-container text-on-primary-container px-10 py-5 font-headline font-bold uppercase tracking-widest text-lg pixel-cut hover:shadow-[0_0_20px_rgba(0,255,194,0.4)] transition-shadow"
          whileHover={btnHover}
          whileTap={btnTap}
          transition={btnSpring}
        >
          INITIATE UPLOAD
        </motion.button>
      </motion.div>

      {/* Right visual */}
      <motion.div
        className="relative flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
      >
        <div className="w-full aspect-square max-w-[450px] border-4 border-primary/20 p-4 relative">
          {/* Corner accents */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
            <div
              key={pos}
              className={`absolute w-4 h-4 bg-primary-container ${
                pos === 'top-left'     ? '-top-1 -left-1' :
                pos === 'top-right'    ? '-top-1 -right-1' :
                pos === 'bottom-left'  ? '-bottom-1 -left-1' :
                                         '-bottom-1 -right-1'
              }`}
            />
          ))}
          <div className="w-full h-full bg-surface-container-high overflow-hidden relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9otHC2BubY-GZbPygdRBJHojCO8dSh1LpfkFhsMe5RD1Kv597GQ-uadINA8YVA0zjlEKHHhjalSDPxETu--bHq64wwhpjquElW9WVGA3yvE9dn7i26KL_lXnStY0VaBCLOr5Zgzkujg5YiCcx01jxj3xB8U1KiKiuSg49da8uRBmtRl1IoXhLjMkGJJ-MLuzFdyMH2hBy2mwjdVx3POvUZ9m3_RCbl8-SUW1AxswcaiIFiQDzgaZ7Nh4sO6lY_Of3_KXZEXW10ynI"
              alt="Pixel art glowing book, neon mint lines, brutalist style"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            <div className="absolute top-4 left-4 font-headline text-[10px] text-primary-container tracking-[0.2em] bg-black/80 px-2 py-1">
              CORE_UNIT_01
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
