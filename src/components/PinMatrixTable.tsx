import React, { useState } from 'react';
import { PinDefinition, PinType } from '../types/datasheet';
import { getPinTypeColor } from './ChipPackageVisualizer';
import { Search, Download, Layers, ShieldAlert } from 'lucide-react';

interface PinMatrixTableProps {
  pins: PinDefinition[];
  chipName: string;
  selectedPinNumber: number | null;
  onSelectPin: (pinNumber: number | null) => void;
}

export const PinMatrixTable: React.FC<PinMatrixTableProps> = ({
  pins,
  chipName,
  selectedPinNumber,
  onSelectPin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<PinType | 'ALL'>('ALL');

  const safePins = Array.isArray(pins) ? pins : [];
  const availableTypes: PinType[] = Array.from(new Set(safePins.map((p) => p.type)));

  const filteredPins = safePins.filter((pin) => {
    const matchesSearch =
      searchTerm === '' ||
      pin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.pinNumber.toString().includes(searchTerm) ||
      pin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.voltageTolerance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pin.alternateFunctions.some((alt) => alt.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = selectedType === 'ALL' || pin.type === selectedType;

    return matchesSearch && matchesType;
  });

  const exportCsv = () => {
    const headers = [
      'Pin Number',
      'Signal Name',
      'Type',
      'Direction',
      'Voltage Tolerance',
      'Pull Config',
      'Alternate Functions',
      'Description',
    ];
    const rows = pins.map((p) => [
      p.pinNumber,
      `"${p.name}"`,
      p.type,
      p.direction,
      `"${p.voltageTolerance}"`,
      `"${p.pullConfig}"`,
      `"${p.alternateFunctions.join('; ')}"`,
      `"${p.description.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${chipName.toLowerCase()}_pinout_matrix.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Pinout & Electrical Matrix</span>
              <span className="text-xs font-mono text-cyan-400 font-normal">
                ({pins.length} total pins)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Pin numbers, electrical limits, pull-up/down requirements, and multiplexed functions
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pin, signal, tolerance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-56"
            />
          </div>

          {/* Export CSV Button */}
          <button
            onClick={exportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 mb-4 overflow-x-auto pb-1 text-xs font-mono">
        <button
          onClick={() => setSelectedType('ALL')}
          className={`px-2.5 py-1 rounded transition-colors ${
            selectedType === 'ALL'
              ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-medium'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
          }`}
        >
          All ({pins.length})
        </button>
        {availableTypes.map((type) => {
          const count = pins.filter((p) => p.type === type).length;
          const colors = getPinTypeColor(type);
          const isSelected = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 rounded transition-colors border ${
                isSelected
                  ? `${colors.bg} ${colors.text} ${colors.border} font-semibold ring-1 ring-cyan-400`
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type} ({count})
            </button>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-900/90 text-slate-400 font-mono border-b border-slate-800 text-[11px]">
              <th className="py-2.5 px-3 w-16">PIN #</th>
              <th className="py-2.5 px-3 w-32">SIGNAL</th>
              <th className="py-2.5 px-3 w-28">TYPE</th>
              <th className="py-2.5 px-3 w-24">DIR</th>
              <th className="py-2.5 px-3 w-36">VOLTAGE LIMIT</th>
              <th className="py-2.5 px-3 w-48">PULL CONFIG</th>
              <th className="py-2.5 px-3">DESCRIPTION & ALTERNATES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredPins.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                  No pins found matching criteria.
                </td>
              </tr>
            ) : (
              filteredPins.map((pin) => {
                const colors = getPinTypeColor(pin.type);
                const isSelected = selectedPinNumber === pin.pinNumber;

                return (
                  <tr
                    key={pin.pinNumber}
                    onClick={() => onSelectPin(isSelected ? null : pin.pinNumber)}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 text-slate-100 ring-1 ring-cyan-500/50'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    {/* Pin # */}
                    <td className="py-2 px-3 font-bold">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-800 border border-slate-700 text-slate-200 text-xs tabular-nums">
                        {pin.pinNumber}
                      </span>
                    </td>

                    {/* Signal Name */}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span>{pin.name}</span>
                        {pin.isCritical && (
                          <span title="Critical Pin">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400 inline" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
                      >
                        {pin.type}
                      </span>
                    </td>

                    {/* Direction */}
                    <td className="py-2 px-3 text-[11px] text-slate-400">{pin.direction}</td>

                    {/* Voltage Limit */}
                    <td className="py-2 px-3">
                      <span className="text-cyan-300 font-semibold">{pin.voltageTolerance}</span>
                    </td>

                    {/* Pull Config */}
                    <td className="py-2 px-3 text-slate-300 text-[11px]">{pin.pullConfig}</td>

                    {/* Description & Alternates */}
                    <td className="py-2 px-3 font-sans">
                      <p className="text-xs text-slate-300">{pin.description}</p>
                      {pin.alternateFunctions && pin.alternateFunctions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                          <span className="text-slate-500">Mux:</span>
                          {pin.alternateFunctions.map((alt, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded border border-slate-700"
                            >
                              {alt}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
