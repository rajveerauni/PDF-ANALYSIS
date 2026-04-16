'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { slideDown, btnHover, btnTap, btnSpring } from '@/lib/variants';

const NAV_LINKS = [
  { label: 'ANALYSIS', active: true },
  { label: 'VAULT',    active: false },
  { label: 'TERMINAL', active: false },
  { label: 'NETWORK',  active: false },
];

export default function Header() {
  return (
    <motion.header
      variants={slideDown}
      initial="initial"
      animate="animate"
      className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-background border-b border-primary/20 shadow-[0_0_15px_rgba(0,255,194,0.15)]"
    >
      <div className="text-xl font-bold tracking-tighter text-primary-container uppercase font-headline">
        ARCHITECT_AI
      </div>

      <nav className="hidden md:flex gap-8 items-center h-full">
        {NAV_LINKS.map(({ label, active }) => (
          <Link
            key={label}
            href="#"
            className={`font-headline uppercase tracking-[0.05em] text-sm transition-all px-1 py-1 hover:bg-primary/10 ${
              active
                ? 'text-primary-container border-b-2 border-primary-container'
                : 'text-primary/60 hover:text-primary-container'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <motion.button
          className="font-headline uppercase tracking-[0.05em] text-sm text-primary-container px-4 py-2 hover:bg-primary/10 transition-all"
          whileHover={btnHover}
          whileTap={btnTap}
          transition={btnSpring}
        >
          UP_LINK
        </motion.button>
      </div>
    </motion.header>
  );
}
