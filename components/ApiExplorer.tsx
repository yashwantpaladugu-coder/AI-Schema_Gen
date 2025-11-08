import React from 'react';
import type { SchemaResponse } from '../types';
import { Header } from './Header';
import { APIIcon } from './icons';

interface ApiExplorerProps {
  apiContent: SchemaResponse;
  deploymentUrl: string;
  onBack: () => void;
}

const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
        case 'GET': return 'bg-green-600/80 text-green-100';
        case 'POST': return 'bg-blue-600/80 text-blue-100';
        case 'PUT': return 'bg-yellow-600/80 text-yellow-100';
        case 'PATCH': return 'bg-orange-600/80 text-orange-100';
        case 'DELETE': return 'bg-red-600/80 text-red-100';
        default: return 'bg-gray-600/80 text-gray-100';
    }
};


export const ApiExplorer: React.FC<ApiExplorerProps> = ({ apiContent, deploymentUrl, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <button onClick={onBack} className="text-brand-secondary hover:underline mb-4">
                        &larr; Back to Generator
                    </button>
                    <h2 className="text-3xl font-bold text-white">Live API Explorer</h2>
                    <p className="text-gray-400 mt-2">Your generated REST API is available at the following base URL:</p>
                    <div className="mt-2 bg-gray-800 border border-gray-700 rounded-md p-3 font-mono text-green-400">
                        {deploymentUrl}
                    </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg">
                    <div className="p-6 border-b border-gray-700 flex items-center space-x-3">
                        <APIIcon className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-semibold text-white">API Endpoints</h3>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {apiContent.apiEndpoints.map((endpoint, index) => (
                             <div key={index} className="p-4 md:p-6 grid grid-cols-[auto,1fr] items-center gap-4 hover:bg-gray-800 transition-colors duration-200">
                                <span className={`w-24 text-center font-mono text-sm font-bold p-2 rounded-md ${getMethodColor(endpoint.method)}`}>
                                    {endpoint.method.toUpperCase()}
                                </span>
                                <div className='font-mono text-gray-300'>
                                    <p className="text-md">{endpoint.path}</p>
                                    <p className="text-sm text-gray-400 mt-1 font-sans">{endpoint.summary}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
