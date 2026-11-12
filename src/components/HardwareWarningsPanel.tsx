import React, { useState } from 'react';
import { HardwareWarning, WarningSeverity } from '../types/datasheet';
import { AlertTriangle, AlertCircle, Info, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface HardwareWarningsPanelProps {
  warnings: HardwareWarning[];
}

export const HardwareWarningsPanel: React.FC<HardwareWarningsPanelProps> = ({ warnings }) => {
  const [filterSeverity, setFilterSeverity] = useState<WarningSeverity | 'ALL'>('ALL');

  const filteredWarnings =
    filterSeverity === 'ALL' ? warnings : warnings.filter((w) => w.severity === filterSeverity);

  const criticalCount = warnings.filter((w) => w.severity === 'CRITICAL').length;
  const warningCount = warnings.filter((w) => w.severity === 'WARNING').length;
  const infoCount = warnings.filter((w) => w.severity === 'INFO').length;

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <span>Hardware Trap Warnings</span>
              <span className="text-xs font-mono text-rose-400 font-normal">
                ({warnings.length} detected)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Voltage limits, required pull-ups, bootstrapping conflicts, and decoupling rules
            </p>
          </div>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterSeverity === 'ALL'
                ? 'bg-slate-800 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({warnings.length})
          </button>
          <button
            onClick={() => setFilterSeverity('CRITICAL')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterSeverity === 'CRITICAL'
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40 font-medium'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilterSeverity('WARNING')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterSeverity === 'WARNING'
                ? 'bg-amber-950 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Warning ({warningCount})
          </button>
          <button
            onClick={() => setFilterSeverity('INFO')}
            className={`px-2.5 py-1 rounded transition-colors ${
              filterSeverity === 'INFO'
                ? 'bg-blue-950 text-blue-300 border border-blue-500/40 font-medium'
                : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            Info ({infoCount})
          </button>
        </div>
      </div>

      {/* Warnings List */}
      <div className="space-y-3">
        {filteredWarnings.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500 font-mono">
            No warnings matching current severity filter.
          </div>
        ) : (
          filteredWarnings.map((warning, index) => {
            const isCritical = warning.severity === 'CRITICAL';
            const isWarning = warning.severity === 'WARNING';

            const borderClass = isCritical
              ? 'border-rose-500/30 bg-rose-950/10'
              : isWarning
              ? 'border-amber-500/30 bg-amber-950/10'
              : 'border-blue-500/30 bg-blue-950/10';

            const badgeBg = isCritical
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : isWarning
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

            const IconComponent = isCritical ? AlertCircle : isWarning ? AlertTriangle : Info;

            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${borderClass} transition-all hover:bg-slate-900/60`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-md border shrink-0 mt-0.5 ${badgeBg}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono px-2 py-0.5 rounded border uppercase tracking-wider font-semibold">
                        {warning.category}
                      </span>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${badgeBg}`}>
                        {warning.severity}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-200">{warning.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{warning.message}</p>

                    {/* Remediation Box */}
                    <div className="mt-3 bg-slate-950/80 border border-slate-800 rounded-md p-2.5 flex items-start gap-2.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block">
                          Hardware Fix & Remediation
                        </span>
                        <p className="text-xs text-slate-200 font-mono mt-0.5">{warning.remediation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
