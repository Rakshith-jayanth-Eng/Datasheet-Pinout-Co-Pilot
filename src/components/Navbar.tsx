import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSelectSection: (sectionId: string) => void;
  onQuickLoadSX1278: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectSection,
  onQuickLoadSX1278,
  activeSection,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-3.5">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectSection('workbench');
            }}
            className="text-base font-bold tracking-tight text-white font-mono hover:text-cyan-300 transition-colors"
          >
            Datasheet Pinout Co-Pilot
          </a>
        </div>

        {/* Zone 2: 4-5 Clean Single-Line Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-mono text-slate-400 font-medium">
          <button
            onClick={() => onSelectSection('workbench')}
            className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'workbench' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Workbench
          </button>
          <button
            onClick={() => onSelectSection('visualizer')}
            className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'visualizer' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            IC Package
          </button>
          <button
            onClick={() => onSelectSection('matrix')}
            className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'matrix' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Pin Matrix
          </button>
          <button
            onClick={() => onSelectSection('warnings')}
            className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'warnings' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Hardware Traps
          </button>
          <button
            onClick={() => onSelectSection('code')}
            className={`hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeSection === 'code' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Init Driver
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onQuickLoadSX1278}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SX1278 Sample Preset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
