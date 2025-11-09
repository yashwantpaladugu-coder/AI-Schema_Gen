import type { SchemaResponse } from '../types';

const getMethodColorStyles = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'background-color: #059669; color: #d1fae5;';
      case 'POST': return 'background-color: #2563eb; color: #dbeafe;';
      case 'PUT': return 'background-color: #d97706; color: #fef3c7;';
      case 'PATCH': return 'background-color: #ea580c; color: #ffedd5;';
      case 'DELETE': return 'background-color: #dc2626; color: #fee2e2;';
      default: return 'background-color: #4b5563; color: #e5e7eb;';
    }
};

export const generateApiExplorerHtml = (apiContent: SchemaResponse, deploymentUrl: string): string => {
    const baseUrl = deploymentUrl.replace('/docs', '');
    const endpointsHtml = apiContent.apiEndpoints.map(endpoint => `
        <div class="endpoint">
        <span class="method" style="${getMethodColorStyles(endpoint.method)}">${endpoint.method.toUpperCase()}</span>
        <div class="details">
            <p class="path">${baseUrl}${endpoint.path}</p>
            <p class="summary">${endpoint.summary}</p>
        </div>
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>API Documentation</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          background-color: #111827;
          color: #d1d5db;
          margin: 0;
          padding: 2rem;
        }
        .container {
          max-width: 900px;
          margin: 0 auto;
        }
        h1 {
          font-size: 2.25rem;
          color: #ffffff;
          border-bottom: 1px solid #374151;
          padding-bottom: 1rem;
          margin-bottom: 1rem;
        }
        h2 {
          font-size: 1.5rem;
          color: #ffffff;
          margin-top: 2rem;
        }
        p {
          line-height: 1.6;
        }
        .base-url {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.375rem;
          padding: 1rem;
          font-family: monospace;
          color: #6ee7b7;
          margin-top: 0.5rem;
          word-break: break-all;
        }
        .endpoints-container {
          background-color: #1f2937;
          border: 1px solid #374151;
          border-radius: 0.375rem;
          margin-top: 1rem;
          overflow: hidden;
        }
        .endpoint {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #374151;
        }
        .endpoint:last-child {
          border-bottom: none;
        }
        .method {
          font-family: monospace;
          font-size: 0.875rem;
          font-weight: bold;
          padding: 0.5rem;
          border-radius: 0.375rem;
          width: 6rem;
          text-align: center;
        }
        .details .path {
          font-family: monospace;
          color: #e5e7eb;
          font-size: 1rem;
          margin: 0;
          word-break: break-all;
        }
        .details .summary {
          color: #9ca3af;
          font-size: 0.875rem;
          margin: 0.25rem 0 0 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Live API Explorer</h1>
        <p>Your generated REST API is available at the following base URL:</p>
        <div class="base-url">${baseUrl}</div>
        
        <h2>API Endpoints</h2>
        <div class="endpoints-container">
          ${endpointsHtml}
        </div>
      </div>
    </body>
    </html>
  `;
};
