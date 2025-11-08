
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (file: File | null) => void;
  disabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onImageChange, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageChange(file || null);
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageChange(file);
    }
  }, [onImageChange, disabled]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div 
        className={`relative flex-grow border-2 border-dashed rounded-lg p-4 flex items-center justify-center text-center transition-colors duration-300 ${disabled ? 'border-gray-600 bg-gray-800' : 'border-gray-600 hover:border-blue-500 hover:bg-gray-700/50 cursor-pointer'}`}
        onClick={!disabled ? openFileDialog : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      {imageUrl ? (
        <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
      ) : (
        <div className="text-gray-400 flex flex-col items-center">
            <UploadIcon className="w-12 h-12 mb-3 text-gray-500" />
            <span className="font-semibold text-gray-300">Drag & drop an image here</span>
            <span className="mt-1 text-sm">or click to browse</span>
        </div>
      )}
    </div>
  );
};
