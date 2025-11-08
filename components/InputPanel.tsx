import React, { useState, useCallback, useRef } from 'react';
import { UploadIcon, LinkIcon, TextIcon, FileIcon } from './icons';
import type { UserInput } from '../types';

interface InputPanelProps {
  onInputChange: (input: UserInput | null) => void;
  disabled: boolean;
}

type InputMode = 'file' | 'url' | 'text';

export const InputPanel: React.FC<InputPanelProps> = ({ onInputChange, disabled }) => {
  const [mode, setMode] = useState<InputMode>('file');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');
  const [text, setText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    onInputChange(selectedFile ? { type: 'file', file: selectedFile } : null);
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setImageUrl(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setImageUrl(null);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    onInputChange(newUrl.trim() ? { type: 'url', url: newUrl.trim() } : null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onInputChange(newText.trim() ? { type: 'text', text: newText.trim() } : null);
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
        handleFileChange(droppedFile);
    }
  }, [disabled]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };
  
  const clearInputs = () => {
    setFile(null);
    setImageUrl(null);
    setUrl('');
    setText('');
  };

  const switchMode = (newMode: InputMode) => {
    setMode(newMode);
    clearInputs();
    onInputChange(null);
  }

  const TabButton = ({ targetMode, label, icon }: { targetMode: InputMode, label: string, icon: React.ReactNode}) => (
    <button
      onClick={() => switchMode(targetMode)}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center space-x-2 p-3 text-sm font-medium transition-colors duration-200 ${
        mode === targetMode
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200 disabled:hover:bg-transparent disabled:text-gray-500'
      } ${targetMode === 'file' ? 'rounded-tl-md' : ''} ${targetMode === 'text' ? 'rounded-tr-md' : ''}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex bg-gray-800 rounded-t-md border-b border-gray-600">
        <TabButton targetMode="file" label="Upload File" icon={<UploadIcon className="w-5 h-5"/>}/>
        <TabButton targetMode="url" label="From URL" icon={<LinkIcon className="w-5 h-5"/>}/>
        <TabButton targetMode="text" label="From Text" icon={<TextIcon className="w-5 h-5"/>}/>
      </div>
      <div className="flex-grow">
        {mode === 'file' && (
           <div 
                className={`relative flex-grow border-2 border-dashed rounded-b-lg p-4 flex items-center justify-center text-center transition-colors duration-300 h-full ${disabled ? 'border-gray-600 bg-gray-800' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50 cursor-pointer'}`}
                onClick={!disabled ? openFileDialog : undefined}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                accept="image/*,application/pdf,.csv"
                className="hidden"
                disabled={disabled}
              />
              {file ? (
                <div>
                  {imageUrl ? (
                    <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <FileIcon className="w-16 h-16 mb-4 text-gray-500"/>
                      <p className="font-semibold text-gray-300">{file.name}</p>
                      <p className="text-sm text-gray-500">{Math.round(file.size / 1024)} KB</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                    <UploadIcon className="w-12 h-12 mb-3 text-gray-500" />
                    <span className="font-semibold text-gray-300">Drag & drop a file here</span>
                    <span className="mt-1 text-sm">or click to browse (Image, PDF, CSV)</span>
                </div>
              )}
          </div>
        )}
        {mode === 'url' && (
          <div className="p-4 h-full flex flex-col">
            <label htmlFor="url-input" className="mb-2 font-medium text-gray-300">Google Sheet or Public URL</label>
            <input 
              id="url-input"
              type="url"
              value={url}
              onChange={handleUrlChange}
              disabled={disabled}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        )}
        {mode === 'text' && (
          <div className="p-4 h-full flex flex-col">
            <label htmlFor="text-input" className="mb-2 font-medium text-gray-300">Describe your data</label>
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              disabled={disabled}
              placeholder="e.g., 'A database for a blog with posts, comments, and users. Posts have a title, content, and author. Comments belong to a post and a user...'"
              className="w-full flex-grow bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
              rows={8}
            />
          </div>
        )}
      </div>
    </div>
  );
};
