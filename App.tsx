import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Controls from './components/Controls';
import Results from './components/Results';
import AuthModal from './components/AuthModal';
import HistorySidebar from './components/HistorySidebar';
import AboutModal from './components/AboutModal';
import { AnalysisMode, AudienceLevel, AnalysisResult, InputMode, User, HistoryItem } from './types';
import { analyzeImage } from './services/geminiService';
import { authService } from './services/authService';
import { historyService } from './services/historyService';
import { Split, Bookmark, Check, Save } from 'lucide-react';

const App: React.FC = () => {
  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  
  // --- History State ---
  const [isHistoryOpen, setHistoryOpen] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  // --- Analysis State ---
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.SINGLE);
  
  // Image A (Main)
  const [imageA, setImageA] = useState<File | null>(null);
  const [previewUrlA, setPreviewUrlA] = useState<string | null>(null);
  
  // Image B (Compare)
  const [imageB, setImageB] = useState<File | null>(null);
  const [previewUrlB, setPreviewUrlB] = useState<string | null>(null);

  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.EXPLAIN);
  const [audience, setAudience] = useState<AudienceLevel>(AudienceLevel.STUDENT);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResultSaved, setIsResultSaved] = useState(false);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('arc_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('arc_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('arc_theme', 'light');
      }
      return newMode;
    });
  };

  // Initialize Auth
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      loadHistory(currentUser.id);
    }
  }, []);

  const loadHistory = (userId: string) => {
    const items = historyService.getHistory(userId);
    setHistoryItems(items);
  };

  const handleLoginSuccess = (user: User) => {
    setUser(user);
    loadHistory(user.id);
    // Note: We do not clear the current result here, so the user can save it after logging in.
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setHistoryItems([]);
    setResult(null); // Clear sensitive results on logout
    setIsResultSaved(false);
  };

  const handleImageAChange = (file: File | null, url: string | null) => {
    setImageA(file);
    setPreviewUrlA(url);
    if (!file) {
      setResult(null);
      setIsResultSaved(false);
    }
  };

  const handleImageBChange = (file: File | null, url: string | null) => {
    setImageB(file);
    setPreviewUrlB(url);
  };

  const handleInputModeChange = (newMode: InputMode) => {
    setInputMode(newMode);
    if (newMode === InputMode.SINGLE) {
      // Clear second image when switching back to single
      setImageB(null);
      setPreviewUrlB(null);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setResult(item.result);
    setMode(item.mode);
    setAudience(item.audience);
    setHistoryOpen(false);
    setIsResultSaved(true); // History items are already saved
    
    // We can't restore the File object from history (localStorage), 
    // but we can show the thumbnail as a preview to indicate context.
    setPreviewUrlA(item.thumbnailUrl);
    setImageA(null); 
    
    if (item.imageCount > 1) {
      setInputMode(InputMode.COMPARE);
      setPreviewUrlB(item.thumbnailUrl); 
    } else {
      setInputMode(InputMode.SINGLE);
      setPreviewUrlB(null);
    }
  };

  const handleAnalyze = async () => {
    if (!imageA) return;
    if (inputMode === InputMode.COMPARE && !imageB) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setIsResultSaved(false);

    const imagesToAnalyze = [imageA];
    if (inputMode === InputMode.COMPARE && imageB) {
      imagesToAnalyze.push(imageB);
    }

    try {
      const analysisResult = await analyzeImage(imagesToAnalyze, mode, audience);
      setResult(analysisResult);

      // Auto-save to history if logged in
      if (user) {
        await historyService.saveItem(user.id, analysisResult, mode, audience, imagesToAnalyze);
        loadHistory(user.id);
        setIsResultSaved(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualSave = async () => {
    if (!result) return;
    
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    // Construct valid image array for thumbnail generation
    const imagesToSave: File[] = [];
    if (imageA) imagesToSave.push(imageA);
    if (inputMode === InputMode.COMPARE && imageB) imagesToSave.push(imageB);
    
    if (imagesToSave.length === 0 && previewUrlA) {
       // Edge case: Saving a loaded history item? 
       // Currently History items are already saved, so isResultSaved is true.
       // This path is for new analyses where File objects exist.
       return; 
    }

    await historyService.saveItem(user.id, result, mode, audience, imagesToSave);
    loadHistory(user.id);
    setIsResultSaved(true);
  };

  const canAnalyze = !!imageA && (inputMode === InputMode.SINGLE || !!imageB);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Header 
        user={user}
        onLoginClick={() => setAuthModalOpen(true)}
        onLogoutClick={handleLogout}
        onHistoryClick={() => setHistoryOpen(true)}
        onAboutClick={() => setAboutModalOpen(true)}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />

      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setHistoryOpen(false)} 
        history={historyItems}
        onSelect={handleHistorySelect}
      />
      
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setAboutModalOpen(false)} 
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Input Mode Switcher */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-1 flex">
              {Object.values(InputMode).map((m) => (
                <button
                  key={m}
                  onClick={() => handleInputModeChange(m)}
                  className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                    inputMode === m 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                   {m === InputMode.COMPARE && <Split size={14} className="inline mr-1" />}
                   {m}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-colors">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Step 1: Upload
              </h2>
              
              <div className={`grid gap-4 ${inputMode === InputMode.COMPARE ? 'grid-cols-2 lg:grid-cols-1' : 'grid-cols-1'}`}>
                <ImageUploader 
                  image={imageA} 
                  previewUrl={previewUrlA} 
                  onImageChange={handleImageAChange}
                  disabled={isAnalyzing}
                  label={inputMode === InputMode.COMPARE ? "Image A" : "Target Image"}
                  compact={inputMode === InputMode.COMPARE}
                />
                
                {inputMode === InputMode.COMPARE && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <ImageUploader 
                      image={imageB} 
                      previewUrl={previewUrlB} 
                      onImageChange={handleImageBChange}
                      disabled={isAnalyzing}
                      label="Image B"
                      compact={true}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 transition-colors">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
                Step 2: Configure
              </h2>
              <Controls 
                mode={mode} 
                setMode={setMode} 
                audience={audience} 
                setAudience={setAudience}
                onAnalyze={handleAnalyze}
                isAnalyzing={isAnalyzing}
                canAnalyze={canAnalyze}
              />
              {!user && (
                <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-4">
                  Tip: <button onClick={() => setAuthModalOpen(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</button> to save your research history.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-8 min-h-[500px] lg:h-auto flex flex-col">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-0 flex flex-col h-full overflow-hidden transition-colors">
               
               {/* Results Header with Save Button */}
               {result && (
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
                     <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <Bookmark size={18} className="text-indigo-500" />
                        Analysis Results
                     </h2>
                     <button
                        onClick={handleManualSave}
                        disabled={isResultSaved}
                        className={`
                           flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                           ${isResultSaved 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default' 
                              : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm'}
                        `}
                     >
                        {isResultSaved ? (
                           <>
                              <Check size={16} />
                              Saved
                           </>
                        ) : (
                           <>
                              <Save size={16} />
                              {user ? 'Save to History' : 'Login to Save'}
                           </>
                        )}
                     </button>
                  </div>
               )}

               <div className="p-6 flex-grow overflow-y-auto custom-scrollbar">
                  <Results 
                    result={result} 
                    isLoading={isAnalyzing} 
                    error={error} 
                  />
               </div>
            </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 dark:text-slate-600 text-sm">
          &copy; {new Date().getFullYear()} AI Research Camera. Built with Gemini 3 Pro.
        </div>
      </footer>
    </div>
  );
};

export default App;