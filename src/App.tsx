import React, { useState } from 'react';
import { DatasheetAnalysisResult, TargetPlatform } from './types/datasheet';
import { SX1278_PRESET, BME280_PRESET } from './data/presets';
import { Navbar } from './components/Navbar';
import { DatasheetInput } from './components/DatasheetInput';
import { ChipPackageVisualizer } from './components/ChipPackageVisualizer';
import { HardwareWarningsPanel } from './components/HardwareWarningsPanel';
import { PinMatrixTable } from './components/PinMatrixTable';
import { CodeViewer } from './components/CodeViewer';
import { WiringGuidePanel } from './components/WiringGuidePanel';
import {
  Zap,
  ShieldAlert,
  Cpu,
  Layers,
  Terminal,
  Thermometer,
  Gauge,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';

export default function App() {
  const [datasheetText, setDatasheetText] = useState<string>(SX1278_PRESET.rawExcerpt);
  const [preferredPlatform, setPreferredPlatform] = useState<TargetPlatform>('stm32_hal');
  const [analysisResult, setAnalysisResult] = useState<DatasheetAnalysisResult>(SX1278_PRESET.verifiedResult);
  const [selectedPinNumber, setSelectedPinNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('workbench');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoadInstantPreset = (presetId: 'sx1278-lora' | 'bme280-sensor') => {
    const preset = presetId === 'sx1278-lora' ? SX1278_PRESET : BME280_PRESET;
    setDatasheetText(preset.rawExcerpt);
    setAnalysisResult(preset.verifiedResult);
    setSelectedPinNumber(null);
    setError(null);
    scrollToSection('visualizer');
  };

  const handleAnalyze = async () => {
    if (!datasheetText.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-datasheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          datasheetText,
          preferredPlatform,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze datasheet');
      }

      setAnalysisResult(data);
      setSelectedPinNumber(null);
      scrollToSection('visualizer');
    } catch (err: unknown) {
      console.error('Analysis error:', err);
      const msg = err instanceof Error ? err.message : 'Unknown error during analysis';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const limits = analysisResult.electricalLimits;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3-Zone Sticky Navigation Bar */}
      <Navbar
        onSelectSection={scrollToSection}
        onQuickLoadSX1278={() => handleLoadInstantPreset('sx1278-lora')}
        activeSection={activeSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>AI-POWERED EMBEDDED HARDWARE PINOUT CO-PILOT</span>
              <span>·</span>
              <span>GEMINI 3.8 FLASH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Datasheet Pinout & Driver Co-Pilot
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Extract pin numbers, electrical limits, critical hardware warnings, and ready-to-compile
              C/C++ peripheral drivers for STM32 HAL, ESP-IDF, Arduino, and Raspberry Pi Pico.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-right">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">Active Component</span>
              <span className="text-sm font-bold font-mono text-cyan-300">{analysisResult.chipName}</span>
              <span className="text-xs text-slate-400 font-mono"> ({analysisResult.packageType})</span>
            </div>
          </div>
        </div>

        {/* Section 1: Datasheet Input Workbench */}
        <section id="workbench" className="scroll-mt-20">
          <DatasheetInput
            datasheetText={datasheetText}
            onDatasheetTextChange={setDatasheetText}
            preferredPlatform={preferredPlatform}
            onPreferredPlatformChange={setPreferredPlatform}
            onAnalyze={handleAnalyze}
            onLoadInstantPreset={handleLoadInstantPreset}
            isLoading={isLoading}
            error={error}
          />
        </section>

        {/* Electrical Limits KPI Ribbon */}
        {limits && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#111827] border border-slate-800 rounded-xl p-4 shadow-xl font-mono">
            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Operating Supply (VDD)</span>
              <div className="text-base font-bold text-slate-100 mt-0.5">
                <span className="text-cyan-400 tabular-nums">{limits.nominalVoltage || limits.minSupplyVoltage}V</span>
                <span className="text-xs text-slate-500 font-normal ml-1.5">
                  ({limits.minSupplyVoltage}V – {limits.maxSupplyVoltage}V)
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Max Input/Output Voltage</span>
              <div className="text-base font-bold text-rose-400 mt-0.5 tabular-nums">
                {limits.maxIoVoltage}V Max
                <span className="text-[10px] font-normal text-slate-400 block font-sans">
                  {limits.maxIoVoltage <= 3.7 ? 'NON-5V TOLERANT' : '5V TOLERANT'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Primary Bus Interface</span>
              <div className="text-base font-bold text-emerald-400 mt-0.5">
                {analysisResult.primaryInterface}
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 block uppercase">Operating Temperature</span>
              <div className="text-base font-bold text-slate-200 mt-0.5">
                {limits.operatingTempRange || '-40°C to +85°C'}
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Interactive IC Package Visualizer */}
        <section id="visualizer" className="scroll-mt-20">
          <ChipPackageVisualizer
            chipName={analysisResult.chipName}
            packageType={analysisResult.packageType}
            pins={analysisResult.pins}
            selectedPinNumber={selectedPinNumber}
            onSelectPin={setSelectedPinNumber}
          />
        </section>

        {/* Section 3: Hardware Warnings & Traps Panel */}
        <section id="warnings" className="scroll-mt-20">
          <HardwareWarningsPanel warnings={analysisResult.criticalWarnings} />
        </section>

        {/* Section 4: Pinout & Electrical Matrix Table */}
        <section id="matrix" className="scroll-mt-20">
          <PinMatrixTable
            pins={analysisResult.pins}
            chipName={analysisResult.chipName}
            selectedPinNumber={selectedPinNumber}
            onSelectPin={setSelectedPinNumber}
          />
        </section>

        {/* Section 5: Ready-to-Compile C/C++ Code Viewer */}
        <section id="code" className="scroll-mt-20">
          <CodeViewer
            platformCode={analysisResult.platformCode}
            chipName={analysisResult.chipName}
            defaultPlatform={preferredPlatform}
          />
        </section>

        {/* Section 6: Wiring Guide Panel */}
        {analysisResult.wiringGuide && analysisResult.wiringGuide.length > 0 && (
          <section id="wiring" className="scroll-mt-20">
            <WiringGuidePanel
              wiringGuide={analysisResult.wiringGuide}
              chipName={analysisResult.chipName}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Datasheet Pinout Co-Pilot · Precision Embedded Hardware Tooling</span>
          <span>Powered by Google Gemini 3.8 Flash with Structured Output</span>
        </div>
      </footer>
    </div>
  );
}
