import React, { useRef } from 'react';
import { TargetPlatform } from '../types/datasheet';
import { SX1278_PRESET, BME280_PRESET } from '../data/presets';
import { Sparkles, UploadCloud, FileText, Cpu, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';

interface DatasheetInputProps {
  datasheetText: string;
  onDatasheetTextChange: (text: string) => void;
  preferredPlatform: TargetPlatform;
  onPreferredPlatformChange: (platform: TargetPlatform) => void;
  onAnalyze: () => void;
  onLoadInstantPreset: (presetId: 'sx1278-lora' | 'bme280-sensor') => void;
  isLoading: boolean;
  error: string | null;
}

export const DatasheetInput: React.FC<DatasheetInputProps> = ({
  datasheetText,
  onDatasheetTextChange,
  preferredPlatform,
  onPreferredPlatformChange,
  onAnalyze,
  onLoadInstantPreset,
  isLoading,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onDatasheetTextChange(content);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onDatasheetTextChange(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Top Banner: One-Click Evaluator Sample Preset */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/40 border border-cyan-500/30 rounded-lg p-3.5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 font-mono">
                Evaluator Instant Preset
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SX1278 LoRa SPI
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Instantly test full extraction: 16 pins, 3.7V non-5V warnings, antenna protection, and multi-target C/C++ init code.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onLoadInstantPreset('sx1278-lora')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold tracking-wide transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] cursor-pointer"
          >
            <Cpu className="w-4 h-4" />
            <span>Load SX1278 LoRa Preset</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-[11px] uppercase text-slate-500">Preset Excerpts:</span>
          <button
            onClick={() => onDatasheetTextChange(SX1278_PRESET.rawExcerpt)}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          >
            SX1278 LoRa (Raw Excerpt)
          </button>
          <button
            onClick={() => onDatasheetTextChange(BME280_PRESET.rawExcerpt)}
            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-mono transition-colors border border-slate-700 cursor-pointer"
          >
            BME280 Sensor (Raw Excerpt)
          </button>
        </div>

        {datasheetText && (
          <button
            onClick={() => onDatasheetTextChange('')}
            className="text-xs font-mono text-slate-500 hover:text-slate-300 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Text</span>
          </button>
        )}
      </div>

      {/* Editor & Dropzone Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative border border-slate-800 rounded-lg overflow-hidden bg-[#090d16] focus-within:border-cyan-500/60 transition-colors"
      >
        <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Datasheet Excerpt / Pinout Description</span>
          </div>
          <div className="flex items-center gap-3">
            <span>{datasheetText.length} characters</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".txt,.md,.csv,.json,.pdf"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
          </div>
        </div>

        <textarea
          value={datasheetText}
          onChange={(e) => onDatasheetTextChange(e.target.value)}
          placeholder="Paste microcontroller or sensor datasheet pin descriptions, electrical characteristics tables, absolute maximum ratings, or strapping pin notes here... (Or click 'Load SX1278 LoRa Preset' above)"
          rows={9}
          className="w-full p-4 bg-transparent text-slate-200 text-xs font-mono placeholder-slate-600 focus:outline-none resize-y leading-relaxed"
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-300 font-mono">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Analysis Notice:</span> {error}
            </div>
          </div>
          <button
            onClick={() => onLoadInstantPreset('sx1278-lora')}
            className="px-3 py-1.5 bg-rose-900/50 hover:bg-rose-900 border border-rose-500/40 text-rose-200 rounded-md text-[11px] whitespace-nowrap self-start sm:self-auto cursor-pointer transition-colors"
          >
            Load Verified Preset Instead
          </button>
        </div>
      )}

      {/* Bottom Controls Bar */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Target Platform:</span>
          <select
            value={preferredPlatform}
            onChange={(e) => onPreferredPlatformChange(e.target.value as TargetPlatform)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500"
          >
            <option value="stm32_hal">STM32 HAL (CubeMX C)</option>
            <option value="esp_idf">ESP-IDF (Espressif FreeRTOS C)</option>
            <option value="arduino">Arduino C++</option>
            <option value="rp2040_pico">Raspberry Pi Pico C/C++ SDK</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAnalyze}
            disabled={isLoading || !datasheetText.trim()}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
              isLoading || !datasheetText.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Analyzing via Gemini 3.8 Flash...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Pinout & Generate Code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
