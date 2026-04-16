'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { slideRight, btnHover, btnTap, btnSpring } from '@/lib/variants';

const NAV_ITEMS = [
  { icon: 'grid_view',      label: 'DASHBOARD',   active: true  },
  { icon: 'picture_as_pdf', label: 'PDF_SCAN',    active: false },
  { icon: 'terminal',       label: 'NEURAL_LOGS', active: false },
  { icon: 'hub',            label: 'DATA_MAP',    active: false },
  { icon: 'settings',       label: 'SETTINGS',    active: false },
];

export default function Sidebar() {
  return (
    <motion.aside
      variants={slideRight}
      initial="initial"
      animate="animate"
      className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-container-low border-r border-primary/20 hidden lg:flex flex-col z-40"
    >
      {/* Operator badge */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-container/20 border border-primary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-primary-container">person</span>
        </div>
        <div>
          <div className="text-lg font-black text-primary font-headline">OPERATOR_01</div>
          <div className="text-[10px] text-white/40 tracking-widest font-headline">LVL_4_ACCESS</div>
        </div>
      </div>

      <div className="mt-4 px-3 flex-grow">
        <motion.button
          className="w-full bg-primary-container text-on-primary-container font-headline py-3 mb-6 font-bold uppercase tracking-widest flex items-center justify-center gap-2 pixel-cut"
          whileHover={btnHover}
          whileTap={btnTap}
          transition={btnSpring}
        >
          <span className="material-symbols-outlined">add</span> NEW_SCAN
        </motion.button>

        <nav className="space-y-1">
          {NAV_ITEMS.map(({ icon, label, active }) => (
            <Link
              key={label}
              href="#"
              className={`flex items-center gap-3 px-4 py-3 font-headline text-xs uppercase tracking-widest transition-all hover:translate-x-1 ${
                active
                  ? 'bg-primary/10 text-primary border-r-4 border-primary'
                  : 'text-white/40 hover:text-primary/80 hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-6 mt-auto">
        <Link href="#" className="flex items-center gap-3 text-white/40 hover:text-error font-headline text-xs uppercase tracking-widest transition-colors">
          <span className="material-symbols-outlined">logout</span> LOGOUT
        </Link>
      </div>
    </motion.aside>
  );
}
