import React from 'react';

interface ReasoningDisplayProps {
  content: string;
}

export const ReasoningDisplay: React.FC<ReasoningDisplayProps> = ({ content }) => {
  return (
    <div className="p-6 h-full overflow-auto">
      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</pre>
    </div>
  );
};
