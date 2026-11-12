import React from 'react';
import { PinDefinition, PinType } from '../types/datasheet';
import { Zap, ShieldAlert, Cpu } from 'lucide-react';

interface ChipPackageVisualizerProps {
  chipName: string;
  packageType: string;
  pins: PinDefinition[];
  selectedPinNumber: number | null;
  onSelectPin: (pinNumber: number | null) => void;
}

export const getPinTypeColor = (type: PinType): { bg: string; text: string; border: string; glow: string } => {
  switch (type) {
    case 'POWER':
      return { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/40', glow: 'shadow-rose-500/20' };
    case 'GND':
      return { bg: 'bg-slate-700/30', text: 'text-slate-300', border: 'border-slate-600', glow: 'shadow-slate-500/10' };
    case 'SPI':
      return { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/20' };
    case 'I2C':
      return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' };
    case 'UART':
      return { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/40', glow: 'shadow-blue-500/20' };
    case 'INTERRUPT':
      return { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/40', glow: 'shadow-purple-500/20' };
    case 'RESET':
      return { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' };
    case 'RF':
      return { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/40', glow: 'shadow-teal-500/20' };
    case 'ANALOG':
      return { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/40', glow: 'shadow-orange-500/20' };
    default:
      return { bg: 'bg-slate-800/40', text: 'text-slate-400', border: 'border-slate-700', glow: 'shadow-slate-500/10' };
  }
};

export const ChipPackageVisualizer: React.FC<ChipPackageVisualizerProps> = ({
  chipName,
  packageType,
  pins,
  selectedPinNumber,
  onSelectPin,
}) => {
  // Sort pins numerically with safe array check
  const safePins = Array.isArray(pins) ? pins : [];
  const sortedPins = [...safePins].sort((a, b) => a.pinNumber - b.pinNumber);
  const total = sortedPins.length;

  // Split pins into Left side (1 .. total/2) and Right side (total .. total/2 + 1) for DIP/SOIC dual-inline representation
  const half = Math.ceil(total / 2);
  const leftPins = sortedPins.slice(0, half);
  // In standard IC pin numbering, pin counting goes counter-clockwise around package:
  // Left side top-to-bottom: 1 to half
  // Right side bottom-to-top: half+1 to total, meaning right top pin is highest pin number
  const rightPins = sortedPins.slice(half).reverse();

  const activePin = pins.find((p) => p.pinNumber === selectedPinNumber);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background Silicon Die Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>{chipName || 'IC Package Diagram'}</span>
              <span className="text-xs font-mono text-cyan-400 font-normal">[{packageType}]</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive dual-inline footprint · Hover or click pins to inspect electrical ratings
            </p>
          </div>
        </div>
        {selectedPinNumber && (
          <button
            onClick={() => onSelectPin(null)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Visual IC Package Body */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full max-w-xl flex items-center justify-between gap-3">
          {/* Left Pins Column */}
          <div className="flex-1 flex flex-col gap-2">
            {leftPins.map((pin) => {
              const colors = getPinTypeColor(pin.type);
              const isSelected = selectedPinNumber === pin.pinNumber;
              return (
                <div
                  key={pin.pinNumber}
                  onClick={() => onSelectPin(isSelected ? null : pin.pinNumber)}
                  onMouseEnter={() => onSelectPin(pin.pinNumber)}
                  className={`group relative flex items-center justify-end gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow} ring-1 ring-cyan-400`
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px] text-right font-medium">
                    {pin.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {pin.type}
                  </span>
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {pin.pinNumber}
                  </div>
                  {/* Pin Lead */}
                  <div
                    className={`h-[2px] w-3 ${
                      isSelected ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700 group-hover:bg-slate-500'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Central IC Body */}
          <div className="w-36 self-stretch min-h-[300px] bg-[#0c121e] border-2 border-slate-700/80 rounded-xl relative flex flex-col items-center justify-between py-6 px-3 shadow-inner">
            {/* Package Pin 1 Notch */}
            <div className="w-8 h-4 bg-slate-900 border border-slate-700 rounded-b-full shadow-inner" />

            <div className="text-center my-auto">
              <span className="text-[10px] tracking-widest text-slate-500 font-mono uppercase block mb-1">
                SEMICONDUCTOR
              </span>
              <p className="text-base font-bold tracking-wider text-slate-200 font-mono">{chipName}</p>
              <p className="text-[11px] text-cyan-400/90 font-mono mt-0.5">{packageType}</p>
              <div className="mt-3 flex justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
              </div>
            </div>

            <span className="text-[9px] font-mono text-slate-600 tracking-wider">REV 1.0</span>
          </div>

          {/* Right Pins Column */}
          <div className="flex-1 flex flex-col gap-2">
            {rightPins.map((pin) => {
              const colors = getPinTypeColor(pin.type);
              const isSelected = selectedPinNumber === pin.pinNumber;
              return (
                <div
                  key={pin.pinNumber}
                  onClick={() => onSelectPin(isSelected ? null : pin.pinNumber)}
                  onMouseEnter={() => onSelectPin(pin.pinNumber)}
                  className={`group relative flex items-center justify-start gap-2 px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? `${colors.bg} ${colors.border} shadow-lg ${colors.glow} ring-1 ring-cyan-400`
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  {/* Pin Lead */}
                  <div
                    className={`h-[2px] w-3 ${
                      isSelected ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-700 group-hover:bg-slate-500'
                    }`}
                  />
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {pin.pinNumber}
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${colors.bg} ${colors.text} ${colors.border}`}
                  >
                    {pin.type}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 truncate max-w-[120px] font-medium">
                    {pin.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Pin Details Inspector Drawer */}
        {activePin ? (
          <div className="w-full mt-5 bg-slate-950/80 border border-cyan-500/40 rounded-lg p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg border flex items-center justify-center font-mono font-bold text-sm ${
                  getPinTypeColor(activePin.type).bg
                } ${getPinTypeColor(activePin.type).text} ${getPinTypeColor(activePin.type).border}`}
              >
                P{activePin.pinNumber}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">{activePin.name}</span>
                  <span className="text-xs font-mono text-slate-400">· {activePin.direction}</span>
                  {activePin.isCritical && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      CRITICAL
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">{activePin.description}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">VOLTAGE LIMIT</span>
                <span className="text-cyan-300 font-semibold">{activePin.voltageTolerance}</span>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                <span className="text-slate-500 text-[10px] block">PULL CONFIG</span>
                <span className="text-slate-300">{activePin.pullConfig}</span>
              </div>
              {activePin.alternateFunctions && activePin.alternateFunctions.length > 0 && (
                <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">ALTERNATE FUNCTIONS</span>
                  <span className="text-slate-400">{activePin.alternateFunctions.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full mt-4 text-center py-2 text-xs text-slate-500 font-mono">
            Hover over any pin above to preview electrical limits and internal pull configurations
          </div>
        )}
      </div>
    </div>
  );
};
