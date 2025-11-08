import { GoogleGenAI, Type } from "@google/genai";
// Fix: Replaced deprecated `GenerateContentRequest` with `GenerateContentParameters`.
import type { GenerateContentParameters } from "@google/genai";
import type { SchemaResponse, UserInput } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const generateSchemaAndApi = async (userInput: UserInput): Promise<SchemaResponse> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const basePrompt = `
You are a world-class AI software architect specializing in database and API design.
Your task is to analyze the provided data source (which could be an image, a CSV, a PDF, a URL to a Google Sheet, or a text description) and generate a complete backend specification in a single JSON object.

1.  **Analyze Database Schema**:
    *   Design a normalized SQL database schema. Use appropriate SQL data types.
    *   Define primary keys and suggest foreign key constraints in comments.
    *   The result should be a single, well-formatted string containing all the SQL 'CREATE TABLE' statements.

2.  **Design REST API**:
    *   Based on the schema, generate a comprehensive REST API specification in OpenAPI 3.0.x YAML format.
    *   Include standard CRUD endpoints for each table.
    *   The result should be a single string containing the API definition.

3.  **Provide Schema Reasoning**:
    *   Explain the design choices for the database schema in Markdown format.
    *   Describe why you chose certain tables, columns, and relationships based on the input data source.

4.  **Generate ERD Diagram**:
    *   Create an Entity-Relationship Diagram (ERD) for the schema using Mermaid.js \`erDiagram\` syntax.
    *   Define entities and their attributes. For attributes, use the format: \`dataType attributeName PK "comment"\`. For example: \`int user_id PK "Auto-incrementing primary key"\`.
    *   Do not use non-standard abbreviations like 'AI' for AUTO_INCREMENT. Stick to valid Mermaid syntax.
    *   The result should be a single string of valid Mermaid.js code.

5.  **Extract API Endpoints**:
    *   From the YAML generated in step 2, extract a structured list of all API endpoints.
    *   For each endpoint, provide the HTTP method (e.g., 'GET', 'POST'), the URL path (e.g., '/users/{id}'), and a brief summary/description.
    *   The result should be a JSON array of objects, where each object has 'path', 'method', and 'summary' keys.
`;

  // Fix: Replaced deprecated `GenerateContentRequest` with `GenerateContentParameters`.
  let contents: GenerateContentParameters['contents'];

  switch (userInput.type) {
    case 'file':
      const filePart = await fileToGenerativePart(userInput.file);
      const textPart = { text: basePrompt };
      contents = { parts: [textPart, filePart] };
      break;
    case 'url':
      contents = { parts: [{ text: `${basePrompt}\n---DATA SOURCE---\nAnalyze the data from the following URL: ${userInput.url}` }] };
      break;
    case 'text':
      contents = { parts: [{ text: `${basePrompt}\n---DATA SOURCE---\nAnalyze the following data description: "${userInput.text}"` }] };
      break;
    default:
        throw new Error("Unsupported user input type");
  }


  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      databaseSchema: {
        type: Type.STRING,
        description: "A single, well-formatted string containing all the SQL 'CREATE TABLE' statements. Each statement should end with a semicolon."
      },
      restApi: {
        type: Type.STRING,
        description: "A single string containing the API definition in OpenAPI 3.0.x YAML format."
      },
      schemaReasoning: {
          type: Type.STRING,
          description: "A Markdown formatted string explaining the design choices for the database schema."
      },
      erdDiagram: {
          type: Type.STRING,
          description: "A string containing the Entity-Relationship Diagram in Mermaid.js syntax."
      },
      apiEndpoints: {
          type: Type.ARRAY,
          description: "A structured list of all API endpoints from the OpenAPI YAML.",
          items: {
              type: Type.OBJECT,
              properties: {
                  path: { type: Type.STRING, description: "The URL path for the endpoint." },
                  method: { type: Type.STRING, description: "The HTTP method (e.g., GET, POST)." },
                  summary: { type: Type.STRING, description: "A brief summary of what the endpoint does." }
              },
              required: ['path', 'method', 'summary']
          }
      }
    },
    required: ['databaseSchema', 'restApi', 'schemaReasoning', 'erdDiagram', 'apiEndpoints']
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: contents,
    config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
    }
  });

  try {
    const jsonString = response.text.trim();
    const parsedResponse = JSON.parse(jsonString);

    if (!parsedResponse.databaseSchema || !parsedResponse.restApi || !parsedResponse.schemaReasoning || !parsedResponse.erdDiagram || !parsedResponse.apiEndpoints) {
        throw new Error("Invalid response format from AI. Missing required keys.");
    }
    
    // Fix for Mermaid parsing error: The AI might return escaped newlines ('\\n')
    // which need to be converted to actual newline characters for Mermaid to parse correctly.
    const fixedResponse: SchemaResponse = {
      ...parsedResponse,
      erdDiagram: parsedResponse.erdDiagram.replace(/\\n/g, '\n'),
      databaseSchema: parsedResponse.databaseSchema.replace(/\\n/g, '\n'),
      restApi: parsedResponse.restApi.replace(/\\n/g, '\n'),
      schemaReasoning: parsedResponse.schemaReasoning.replace(/\\n/g, '\n'),
    };
    
    return fixedResponse;

  } catch (e) {
    console.error("Failed to parse AI response:", response.text);
    throw new Error("The AI returned an invalid or unparsable response. Please try again.");
  }
};