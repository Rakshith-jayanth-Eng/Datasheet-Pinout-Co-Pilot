import React, { useState } from 'react';
import { PlatformCodeBundle, TargetPlatform } from '../types/datasheet';
import { Terminal, Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeViewerProps {
  platformCode: PlatformCodeBundle;
  chipName: string;
  defaultPlatform?: TargetPlatform;
}

interface PlatformOption {
  id: TargetPlatform;
  label: string;
  framework: string;
  extension: string;
  badgeColor: string;
}

const PLATFORMS: PlatformOption[] = [
  { id: 'stm32_hal', label: 'STM32 HAL', framework: 'STM32Cube HAL C', extension: 'c', badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { id: 'esp_idf', label: 'ESP-IDF', framework: 'Espressif C API', extension: 'c', badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30' },
  { id: 'arduino', label: 'Arduino C++', framework: 'Arduino Core / Wiring', extension: 'ino', badgeColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
  { id: 'rp2040_pico', label: 'Raspberry Pi Pico', framework: 'Pico C/C++ SDK', extension: 'c', badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
];

export const CodeViewer: React.FC<CodeViewerProps> = ({
  platformCode,
  chipName,
  defaultPlatform = 'stm32_hal',
}) => {
  const [activePlatform, setActivePlatform] = useState<TargetPlatform>(defaultPlatform);
  const [copied, setCopied] = useState(false);

  const activeOption = PLATFORMS.find((p) => p.id === activePlatform) || PLATFORMS[0];
  const currentCode = platformCode[activePlatform] || '// Code snippet not available for this target.';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleDownload = () => {
    const filename = `${chipName.toLowerCase()}_${activePlatform}_init.${activeOption.extension}`;
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Split lines for line numbers
  const lines = currentCode.split('\n');

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Ready-to-Compile C/C++ Peripheral Initialization</span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${activeOption.badgeColor}`}>
                {activeOption.framework}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Modular GPIO pin defines, clock initializations, bus configs, and chip verification routines
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border cursor-pointer ${
              copied
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>.{activeOption.extension}</span>
          </button>
        </div>
      </div>

      {/* Target Platform Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg mb-4 overflow-x-auto text-xs font-mono">
        {PLATFORMS.map((platform) => {
          const isActive = activePlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => setActivePlatform(platform.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{platform.label}</span>
            </button>
          );
        })}
      </div>

      {/* Code Container with Line Numbers */}
      <div className="relative border border-slate-800 rounded-lg overflow-hidden bg-[#090d16]">
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <span className="text-slate-300 font-semibold">
              {chipName.toLowerCase()}_{activePlatform}.{activeOption.extension}
            </span>
          </div>
          <span className="text-slate-500">{lines.length} lines · UTF-8</span>
        </div>

        <div className="overflow-x-auto max-h-[460px] p-4 text-xs font-mono leading-relaxed flex">
          {/* Line Numbers Column */}
          <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800/80 mr-4 font-mono tabular-nums">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Code Text Content */}
          <pre className="text-slate-200 font-mono whitespace-pre flex-1">
            <code>{currentCode}</code>
          </pre>
        </div>
      </div>

      {/* Quick Compilation Checklist */}
      <div className="mt-4 p-3 bg-slate-900/60 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Self-contained drop-in driver: includes pin defines, clock gating, and register readback</span>
        </div>
        <span className="text-[11px] font-mono text-cyan-400">Compile Target: {activeOption.framework}</span>
      </div>
    </div>
  );
};
