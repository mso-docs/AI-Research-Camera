import React from 'react';
import { X, Cpu, Zap, Eye, Share2, Code } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Share2 size={18} className="text-indigo-600 dark:text-indigo-400" />
            About This Project
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
              <Cpu size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              AI Research Camera
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              A multimodal research assistant designed to bridge the gap between complex visual data and human understanding.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Powered By</h4>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Zap className="text-amber-500 mt-0.5" size={18} />
                <div>
                  <h5 className="font-semibold text-slate-900 dark:text-white text-sm">Gemini 3 Pro</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Utilizing the latest generation model for advanced reasoning, multimodal comprehension, and structured output generation.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Eye className="text-blue-500 mt-0.5" size={18} />
                <div>
                  <h5 className="font-semibold text-slate-900 dark:text-white text-sm">Computer Vision Analysis</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Capable of processing single images for detailed explanation or comparing multiple inputs to identify subtle differences.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3">
                <Code className="text-emerald-500 mt-0.5" size={18} />
                <div>
                  <h5 className="font-semibold text-slate-900 dark:text-white text-sm">Client-Side Architecture</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    This interactive demo operates entirely client-side to ensure instant accessibility. It connects directly to the Google Gemini API from your browser, demonstrating serverless AI integration without requiring account creation or backend infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Built for the Google Gemini API Developer Competition
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-center">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Explore App
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutModal;