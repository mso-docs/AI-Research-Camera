import React from 'react';
import { X, Calendar, ArrowRight, Layers } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onSelect }) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-slate-900 shadow-2xl z-50 transform transition-all duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 transition-colors">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Layers size={20} className="text-indigo-600 dark:text-indigo-400" />
              Your History
            </h2>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-300 dark:text-slate-600">
                  <Layers size={32} />
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-1">No history yet</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Analyses you perform while logged in will appear here.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all flex gap-4"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-lg flex-shrink-0 overflow-hidden relative border border-slate-100 dark:border-slate-700">
                    <img 
                      src={item.thumbnailUrl} 
                      alt="Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                    {item.imageCount > 1 && (
                       <div className="absolute bottom-0 right-0 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md">
                         Compare
                       </div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          {item.mode}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                        {item.result.sections[0]?.title || "Analysis Result"}
                      </h4>
                    </div>
                    
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mt-2">
                      View Results <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HistorySidebar;