import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisResult } from '../types';
import { FileText, AlertTriangle, Clock } from 'lucide-react';

interface ResultsProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

const Results: React.FC<ResultsProps> = ({ result, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[400px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 dark:border-slate-800 border-t-indigo-500 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-full"></div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Researching...</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mt-2">
            Gemini 3 Pro is analyzing the visual data and synthesizing a response.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    const isQuotaError = error === "DEMO_QUOTA_EXCEEDED";

    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
        <div className={`${isQuotaError ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'} p-4 rounded-full mb-4`}>
          {isQuotaError ? (
            <Clock size={32} className="text-amber-500 dark:text-amber-400" />
          ) : (
            <AlertTriangle size={32} className="text-red-500 dark:text-red-400" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {isQuotaError ? "Demo Usage Limit Reached" : "Analysis Failed"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto mt-2 mb-6 leading-relaxed">
          {isQuotaError 
            ? "This interactive demo has reached its daily safety limit for AI processing. Please try again later or tomorrow."
            : error}
        </p>
        {!isQuotaError && (
          <button 
            onClick={() => window.location.reload()}
            className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline"
          >
            Refresh Page
          </button>
        )}
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
          <FileText size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Ready to Analyze</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mt-2">
          Upload an image and select your preferences to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      {result.sections.map((section, index) => (
        <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
              {index + 1}
            </span>
            {section.title}
          </h3>
          <div className="prose prose-slate dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-slate-900 dark:prose-headings:text-white prose-strong:text-slate-900 dark:prose-strong:text-white">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
          {index < result.sections.length - 1 && (
            <hr className="my-8 border-slate-100 dark:border-slate-800" />
          )}
        </div>
      ))}
    </div>
  );
};

export default Results;