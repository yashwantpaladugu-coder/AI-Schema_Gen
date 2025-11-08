import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface CodeDisplayProps {
  code: string;
  language: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code, language }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative h-full w-full font-mono text-sm bg-gray-900 text-gray-300 rounded-b-lg">
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md text-gray-300 transition-all duration-200 z-10"
        aria-label="Copy code to clipboard"
      >
        {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
      </button>
      <div className="overflow-auto h-full w-full p-6 pt-14">
        <pre><code className={`language-${language}`}>{code}</code></pre>
      </div>
    </div>
  );
};