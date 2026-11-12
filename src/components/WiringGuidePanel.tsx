import React from 'react';
import { WiringMapping } from '../types/datasheet';
import { Zap, ArrowRight, ShieldAlert } from 'lucide-react';

interface WiringGuidePanelProps {
  wiringGuide: WiringMapping[];
  chipName: string;
}

export const WiringGuidePanel: React.FC<WiringGuidePanelProps> = ({ wiringGuide, chipName }) => {
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <span>Hardware Wiring & Breadboard Hookup Guide</span>
            <span className="text-xs font-mono text-cyan-400 font-normal">({chipName})</span>
          </h3>
          <p className="text-xs text-slate-400">
            Recommended pin connections to target host MCU with passive component guidelines
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {wiringGuide.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-slate-900/70 border border-slate-800 rounded-lg flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-5 h-5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[10px] flex items-center justify-center font-bold">
                  {item.chipPinNumber}
                </span>
                <span className="text-xs font-bold text-white">{item.chipPinName}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-mono text-cyan-300 font-semibold">{item.microcontrollerFunction}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{item.connectionNotes}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
