export interface ApiEndpoint {
  path: string;
  method: string;
  summary: string;
}

export interface SchemaResponse {
  databaseSchema: string;
  restApi: string;
  schemaReasoning: string;
  erdDiagram: string;
  apiEndpoints: ApiEndpoint[];
}

export type UserInput = 
  | { type: 'file'; file: File }
  | { type: 'url'; url: string }
  | { type: 'text'; text: string };