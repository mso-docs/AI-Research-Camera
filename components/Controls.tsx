import React from 'react';
import { AnalysisMode, AudienceLevel } from '../types';
import { Sparkles, GraduationCap, BookOpen, BrainCircuit } from 'lucide-react';

interface ControlsProps {
  mode: AnalysisMode;
  setMode: (mode: AnalysisMode) => void;
  audience: AudienceLevel;
  setAudience: (audience: AudienceLevel) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  mode,
  setMode,
  audience,
  setAudience,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  
  const getModeIcon = (m: AnalysisMode) => {
    switch(m) {
      case AnalysisMode.EXPLAIN: return <BookOpen size={16} />;
      case AnalysisMode.RESEARCH: return <BrainCircuit size={16} />;
      case AnalysisMode.TEACH: return <GraduationCap size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
          Analysis Mode
        </label>
        <div className="grid grid-cols-1 gap-2">
          {Object.values(AnalysisMode).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all
                ${mode === m 
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-sm' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300'}
              `}
            >
              <div className={`${mode === m ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                {getModeIcon(m)}
              </div>
              <span className="font-medium text-sm">{m}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Audience Selector */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 transition-colors">
          Target Audience
        </label>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value as AudienceLevel)}
          className="w-full rounded-lg border-slate-200 dark:border-slate-700 text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 shadow-sm transition-colors"
        >
          {Object.values(AudienceLevel).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Action Button */}
      <button
        onClick={onAnalyze}
        disabled={!canAnalyze || isAnalyzing}
        className={`
          w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white shadow-md transition-all
          ${!canAnalyze || isAnalyzing
            ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' 
            : 'bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 hover:shadow-lg active:scale-[0.98]'}
        `}
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Analyze Image</span>
          </>
        )}
      </button>
    </div>
  );
};

export default Controls;