import React, { useState } from 'react';
import { Spinner } from './Spinner';
import { CheckIcon, CopyIcon, APIIcon } from './icons';

interface DeploymentStatusProps {
  isDeploying: boolean;
  deploymentUrl: string | null;
  onClose: () => void;
  onViewApi: () => void;
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({ isDeploying, deploymentUrl, onClose, onViewApi }) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        if(!deploymentUrl) return;
        navigator.clipboard.writeText(deploymentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-2xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
            {isDeploying && (
                <>
                    <Spinner className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">Deployment in Progress</h3>
                    <p className="text-gray-400">Your API is being deployed. This is a simulation and may take a few seconds.</p>
                </>
            )}
            {deploymentUrl && (
                <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-900/50 border-2 border-green-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-10 h-10 text-green-400"/>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Deployment Successful!</h3>
                    <p className="text-gray-400 mb-6">Your new REST API is live at this mock endpoint:</p>
                    <div className="flex items-center bg-gray-900 border border-gray-600 rounded-md p-3">
                        <p className="bg-transparent text-green-400 font-mono text-sm flex-grow text-left truncate">{deploymentUrl}</p>
                        <button onClick={handleCopy} className="p-2 rounded-md hover:bg-gray-700 text-gray-300 flex-shrink-0">
                            {isCopied ? <CheckIcon className="w-5 h-5"/> : <CopyIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                    <div className="mt-8 flex items-center justify-center space-x-4">
                        <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                            Close
                        </button>
                        <button onClick={onViewApi} className="bg-brand-secondary hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2">
                            <APIIcon className="w-5 h-5" />
                            <span>View API</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    </div>
  );
};