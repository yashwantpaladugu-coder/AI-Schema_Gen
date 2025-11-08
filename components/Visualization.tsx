import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';

interface VisualizationProps {
  chart: string;
}

export const Visualization: React.FC<VisualizationProps> = ({ chart }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const uniqueId = useRef(`mermaid-svg-${Date.now()}-${Math.floor(Math.random() * 1000)}`).current;

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
    });

    const renderDiagram = async () => {
      try {
        setError(null);
        setSvg('');

        // Clean the chart code to remove markdown fences if the AI includes them.
        const cleanedChart = chart
            .replace(/^```(?:mermaid)?\s*/, '')
            .replace(/```\s*$/, '')
            .trim();
        
        if (!cleanedChart) {
          return; // Don't render if the chart is empty after cleaning
        }

        const { svg: renderedSvg } = await mermaid.render(uniqueId, cleanedChart);
        setSvg(renderedSvg);
      } catch (e) {
        console.error("Mermaid rendering failed:", e);
        const errorMessage = e instanceof Error ? e.message : String(e);
        setError(errorMessage);
        setSvg('');
      }
    };
    
    if (chart && chart.trim()) {
      renderDiagram();
    } else {
      setSvg('');
      setError(null);
    }
  }, [chart, uniqueId]);

  if (error) {
    return (
      <div className="p-6 h-full w-full overflow-auto text-sm">
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Failed to render diagram</h3>
            <p className="font-mono bg-red-800/50 p-2 rounded text-xs mb-4">{error}</p>
            <h4 className="font-bold mt-4 mb-2">Generated Mermaid Code:</h4>
            <pre className="text-xs bg-gray-800 p-2 rounded whitespace-pre-wrap">{chart}</pre>
        </div>
      </div>
    );
  }

  return (
    <div
      key={uniqueId}
      className="p-6 h-full w-full flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};