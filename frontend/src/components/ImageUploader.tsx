import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  image: File | null;
  previewUrl: string | null;
  onImageChange: (file: File | null, url: string | null) => void;
  disabled?: boolean;
  label?: string;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  image, 
  previewUrl, 
  onImageChange, 
  disabled,
  label = "Target Image",
  compact = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onImageChange(file, url);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageChange(null, null);
  };

  const triggerUpload = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
          {label}
        </label>
        <span className="text-xs text-slate-400 dark:text-slate-500">Max 10MB</span>
      </div>
      
      <div 
        onClick={triggerUpload}
        className={`
          relative group cursor-pointer 
          border-2 border-dashed rounded-xl 
          flex flex-col items-center justify-center 
          transition-all duration-200 overflow-hidden
          ${image 
            ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'}
          ${compact ? 'h-40' : (image ? 'h-64 sm:h-80' : 'h-48')}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={disabled}
        />

        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-contain p-2"
            />
            <div className="absolute top-2 right-2">
              <button 
                onClick={handleClear}
                className="bg-white/90 dark:bg-slate-800/90 p-1.5 rounded-full shadow-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
                title="Remove image"
              >
                <X size={18} />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <p className="text-white text-xs text-center">Click to change</p>
            </div>
          </>
        ) : (
          <div className="text-center p-4">
            <div className={`bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors ${compact ? 'w-8 h-8' : 'w-12 h-12'}`}>
              <Upload size={compact ? 16 : 24} />
            </div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
              {compact ? 'Upload' : 'Click to upload'}
            </p>
            {!compact && (
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                JPG, PNG, WebP
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;