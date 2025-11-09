import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { CodeDisplay } from './components/CodeDisplay';
import { Spinner } from './components/Spinner';
import { generateSchemaAndApi } from './services/geminiService';
import type { SchemaResponse, UserInput } from './types';
import { FileIcon, DeployIcon, BrainIcon, DiagramIcon, SQLIcon, APIIcon } from './components/icons';
import { ReasoningDisplay } from './components/ReasoningDisplay';
import { Visualization } from './components/Visualization';
import { DeploymentStatus } from './components/DeploymentStatus';
import { generateApiExplorerHtml } from './components/ApiExplorer';


type ActiveTab = 'schema' | 'api' | 'reasoning' | 'diagram';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<SchemaResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('schema');

  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
  const [showDeploymentModal, setShowDeploymentModal] = useState<boolean>(false);

  const [inputKey, setInputKey] = useState(Date.now());
  
  const [deployedApiContent, setDeployedApiContent] = useState<SchemaResponse | null>(null);

  const handleUserInput = (input: UserInput | null) => {
    setUserInput(input);
    if (input !== null) {
      setGeneratedContent(null);
      setError(null);
      setDeploymentUrl(null);
      setShowDeploymentModal(false);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!userInput) {
      setError("Please provide a data source first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setDeploymentUrl(null);
    setActiveTab('schema');

    try {
      const response = await generateSchemaAndApi(userInput);
      setGeneratedContent(response);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleClear = useCallback(() => {
    setUserInput(null);
    setGeneratedContent(null);
    setError(null);
    setDeploymentUrl(null);
    setShowDeploymentModal(false);
    setInputKey(Date.now());
  }, []);

  const handleDeploy = useCallback(() => {
    if (!generatedContent) return;
    setShowDeploymentModal(true);
    setIsDeploying(true);
    setDeploymentUrl(null);
    setDeployedApiContent(generatedContent); // Save content for the new tab
    setTimeout(() => {
        const randomHash = Math.random().toString(36).substring(2, 8);
        const newUrl = `https://api-${randomHash}.prod.dev-cloud.run/v1/docs`;
        setDeploymentUrl(newUrl);
        setIsDeploying(false);
    }, 3000);
  }, [generatedContent]);

  const handleCloseDeploymentModal = () => {
    setShowDeploymentModal(false);
  }

  const handleViewApi = () => {
    if (!deployedApiContent || !deploymentUrl) return;

    const htmlContent = generateApiExplorerHtml(deployedApiContent, deploymentUrl);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    
    window.open(blobUrl, '_blank');
    
    setShowDeploymentModal(false);
  };

  const TabButton = ({ tabName, label, icon }: { tabName: ActiveTab, label: string, icon: React.ReactNode}) => (
     <button
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center space-x-2 whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
        activeTab === tabName
            ? 'border-blue-500 text-blue-400'
            : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Input Panel */}
          <div className="flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 p-6 shadow-lg h-full">
            <h2 className="text-xl font-semibold mb-4 text-white">1. Provide Data Source</h2>
            <div className="flex-grow">
                <InputPanel key={inputKey} onInputChange={handleUserInput} disabled={isLoading} />
            </div>
            <div className="mt-6 flex items-center justify-end space-x-4">
              {userInput && !isLoading && (
                  <button
                    onClick={handleClear}
                    className="text-gray-400 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 hover:bg-gray-700"
                    aria-label="Clear input and results"
                  >
                    Clear
                  </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={!userInput || isLoading}
                className="w-full md:w-auto bg-brand-secondary hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400/50 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Generate Assets</span>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex flex-col bg-gray-800/50 rounded-lg border border-gray-700 shadow-lg h-full min-h-[500px]">
            <div className="p-6 flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-semibold text-white">2. Generated Assets</h2>
                {generatedContent && (
                    <button
                        onClick={handleDeploy}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-400/50"
                    >
                        <DeployIcon className="w-5 h-5"/>
                        <span>Deploy Now</span>
                    </button>
                )}
            </div>
            {isLoading && (
              <div className="flex-grow flex items-center justify-center p-6 text-gray-400">
                <div className="text-center">
                    <Spinner className="w-12 h-12 mx-auto mb-4"/>
                    <p className="text-lg font-medium">AI is analyzing your data...</p>
                    <p className="text-sm">This might take a moment.</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex-grow flex items-center justify-center p-6">
                  <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg text-center">
                    <h3 className="font-bold mb-2">Error</h3>
                    <p>{error}</p>
                </div>
              </div>
            )}
            {!isLoading && !error && !generatedContent && (
                 <div className="flex-grow flex items-center justify-center p-6 text-gray-500">
                    <div className="text-center">
                        <FileIcon className="w-16 h-16 mx-auto mb-4 text-gray-600"/>
                        <p className="text-lg">Your generated assets will appear here.</p>
                        <p className="text-sm">Provide a data source and click "Generate" to start.</p>
                    </div>
                 </div>
            )}
            {generatedContent && (
              <div className="flex-grow flex flex-col">
                <div className="px-6 border-b border-gray-700">
                  <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    <TabButton tabName='schema' label='Schema (SQL)' icon={<SQLIcon className="w-5 h-5"/>}/>
                    <TabButton tabName='api' label='API (YAML)' icon={<APIIcon className="w-5 h-5"/>}/>
                    <TabButton tabName='reasoning' label='Reasoning' icon={<BrainIcon className="w-5 h-5"/>}/>
                    <TabButton tabName='diagram' label='Diagram' icon={<DiagramIcon className="w-5 h-5"/>}/>
                  </nav>
                </div>
                <div className="flex-grow relative bg-gray-900 rounded-b-lg">
                    {activeTab === 'schema' && (
                        <CodeDisplay language="sql" code={generatedContent.databaseSchema} />
                    )}
                    {activeTab === 'api' && (
                        <CodeDisplay language="yaml" code={generatedContent.restApi} />
                    )}
                    {activeTab === 'reasoning' && (
                        <ReasoningDisplay content={generatedContent.schemaReasoning} />
                    )}
                    {activeTab === 'diagram' && (
                        <Visualization chart={generatedContent.erdDiagram} />
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      {showDeploymentModal && <DeploymentStatus isDeploying={isDeploying} deploymentUrl={deploymentUrl} onClose={handleCloseDeploymentModal} onViewApi={handleViewApi} />}
    </div>
  );
};

export default App;